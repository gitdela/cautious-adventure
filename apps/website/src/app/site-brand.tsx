import Image from "next/image";
import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";

const sizeClasses = {
  mobile: "h-[46px]",
  desktop: "h-[55px]",
  footer: "h-[clamp(44px,5vw,56px)]",
};

function SiteBrand({
  inverse = false,
  size = "desktop",
  className,
}: {
  inverse?: boolean;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Petrosol home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={inverse ? "/brand/logo-lockup-inverse.png" : "/brand/logo-lockup.png"}
        alt="Petrosol — energizing dreams!"
        width={3862}
        height={1360}
        priority={size !== "footer"}
        className={cn("w-auto object-contain", sizeClasses[size])}
      />
    </Link>
  );
}

export { SiteBrand };
