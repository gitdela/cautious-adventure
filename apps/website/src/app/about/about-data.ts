import {
  RiAwardLine,
  RiFirstAidKitLine,
  RiLeafLine,
  RiScales3Line,
  RiShakeHandsLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";

const certifications = [
  ["ISO 9001:2015", "Quality Management System"],
  ["ISO 14001:2015", "Environmental Management System"],
  ["ISO 45001:2018", "Occupational Health & Safety"],
  ["NPA Licensed", "National Petroleum Authority"],
];

const visionAndPurpose = [
  ["Our vision", "To be a model of excellence in the global energy space."],
  [
    "Our purpose",
    "We energize dreams, ignite hope and power the achievement of goals and aspirations, through the delivery of energy solutions — in a sustainable and ethical manner.",
  ],
];

const values = [
  [
    "Integrity",
    "We conduct our business with honesty, transparency and accountability — earning the trust of our customers, partners and communities.",
  ],
  [
    "Professionalism",
    "We uphold the highest standards of industry best practice in everything we do — from fuel quality to customer service.",
  ],
  [
    "Service",
    "We're here to serve. Clean fuel in full quantity, on time, every time — that's our fundamental promise to Ghana.",
  ],
  [
    "Leadership",
    "We lead by example in the petroleum downstream sector — setting standards for what an African OMC can achieve.",
  ],
  [
    "Empathy",
    "We listen to and understand the people we serve — our customers, employees and the communities where we operate.",
  ],
  [
    "Sustainability",
    "We operate responsibly, protecting the environment and investing in the long-term wellbeing of Ghana's people and economy.",
  ],
];

const pillars = [
  {
    icon: RiVerifiedBadgeLine,
    title: "Quality assurance",
    description:
      "ISO 9001:2015 certified quality management — every product and service meets the highest standards.",
  },
  {
    icon: RiLeafLine,
    title: "Environmental stewardship",
    description:
      "ISO 14001:2015 certified — minimising our environmental footprint across all our operations.",
  },
  {
    icon: RiFirstAidKitLine,
    title: "Health & safety",
    description:
      "ISO 45001:2018 certified. The safety of our employees, customers and contractors is non-negotiable.",
  },
  {
    icon: RiScales3Line,
    title: "Regulatory compliance",
    description:
      "Licensed by the NPA and registered with GIPC and EPA — operating within the full bounds of Ghana's law.",
  },
  {
    icon: RiShakeHandsLine,
    title: "Corporate responsibility",
    description:
      "Active membership in COMAC, GEA, GNCCI, AGI and CIMG — committed to Ghana's business community.",
  },
  {
    icon: RiAwardLine,
    title: "Service excellence",
    description:
      "From 115+ nationwide stations to direct bulk supply, we deliver clean fuel in full quantity — every time.",
  },
];

const affiliations = [
  "Chamber of Oil Marketing Companies (COMAC)",
  "Ghana Employers Association (GEA)",
  "Ghana National Chamber of Commerce & Industry (GNCCI)",
  "Association of Ghana Industries (AGI)",
  "Chartered Institute of Marketing, Ghana (CIMG)",
  "Ghana Investment Promotion Centre (GIPC)",
  "Environmental Protection Agency (EPA)",
];

export {
  affiliations,
  certifications,
  pillars,
  values,
  visionAndPurpose,
};
