import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

function ServiceCard({
  icon,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "items-center gap-0 bg-background py-0 text-center shadow-card transition-[transform,background-color,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[3px] hover:bg-ink-100 hover:shadow-raised",
        className,
      )}
    >
      <CardHeader className="flex w-full flex-col items-center gap-4 px-6 pt-8 pb-0">
        <span className="inline-grid size-14 place-items-center rounded-full bg-brand text-white [&_svg]:size-6">
          {icon}
        </span>
        <CardTitle className="text-[18px]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-8">
        <p className="text-[13px] leading-[1.58] text-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}

export { ServiceCard };
