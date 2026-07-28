import type {
  SiteFooterGroup,
  SiteNavItem,
} from "@workspace/ui/components/site-chrome";

type SocialName = "facebook" | "x" | "instagram" | "linkedin";

const navigationItems: SiteNavItem[] = [
  {
    label: "Company",
    children: [
      { label: "About PETROSOL", href: "/about" },
      { label: "Our Achievements", href: "/achievements" },
      { label: "Leadership", href: "/leadership" },
      { label: "Board of Directors", href: "/board" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Products",
    children: [
      { label: "Lubricants", href: "/lubricants" },
      { label: "Fuel", href: "/fuel" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "FullCare", href: "/fullcare" },
      { label: "Fuel Delivery Service", href: "/fuel-delivery" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    label: "Fuel Station",
    children: [
      { label: "Find our Station", href: "/stations" },
      { label: "CSR", href: "/csr" },
    ],
  },
  {
    label: "Media",
    children: [
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
];

const footerGroups: SiteFooterGroup[] = navigationItems.map((item) => ({
  title: item.label,
  items: "children" in item ? item.children : [item],
}));

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
