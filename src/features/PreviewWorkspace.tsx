import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowRight, ChevronDown, Copy, FileCode2, Maximize, Pause, Play, RotateCcw, Smartphone, Timer, X } from 'lucide-react'
import { components } from '../domain/registry'
import { controlsMessage, previewDocument, previewFiles } from '../preview/documents'
import type { BenchmarkRecord } from '../storage/database'

type Props = { mode: 'playground' | 'performance'; initialComponentId?: string; records: BenchmarkRecord[]; onRecord: (record: BenchmarkRecord) => void; onCopy: (text: string) => void }
const sizes = [
  { label:'Desktop · 1920 × 1080', width:1920, height:1080 }, { label:'Desktop · 1440 × 900', width:1440, height:900 }, { label:'Desktop · 1280 × 720', width:1280, height:720 },
  { label:'Tablet · 1024 × 768', width:1024, height:768 }, { label:'Tablet · 768 × 1024', width:768, height:1024 },
  { label:'Mobile · 430 × 932', width:430, height:932 }, { label:'Mobile · 390 × 844', width:390, height:844 }, { label:'Mobile · 375 × 812', width:375, height:812 }, { label:'Mobile · 360 × 800', width:360, height:800 },
]

export default function PreviewWorkspace({ mode, initialComponentId, records, onRecord, onCopy }: Props) {
  const [componentId,setComponentId]=useState(initialComponentId??components.find(item=>item.previewAvailable)?.id??'')
  const [motionPreference,setMotionPreference]=useState<'system'|'normal'|'reduced'>('system')
  const [systemReduced,setSystemReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const reduced=motionPreference==='reduced'||(motionPreference==='system'&&systemReduced)
  const [preset,setPreset]=useState('Desktop · 1440 × 900'),[width,setWidth]=useState(1440),[height,setHeight]=useState(900)
  const [action,setAction]=useState<'start'|'pause'|'reset'>('start'),[background,setBackground]=useState('#08090B')
  const [warmup,setWarmup]=useState(1500),[duration,setDuration]=useState(5000),[running,setRunning]=useState(false),[progress,setProgress]=useState(0),[error,setError]=useState(''),[fileName,setFileName]=useState('index.html')
  const [scale,setScale]=useState(1)
  const frame=useRef<HTMLIFrameElement>(null),stage=useRef<HTMLDivElement>(null),cancelRun=useRef(false)
  const item=components.find(entry=>entry.id===componentId)??components[0]
  const source=useMemo<Record<string,string>|null>(()=>item?previewFiles(item):null,[item])
  const sendControl=(next:'start'|'pause'|'reset',motion=motionPreference)=>{setAction(next);frame.current?.contentWindow?.postMessage(controlsMessage(next,motion),'*')}

  useEffect(()=>{const element=stage.current;if(!element)return;const observer=new ResizeObserver(entries=>{const rect=entries[0]?.contentRect;if(!rect)return;setScale(Math.min((rect.width-38)/width,(rect.height-48)/height,1))});observer.observe(element);return()=>observer.disconnect()},[width,height])
  useEffect(()=>{sendControl(action,motionPreference)},[motionPreference,componentId])
  useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setSystemReduced(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[])
  const choosePreset=(label:string)=>{setPreset(label);const found=sizes.find(value=>value.label===label);if(found){setWidth(found.width);setHeight(found.height)}}
  const run=async()=>{
    if(!item?.previewAvailable||running)return
    setError('');setRunning(true);setProgress(0);cancelRun.current=false
    const longTasks:number[]=[]
    const observer=typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')?new PerformanceObserver(list=>{for(const entry of list.getEntries())longTasks.push(entry.duration)}):null
    try{observer?.observe({type:'longtask',buffered:false})}catch{}
    await new Promise<void>(resolve=>{const start=performance.now();const warm=()=>{if(cancelRun.current||performance.now()-start>=warmup){resolve();return}requestAnimationFrame(warm)};requestAnimationFrame(warm)})
    if(cancelRun.current){observer?.disconnect();setRunning(false);return}
    const samples:number[]=[];let previous:number|undefined;let raf=0;const start=performance.now()
    await new Promise<void>(resolve=>{let safetyTimer=0;let settled=false;const finish=()=>{if(settled)return;settled=true;window.clearTimeout(safetyTimer);resolve()};const tick=(now:number)=>{if(cancelRun.current||now-start>=duration){finish();return}if(previous!==undefined)samples.push(now-previous);previous=now;raf=requestAnimationFrame(tick)};safetyTimer=window.setTimeout(()=>{cancelRun.current=true;cancelAnimationFrame(raf);finish()},duration+500);raf=requestAnimationFrame(tick)})
    observer?.disconnect()
    if(cancelRun.current){setRunning(false);setProgress(0);return}
    const elapsed=performance.now()-start
    const averageFrameMs=samples.length?samples.reduce((sum,value)=>sum+value,0)/samples.length:0
    const variance=samples.length?samples.reduce((sum,value)=>sum+(value-averageFrameMs)**2,0)/samples.length:0
    const memory=(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize??null
    const record:BenchmarkRecord={id:crypto.randomUUID(),componentId:item.id,startedAt:new Date().toISOString(),durationMs:Math.round(elapsed),warmupMs:warmup,viewport:{width,height},userAgent:navigator.userAgent,metrics:{averageFps:elapsed?samples.length/(elapsed/1000):0,averageFrameMs,frameVarianceMs:Math.sqrt(variance),droppedFrames:samples.reduce((count,value)=>count+Math.max(0,Math.round(value/(1000/60))-1),0),longTasks:longTasks.length,heapBytes:memory}}
    onRecord(record);setProgress(100);setRunning(false)
    window.setTimeout(()=>setProgress(0),1600)
  }
  const stop=()=>{cancelRun.current=true;setProgress(0)}
  const latest=records.filter(record=>record.componentId===item?.id).slice(-5).reverse()

  if(!item)return <div className="empty-state"><Activity/><h3>No registered component</h3><p>Add a reviewed local preview adapter to begin.</p></div>
  if(!item.previewAvailable)return <div className="preview-unavailable"><div><span className="section-kicker">THIRD PARTY REFERENCE</span><h2>{item.name}</h2><p>{item.description}</p><p className="review-warning">This source has not been reviewed. Its code is not imported or executed here.</p>{item.sourceUrl&&<a href={item.sourceUrl} target="_blank" rel="noreferrer">Visit source ↗</a>}</div><button onClick={()=>setComponentId(components.find(entry=>entry.previewAvailable)?.id??'')}>Select a local preview <ArrowRight/></button></div>

  return <div className={`preview-workspace ${mode==='performance'?'is-lab':''}`}>
    <div className="workspace-toolbar"><label className="component-picker"><FileCode2/><select value={item.id} onChange={event=>setComponentId(event.target.value)}>{components.filter(entry=>entry.previewAvailable).map(entry=><option key={entry.id} value={entry.id}>{entry.name} · {entry.category}</option>)}</select><ChevronDown/></label>{mode==='playground'?<><label className="viewport-picker"><Smartphone/><select value={preset} onChange={event=>choosePreset(event.target.value)}>{sizes.map(value=><option key={value.label}>{value.label}</option>)}<option value="Custom">Custom viewport</option></select><ChevronDown/></label>{preset==="Custom"&&<div className="custom-viewport"><input aria-label="Custom viewport width" type="number" min="320" max="3840" value={width} onChange={event=>setWidth(Math.max(320,Math.min(3840,Number(event.target.value)||320)))}/><span>×</span><input aria-label="Custom viewport height" type="number" min="240" max="2160" value={height} onChange={event=>setHeight(Math.max(240,Math.min(2160,Number(event.target.value)||240)))}/></div>}</>:<div className="lab-settings"><label>Warm-up<select value={warmup} onChange={event=>setWarmup(Number(event.target.value))}><option value={0}>None</option><option value={1000}>1 second</option><option value={1500}>1.5 seconds</option><option value={3000}>3 seconds</option></select></label><label>Sample<select value={duration} onChange={event=>setDuration(Number(event.target.value))}><option value={2000}>2 seconds</option><option value={5000}>5 seconds</option><option value={10000}>10 seconds</option></select></label></div>}</div>
    <div className="playground-layout"><section className="play-canvas"><div className="canvas-toolbar"><div className="play-actions"><button onClick={()=>sendControl(action==='pause'?'start':'pause')} title={action==='pause'?'Resume':'Pause'}>{action==='pause'?<Play/>:<Pause/>}<span>{action==='pause'?'Resume':'Pause'}</span></button><button onClick={()=>sendControl('reset')} title="Replay"><RotateCcw/><span>Replay</span></button></div><div className="canvas-options"><label className="motion-toggle"><select className="motion-select" aria-label="Motion preference" value={motionPreference} onChange={event=>setMotionPreference(event.target.value as 'system'|'normal'|'reduced')}><option value="system">System motion</option><option value="normal">Normal motion</option><option value="reduced">Reduced motion</option></select></label>{mode==='playground'&&<label className="background-picker">Canvas<input type="color" value={background} onChange={event=>setBackground(event.target.value)}/></label>}<button onClick={()=>stage.current?.requestFullscreen()} title="Fullscreen"><Maximize/></button></div></div>
      <div className="preview-stage" ref={stage} style={{background}}>{item.previewAvailable&&<div className="preview-scaled" style={{width,height,transform:`translate(-50%,-50%) scale(${scale})`}}><iframe ref={frame} title={`${item.name} isolated preview`} sandbox="allow-scripts" srcDoc={previewDocument(item,{reducedMotion:reduced,background})} onLoad={()=>sendControl(action,motionPreference)}/></div>}<span className="viewport-readout">{width} × {height} · {Math.round(scale*100)}%</span></div>
      {mode==='playground'?<div className="canvas-foot"><span><i/> ISOLATED PREVIEW · SANDBOXED</span><span>CHANGES STAY LOCAL</span></div>:<div className="lab-runbar"><span>{running?'Sampling live browser frames…':'Measurement includes browser and Observatory overhead.'}</span><button className="button button-primary" disabled={running} onClick={run}>{running?<><Timer/>Running…</>:<><Play/>Start measurement</>}</button>{running&&<button className="button button-secondary" onClick={stop}><X/>Stop</button>}</div>}
      {error&&<p className="inline-error">{error}</p>}
    </section>
    <aside className="workspace-details"><div className="detail-section-head"><span className="section-kicker">COMPONENT NOTES</span><span className="registration-tag"><i/> TRUSTED LOCAL DEMO</span></div><h2>{item.name}</h2><p>{item.description}</p><div className="detail-facts"><span>CATEGORY<b>{item.category}</b></span><span>FRAMEWORK<b>{item.framework}</b></span><span>DEPENDENCIES<b>{item.dependencies.length?item.dependencies.join(', '):'None'}</b></span><span>REDUCED MOTION<b>{reduced?item.reducedMotion:'Standard motion'}</b></span><span>LICENCE<b>{item.licence.name} · {item.licence.status}</b></span></div>{mode==='playground'?<><div className="source-view-head"><span className="section-kicker">SOURCE STUDIO</span><button onClick={()=>source&&onCopy(source[fileName])}><Copy/>Copy file</button></div><label className="source-file-picker"><FileCode2/><select value={fileName} onChange={event=>setFileName(event.target.value)}>{Object.keys(source??{}).map(file=><option key={file}>{file}</option>)}</select><ChevronDown/></label><pre className="source-editor"><code>{source?.[fileName]??'Source is unavailable.'}</code></pre><div className="source-install"><span>INSTALLATION</span><code>{item.installation}</code><span>USAGE</span><code>{item.usage}</code></div></>:<><div className="measurement-results"><div className="detail-section-head"><span className="section-kicker">LATEST MEASUREMENTS</span><span className="metric-note">APPROXIMATE · BROWSER OBSERVABLE</span></div>{latest.length?latest.map(record=><div className="measurement-row" key={record.id}><div><b>{record.metrics.averageFps.toFixed(1)} <small>FPS</small></b><span>{new Date(record.startedAt).toLocaleString()} · {record.durationMs} ms</span></div><span>{record.metrics.droppedFrames} dropped<br/>{record.metrics.longTasks} long tasks</span></div>):<div className="measurement-empty">Run a measurement to record the first result.</div>}{progress>0&&<div className="sampling-progress"><span style={{width:`${progress}%`}}/></div>}</div></>}
    {mode==='performance'&&latest[0]&&<div className="lab-metric-grid"><div><span>AVERAGE FRAME RATE</span><b>{latest[0].metrics.averageFps.toFixed(1)} FPS</b><small>Observed in this browser</small></div><div><span>AVERAGE FRAME TIME</span><b>{latest[0].metrics.averageFrameMs.toFixed(2)} ms</b><small>Lower is smoother</small></div><div><span>FRAME TIME VARIANCE</span><b>{latest[0].metrics.frameVarianceMs.toFixed(2)} ms</b><small>Standard deviation</small></div><div><span>APPROX. DROPPED</span><b>{latest[0].metrics.droppedFrames}</b><small>Against a 60 Hz reference</small></div><div><span>LONG TASKS</span><b>{latest[0].metrics.longTasks}</b><small>Browser observer</small></div><div><span>JS HEAP</span><b>{latest[0].metrics.heapBytes?`${(latest[0].metrics.heapBytes/1048576).toFixed(1)} MB`:'N/A'}</b><small>Browser dependent</small></div><div><span>INITIALISATION</span><b>N/A</b><small>Not measured in this preview harness</small></div></div>}
    </aside></div>
  </div>
}
