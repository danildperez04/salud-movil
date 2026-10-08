import { useEffect, useRef } from "react";

// Barra fina bajo el header que se llena según el avance de lectura. Escribe la
// transformación directamente en el DOM (sin estado de React) para no volver a
// renderizar el header en cada evento de scroll.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.75"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-linear-to-r from-mint to-mint-light [transform:scaleX(0)]"
      />
    </div>
  );
}
