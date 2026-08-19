import type {
  SiteFooterGroup,
  SiteNavItem,
} from "@workspace/ui/components/site-chrome";

type SocialName = "facebook" | "x" | "instagram" | "linkedin";

const navigationItems: SiteNavItem[] = [
  {
    label: "Products & Services",
    children: [
      { label: "Fuels", href: "/fuels" },
      { label: "Lubricants", href: "/lubricants" },
      { label: "Fuel Delivery", href: "/fuel-delivery" },
    ],
  },
  {
    label: "At Our Stations",
    children: [
      { label: "Find a Station", href: "/find-a-station" },
      { label: "FULLCARE Vehicle Services", href: "/fullcare-vehicle-services" },
      { label: "Shops & Convenience", href: "/shops-and-convenience" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Board of Directors", href: "/board-of-directors" },
      { label: "Awards & Recognition", href: "/awards-and-recognition" },
      { label: "Sustainability & Community", href: "/sustainability-and-community" },
    ],
  },
  {
    label: "Blog & Events",
    children: [
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
    ],
  },
  { label: "Contact Us", href: "/contact-us" },
];

// The footer supports broader discovery than the task-led primary navigation,
// so its groups are intentionally maintained separately.
const footerGroups: SiteFooterGroup[] = [
  {
    title: "Company",
    items: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Board of Directors", href: "/board-of-directors" },
      { label: "Awards & Recognition", href: "/awards-and-recognition" },
    ],
  },
  {
    title: "Products & Services",
    items: [
      { label: "Fuels", href: "/fuels" },
      { label: "Lubricants", href: "/lubricants" },
      { label: "Fuel Delivery", href: "/fuel-delivery" },
    ],
  },
  {
    title: "At Our Stations",
    items: [
      { label: "Find a Station", href: "/find-a-station" },
      { label: "FULLCARE Vehicle Services", href: "/fullcare-vehicle-services" },
      { label: "Shops & Convenience", href: "/shops-and-convenience" },
    ],
  },
  {
    title: "Responsibility",
    items: [
      { label: "Sustainability & Community", href: "/sustainability-and-community" },
    ],
  },
  {
    title: "Blog & Events",
    items: [
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

const socialLinks: Array<{
  label: string;
  href: string;
  name: SocialName;
}> = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/petrosolghana",
    name: "facebook",
  },
  { label: "X", href: "https://x.com/petrosolghana", name: "x" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/petrosolghana",
    name: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/petrosol-ghana",
    name: "linkedin",
  },
];

export {
  footerGroups,
  navigationItems,
  socialLinks,
  type SocialName,
};
