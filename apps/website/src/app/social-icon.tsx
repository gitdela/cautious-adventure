import {
  RiFacebookFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "@remixicon/react";

import type { SocialName } from "./site-navigation";

const socialIcons: Record<SocialName, typeof RiFacebookFill> = {
  facebook: RiFacebookFill,
  x: RiTwitterXFill,
  instagram: RiInstagramFill,
  linkedin: RiLinkedinFill,
};

function SocialIcon({ name }: { name: SocialName }) {
  const Icon = socialIcons[name];
  return <Icon aria-hidden="true" />;
}

export { SocialIcon };
