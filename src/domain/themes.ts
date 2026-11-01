export type Theme = {
  name:string
  background:string
  surface:string
  raised:string
  text:string
  muted:string
  accent:string
  border:string
  headingFont:string
  bodyFont:string
  radius:number
  spacing:number
}

export const original:Theme={name:'LUNEVRA Original',background:'#08090B',surface:'#101216',raised:'#171A1F',text:'#F2F3F4',muted:'#9299A3',accent:'#75D9E8',border:'#292D33',headingFont:'Manrope',bodyFont:'Inter',radius:3,spacing:8}
export const monochrome:Theme={...original,name:'LUNEVRA Monochrome',accent:'#F1F2F3'}
export const experimental:Theme={...original,name:'LUNEVRA Experimental',accent:'#9BB8C5'}

export function validateTheme(value:unknown):value is Theme {
  if(!value||typeof value!=='object')return false
  const theme=value as Partial<Theme>
  const colors=[theme.background,theme.surface,theme.raised,theme.text,theme.muted,theme.accent,theme.border]
  return typeof theme.name==='string'&&theme.name.trim().length>0&&colors.every(color=>typeof color==='string'&&/^#[\da-f]{6}$/i.test(color))&&typeof theme.headingFont==='string'&&typeof theme.bodyFont==='string'&&typeof theme.radius==='number'&&theme.radius>=0&&theme.radius<=24&&typeof theme.spacing==='number'&&theme.spacing>=2&&theme.spacing<=24
}
