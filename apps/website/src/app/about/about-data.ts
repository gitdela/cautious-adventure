import {
  RiBuilding2Line,
  RiDashboard3Line,
  RiDropLine,
  RiGasStationLine,
  RiScales3Line,
  RiVerifiedBadgeLine,
} from "@remixicon/react";

/**
 * Copy for /who-we-are, drawn from the 2026 company profile.
 *
 * Two things are deliberate. The station count is "over 100" — the profile
 * states 110 in one place, 100 in three and 120 in a staff biography, so the
 * page uses the floor that every source supports. And the company is described
 * as "100% Ghanaian-owned and managed" rather than "privately-owned", which
 * would read as a contradiction now that it is a PLC.
 */

/**
 * The three ISO standards plus the NPA licence. Grouped as "standards and
 * licences" because the NPA entry is a licence to operate, not a certification.
 */
const standardsAndLicences = [
  ["ISO 9001:2015", "Quality Management System"],
  ["ISO 14001:2015", "Environmental Management System"],
  ["ISO 45001:2018", "Occupational Health & Safety"],
  ["NPA Licensed", "National Petroleum Authority"],
];

type Milestone = {
  year: string;
  title: string;
  description: string;
};

/**
 * The progression from consultancy to PLC. The 2006 and 2010 entries come from
 * the profile's history narrative; the rest from its own milestones page.
 */
const milestones: Milestone[] = [
  {
    year: "2006",
    title: "Founded as a consultancy",
    description:
      "Petroleum Solutions Limited begins in Accra, advising Ghanaian operators entering a newly deregulated downstream sector.",
  },
  {
    year: "2010",
    title: "Managing an OMC",
    description:
      "A management contract with Pacific Oil Ghana, guiding them to their own licence, and growing them from 5 stations to 46 by 2013.",
  },
  {
    year: "2013",
    title: "Licensed as an OMC",
    description:
      "The National Petroleum Authority licenses PETROSOL to procure, store, distribute and sell petroleum products in its own right.",
  },
  {
    year: "2014",
    title: "Retail begins",
    description:
      "Trading starts in February with four fuel stations, and the tagline that still defines the brand: clean fuel in full quantity.",
  },
  {
    year: "2019",
    title: "Platinum Lubricants",
    description:
      "PETROSOL Platinum Lubricants launches, adding engine, hydraulic and industrial oils to the product range.",
  },
  {
    year: "2021",
    title: "Triple ISO certification",
    description:
      "Quality, environmental and occupational health & safety management systems all certified to international standard.",
  },
  {
    year: "2024",
    title: "PETROSOL Platinum Energy",
    description:
      "A rebrand marking the shift from oil marketing alone to broader, more sustainable energy solutions. Ten years as an OMC.",
  },
  {
    year: "2025",
    title: "A Public Limited Company",
    description:
      "Conversion to a PLC, strengthening corporate governance, transparency and the ability to attract long-term investment.",
  },
];

type BusinessLine = {
  icon: typeof RiGasStationLine;
  image: {
    src: string;
    alt: string;
    /**
     * Where the crop sits, when centring it is wrong. The cards are a 16/10
     * frame, so a portrait photograph shows only its middle band by default —
     * enough to cut the subject's head off.
     */
    position?: string;
  };
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

/** The three ways PETROSOL actually reaches a customer. */
const businessLines: BusinessLine[] = [
  {
    icon: RiGasStationLine,
    image: {
      src: "/images/about/forecourt-attendant.webp",
      alt: "A PETROSOL forecourt attendant at the pump, holding a Super nozzle and giving a thumbs up",
      // Portrait source in a landscape frame, so only a band of it shows.
      // Centred cut his head off; hard `object-top` overshot onto the canopy.
      // A quarter of the way down lands the face in the upper third.
      position: "object-[center_25%]",
    },
    title: "Retail network",
    description:
      "Over 100 stations across Ghana, many in communities that had no fuel station before. Around 80% are run directly by trained PETROSOL managers.",
    href: "/find-a-station",
    linkLabel: "Find our station",
  },
  {
    icon: RiBuilding2Line,
    image: {
      src: "/images/fuel-delivery/tanker-fleet.webp",
      alt: "PETROSOL fuel tanker fleet ready for bulk delivery",
    },
    title: "Corporate & mining",
    description:
      "Bulk supply to mining, construction, manufacturing, agri-business and services, including onsite storage we manage, and refuelling delivered to mine equipment where it works.",
    href: "/fuel-delivery",
    linkLabel: "Bulk fuel delivery",
  },
  {
    icon: RiDropLine,
    image: {
      src: "/images/lubricants/lube-bay-technician.webp",
      alt: "A PETROSOL technician in the lube bay holding Platinum NEO 0W20 and ATF-6, with the Platinum range on the shelves behind",
    },
    title: "Lubricants",
    description:
      "PETROSOL Platinum engine, hydraulic and industrial oils, blended to meet original equipment manufacturer requirements.",
    href: "/lubricants",
    linkLabel: "View lubricants",
  },
];

const visionAndPurpose = [
  ["Our vision", "To be a model of excellence in the global energy space."],
  [
    "Our purpose",
    "We energize dreams, ignite hope and power the achievement of goals and aspirations by delivering quality energy solutions in a sustainable and ethical manner.",
  ],
];

/**
 * The profile calls these the six cardinal pillars of PETROSOL's operations.
 * They are written from the customer's side, so the page frames them as what a
 * customer can expect.
 */
type CustomerPromise = {
  number: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
    /**
     * Where the crop sits. The frame is a circle, so a landscape photograph
     * shows only its middle square and anything off-centre gets clipped.
     */
    position?: string;
  };
};

const customerPromises: CustomerPromise[] = [
  {
    number: "1",
    title: "Full Value",
    description: "We give you exactly what you pay for.",
    image: {
      src: "/images/about/pump-nozzles-vehicle.webp",
      alt: "PETROSOL dispenser nozzles on the island, with a car drawn up at the pump",
      // The red nozzle sits left of centre in a landscape frame; bias the
      // square crop that way so it is the circle's subject, not the bodywork.
      position: "object-[35%_center]",
    },
  },
  {
    number: "2",
    title: "Clean Fuel",
    description: "We ensure the integrity of our fuel is intact.",
    image: {
      src: "/images/about/super-nozzle-filler.webp",
      alt: "Close-up of a PETROSOL Super nozzle in a car's filler neck, the collar reading “clean fuel in full quantity”",
    },
  },
  {
    number: "3",
    title: "Helpful & Honest People",
    description: "We make you feel welcome and very special.",
    image: {
      src: "/images/home/attendant-windscreen.webp",
      alt: "A PETROSOL forecourt attendant cleaning a customer's windscreen while their car refuels",
      // He stands right of centre in a 3:2 frame, so a centred square crop
      // clips him against the circle's edge. Bias the window rightwards.
      position: "object-[65%_center]",
    },
  },
  {
    number: "4",
    title: "Available Products",
    description: "Our stations always have fuel.",
    image: {
      src: "/images/about/attendant-platinum-plus.webp",
      alt: "A PETROSOL attendant holding up Platinum Plus 10W40, the lubricants shelf stocked behind him",
      // Tall portrait: centring lands on his midriff, so lift the window to
      // carry his face and the product he is holding.
      position: "object-[center_30%]",
    },
  },
  {
    number: "5",
    title: "Clean & Safe Environment",
    description: "We keep our stations clean and safe.",
    image: {
      src: "/images/about/station-forecourt-clean.webp",
      alt: "A clean, empty PETROSOL forecourt under the branded canopy, with the diesel island and safety bollards in view",
      // Wide station shot in a circular frame: centring lands on empty
      // apron. Bias left so the canopy and pumps fill the circle.
      position: "object-[35%_center]",
    },
  },
  {
    number: "6",
    title: "Fair Prices",
    description: "We offer you very good prices for our products.",
    image: {
      src: "/images/about/attendant-card-payment.webp",
      alt: "A PETROSOL attendant taking a customer's card at the pump, card terminal in hand",
      // Portrait source in a circular frame, subject right of centre.
      position: "object-[62%_35%]",
    },
  },
];

/** The operating culture headline — three words the brand is built on. */
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
      "We deliver exactly what our customers pay for: every litre and every delivery, with no short measures and no cutting corners.",
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

/**
 * The six values. `summary` is what the page renders — one line each, so the
 * section supports the page rather than dominating it.
 *
 * `meaning` and `behaviors` are NOT rendered. They are internal definitions
 * written at PETROSOL and do not appear in the company profile, so they cannot
 * be reconstructed from it. They stay here rather than being deleted, ready for
 * a careers or culture page where the detail earns its space.
 */
const values: CoreValue[] = [
  {
    number: "01",
    title: "Integrity",
    summary:
      "We conduct our business with honesty, transparency and accountability, earning the trust of our customers, partners and communities.",
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
      "We lead by example. Every employee, at every level, takes ownership of PETROSOL's success.",
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
      "We uphold the highest standards of industry best practice in everything we do, from fuel quality to customer service.",
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
      "We're here to serve. Clean fuel in full quantity, on time, every time: that's our fundamental promise to Ghana.",
    meaning:
      "Customer-first thinking for everyone we serve, external customers and colleagues alike.",
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
      "Decisions made for the long term: resources, environment, safety and community.",
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
      "We listen to and understand the people we serve: our customers, employees and the communities where we operate.",
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

/**
 * Impact figures, all from the profile's "Contribution to the Ghanaian
 * Economy" section. The tax total is cumulative and labelled with its period —
 * it is eleven years of payments, not an annual figure.
 */
const impactStats = [
  ["100%", "Ghanaian-owned and Ghanaian-managed"],
  ["500+", "Direct jobs, plus many more indirectly"],
  ["4", "National depots served: Tema, Takoradi, Kumasi & Buipe"],
  ["GHS 1.3bn", "Petroleum taxes paid to the state, 2014–2024"],
];

/**
 * Split because they are different things: one is a body you join, the other a
 * regulator you register with. Listing them together implied PETROSOL was a
 * member of the EPA.
 */
const memberships = [
  "Chamber of Oil Marketing Companies (COMAC)",
  "Ghana Employers Association (GEA)",
  "Ghana National Chamber of Commerce & Industry (GNCCI)",
  "Association of Ghana Industries (AGI)",
  "Chartered Institute of Marketing, Ghana (CIMG)",
];

const registrations = [
  "National Petroleum Authority (NPA)",
  "Environmental Protection Agency (EPA)",
  "Ghana Investment Promotion Centre (GIPC)",
  "Minerals Commission (Mine Support Service Company)",
];

export {
  businessLines,
  customerPromises,
  impactStats,
  memberships,
  milestones,
  operatingCulture,
  registrations,
  standardsAndLicences,
  values,
  visionAndPurpose,
  type BusinessLine,
  type CoreValue,
  type Milestone,
};
