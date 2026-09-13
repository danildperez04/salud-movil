import { useState } from "react";
import { Link } from "react-router";
import { LogIn, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { navLinks } from "../../data/content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-line/70 bg-white/85 backdrop-blur-lg">
      <div className="container-x flex h-16.5 items-center justify-between gap-6 landing-sm:h-18.5">
        <Logo />

        {/* Links: aparecen junto con las acciones, ya en landing-md */}
        <nav className="hidden items-center gap-7 landing-md:flex">
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

        {/* Acciones: login como pill outline (ya no texto huérfano) + CTA sólido */}
        <div className="hidden items-center gap-3 landing-md:flex">
          <Link
            to="/login"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-4 py-2 text-[13px] font-medium text-navy transition-colors duration-200 hover:border-mint hover:bg-mint-soft hover:text-mint-dark"
          >
            <LogIn size={15} />
            Acceso personal de salud
          </Link>
          <Button href="#descargar">Descargar App</Button>
        </div>

        {/* Hamburguesa: solo por debajo de landing-md */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-navy landing-md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Panel móvil: mismo contenido, apilado */}
      {open && (
        <div className="border-t border-line bg-white px-5 pb-6 pt-5 landing-md:hidden">
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
