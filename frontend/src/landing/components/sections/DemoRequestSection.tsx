import type { FormEvent } from "react";
import { CalendarCheck, Loader2, Send } from "lucide-react";
import { demoSection } from "../../data/demo";
import { useDemoRequestForm } from "../../hooks/useDemoRequestForm";
import { Button } from "../ui/Button";
import { CheckBadge } from "../ui/CheckBadge";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { Field } from "../ui/Field";
import { SectionHeader } from "../ui/SectionHeader";

export function DemoRequestSection() {
  const { values, errors, status, formError, setValue, submit, reset } =
    useDemoRequestForm();
  const submitting = status === "submitting";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const decoy = new FormData(event.currentTarget).get("website");
    void submit(typeof decoy === "string" ? decoy : "");
  };

  return (
    <section
      id="demo"
      className="bg-mint-soft-2 py-16 landing-sm:py-22"
    >
      <div className="container-x grid grid-cols-1 items-start gap-12 landing-md:grid-cols-[0.85fr_1.15fr] landing-md:gap-16">
        <div>
          <SectionHeader
            align="left"
            badge={demoSection.badge}
            title={demoSection.title}
            description={demoSection.description}
          />
          <ul className="mt-8 grid gap-3.5">
            {demoSection.points.map((point, index) => (
              <FadeInOnScroll
                key={point}
                as="li"
                delay={260 + index * 90}
                className="flex items-start gap-3 text-[17px] leading-[1.6] text-navy"
              >
                <CheckBadge className="mt-0.75" />
                {point}
              </FadeInOnScroll>
            ))}
          </ul>
        </div>

        <FadeInOnScroll direction="left" delay={120}>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft landing-sm:p-8">
            {status === "success" ? (
              <div role="status" className="py-8 text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-mint-soft text-mint-dark">
                  <CalendarCheck size={30} />
                </div>
                <h3 className="mb-2 text-[28px] font-bold text-navy">
                  {demoSection.success.title}
                </h3>
                <p className="mx-auto mb-6 max-w-110 text-[17px] leading-[1.65] text-muted">
                  {demoSection.success.description}
                </p>
                <Button variant="secondary" onClick={reset}>
                  {demoSection.success.again}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-4">
                <div className="grid gap-4 landing-sm:grid-cols-2">
                  <Field
                    label="Nombre completo"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={120}
                    value={values.name}
                    onChange={(v) => setValue("name", v)}
                    error={errors.name}
                    disabled={submitting}
                  />
                  <Field
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={160}
                    value={values.email}
                    onChange={(v) => setValue("email", v)}
                    error={errors.email}
                    disabled={submitting}
                  />
                </div>
                <Field
                  label="Institución u organización"
                  name="organization"
                  required
                  autoComplete="organization"
                  maxLength={160}
                  value={values.organization}
                  onChange={(v) => setValue("organization", v)}
                  error={errors.organization}
                  disabled={submitting}
                />
                <div className="grid gap-4 landing-sm:grid-cols-2">
                  <Field
                    label="Cargo"
                    name="jobTitle"
                    autoComplete="organization-title"
                    maxLength={120}
                    value={values.jobTitle}
                    onChange={(v) => setValue("jobTitle", v)}
                    disabled={submitting}
                  />
                  <Field
                    label="Teléfono"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    value={values.phoneNumber}
                    onChange={(v) => setValue("phoneNumber", v)}
                    error={errors.phoneNumber}
                    disabled={submitting}
                  />
                </div>
                <Field
                  label="¿Qué te gustaría ver en la demostración?"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  value={values.message}
                  onChange={(v) => setValue("message", v)}
                  disabled={submitting}
                />

                {/* Señuelo anti-bots: fuera de pantalla y fuera del orden de tab.
                    Las personas no lo ven; los bots que rellenan todo, sí. */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label>
                    No llenar este campo
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-[14px] bg-red-50 px-4 py-3 text-[15px] text-red-700"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex flex-col gap-3 landing-sm:flex-row landing-sm:items-center landing-sm:justify-between">
                  <p className="text-[14px] leading-[1.5] text-muted landing-sm:max-w-72">
                    {demoSection.privacy}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[14px] bg-mint px-5 py-3.5 font-body font-[850] text-white shadow-brand transition duration-300 hover:-translate-y-0.5 hover:bg-mint-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        Solicitar demo
                        <Send
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
