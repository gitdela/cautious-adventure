import type { PumpPriceBoardView } from "@workspace/content";
import { StationIcon } from "@workspace/ui/components/station-icon";
import { cn } from "@workspace/ui/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const priceFormatter = new Intl.NumberFormat("en-GH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Forecourt price totem — the hero's only pump-price surface.
 *
 * The 56px top-right diagonal is the brand corner-cut motif; it has to be a
 * clip-path rather than a border radius, so the panel takes no border or
 * shadow (both would be sheared off by the clip).
 */
function HomePriceBoard({ board }: { board: PumpPriceBoardView }) {
  const updated = new Date(board.updatedAt);

  return (
    <div
      role="region"
      aria-label="Pump prices today"
      className="w-[min(100%,340px)] justify-self-start bg-navy-800 p-8 [clip-path:polygon(0_0,calc(100%-56px)_0,100%_56px,100%_100%,0_100%)] min-[961px]:justify-self-end"
    >
      <div className="flex items-center gap-3 text-orange-400">
        <StationIcon name="pump" className="size-5" />
        <span className="font-display text-[13px] leading-[1.2] font-bold tracking-[0.14em] uppercase">
          At the pump today
        </span>
      </div>

      <div className="mt-4">
        {board.prices.map(({ fuel, amount }, index) => (
          <div
            key={fuel}
            className={cn(
              "flex items-baseline justify-between gap-4 py-4",
              index > 0 && "border-t border-white/16",
            )}
          >
            <span className="text-[15px] font-bold tracking-[0.1em] text-white/85 uppercase">
              {fuel}
            </span>
            {/* Sized locally rather than on `--size-stat-md`: that token is
                shared with the stat blocks and person cards, which should not
                shrink with the totem. */}
            <span className="font-mono text-[clamp(22px,2.2vw,28px)] leading-none font-semibold tabular-nums text-orange-400">
              ₵{priceFormatter.format(amount)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-white/55">
        Effective{" "}
        <time dateTime={board.updatedAt.slice(0, 10)}>
          {dateFormatter.format(updated)}
        </time>{" "}
        · GHS/litre
      </p>
    </div>
  );
}

export { HomePriceBoard };
