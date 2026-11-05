// A small WebGL renderer for the hero's black hole.
//
// One full-screen triangle and one fragment shader. For every pixel the shader marches a light ray
// through a Schwarzschild-style gravitational field, bending it step by step, and gathers what it
// meets: the event horizon (black), a thin accretion disk lying in the y = 0 plane (seen from a few
// degrees above it, so the far side of the disk is lensed up over the top of the hole) and, for rays
// that escape, a procedural star field that the same bending distorts into an Einstein ring.
//
// Written for this site: the original renderer module this component expects was not available, so
// this implements the same contract - `createRenderer({ canvas })` returning `{ ready, dispose }`.
//
// Cost control, because this sits behind the headline:
//  - the canvas is rendered at no more than ~1.6M pixels and at most 2x device pixel ratio;
//  - a frame-time governor steps the resolution down if the device cannot hold ~30fps;
//  - nothing is drawn while the canvas is off screen or the tab is hidden;
//  - under prefers-reduced-motion it paints one still frame (and repaints on resize);
//  - software WebGL is refused (`failIfMajorPerformanceCaveat`), so a slow machine gets the page's
//    CSS backdrop rather than a slideshow.

export interface RendererOptions {
  canvas: HTMLCanvasElement
}

export interface Renderer {
  /** Resolves true once the first frame has been drawn, or false if WebGL is unusable here. */
  ready: Promise<boolean>
  dispose: () => void
}

const MAX_PIXELS = 1_600_000
const MIN_QUALITY = 0.45
/** A still frame for reduced motion: seconds into the disk's slow rotation. */
const STILL_TIME = 14

const VERTEX = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragment = (steps: number) => `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCenter;   // where the hole sits in the frame, 0..1, origin bottom-left
uniform vec2 uLook;     // pointer offset, -1..1
uniform float uScale;   // field of view: larger is a smaller hole

#define STEPS ${steps}
#define DISK_IN 3.0     // inner edge of the disk, in Schwarzschild radii (the innermost stable orbit)
#define DISK_OUT 9.5
#define CAM_DIST 24.0

// Hash functions without sin(), which loses precision on mobile GPUs.
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash31(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    sum += amp * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    amp *= 0.5;
  }
  return sum;
}

// Two shells of sparse, small stars on the direction sphere.
vec3 stars(vec3 d) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 2; i++) {
    float s = 55.0 + float(i) * 55.0;
    vec3 q = d * s;
    vec3 id = floor(q);
    vec3 f = fract(q) - 0.5;
    float h = hash31(id + float(i) * 19.7);
    if (h > 0.972) {
      vec3 off = vec3(hash31(id + 3.1), hash31(id + 7.7), hash31(id + 11.3)) - 0.5;
      float dist = length(f - off * 0.6);
      float b0 = (h - 0.972) / 0.028;
      float b = (1.0 - smoothstep(0.0, 0.17, dist)) * (0.3 + 0.7 * b0);
      vec3 tint = mix(vec3(0.74, 0.86, 1.0), vec3(1.0, 0.93, 0.82), hash31(id + 23.9));
      col += tint * b * mix(1.0, 0.6, float(i));
    }
  }
  return col;
}

void main() {
  float minRes = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - uCenter * uRes) / minRes;

  // Camera a few degrees above the disk plane, nudged by the pointer, always looking at the hole.
  float el = radians(7.0) + uLook.y * 0.05;
  float az = uLook.x * 0.18;
  vec3 ro = CAM_DIST * vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el));
  vec3 fwd = -normalize(ro);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 v = normalize(fwd + (uv.x * right + uv.y * up) * uScale);

  vec3 p = ro;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);   // squared angular momentum: constant along a light ray

  vec3 col = vec3(0.0);
  float opac = 0.0;
  float minR = 1000.0;
  bool horizon = false;
  bool escaped = false;

  for (int i = 0; i < STEPS; i++) {
    float r2 = dot(p, p);
    float r = sqrt(r2);
    minR = min(minR, r);
    if (r < 1.0) { horizon = true; break; }
    if (r > CAM_DIST + 2.0 && dot(p, v) > 0.0) { escaped = true; break; }

    // Small steps near the hole, long ones far away.
    float dt = clamp(r * 0.18 - 0.1, 0.04, 1.2);
    // Light in a Schwarzschild field: a = -1.5 * rs * h^2 * p / r^5 (rs = 1). Gives the photon
    // sphere at r = 1.5 and the right deflection for a grazing ray.
    vec3 acc = -1.5 * h2 * p / (r2 * r2 * r);
    vec3 vn = normalize(v + acc * dt);
    vec3 pn = p + vn * dt;

    // Did this step cross the disk plane?
    if (p.y * pn.y < 0.0) {
      float k = p.y / (p.y - pn.y);
      vec3 hp = mix(p, pn, k);
      float rr = length(hp.xz);
      if (rr > DISK_IN && rr < DISK_OUT) {
        float x = (rr - DISK_IN) / (DISK_OUT - DISK_IN);
        float temp = pow(DISK_IN / rr, 0.75);

        // Keplerian shear: the inner disk turns faster than the outer, so the texture winds up.
        float ang = uTime * 0.9 / (rr * sqrt(rr));
        float ca = cos(ang);
        float sa = sin(ang);
        vec2 q = vec2(ca * hp.x - sa * hp.z, sa * hp.x + ca * hp.z);
        float n = fbm(q * 1.15);
        float arms = 0.5 + 0.5 * sin(rr * 6.0 + n * 6.0);
        float edge = smoothstep(0.0, 0.06, x) * (1.0 - smoothstep(0.55, 1.0, x));
        float dens = edge * (0.25 + 1.1 * n) * (0.55 + 0.45 * arms);

        // Relativistic beaming: the side turning toward us is brighter and bluer.
        float vorb = sqrt(0.5 / max(rr - 0.9, 0.5));
        vec3 vel = normalize(vec3(-hp.z, 0.0, hp.x)) * vorb;
        float dop = 1.0 / max(1.0 - dot(vel, -vn), 0.25);
        float beam = clamp(pow(dop, 2.5), 0.2, 3.2);

        // Silver-white at the hot inner edge, cooling to ice-blue; warm on the receding side.
        vec3 hot = vec3(1.0, 0.97, 0.92);
        vec3 cool = vec3(0.30, 0.50, 0.62);
        vec3 c = mix(cool, hot, clamp(temp * temp * 1.4, 0.0, 1.0));
        c = mix(c * vec3(1.15, 0.85, 0.7), c * vec3(0.85, 1.0, 1.18), smoothstep(0.7, 1.6, dop));

        float a = clamp(dens * 1.25, 0.0, 0.96);
        col += (1.0 - opac) * c * beam * (0.55 + 1.8 * temp) * a;
        opac += (1.0 - opac) * a;
        if (opac > 0.99) break;
      }
    }

    p = pn;
    v = vn;
  }

  // Whatever the ray did not hit: stars if it got away, nothing if it fell in.
  if (escaped) col += (1.0 - opac) * stars(v);

  // A faint halo where rays skim the photon sphere.
  if (!horizon) {
    float dm = (minR - 1.5) * 4.0;
    col += vec3(0.75, 0.88, 1.0) * exp(-dm * dm) * 0.18 * (1.0 - opac);
  }

  col = 1.0 - exp(-col * 1.25);   // soft tone map
  col = pow(col, vec3(0.92));
  col += (hash21(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) / 255.0;   // dither against banding
  gl_FragColor = vec4(col, 1.0);
}
`

type Uniforms = Record<'res' | 'time' | 'center' | 'look' | 'scale', WebGLUniformLocation | null>

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Black hole shader failed to compile:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function createRenderer({ canvas }: RendererOptions): Renderer {
  let announced = false
  let resolveReady: (ok: boolean) => void = () => {}
  const ready = new Promise<boolean>(resolve => {
    resolveReady = resolve
  })
  const announce = (ok: boolean) => {
    if (announced) return
    announced = true
    resolveReady(ok)
  }

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'default',
    failIfMajorPerformanceCaveat: true,
  })
  if (!gl) {
    announce(false)
    return { ready, dispose: () => {} }
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const lowPower = window.matchMedia('(max-width: 720px), (pointer: coarse)').matches
  const steps = lowPower ? 64 : 96

  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let uniforms: Uniforms | null = null

  let disposed = false
  let onScreen = true
  let frame = 0
  let last = 0
  let slow = 0
  let quality = 1
  const t0 = performance.now()

  const look = { x: 0, y: 0, tx: 0, ty: 0 }
  let center: [number, number] = [0.76, 0.5]
  let scale = 0.85

  /** Compile and link, and set up the one triangle. Run again after a lost context is restored. */
  const init = () => {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment(steps))
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      return false
    }
    const prog = gl.createProgram()
    if (!prog) return false
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('Black hole program failed to link:', gl.getProgramInfoLog(prog))
      gl.deleteProgram(prog)
      return false
    }
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.useProgram(prog)
    const position = gl.getAttribLocation(prog, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    uniforms = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      center: gl.getUniformLocation(prog, 'uCenter'),
      look: gl.getUniformLocation(prog, 'uLook'),
      scale: gl.getUniformLocation(prog, 'uScale'),
    }
    program = prog
    return true
  }

  const draw = (seconds: number) => {
    if (!program || !uniforms || gl.isContextLost()) return
    gl.uniform2f(uniforms.res, canvas.width, canvas.height)
    gl.uniform1f(uniforms.time, seconds)
    gl.uniform2f(uniforms.center, center[0], center[1])
    gl.uniform2f(uniforms.look, look.x, look.y)
    gl.uniform1f(uniforms.scale, scale)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  /** Match the drawing buffer to the canvas, within the pixel budget, and place the hole. */
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const budget = Math.min(1, Math.sqrt(MAX_PIXELS / (w * h * dpr * dpr)))
    const px = dpr * budget * quality
    const bw = Math.max(1, Math.round(w * px))
    const bh = Math.max(1, Math.round(h * px))
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    gl.viewport(0, 0, bw, bh)
    // Wide: right of centre, in the space beside the headline. Narrow: low in the frame, under it.
    center = w < 720 ? [0.62, 0.3] : [0.76, 0.5]
    scale = w < 720 ? 1.0 : w < 1050 ? 0.95 : 0.85
  }

  const animating = () => !disposed && program !== null && onScreen && !document.hidden && !motion.matches

  const paintStill = () => {
    if (disposed || !program) return
    draw(motion.matches ? STILL_TIME : (performance.now() - t0) / 1000)
    announce(true)
  }

  const tick = (now: number) => {
    frame = 0
    if (!animating()) {
      last = 0
      return
    }
    if (last) {
      const dt = now - last
      // Ignore the long gaps left by a throttled tab; only judge steady-state frames.
      if (dt < 250) {
        slow = dt > 30 ? slow + 1 : Math.max(0, slow - 1)
        if (slow > 24 && quality > MIN_QUALITY) {
          quality = Math.max(MIN_QUALITY, quality * 0.85)
          slow = 0
          resize()
        }
      }
    }
    last = now
    look.x += (look.tx - look.x) * 0.06
    look.y += (look.ty - look.y) * 0.06
    draw((now - t0) / 1000)
    announce(true)
    frame = requestAnimationFrame(tick)
  }

  /** Start or stop the loop to match whether there is anything worth drawing. */
  const sync = () => {
    if (animating()) {
      if (!frame) frame = requestAnimationFrame(tick)
    } else if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
    }
  }

  const onResize = () => {
    resize()
    // Resizing clears the canvas. A running loop repaints next frame; otherwise do it now.
    if (!animating()) paintStill()
  }

  const onMotion = () => {
    sync()
    if (!animating()) paintStill()
  }

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || motion.matches) return
    look.tx = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1)
    look.ty = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1)
  }

  const onLost = (event: Event) => {
    event.preventDefault()
    program = null
    uniforms = null
    buffer = null
    sync()
  }

  const onRestored = () => {
    if (disposed || !init()) return
    resize()
    paintStill()
    sync()
  }

  if (!init()) {
    announce(false)
    return { ready, dispose: () => {} }
  }

  resize()
  paintStill()

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas)
  const intersectionObserver = new IntersectionObserver(entries => {
    const entry = entries.at(-1)
    if (!entry) return
    onScreen = entry.isIntersecting
    sync()
  })
  intersectionObserver.observe(canvas)
  document.addEventListener('visibilitychange', sync)
  motion.addEventListener('change', onMotion)
  window.addEventListener('pointermove', onPointer, { passive: true })
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  sync()

  return {
    ready,
    dispose: () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', onMotion)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      if (program) gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
      program = null
      buffer = null
      // The context itself is left alone on purpose. Calling loseContext() here would break React
      // StrictMode, which disposes and re-creates the renderer on the same canvas: getContext()
      // would hand back the dead context.
      announce(false)
    },
  }
}
