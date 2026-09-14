import { useState } from "react";
import { Link } from "react-router";
import { LogIn, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { navLinks } from "../../data/content";

// Nota: el breakpoint 1200px está escrito de forma literal en cada
// className (min-[1200px]:...) a propósito. Tailwind genera el CSS
// escaneando el texto de tus archivos en busca de nombres de clase
// completos — si se arma con una variable de JS (`${x}:flex`), Tailwind
// nunca "ve" la clase final y no genera su regla, así que el elemento
// se queda con el comportamiento por defecto (por eso el botón de
// hamburguesa no se ocultaba en desktop). Si más adelante quieres
// cambiar el punto de corte, hazlo con buscar-y-reemplazar en este
// archivo, no con una constante.

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-line/70 bg-white/85 backdrop-blur-lg">
      <div className="container-x flex h-16.5 items-center justify-between gap-6 landing-sm:h-18.5">
        <Logo />

        <nav className="hidden items-center gap-7 min-[1200px]:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[13px] font-medium text-muted transition-colors duration-200 hover:text-mint-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 min-[1200px]:flex">
          <Link
            to="/login"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2 text-[13px] font-medium text-navy transition-colors duration-200 hover:border-mint hover:bg-mint-soft hover:text-mint-dark"
          >
            <LogIn size={15} />
            Acceso personal de salud
          </Link>
          <Button href="#descargar" className="shrink-0 whitespace-nowrap">
            Descargar App
          </Button>
        </div>

        {/* Hamburguesa: visible hasta 1199px, oculta desde 1200px */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-navy min-[1200px]:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-5 pb-6 pt-5 min-[1200px]:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-navy"
            >
              <LogIn size={16} />
              Acceso personal de salud
            </Link>
            <Button href="#descargar" className="justify-center">
              Descargar App
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
