import { cn } from "@workspace/ui/lib/utils";

function initialsForName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PersonCard({
  name,
  role,
  tone = "light",
  mediaClassName,
  className,
}: {
  name: string;
  role: string;
  tone?: "light" | "dark";
  mediaClassName?: string;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "ps-blueprint relative grid aspect-[4/5] place-items-center overflow-hidden rounded-xl bg-surface-inverse",
          mediaClassName,
        )}
      >
        <span className="font-display text-[length:var(--size-stat-md)] font-bold text-white/90">
          {initialsForName(name)}
        </span>
        <span className="absolute inset-x-0 bottom-0 h-[5px] bg-brand" />
      </div>
      <h3
        className={cn(
          "mt-4 font-display text-base font-bold",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {name}
      </h3>
      <p
        className={cn(
          "mt-1 text-[13px]",
          tone === "dark" ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {role}
      </p>
    </article>
  );
}

export { PersonCard };
