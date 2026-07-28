const lubricantCategories = [
  "All",
  "Engine oils",
  "Motorcycle oils",
  "Gear & transmission",
  "Brake fluid & coolant",
] as const;

type LubricantCategory = (typeof lubricantCategories)[number];
type ProductCategory = Exclude<LubricantCategory, "All">;

type LubricantProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  grade: string;
  standard: string;
  applications: string;
  benefits: string[];
  drainInterval?: string;
  image?: string;
};

const lubricantProducts: LubricantProduct[] = [
  {
    id: "neo-0w20",
    name: "Platinum NEO 0W20",
    category: "Engine oils",
    grade: "SAE 0W-20 \u00b7 full synthetic",
    standard: "ACEA C3 \u00b7 Syntec\u00ae additives",
    applications:
      "Hybrids and modern engines \u2014 Toyota, Honda, Ford and GM models that specify 0W-20",
    benefits: [
      "Easy cold starts with quick oil circulation",
      "Lower internal friction for improved fuel economy",
      "Extended drain intervals between changes",
      "Exceptional engine cleanliness and anti-wear stability",
    ],
  },
  {
    id: "jet-hd40",
    name: "JET HD 40",
    category: "Engine oils",
    grade: "SAE 40 \u00b7 heavy duty",
    standard: "API SJ/CD \u00b7 ACEA E2, A3/B2",
    image: "/images/lubricants/jet-hd-40.webp",
    applications:
      "Hard-working taxis, buses and vans in tough driving conditions \u2014 heavy traffic, warm climates and older high-mileage engines",
    benefits: [
      "Premium heavy duty oil for petrol and diesel engines",
      "European-made from virgin base oils and Syntec\u00ae additives",
      "Greater engine protection and cleanliness",
      "Longer life compared to conventional oils",
    ],
  },
  {
    id: "plus-5w30",
    name: "Platinum Plus 5w30 FE",
    category: "Engine oils",
    grade: "SAE 5W-30 \u00b7 pure synthetic",
    standard: "API SN-Plus/CF \u00b7 ACEA C2/C3",
    drainInterval: "Up to 10,000 km",
    image: "/images/lubricants/platinum-plus-5w30-fe.webp",
    applications:
      "Today's high-tech, low-emissions engines \u2014 with or without exhaust after-treatment",
    benefits: [
      "Quick lubrication on start-up",
      "Increased fuel efficiency",
      "Long / extended drain capability (C3)",
      "Backwards compatible with older performance levels",
    ],
  },
  {
    id: "plus-10w40",
    name: "Platinum Plus 10w40",
    category: "Engine oils",
    grade: "SAE 10W-40 \u00b7 pure synthetic",
    standard: "API SN/CF \u00b7 ACEA C3",
    drainInterval: "Up to 10,000 km",
    image: "/images/lubricants/platinum-plus-10w40.webp",
    applications:
      "Modern high performance petrol and diesel engines \u2014 European, American and Japanese, with exhaust after-treatment",
    benefits: [
      "DPF compliant",
      "Long / extended drain capability",
      "Exceptional long-term anti-wear and oxidation stability",
      "Excellent high and low temperature performance",
    ],
  },
  {
    id: "petrol-20w50",
    name: "Platinum Petrol 20w50",
    category: "Engine oils",
    grade: "SAE 20W-50 multigrade",
    standard: "Syntec\u00ae additive technology",
    drainInterval: "Up to 7,000 km",
    applications:
      "Hard-working petrol engines in warm climates \u2014 also approved for diesel and LPG engines",
    benefits: [
      "Excellent high temperature stability",
      "High shear stability for stay-in-grade performance",
      "Reduced engine wear and oil consumption",
      "Ideal mixed fleet lubricant",
    ],
  },
  {
    id: "diesel-15w40",
    name: "Platinum Diesel 15w40",
    category: "Engine oils",
    grade: "SAE 15W-40 \u00b7 universal diesel",
    standard: "Syntec\u00ae additives",
    applications:
      "Hard-working diesel engines on heavy plant, trucks, buses, vans and cars",
    benefits: [
      "Lasts up to twice as long as standard oils",
      "Cooler running, more power, less fuel",
      "Increased soot handling for longer drains",
      "Improved bore polishing protection",
    ],
  },
  {
    id: "ultra-15w40",
    name: "PETROSOL Ultra 15w40 HD",
    category: "Engine oils",
    grade: "SAE 15W-40 \u00b7 heavy duty diesel",
    standard: "API CI-4/SL \u00b7 ACEA A3/B3, E7/E3",
    image: "/images/lubricants/ultra-15w40-hd.webp",
    applications:
      "Modern heavy duty diesel engines in arduous conditions \u2014 trucks, buses, vans and cars, including turbo- and super-charged engines",
    benefits: [
      "Ultra heavy-duty UHDDEO \u2014 out-performs all standard oils",
      "Superior detergents keep turbo and pistons clean",
      "Engines run cooler, deliver more power",
      "Protects better, lasts longer, promotes fuel economy",
    ],
  },
  {
    id: "moto-20w50",
    name: "Platinum Motorcycle 20w50 4T",
    category: "Motorcycle oils",
    grade: "SAE 20W-50 \u00b7 4T",
    standard: "Exceeds JASO MA and MA-2",
    applications: "4-stroke motorcycles and wet-clutch applications",
    benefits: [
      "Engine and clutch lubricant in one",
      "High shear stability for stay-in-grade performance",
      "Excellent high temperature stability",
      "Better exhaust emissions",
    ],
  },
  {
    id: "gear-ep",
    name: "Gear EP 80w90",
    category: "Gear & transmission",
    grade: "SAE 80W-90 & 85W-140 \u00b7 full synthetic",
    standard: "Exceeds API GL-5",
    applications:
      "Hypoid, bevel, spiral and standard gearboxes on trucks, cars, buses, tractors and mining equipment",
    benefits: [
      "High load carrying ability",
      "Greatly reduces noise and wear",
      "Rust and corrosion protection when idle",
      "Outstanding low and high temperature performance",
    ],
  },
  {
    id: "atf-6",
    name: "PETROSOL ATF-6",
    category: "Gear & transmission",
    grade: "Dexron VI \u00b7 pure synthetic",
    standard: "Mercon LV \u00b7 JASO 1A-LV",
    image: "/images/lubricants/atf-6.webp",
    applications:
      "Modern automatic gearboxes, transfer cases and power steering systems where a DEXRON VI fluid is specified \u2014 GM, Ford, Chrysler, Honda, Hyundai, Kia, Toyota, Mercedes, VW, BMW and more",
    benefits: [
      "100% synthetic low-viscosity ATF",
      "Smoother gear changes, longer transmission life",
      "Reduces fuel usage for more efficient driving",
      "Backwards compatible where ATF IIIG or IIIH is called for",
    ],
  },
  {
    id: "brake-dot4",
    name: "PETROSOL DOT-4 Brake Fluid",
    category: "Brake fluid & coolant",
    grade: "DOT 4",
    standard: "Resistant to 260\u00b0C",
    applications:
      "All disc and drum hydraulic braking systems, including anti-lock, and hydraulic clutch systems",
    benefits: [
      "Safe, reliable braking in all conditions",
      "Effective in high performance, high load applications",
      "Protects against rust and corrosion",
      "Mixable with other fluids of the same specification",
    ],
  },
  {
    id: "cool-ant",
    name: "PETROSOL Cool-Ant",
    category: "Brake fluid & coolant",
    grade: "Ready-to-use coolant & antifreeze",
    standard: "Protection from \u221225\u00b0C to +115\u00b0C",
    applications:
      "All modern cooling systems, diesel and petrol, automotive and heavy duty \u2014 including aluminium alloy radiators",
    benefits: [
      "Free of borate, nitrite, nitrate, amine, phosphate and silicate",
      "Long-life protection against corrosion and pitting",
      "No residue \u2014 keeps coolant pathways clear",
      "Compatible with metals, plastic and rubber tubing",
    ],
  },
];

export {
  lubricantCategories,
  lubricantProducts,
  type LubricantCategory,
  type LubricantProduct,
};
