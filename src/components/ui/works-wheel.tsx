// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
//
// Adapted for the LUNEVRA site from the CrafterUI "Works Wheel" component. The
// wheel maths and geometry are unchanged. What differs from the pasted source:
//  - no "use client" directive (this is a Vite SPA, not RSC);
//  - Tailwind runs without its preflight here, so the list, button and image
//    defaults the original relied on are reset explicitly;
//  - artwork is shown whole (object-contain) and an item with no `image` gets a
//    labelled "No screenshot yet" card instead of a broken or invented picture;
//  - items can carry `srcSet`, `alt` and `meta` (status line under the title);
//  - `onOpen` lets the page open its own project dialog, and only the card at the
//    front opens: tapping any other card turns the wheel to it first;
//  - pointer capture starts only after a few pixels of movement. Capturing on
//    pointerdown retargets the click to the stage, so card links never fired;
//  - anchors are not natively draggable (a native drag cancels the pointer drag);
//  - Enter opens the front card from the keyboard; cards are not tab stops
//    (the stage is, and arrows move it, per the aria-activedescendant pattern);
//  - a drag always snaps to a whole item, including inside the ring-opening range;
//  - type has a readable minimum so a narrow stage cannot shrink it to nothing.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. Omit for a labelled placeholder card. */
  image?: string;
  /** Responsive candidates for `image`. */
  srcSet?: string;
  /** Alt text for the cover art. Falls back to the title. */
  alt?: string;
  /** One quiet line under the front card's title, such as a status. */
  meta?: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default "Works '26" */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default "View" */
  action?: string;
  /** Called with the item's index when the front card is chosen. When given,
      the browser's own navigation for that click is cancelled. */
  onOpen?: (index: number) => void;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
const MIN_TITLE = 22; // px floors, so a small stage never makes unreadable type
const MIN_INDEX = 11;
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Pixels of movement before a press becomes a drag (and captures the pointer). */
const DRAG_SLOP = 5;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  onOpen,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const settling = React.useRef(0);
  const drag = React.useRef<{ y: number; id: number; live: boolean } | null>(
    null,
  );

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(cardH * TITLE, MIN_TITLE),
      index: Math.max(cardH * INDEX, MIN_INDEX),
    };
  }, [stage, count]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          // Culled by distance, not by angle: at a full turn the far side comes
          // back round to face us, and everything past the neighbours lands on
          // the vanishing point in a heap.
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  // Native listener, because the wheel has to be cancellable - and it only
  // cancels while it still has somewhere to go, so the page scrolls on at
  // either end instead of trapping the reader.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      // A wheel gesture arrives as a burst of events with no end of its own, so
      // the rest position is whatever notch it happened to stop on. Left there
      // the drum sits between two cards - nothing at the front, and the pair
      // either side of the gap both turned half away. Settle onto an item.
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  /** The item lying flat at the front, or -1 while the ring is still closed. */
  const frontIndex = () =>
    target.current >= 0.5 ? clamp(Math.round(target.current) - 1, 0, last) : -1;

  /** Only the front card opens. Any other card is brought round to the front. */
  const choose = (event: React.MouseEvent, i: number) => {
    if (i !== frontIndex()) {
      event.preventDefault();
      to(i + 1);
      return;
    }
    if (onOpen) {
      event.preventDefault();
      onOpen(i);
    }
  };

  const current = items[active];

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          drag.current = {
            y: event.clientY,
            id: event.pointerId,
            live: false,
          };
        }}
        onPointerMove={(event) => {
          const d = drag.current;
          if (!d || d.id !== event.pointerId) return;
          if (!d.live) {
            if (Math.abs(event.clientY - d.y) < DRAG_SLOP) return;
            // Capture only once it is really a drag. Capturing on pointerdown
            // would send the eventual click to the stage instead of the card.
            d.live = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          to(target.current + (d.y - event.clientY) / DRAG_UNITS);
          d.y = event.clientY;
        }}
        onPointerUp={() => {
          // Land on an item rather than between two.
          const d = drag.current;
          drag.current = null;
          if (d?.live) to(Math.round(target.current));
        }}
        onPointerCancel={() => {
          const d = drag.current;
          drag.current = null;
          if (d?.live) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else if (event.key === "Enter" && frontIndex() === active)
            cardRefs.current[active]?.click();
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <Tag
                key={item.title}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={i === active}
                href={item.href}
                tabIndex={-1}
                draggable={false}
                onDragStart={(event: React.DragEvent) => event.preventDefault()}
                onClick={(event: React.MouseEvent) => choose(event, i)}
                ref={(node: HTMLElement | null) => {
                  cardRefs.current[i] = node;
                }}
                className="group absolute [backface-visibility:hidden]"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <span className="bg-muted border-foreground/10 shadow-foreground/12 relative block size-full overflow-hidden rounded-sm border shadow-[0_18px_40px_-18px_var(--tw-shadow-color)]">
                  {item.image ? (
                    <img
                      src={item.image}
                      srcSet={item.srcSet}
                      sizes={item.srcSet ? "34vw" : undefined}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      className="block size-full object-contain p-[4%]"
                    />
                  ) : (
                    <span
                      className="absolute inset-0 flex flex-col items-center justify-center gap-[0.9em] p-[1em] text-center"
                      style={{ fontSize: metrics.cardH * 0.05 }}
                    >
                      <b className="font-display text-foreground/80 text-[2.4em] leading-[1.1] font-light tracking-tight">
                        {item.title}
                      </b>
                      <span className="font-mono text-muted-foreground text-[0.95em] tracking-[0.14em] uppercase">
                        No screenshot yet
                      </span>
                    </span>
                  )}
                  {action && item.href ? (
                    <span className="bg-background/80 text-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.12em] uppercase opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                      <svg
                        viewBox="0 0 12 12"
                        className="size-2.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 9 9 3M4 3h5v5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {action}
                    </span>
                  ) : null}
                </span>
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Ring title and front-card title trade places across the transition.
          Type is sized off the measured stage, not vh, so the wheel keeps its
          proportions inside a card as well as at full bleed. */}
      <div
        ref={labelRef}
        className="font-display pointer-events-none absolute inset-0 grid place-items-center font-light tracking-tight"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[8%] max-w-[24%] -translate-y-1/2 opacity-0"
      >
        <div
          className="font-display leading-[1.1] font-light tracking-tight"
          style={{ fontSize: metrics.title }}
        >
          {current?.title}
        </div>
        {current?.meta ? (
          <div
            className="font-mono text-muted-foreground mt-[0.9em] tracking-[0.12em] uppercase"
            style={{ fontSize: metrics.index }}
          >
            {current.meta}
          </div>
        ) : null}
      </div>

      <ol
        className="text-muted-foreground absolute top-[7.5%] right-[2.5%] m-0 list-none p-0 text-right leading-[1.75]"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "focus-visible:outline-foreground cursor-pointer border-0 bg-transparent p-0 text-right transition-colors outline-none focus-visible:outline-1",
                i === active && "text-foreground font-medium",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;
