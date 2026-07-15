export function Logo({
  size = 40,
  withWordmark = true,
  className = "",
  wordmarkClassName = "",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/favicon.png"
        alt="Gydus Kiddies"
        width={size}
        height={size}
        className="shrink-0 rounded-full object-contain"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span
          className={`font-display text-lg font-semibold tracking-tight md:text-xl ${wordmarkClassName}`}
        >
          Gydus Kiddies
        </span>
      )}
    </div>
  );
}