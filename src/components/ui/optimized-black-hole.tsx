import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { createRenderer } from "./optimized-black-hole-utils/renderer";

/**
 * Standalone host for the optimized black-hole renderer. Fills its parent.
 *
 * Differences from the pasted component: it takes a `className`; it no longer paints its own
 * `bg-black`, so the page's backdrop shows until the first frame fades in (and stays as the
 * fallback when WebGL is unavailable); and `ready` resolves to a boolean, so a failure leaves the
 * canvas hidden instead of throwing an unhandled rejection.
 */
export function Example({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({ canvas });
    void renderer.ready.then((ok) => {
      if (!cancelled) setIsReady(ok);
    });
    return () => {
      cancelled = true;
      renderer.dispose();
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "block h-full w-full touch-none transition-opacity duration-500",
          isReady ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export default Example;
