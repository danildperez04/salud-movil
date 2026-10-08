import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { IconTile } from "../ui/IconTile";
import { SectionHeader } from "../ui/SectionHeader";
import { faqItems } from "../../data/faq";
import { socialLinks } from "../../data/social";

type FaqItemProps = {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FaqItem({ index, question, answer, isOpen, onToggle }: FaqItemProps) {
  const buttonId = `faq-button-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <FadeInOnScroll delay={index * 90}>
      <div
        className={`relative overflow-hidden rounded-[20px] border transition duration-300 ease-out-expo ${
          isOpen
            ? "border-mint-line-strong bg-linear-to-br from-white to-mint-soft-2 shadow-soft"
            : "border-line bg-white hover:-translate-y-0.5 hover:border-mint-line-strong hover:shadow-soft"
        }`}
      >
        {/* Barra de acento que crece desde el centro al abrir */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-4 left-0 w-1 rounded-r-full bg-mint transition-transform duration-500 ease-out-expo ${
            isOpen ? "scale-y-100" : "scale-y-0"
          }`}
        />

        <h3 className="m-0">
          <button
            id={buttonId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={onToggle}
            className="group flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-4.5 text-left font-body focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mint landing-sm:px-6 landing-sm:py-5"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-black transition-colors duration-300 ${
                isOpen
                  ? "bg-mint text-white"
                  : "bg-mint-soft text-mint-dark group-hover:bg-mint-line"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-[15px] font-[850] leading-[1.4] text-navy landing-sm:text-[16px]">
              {question}
            </span>
            {/* El "+" gira 45° y se vuelve una "x" al abrir */}
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition duration-300 ease-out-expo ${
                isOpen
                  ? "rotate-45 border-mint bg-mint text-white"
                  : "border-line text-mint-dark group-hover:border-mint"
              }`}
            >
              <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </button>
        </h3>

        {/* Altura animada con grid 0fr → 1fr: no hace falta medir el contenido.
            `inert` saca el panel cerrado del orden de tabulación. */}
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          inert={!isOpen}
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="m-0 pb-5 pl-17.5 pr-4.5 text-[14px] leading-[1.75] text-muted landing-sm:pb-6 landing-sm:pl-19 landing-sm:pr-6">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </FadeInOnScroll>
  );
}

export function FaqSection() {
  // La primera pregunta arranca abierta: muestra de entrada cómo funciona.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsapp = socialLinks.find((social) => social.icon === "whatsapp");

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="bg-white py-19.5 landing-sm:py-25">
      <div className="container-x">
        <SectionHeader
          badge="Preguntas frecuentes"
          title="Lo esencial, claro y rápido."
          className="mb-12"
        />

        <div className="mx-auto grid max-w-205 gap-3">
          {faqItems.map((item, index) => (
            <FaqItem
              key={item.question}
              index={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>

        {whatsapp && (
          <FadeInOnScroll delay={faqItems.length * 90} className="mx-auto mt-8 max-w-205">
            <div className="group flex flex-col items-center justify-between gap-4 rounded-[20px] border border-mint-line bg-mint-soft-2 px-5 py-5 text-center landing-sm:flex-row landing-sm:px-6 landing-sm:text-left">
              <div className="flex flex-col items-center gap-3.5 landing-sm:flex-row">
                <IconTile icon={MessageCircle} size="lg" />
                <div>
                  <strong className="block text-[15px] font-bold text-navy">
                    ¿Tienes otra pregunta?
                  </strong>
                  <span className="text-[13px] text-muted">
                    Escríbenos y con gusto te ayudamos.
                  </span>
                </div>
              </div>
              <Button href={whatsapp.href} external>
                Escríbenos por WhatsApp
              </Button>
            </div>
          </FadeInOnScroll>
        )}
      </div>
    </section>
  );
}
