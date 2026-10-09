import { useEffect, useState } from "react";

// `true` cuando la página ya se desplazó más de `threshold` px.
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);

    // Si la página se recarga a mitad de scroll, el estado inicial se corrige
    // en el primer frame sin esperar a que el usuario vuelva a mover la rueda.
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [threshold]);

  return scrolled;
}
