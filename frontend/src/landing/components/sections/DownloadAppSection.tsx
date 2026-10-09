import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { FaAndroid, FaApple, FaAppStoreIos, FaWindows } from "react-icons/fa6";
import { releaseDownloadUrl } from "../../../lib/api";
import { formatBytes } from "../../../lib/format";
import type { PublicRelease } from "../../../types";
import { downloadPlatforms } from "../../data/downloads";
import { useLatestReleases } from "../../hooks/useLatestReleases";
import { Button } from "../ui/Button";
import { FadeInOnScroll } from "../ui/FadeInOnScroll";
import { SectionHeader } from "../ui/SectionHeader";

const ICONS: Record<string, ReactNode> = {
  android: <FaAndroid />,
  windows: <FaWindows />,
  macos: <FaApple />,
  ios: <FaAppStoreIos />,
};

export function DownloadAppSection() {
  const { loading, releases } = useLatestReleases();

  return (
    <section
      id="descargar"
      className="py-16 bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-soft-2)_100%)] landing-sm:py-22"
    >
      <div className="container-x grid grid-cols-1 items-center gap-12 landing-md:grid-cols-[0.8fr_1.2fr] landing-md:gap-16">
        <SectionHeader
          align="left"
          badge="Lleva Salud Móvil contigo"
          title="Tu salud, también desde tu celular."
          description="Accede a tus citas, medicamentos, indicadores y expediente desde Salud Móvil. Descarga la versión para tu dispositivo; las que aún no están listas aparecen como «Disponible pronto»."
        />

        <div className="grid grid-cols-1 gap-4 landing-sm:grid-cols-2">
          {downloadPlatforms.map((item, index) => {
            const release =
              item.platform === "ios" ? undefined : releases[item.platform];
            return (
              <FadeInOnScroll
                key={item.platform}
                direction="right"
                delay={120 + index * 90}
                className="flex"
              >
                <PlatformCard
                  icon={ICONS[item.platform]}
                  name={item.name}
                  description={item.description}
                  cta={item.cta}
                  release={release}
                  loading={loading && item.platform !== "ios"}
                />
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PlatformCardProps = {
  icon: ReactNode;
  name: string;
  description: string;
  cta: string;
  release?: PublicRelease;
  loading: boolean;
};

// Con instalable publicado la tarjeta es clara y ofrece la descarga; sin él,
// pasa al estilo oscuro de "Disponible pronto".
function PlatformCard({
  icon,
  name,
  description,
  cta,
  release,
  loading,
}: PlatformCardProps) {
  if (!release) {
    return (
      <article className="group flex-1 rounded-3xl border border-transparent bg-[linear-gradient(145deg,var(--color-navy),var(--color-navy-2))] p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-strong">
        <div className="mb-5 grid h-13.5 w-13.5 place-items-center rounded-[18px] bg-white/10 text-[25px] text-mint-light transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-2 text-[26px] font-bold text-white">{name}</h3>
        <p className="mb-5 text-[15px] leading-[1.65] text-[#c2d1d8] landing-sm:min-h-16">
          {description}
        </p>
        {loading ? (
          <span
            aria-hidden="true"
            className="block h-9 w-36 animate-pulse rounded-full bg-white/10"
          />
        ) : (
          <span className="inline-flex items-center gap-2.5 rounded-full bg-mint/12 px-3.5 py-2.5 text-[13px] font-[850] text-mint-light">
            <span className="relative grid h-1.75 w-1.75 place-items-center">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
              <span className="relative h-full w-full rounded-full bg-mint" />
            </span>
            Disponible pronto
          </span>
        )}
      </article>
    );
  }

  return (
    <article className="group flex-1 rounded-3xl border border-line bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-mint-line-strong hover:shadow-strong">
      <div className="mb-5 grid h-13.5 w-13.5 place-items-center rounded-[18px] bg-mint-soft text-[25px] text-mint-dark transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-mint group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-[26px] font-bold text-navy">{name}</h3>
      <p className="mb-2 text-[15px] leading-[1.65] text-muted landing-sm:min-h-16">
        {description}
      </p>
      <p className="mb-5 text-[14px] font-semibold text-navy-2">
        Versión {release.version} · {formatBytes(release.sizeBytes)}
      </p>
      <Button href={releaseDownloadUrl(release.downloadPath)} download>
        {cta}
        <Download
          size={18}
          className="transition-transform duration-300 group-hover:translate-y-0.5"
        />
      </Button>
    </article>
  );
}
