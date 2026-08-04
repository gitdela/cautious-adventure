import type { PumpPriceBoardView } from "@workspace/content";
import { StationIcon } from "@workspace/ui/components/station-icon";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const priceFormatter = new Intl.NumberFormat("en-GH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* Schema caps the board at four fuels. */
const columnClasses = [
  "grid-cols-1",
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-4",
];

function HomePriceBoard({ board }: { board: PumpPriceBoardView }) {
  const updated = new Date(board.updatedAt);

  return (
    <div className="mt-12 max-w-[480px] overflow-hidden rounded-xl bg-surface-inverse shadow-[0_12px_32px_rgba(11,36,66,0.18)]">
      <div className="flex items-center justify-between gap-5 bg-brand px-6 py-4 text-white">
        <span className="inline-flex items-center gap-3 font-display text-[13px] font-bold tracking-[0.12em] uppercase">
          <StationIcon name="pump" className="size-[18px]" />
          At the pump today
        </span>
        <time
          dateTime={board.updatedAt.slice(0, 10)}
          className="shrink-0 text-[11px] text-white/85"
        >
          {dateFormatter.format(updated)}
        </time>
      </div>
      <div className={`grid ${columnClasses[Math.min(board.prices.length, 4)]}`}>
        {board.prices.map(({ fuel, amount }, index) => (
          <div
            key={fuel}
            className={index === 0 ? "px-2 py-6 text-center" : "border-l border-white/16 px-2 py-6 text-center"}
          >
            <p className="text-[13px] tracking-[0.08em] text-white/65 uppercase">
              {fuel}
            </p>
            <strong className="mt-2 block font-display text-[length:var(--size-display-sm)] leading-none font-bold text-white">
              ₵{priceFormatter.format(amount)}
            </strong>
            <p className="mt-1 text-[11px] text-white/50">GHS / litre</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { HomePriceBoard };
