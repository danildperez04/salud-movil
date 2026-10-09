import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Logo } from "../ui/Logo";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { SOCIAL_ICONS } from "../../data/icons";
import { footerProductLinks, footerExploreLinks } from "../../data/navigation";
import { socialLinks } from "../../data/social";

const linkClass =
  "my-2.25 block w-fit text-[13px] text-muted transition duration-200 hover:translate-x-1 hover:text-mint-dark";

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#f7fafb] py-12">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 landing-sm:grid-cols-[1.4fr_1fr_1fr_1.2fr] landing-sm:gap-12.5">
          <FadeInOnScroll>
            <Logo animated={false} />
            <p className="mt-4 max-w-105 text-[14px] leading-[1.7] text-muted">
              Una experiencia móvil para organizar y consultar información de
              salud de manera más simple.
            </p>
            <a
              href="#sobre-nosotros"
              className="group mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-mint px-3.5 py-2.75 text-[13px] font-[850] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-mint-dark"
            >
              Sobre nosotros
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </FadeInOnScroll>

          <FadeInOnScroll delay={90}>
            <h4 className="mb-3.5 text-[14px] font-bold text-navy">Producto</h4>
            {footerProductLinks.map((link) => (
              <a key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </FadeInOnScroll>

          <FadeInOnScroll delay={180}>
            <h4 className="mb-3.5 text-[14px] font-bold text-navy">Explorar</h4>
            {footerExploreLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ),
            )}
          </FadeInOnScroll>

          <FadeInOnScroll delay={270}>
            <h4 className="mb-3.5 text-[14px] font-bold text-navy">Contacto</h4>
            <p className="text-[14px] leading-[1.7] text-muted">
              Síguenos y comunícate con el equipo de Salud Móvil.
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
                    className="inline-flex items-center justify-center gap-1.75 rounded-xl border border-line bg-white px-2.75 py-2.25 text-[12px] font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:border-mint-line hover:bg-mint-soft-2"
                  >
                    <Icon className="text-[14px]" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </FadeInOnScroll>
        </div>

        <div className="mt-7.5 flex flex-wrap justify-between gap-4.5 border-t border-line pt-5 text-[12px] text-muted">
          <span>© 2026 Salud Móvil. Prototipo de demostración.</span>
          <span>Tu salud, en tus manos.</span>
        </div>
      </div>
    </footer>
  );
}
