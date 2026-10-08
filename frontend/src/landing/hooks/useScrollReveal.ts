import { useEffect, useRef } from "react";

// Marca el elemento con `data-visible` la primera vez que entra al viewport.
// Con threshold 0 y un margen inferior negativo funciona igual para un badge
// que para una columna entera de 1500px (con un threshold fijo, los elementos
// muy altos nunca llegaban a revelarse).
//
// Usamos un atributo `data-*` en vez de una clase: React no lo toca al volver a
// renderizar, así que el elemento no vuelve a ocultarse si cambia su className.
export function useScrollReveal<T extends HTMLElement>(threshold = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
