import {
  RiDashboard3Line,
  RiScales3Line,
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
    "We energize dreams, ignite hope and power the achievement of goals and aspirations through the delivery of energy solutions in a sustainable and ethical manner.",
  ],
];

const operatingCulture = [
  {
    icon: RiVerifiedBadgeLine,
    title: "High Quality",
    description:
      "We uphold rigorous standards across our products, services, safety practices and every customer interaction.",
  },
  {
    icon: RiDashboard3Line,
    title: "Full Quantity",
    description:
      "We deliver exactly what our customers pay for — every litre and every delivery, with no short measures and no cutting corners.",
  },
  {
    icon: RiScales3Line,
    title: "Fair Pricing",
    description:
      "We price transparently and responsibly, delivering honest value with no hidden charges.",
  },
];

type CoreValue = {
  number: string;
  title: string;
  summary: string;
  meaning: string;
  behaviors: string[];
};

const values: CoreValue[] = [
  {
    number: "01",
    title: "Integrity",
    summary:
      "We conduct our business with honesty, transparency and accountability — earning the trust of our customers, partners and communities.",
    meaning:
      "Doing what is right even when it is difficult, and answering for our actions and decisions.",
    behaviors: [
      "We're honest in our words, records and dealings",
      "We keep our commitments and honour our agreements",
      "We comply with the law and company policy at all times",
      "We speak up and report misconduct when we see it",
    ],
  },
  {
    number: "02",
    title: "Leadership",
    summary:
      "We lead by example — every employee, at every level, takes ownership of PETROSOL's success.",
    meaning:
      "Leadership is a behaviour, not a title. We take initiative, contribute ideas and stand behind agreed decisions.",
    behaviors: [
      "We take ownership and act without waiting to be asked",
      "We bring constructive ideas and collaborate across teams",
      "We hold ourselves accountable for outcomes",
      "We support agreed decisions positively, even after debate",
    ],
  },
  {
    number: "03",
    title: "Professionalism",
    summary:
      "We uphold the highest standards of industry best practice in everything we do — from fuel quality to customer service.",
    meaning:
      "Competence, preparation and conduct that represent PETROSOL with dignity everywhere we work.",
    behaviors: [
      "We're punctual, prepared and deliver competent work",
      "We communicate respectfully, in person and in writing",
      "We use company resources responsibly",
      "We represent PETROSOL with dignity, on and off duty",
    ],
  },
  {
    number: "04",
    title: "Service",
    summary:
      "We're here to serve. Clean fuel in full quantity, on time, every time — that's our fundamental promise to Ghana.",
    meaning:
      "Customer-first thinking for everyone we serve — external customers and colleagues alike.",
    behaviors: [
      "We listen actively and respond with urgency",
      "We offer solutions, not excuses",
      "We anticipate needs before they're voiced",
      "We extend courtesy to internal and external customers alike",
    ],
  },
  {
    number: "05",
    title: "Sustainability",
    summary:
      "We operate responsibly, protecting the environment and investing in the long-term wellbeing of Ghana's people and economy.",
    meaning:
      "Decisions made for the long term — resources, environment, safety and community.",
    behaviors: [
      "We use resources responsibly and reduce waste",
      "We comply with environmental and safety standards",
      "We weigh the long-term impact of our decisions",
      "We support CSR and community programmes",
    ],
  },
  {
    number: "06",
    title: "Empathy",
    summary:
      "We listen to and understand the people we serve — our customers, employees and the communities where we operate.",
    meaning:
      "Respect for every person and every perspective, especially under pressure.",
    behaviors: [
      "We listen without interrupting",
      "We respect diverse perspectives and avoid harmful language and gossip",
      "We give constructive feedback in private",
      "We stay patient under pressure and disagree respectfully",
    ],
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
  operatingCulture,
  values,
  visionAndPurpose,
  type CoreValue,
};
