import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiDashboard3Line,
  RiFlashlightLine,
  RiLeafLine,
  RiShieldCheckLine,
  RiSunLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";

type IsoCertification = {
  code: string;
  title: string;
  description: string;
  icon: RemixiconComponentType;
};

const isoCertifications: IsoCertification[] = [
  {
    code: "ISO 9001:2015",
    title: "Quality management",
    description:
      "Guides how we deliver reliable, consistent products and service at every PETROSOL station, from depot to forecourt.",
    icon: RiVerifiedBadgeLine,
  },
  {
    code: "ISO 14001:2015",
    title: "Environmental management",
    description:
      "The flagship of our sustainability agenda: a structured framework for managing our environmental responsibilities and continually improving our performance.",
    icon: RiLeafLine,
  },
  {
    code: "ISO 45001:2018",
    title: "Occupational health & safety",
    description:
      "A structured system for protecting the health, safety and wellbeing of our people, our customers and the communities around us.",
    icon: RiShieldCheckLine,
  },
];

type SolarBenefit = {
  title: string;
  description: string;
  icon: RemixiconComponentType;
};

const solarBenefits: SolarBenefit[] = [
  {
    title: "Harnessing renewable energy",
    description:
      "Solar energy gives our facilities a clean and renewable alternative, drawn from Ghana's abundant sunshine.",
    icon: RiSunLine,
  },
  {
    title: "More efficient energy use",
    description:
      "Generating our own solar electricity helps reduce dependence on conventional sources for station operations.",
    icon: RiDashboard3Line,
  },
  {
    title: "A smaller footprint",
    description:
      "Every panel on our rooftops reduces reliance on fossil-fuel-based electricity generation.",
    icon: RiLeafLine,
  },
  {
    title: "The future of energy",
    description:
      "Our stations are evolving from fuel retail points into platforms for a broader range of energy solutions.",
    icon: RiFlashlightLine,
  },
];

type OperationPrinciple = {
  title: string;
  description: string;
  icon: RemixiconComponentType;
};

const operationPrinciples: OperationPrinciple[] = [
  {
    title: "Protecting the environment",
    description:
      "As an ISO 14001 certified organization, we manage the environmental aspects of our operations systematically. In the petroleum downstream sector that means responsible handling, storage, transportation and dispensing at every step.",
    icon: RiLeafLine,
  },
  {
    title: "Safety is sustainability",
    description:
      "Our ISO 45001 system embeds health, safety, security and environmental considerations into daily operations, because we cannot build a sustainable future if we compromise the safety of the people who are helping us build it.",
    icon: RiShieldCheckLine,
  },
];

type Award = {
  title: string;
  organisation: string;
  year: string;
};

const awards: Award[] = [
  {
    title: "Sustainable OMC of the Year",
    organisation: "Sustainable and Investment Awards",
    year: "2024",
  },
  {
    title: "Excellence in Corporate Responsibility",
    organisation: "Ghana Oil and Gas Awards",
    year: "2024",
  },
  {
    title: "CSR of the Year",
    organisation: "Ghana Energy Awards",
    year: "2024",
  },
];

type Pillar = {
  number: string;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Environmental Responsibility",
    description:
      "Strengthening environmental management while incorporating renewable energy such as solar power into our infrastructure.",
  },
  {
    number: "02",
    title: "Energy Transition",
    description:
      "Progressively diversifying beyond traditional petroleum marketing into renewable energy and emerging energy solutions.",
  },
  {
    number: "03",
    title: "Responsible Operations",
    description:
      "ISO certified systems, product quality controls, our full quantity commitment and HSSE practices keep us efficient and accountable.",
  },
  {
    number: "04",
    title: "People & Inclusion",
    description:
      "Investing in our people, promoting professional development and creating platforms that empower women to grow and lead.",
  },
  {
    number: "05",
    title: "Community Impact",
    description:
      "Using our resources and capabilities to contribute to social development and improve lives through CSR initiatives.",
  },
];

export { awards, isoCertifications, operationPrinciples, pillars, solarBenefits };
