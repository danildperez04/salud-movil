import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LogIn, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { ScrollProgress } from "../ui/ScrollProgress";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useScrolled } from "../../hooks/useScrolled";
import { navLinks } from "../../data/navigation";

// Nota: el breakpoint 1320px está escrito de forma literal en cada
// className (min-[1320px]:...) a propósito. Tailwind genera el CSS
// escaneando el texto de tus archivos en busca de nombres de clase
// completos — si se arma con una variable de JS (`${x}:flex`), Tailwind
// nunca "ve" la clase final y no genera su regla, así que el elemento
// se queda con el comportamiento por defecto (por eso el botón de
// hamburguesa no se ocultaba en desktop). Si más adelante quieres
// cambiar el punto de corte, hazlo con buscar-y-reemplazar en este
// archivo, no con una constante.

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const activeId = useActiveSection("main section[id]");

  // Escape cierra el menú móvil.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-100 border-b backdrop-blur-lg transition duration-300 ${
        scrolled || open
          ? "border-line bg-white/95 shadow-soft"
          : "border-line/70 bg-white/85"
      }`}
    >
      <div className="container-x flex h-16.5 items-center justify-between gap-6 landing-sm:h-18.5">
        <Logo />

        <nav
          aria-label="Principal"
          className="hidden items-center gap-5 min-[1320px]:flex"
        >
          {navLinks.map((link) => {
            const active = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "location" : undefined}
                className={`relative whitespace-nowrap py-1 text-[14.5px] font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-mint after:transition-transform after:duration-300 after:ease-out-expo hover:text-mint-dark hover:after:scale-x-100 ${
                  active
                    ? "text-mint-dark after:scale-x-100"
                    : "text-muted after:scale-x-0"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 min-[1320px]:flex">
          <Link
            to="/login"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2 text-[14.5px] font-medium text-navy transition-colors duration-200 hover:border-mint hover:bg-mint-soft hover:text-mint-dark"
          >
            <LogIn size={15} />
            Acceso personal de salud
          </Link>
          <Button href="#descargar" className="shrink-0">
            Descargar App
          </Button>
        </div>

        {/* Hamburguesa: visible hasta 1319px, oculta desde 1320px */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-navy transition-colors duration-200 hover:bg-mint-soft min-[1320px]:hidden"
        >
          <Menu
            size={22}
            className={`absolute transition duration-300 ${
              open ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            size={22}
            className={`absolute transition duration-300 ${
              open ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"
            }`}
          />
        </button>
      </div>

      {/* Menú móvil: siempre montado para poder animar la altura (grid 0fr → 1fr).
          `inert` lo saca del foco y de los lectores de pantalla mientras está cerrado. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out-expo min-[1320px]:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-h-[calc(100dvh-4.125rem)] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-4">
            <nav aria-label="Principal (móvil)" className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const active = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "location" : undefined}
                    style={{ transitionDelay: open ? `${90 + index * 50}ms` : "0ms" }}
                    className={`rounded-xl px-3 py-3 text-[17px] font-medium transition duration-300 ${
                      active
                        ? "bg-mint-soft text-mint-dark"
                        : "text-navy hover:bg-mint-soft-2"
                    } ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div
              style={{ transitionDelay: open ? `${90 + navLinks.length * 50}ms` : "0ms" }}
              className={`mt-4 flex flex-col gap-3 border-t border-line pt-5 transition duration-300 ${
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-3 text-[16px] font-medium text-navy transition-colors duration-200 hover:border-mint hover:bg-mint-soft"
              >
                <LogIn size={16} />
                Acceso personal de salud
              </Link>
              <Button href="#descargar" className="justify-center">
                Descargar App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollProgress />
    </header>
  );
}
