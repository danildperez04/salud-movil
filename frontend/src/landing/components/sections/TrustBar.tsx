import { trustItems } from "../../data/content";

export function TrustBar() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-x grid grid-cols-2 landing-sm:grid-cols-4">
        {trustItems.map((item, index) => (
          <div
            key={item.title}
            className={`px-4.5 py-6 text-center ${
              index === 0
                ? "border-b border-r border-line landing-sm:border-b-0"
                : index === 1
                  ? "border-b border-line landing-sm:border-b-0 landing-sm:border-r"
                  : index === 2
                    ? "border-b border-r border-line landing-sm:border-b-0"
                    : "border-b border-line landing-sm:border-b-0"
            }`}
          >
            <strong className="block text-[14px] font-bold text-navy">
              {item.title}
            </strong>
            <span className="text-[11px] text-muted">{item.subtitle}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
