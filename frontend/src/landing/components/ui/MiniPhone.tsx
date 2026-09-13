type MiniPhoneProps = {
  src: string;
  alt: string;
  secondary?: boolean;
  className?: string;
};

export function MiniPhone({
  src,
  alt,
  secondary = false,
  className = "",
}: MiniPhoneProps) {
  const width = secondary
    ? "w-[var(--mini-phone-secondary-width,190px)] opacity-[0.88]"
    : "w-[var(--mini-phone-width,230px)]";

  return (
    <div
      className={`${width} flex-none rounded-[35px] bg-navy p-1.75 shadow-[0_25px_60px_rgba(0,0,0,0.28)] ${className}`}
    >
      <img src={src} alt={alt} className="block w-full rounded-[29px]" />
    </div>
  );
}
