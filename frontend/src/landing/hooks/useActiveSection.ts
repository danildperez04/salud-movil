import { useEffect, useState } from "react";

// Devuelve el id de la sección que está cruzando la "línea de lectura"
// (35% desde el borde superior del viewport). Se calcula a partir del DOM, en
// el orden en que aparecen las secciones, así que no hay que mantener una
// lista de ids aparte.
export function useActiveSection(selector: string, readingLine = 0.35) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    if (sections.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * readingLine;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActiveId(current);
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
  }, [selector, readingLine]);

  return activeId;
}
