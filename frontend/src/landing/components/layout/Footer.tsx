import { Link } from "react-router";
import { Logo } from "../ui/Logo";
import { SOCIAL_ICONS } from "../../data/socialIcons";
import {
  footerProductLinks,
  footerExploreLinks,
  socialLinks,
} from "../../data/content";

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#f7fafb] py-12">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12.5 landing-sm:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-95 text-xs leading-[1.7] text-muted">
              Una experiencia móvil para organizar y consultar información de
              salud de manera más simple.
            </p>
            <a
              href="#sobre-nosotros"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-mint px-3.5 py-2.75 text-[11px] font-[850] text-white transition duration-200 hover:bg-mint-dark"
            >
              Sobre nosotros →
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold text-navy">Producto</h4>
            {footerProductLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="my-2.25 block text-[11px] text-muted transition duration-200 hover:text-mint-dark"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-navy">Explorar</h4>
            {footerExploreLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="my-2.25 block text-[11px] text-muted transition duration-200 hover:text-mint-dark"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="my-2.25 block text-[11px] text-muted transition duration-200 hover:text-mint-dark"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-navy">Contacto</h4>
            <p className="text-xs leading-[1.7] text-muted">
              Seguinos y comunicate con el equipo de Salud Móvil.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon];
                const isExternal = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-1.75 rounded-xl border border-line bg-white px-2.75 py-2.25 text-[10px] font-bold text-navy transition duration-200 hover:border-mint-line hover:bg-mint-soft-2"
                  >
                    <Icon className="text-xs" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-7.5 flex flex-wrap justify-between gap-4.5 border-t border-line pt-5 text-[10px] text-muted">
          <span>© 2026 Salud Móvil. Prototipo de demostración.</span>
          <span>Tu salud, en tus manos.</span>
        </div>
      </div>
    </footer>
  );
}
