import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { ICONS } from "../../data/icons";
import { trustItems } from "../../data/hero";

export function TrustBar() {
  return (
    <section className="border-y border-line bg-white">
      {/* Los divisores salen del `gap-px` sobre fondo `bg-line`: funcionan igual
          con 2 columnas (móvil) que con 4, sin calcular bordes por índice.
          El reveal va dentro de cada celda para que el fondo no se vea hueco. */}
      <div className="container-x grid grid-cols-2 gap-px bg-line landing-sm:grid-cols-4">
        {trustItems.map((item, index) => (
          <div
            key={item.title}
            className="group bg-white px-4.5 py-6 text-center transition-colors duration-300 hover:bg-mint-soft-2"
          >
            <FadeInOnScroll delay={index * 90} className="flex flex-col items-center">
              <IconTile icon={ICONS[item.icon]} className="mb-3" />
              <strong className="block text-[16px] font-bold text-navy">
                {item.title}
              </strong>
              <span className="mt-0.5 text-[13px] text-muted">
                {item.subtitle}
              </span>
            </FadeInOnScroll>
          </div>
        ))}
      </div>
    </section>
  );
}
