import { useState } from "react";
import { Badge } from "../ui/Badge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { faqItems } from "../../data/content";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="bg-white py-19.5 landing-sm:py-25">
      <div className="container-x">
        <FadeInOnScroll className="mx-auto mb-13.5 max-w-190 text-center">
          <Badge>Preguntas frecuentes</Badge>
          <h2 className="my-3.5 mb-4 text-[clamp(32px,4vw,54px)] leading-[1.04] tracking-[-1.8px] text-navy">
            Lo esencial, claro y rápido.
          </h2>
        </FadeInOnScroll>

        <div className="mx-auto grid max-w-205 gap-2.5">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeInOnScroll
                key={item.question}
                className="overflow-hidden rounded-[18px] border border-line"
              >
                <button
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-white p-[20px_22px] text-left font-body text-[16px] font-[850] text-navy"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <span className="text-xl text-mint-dark">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5.5 pb-5 text-[13px] leading-[1.7] text-muted">
                    {item.answer}
                  </div>
                )}
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
