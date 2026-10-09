# Landing

Página pública de Salud Móvil (`/`). El panel de gestión vive en `/app` y no comparte componentes con esta carpeta.

```
landing/
├── LandingPage.tsx        Orden de las secciones
├── landing.css            Tokens de movimiento, reveal y estilos base (se importa desde src/index.css)
├── components/
│   ├── layout/            Navbar, Footer
│   ├── sections/          Una sección por archivo, en el orden de la página
│   ├── cards/             Tarjetas que se repiten (equipo, foto)
│   └── ui/                Piezas sueltas: Badge, Button, IconTile, SectionHeader, FadeInOnScroll…
├── data/                  Todo el copy y los enlaces, por tema (ver abajo)
└── hooks/                 useScrollReveal, useActiveSection, useScrolled
```

## Reglas para mantenerla ordenada

- **El copy va en `data/`, no en el JSX.** Un archivo por tema: `navigation`, `hero`, `features`, `showcase`, `faq`, `team`, `social`, `demo`.
- **Los iconos se registran en `data/icons.ts`** (`ICONS`, familia lucide). Los datos guardan solo la clave (`icon: "citas"`). No uses glifos Unicode (`◷ ✚ ⌁`): cada fuente los dibuja distinto.
- **El orden de `navLinks` y de los enlaces del footer sigue el orden de las secciones** en `LandingPage.tsx` (arriba → abajo). Si mueves una sección, reordena también los enlaces.
- **Cada sección con `id` salta bien bajo el header fijo** gracias a `scroll-margin-top` en `landing.css`; el Navbar resalta la sección activa leyendo `main section[id]`.
- **Animaciones de entrada:** envuelve en `<FadeInOnScroll delay={index * 90} direction="up|left|right|scale|fade">`. Ponlo en un wrapper *alrededor* de la tarjeta, no en la tarjeta con hover, para que el hover no herede el retraso.
- **Animaciones continuas** (`animate-float`, `animate-drift`, `animate-orbit`…) se definen una sola vez en `landing.css`. Todo respeta `prefers-reduced-motion`.
- Los breakpoints `landing-sm` (680px) y `landing-md` (980px) se escriben literales en las clases; el del Navbar (`min-[1200px]`) también (ver el comentario en `Navbar.tsx`).
