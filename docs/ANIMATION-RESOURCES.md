# Frontend Component & Animation Resources

A curated starting catalogue for LUNEVRA Technologies. These are discovery and learning resources, not blanket approval to copy or commercially redistribute their components.

## 1. React component libraries

| Resource | Best for | URL |
|---|---|---|
| React Bits | Particle effects, typography, interactive cards, backgrounds | https://reactbits.dev/ |
| Magic UI | Animated landing-page components, text, grids, marquees and effects | https://magicui.design/ |
| 21st.dev | Community React components, patterns and agent-assisted discovery | https://21st.dev/ |
| Aceternity UI | Cinematic hero sections, spotlight effects, parallax and visual components | https://ui.aceternity.com/ |
| Motion Primitives | Reusable motion patterns and restrained UI transitions | https://motion-primitives.com/ |
| Animate UI | Animated interface primitives such as dialogs, menus and accordions | https://animate-ui.com/ |
| shadcn/ui | Accessible, composable UI foundations | https://ui.shadcn.com/ |

## 2. Animation engines and creative tools

| Technology | Best for | URL |
|---|---|---|
| Motion for React | Everyday UI animation, gestures, springs and scroll-linked motion | https://motion.dev/ |
| GSAP | Complex timelines, scroll choreography and advanced transitions | https://gsap.com/ |
| Three.js | Custom WebGL, shaders, procedural geometry and particle systems | https://threejs.org/ |
| Rive | Interactive vector animation and state-driven assets | https://rive.app/ |
| Spline | Interactive 3D scenes and product visuals | https://spline.design/ |
| Lenis | Smooth-scroll behaviour and scroll coordination | https://lenis.darkroom.engineering/ |

## 3. Inspiration and experimentation

| Resource | What to study | URL |
|---|---|---|
| Awwwards | Award-winning website design and interaction | https://www.awwwards.com/ |
| Hoverstat.es | Experimental web design and interactions | https://www.hoverstat.es/ |
| Codrops | Creative coding, WebGL and unusual transitions | https://tympanus.net/codrops/ |
| Godly | Curated modern website design | https://godly.website/ |
| Darkroom | Experimental digital experiences and interaction design | https://www.darkroom.engineering/ |
| Locomotive | Agency-level web design and motion direction | https://www.locomotive.ca/ |

## 4. Suggested LUNEVRA animation toolkit

| Priority | Tool | Intended role |
|---|---|---|
| 1 | Motion | Default UI animation engine |
| 2 | shadcn/ui | Accessible interface foundation |
| 3 | React Bits | Distinctive visual effects |
| 4 | Magic UI | Landing-page and presentation components |
| 5 | GSAP | Advanced timelines and scroll choreography |
| 6 | Three.js | Custom 3D and shader experiences when justified |
| 7 | Rive | Interactive vector assets |

Use the simplest technology that achieves the desired result. Avoid stacking multiple animation engines on the same interaction without a clear reason.

## 5. LUNEVRA visual direction

The preferred company aesthetic is:
- Near-black and graphite surfaces.
- Restrained silver and cyan accents.
- Minimalist, architectural typography.
- Fine grain, subtle lighting and carefully controlled depth.
- Smooth, purposeful transitions.
- Interactive effects that respond subtly rather than constantly demanding attention.

Avoid generic purple gradients, excessive neon, random glassmorphism and animation that harms readability or performance.

Potential signature hero direction:
- A restrained particle constellation or structured particle field.
- Subtle cursor response.
- A geometric/orbital emblem constructed through thin lines or points.
- Staggered headline reveal.
- Fine grain and a quiet vignette.

## 6. Licence and sourcing policy

Before adding any third-party component to the Observatory or a LUNEVRA product:

1. Identify the exact component and original author.
2. Locate its source repository and component-level licence, if present.
3. Record the licence name and version.
4. Verify commercial-use, modification and redistribution terms.
5. Record required attribution and notices.
6. Record the verification date and source reference.
7. Mark the entry **Review required** or **Unknown** until verified.

Do not assume every component in a library has the same licence as the library repository. Some libraries may contain separately licensed, restricted or community-submitted content.

Do not treat a public demo or website preview as permission to copy its implementation or assets.

## 7. Performance and accessibility policy

- Prefer transform and opacity animation when appropriate.
- Avoid expensive layout-triggering animation on large regions.
- Lazy-load heavy 3D and canvas experiences.
- Clean up requestAnimationFrame loops and observers.
- Dispose of WebGL resources.
- Respect `prefers-reduced-motion`.
- Provide static or simplified alternatives for non-essential motion.
- Test on mobile hardware and low-power devices.
- Never publish invented FPS or GPU metrics.

---

*This catalogue is a starting point. Add exact component references, licence evidence and test results as each item is reviewed in the Component Observatory.*
