"use client";

import { Fragment, type ReactNode } from "react";

import {
  formatCedis,
  formatPumpDate,
  type PumpPriceBoardView,
} from "@workspace/content";

import { SiteTopBarPortal } from "./site-top-bar-slot";

/** Two copies inside each half keep a pass wider than the full-width strip. */
const CONTENT_REPEATS = 2;

function TickerItem({ children }: { children: ReactNode }) {
  return (
    <span className="flex shrink-0 items-center gap-5 pr-5">
      <span>{children}</span>
      <span className="text-brand/75" aria-hidden>
        &bull;
      </span>
    </span>
  );
}

function PriceTickerPass({ board }: { board: PumpPriceBoardView }) {
  return (
    <div data-price-marquee-pass className="flex shrink-0 items-center">
      {Array.from({ length: CONTENT_REPEATS }, (_, repeatIndex) => (
        <Fragment key={repeatIndex}>
          <TickerItem>
            <span className="font-semibold text-brand/90">
              At the pump today
            </span>
          </TickerItem>
          {board.prices.map(({ fuel, amount }) => (
            <TickerItem key={`${repeatIndex}-${fuel}`}>
              <span className="text-white/60">{fuel}</span>{" "}
              <span className="font-semibold text-white/85">
                {formatCedis(amount)} GHS/L
              </span>
            </TickerItem>
          ))}
          <TickerItem>
            <time
              dateTime={board.updatedAt.slice(0, 10)}
              className="text-white/45"
            >
              Effective {formatPumpDate(board.updatedAt)}
            </time>
          </TickerItem>
        </Fragment>
      ))}
    </div>
  );
}

function buildAccessibleSummary(board: PumpPriceBoardView) {
  const prices = board.prices
    .map(
      ({ fuel, amount }) =>
        `${fuel}: ${formatCedis(amount)} GHS per litre`,
    )
    .join(". ");

  return `Current pump prices. ${prices}. Effective ${formatPumpDate(board.updatedAt)}.`;
}

function PumpPriceTicker({ board }: { board: PumpPriceBoardView }) {
  return (
    <div
      role="region"
      aria-label="Current pump prices"
      className="flex h-full w-full items-center"
    >
      <p className="sr-only">{buildAccessibleSummary(board)}</p>
      <div
        aria-hidden
        className="w-full overflow-hidden font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase"
      >
        <div className="ps-price-marquee-track flex w-max [--marquee-duration:28s]">
          <PriceTickerPass board={board} />
          <PriceTickerPass board={board} />
        </div>
      </div>
    </div>
  );
}

function HomePriceMarquee({
  board,
}: {
  board: PumpPriceBoardView | null;
}) {
  return (
    <SiteTopBarPortal>
      {board ? (
        <PumpPriceTicker board={board} />
      ) : (
        <p
          role="status"
          className="flex h-full items-center justify-center px-[var(--container-pad)] text-center text-[10px] tracking-[0.12em] text-white/70 uppercase"
        >
          Today&apos;s pump prices are being updated
        </p>
      )}
    </SiteTopBarPortal>
  );
}

export { HomePriceMarquee, PumpPriceTicker };
