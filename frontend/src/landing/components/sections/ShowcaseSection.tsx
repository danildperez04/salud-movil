import { useState, type KeyboardEvent } from "react";
import { CheckBadge } from "../ui/CheckBadge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { MiniPhone } from "../ui/MiniPhone";
import { ICONS } from "../../data/icons";
import {
  showcaseTabs,
  showcaseScreens,
  type ShowcaseTabKey,
} from "../../data/showcase";

// Cada pestaña carga sus dos capturas solo cuando alguien se acerca a ella
// (hover, foco o toque), así el cambio no parpadea sin descargar las ocho
// imágenes al abrir la página.
function preloadScreen(tab: ShowcaseTabKey) {
  const { main, secondary } = showcaseScreens[tab];
  [main, secondary].forEach((src) => {
    new Image().src = src;
  });
}

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTabKey>("citas");
  const screen = showcaseScreens[activeTab];

  const selectTab = (key: ShowcaseTabKey, focus = false) => {
    setActiveTab(key);
    if (focus) document.getElementById(`showcase-tab-${key}`)?.focus();
  };

  // Navegación con flechas, como en cualquier tablist accesible.
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const last = showcaseTabs.length - 1;
    const target =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    selectTab(showcaseTabs[target].key, true);
  };

  return (
    <section id="descubre" className="bg-white py-16 landing-sm:py-22">
      <div className="container-x">
        <FadeInOnScroll
          direction="scale"
          className="relative overflow-hidden rounded-[25px] bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] p-5 shadow-strong landing-sm:rounded-[34px] landing-sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 animate-drift rounded-full bg-mint/12 blur-3xl"
          />

          <div className="relative mb-6 flex flex-col items-start justify-between gap-4 landing-md:flex-row landing-md:items-center landing-md:gap-8">
            <h2 className="m-0 text-[30px] tracking-[-0.03em] text-white landing-sm:text-[37px]">
              Conoce Salud Móvil por dentro.
            </h2>
            <p className="m-0 max-w-140 text-[15px] leading-[1.6] text-[#b9ccd6]">
              Explora las funciones principales que acompañan el día a día del
              usuario.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Funciones de la app"
            className="relative mb-6 flex flex-wrap gap-2"
          >
            {showcaseTabs.map((tab, index) => {
              const Icon = ICONS[tab.icon];
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`showcase-tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="showcase-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(tab.key)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  onPointerEnter={() => preloadScreen(tab.key)}
                  onFocus={() => preloadScreen(tab.key)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2.5 font-body text-[14px] font-extrabold transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-light ${
                    selected
                      ? "border-mint bg-mint text-white shadow-brand"
                      : "border-white/15 bg-white/6 text-[#c7d7df] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="showcase-panel"
            aria-labelledby={`showcase-tab-${activeTab}`}
            className="relative grid grid-cols-1 items-center gap-8 landing-md:grid-cols-[0.9fr_1.1fr]"
          >
            {/* `key` remonta el bloque al cambiar de pestaña y así se repite la
                animación de entrada. */}
            <div key={activeTab} className="animate-panel-in">
              <span className="text-[14px] font-black tracking-widest text-mint-light">
                {screen.num}
              </span>
              <h3 className="my-3 text-[38px] leading-[1.04] tracking-[-0.04em] text-white landing-sm:text-[46px]">
                {screen.title}
              </h3>
              <p className="max-w-117.5 text-[16px] leading-[1.7] text-[#b9ccd6]">
                {screen.text}
              </p>
              <ul className="m-0 mt-6 grid list-none gap-2.5 p-0">
                {screen.list.map((item, index) => (
                  <li
                    key={item}
                    className="flex animate-panel-in items-center gap-2.5 text-[15px] text-[#dfe8ec]"
                    style={{ animationDelay: `${180 + index * 90}ms` }}
                  >
                    <CheckBadge tone="dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex min-h-107.5 items-end justify-center [--mini-phone-secondary-width:155px] [--mini-phone-width:190px] landing-sm:min-h-125 landing-sm:[--mini-phone-secondary-width:190px] landing-sm:[--mini-phone-width:230px] landing-md:min-h-150 landing-md:[--mini-phone-secondary-width:240px] landing-md:[--mini-phone-width:290px]">
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 animate-glow rounded-full bg-mint/20 blur-3xl"
              />
              <MiniPhone
                key={`${activeTab}-main`}
                src={screen.main}
                alt={`Pantalla de ${activeTab}`}
                className="relative animate-phone-in"
              />
              <MiniPhone
                key={`${activeTab}-secondary`}
                src={screen.secondary}
                alt="Pantalla secundaria"
                secondary
                floatOffset={2400}
                className="absolute bottom-0 right-0 rotate-[5deg] animate-phone-in [animation-delay:160ms] landing-sm:right-[3%]"
              />
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
