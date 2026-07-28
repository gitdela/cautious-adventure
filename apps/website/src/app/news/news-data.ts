type NewsSection = {
  heading: string;
  body: string;
};

type NewsArticle = {
  slug: string;
  tag: string;
  date: string;
  dateISO: string;
  title: string;
  lead: string;
  sections: NewsSection[];
};

// Newest first — the first three power the featured carousel.
const newsArticles: NewsArticle[] = [
  {
    slug: "quality-2024",
    tag: "Recognition",
    date: "Sep 4, 2024",
    dateISO: "2024-09-04",
    title: "PETROSOL commended for fuel quality and accuracy",
    lead: "PETROSOL has been commended for the quality of its fuels and the accuracy of its pumps — a recognition of our promise of clean fuel in full quantity, at every station.",
    sections: [
      {
        heading: "What the commendation covers",
        body: "Independent checks across our retail network tested both what comes out of the nozzle and how much of it you get. Our fuels met quality specifications and our pumps dispensed accurately — no shortfalls, no compromises.",
      },
      {
        heading: "Clean fuel in full quantity",
        body: "It's the promise we make at every forecourt: the fuel you pay for is the fuel you get. We test at the depot, in transit and at the station, so quality never depends on luck.",
      },
      {
        heading: "What it means for you",
        body: "Whether you're filling a family car or a company fleet, you can drive off knowing your engine got exactly what it needs. We'll keep earning that trust one tank at a time.",
      },
    ],
  },
  {
    slug: "chairman-2024",
    tag: "Leadership",
    date: "May 20, 2024",
    dateISO: "2024-05-20",
    title: "PETROSOL appoints former CEO of VALCO as its board chairman",
    lead: "PETROSOL has appointed the former Chief Executive Officer of Volta Aluminium Company Ltd (VALCO), the second-largest aluminium smelter in Sub-Saharan Africa, Daniel Acheampong, as its Board Chairman.",
    sections: [
      {
        heading: "A proven industrial leader",
        body: "Daniel Acheampong led VALCO, the second-largest aluminium smelter in Sub-Saharan Africa, through demanding operational and commercial cycles. He brings decades of heavy-industry judgement to our board.",
      },
      {
        heading: "From VALCO to PETROSOL",
        body: "Running a smelter means managing energy at scale — supply, cost and reliability. That experience maps directly onto our business of fuelling homes, businesses and industry across Ghana.",
      },
      {
        heading: "The road ahead",
        body: "As chairman, he'll guide our next phase: growing the retail network, deepening our commercial fuel business and holding the standard on safety and service.",
      },
    ],
  },
  {
    slug: "board-2024",
    tag: "Leadership",
    date: "Jan 10, 2024",
    dateISO: "2024-01-10",
    title: "New addition to PETROSOL Board of Directors",
    lead: "Mr. William Ntim-Boadu joined the Board of PETROSOL Ghana Ltd. on 1st January, 2024. He is a seasoned and well-respected energy finance professional with about 14 years' senior leadership experience in the energy sector.",
    sections: [
      {
        heading: "14 years in energy finance",
        body: "Mr. Ntim-Boadu has spent about 14 years in senior leadership across the energy sector, structuring and financing the projects that keep fuel moving. He knows the numbers behind the industry.",
      },
      {
        heading: "What he brings to the board",
        body: "Discipline on capital, rigour on risk and a clear read on where the sector is heading. His counsel strengthens board oversight as we invest in new stations and services.",
      },
      {
        heading: "A stronger board for a growing company",
        body: "We're growing, and growth needs governance to match. This appointment keeps our board as strong as the business it steers.",
      },
    ],
  },
  {
    slug: "cfo-award-2023",
    tag: "Awards",
    date: "Oct 18, 2023",
    dateISO: "2023-10-18",
    title: "The CFO of PETROSOL Ghana receives Exemplary Leadership Award",
    lead: 'The Chief Finance Officer of PETROSOL Ghana Ltd., Lawrencia Himans, received the prestigious "Exemplary Leadership Award" at the recently held Women in Mining and Energy Awards (WIMEA). The WIMEA, in its third edition, was held at the Movenpick Ambassador Hotel.',
    sections: [
      {
        heading: "Exemplary leadership recognised",
        body: "Lawrencia Himans was honoured with the Exemplary Leadership Award for her stewardship of PETROSOL's finances — steady hands through volatile fuel markets and a growing balance sheet.",
      },
      {
        heading: "About the WIMEA awards",
        body: "The Women in Mining and Energy Awards, now in its third edition, celebrates women shaping Ghana's extractive and energy industries. This year's ceremony was held at the Movenpick Ambassador Hotel in Accra.",
      },
      {
        heading: "Women leading at PETROSOL",
        body: "We're proud that women lead at every level of our company — in finance, operations and on the forecourt. Recognition like this reflects a culture we work at every day.",
      },
    ],
  },
  {
    slug: "lions-2023",
    tag: "CSR",
    date: "Apr 29, 2023",
    dateISO: "2023-04-29",
    title:
      "PETROSOL joins Lions Club International in rehabilitation project for Adenta Aviation Road Roundabout",
    lead: "PETROSOL, a leading fuel and energy company and a sponsor of Lions Club International, was proud to participate in the commissioning of the club's environment-cause project on the 28th of April 2023.",
    sections: [
      {
        heading: "A greener roundabout for Adenta",
        body: "The rehabilitated Aviation Road Roundabout was commissioned on 28th April 2023 — relandscaped, replanted and maintained as a green landmark for the thousands of commuters who pass it daily.",
      },
      {
        heading: "Why we partnered",
        body: "We sponsor Lions Club International because their environment-cause projects deliver visible, lasting results in the communities where we operate. This roundabout sits minutes from our own stations.",
      },
      {
        heading: "Our environmental commitment",
        body: "From cleaner fuels to greener public spaces, we back environmental work with money and people, not slogans. There's more of this to come.",
      },
    ],
  },
  {
    slug: "graft-2023",
    tag: "CSR",
    date: "Apr 3, 2023",
    dateISO: "2023-04-03",
    title:
      "PETROSOL donates GH₵30,000 to support free surgeries for the under-privileged",
    lead: "PETROSOL Ghana Ltd, a leading Oil Marketing Company, has donated Thirty Thousand Ghana Cedis (GH₵30,000) to the Ghana Reconstruction of Anomaly and Trauma Fund (GRAFT Foundation).",
    sections: [
      {
        heading: "GH₵30,000 towards free surgeries",
        body: "Our donation funds reconstructive surgeries for patients who couldn't otherwise afford them — procedures that restore function, confidence and livelihoods.",
      },
      {
        heading: "About the GRAFT Foundation",
        body: "The Ghana Reconstruction of Anomaly and Trauma Fund organises free reconstructive surgical care for under-privileged patients across the country, working with volunteer surgeons and partner hospitals.",
      },
      {
        heading: "Giving that changes lives",
        body: "We measure our CSR the way we measure our business: by outcomes. Every surgery funded is a life changed, and that's the standard we hold our giving to.",
      },
    ],
  },
  {
    slug: "bonding-2023",
    tag: "Inside PETROSOL",
    date: "Mar 30, 2023",
    dateISO: "2023-03-30",
    title: "PETROSOL wraps up successful team bonding session",
    lead: "The employees of PETROSOL Head Office recently completed a highly successful team bonding session that brought together individuals from across departments for a day of fun and team building activities.",
    sections: [
      {
        heading: "A day away from the desk",
        body: "Colleagues from every department at Head Office swapped spreadsheets for games, challenges and shared meals — a full day designed to mix teams that don't usually work side by side.",
      },
      {
        heading: "Building one team",
        body: "Fuel retail runs on coordination between finance, operations, marketing and the stations. Days like this build the trust that makes that coordination fast when it matters.",
      },
      {
        heading: "What comes next",
        body: "Team bonding is now a fixture on our calendar, not a one-off. The next session will bring in colleagues from our regional operations too.",
      },
    ],
  },
  {
    slug: "safety-day-2023",
    tag: "Inside PETROSOL",
    date: "Mar 29, 2023",
    dateISO: "2023-03-29",
    title:
      "PETROSOL celebrates World Health and Safety Day with a focus on a safe and healthy environment",
    lead: "PETROSOL marked World Health and Safety Day with a virtual event focused on keeping a safe and healthy environment across our stations and offices.",
    sections: [
      {
        heading: "Safety first, every day",
        body: "Handling fuel leaves no room for shortcuts. World Health and Safety Day is our annual checkpoint, but the standard it celebrates applies every shift, at every station and office.",
      },
      {
        heading: "Highlights from the virtual event",
        body: "Teams across the network joined sessions on safe fuel handling, emergency response and workplace wellbeing, with station managers sharing what works on their own forecourts.",
      },
      {
        heading: "Safe stations, safe offices",
        body: "The outcome is practical: refreshed drills, updated station checklists and a renewed commitment that everyone who works with us goes home safe.",
      },
    ],
  },
  {
    slug: "iwd-2023",
    tag: "Inside PETROSOL",
    date: "Mar 9, 2023",
    dateISO: "2023-03-09",
    title: "PETROSOL celebrates International Women's Day",
    lead: "International Women's Day (March 8) is a global day celebrating the social, economic, cultural and political achievements of women.",
    sections: [
      {
        heading: "Celebrating our women",
        body: "On March 8 we celebrated the women of PETROSOL — the engineers, accountants, managers and station staff whose work keeps the company running every day.",
      },
      {
        heading: "Voices from the team",
        body: "Colleagues shared their journeys in the energy industry: how they got here, the barriers they've cleared and the advice they'd give the next generation of women joining the sector.",
      },
      {
        heading: "Embracing equity all year",
        body: "One day doesn't make a culture. We back the celebration with year-round commitments on hiring, development and leadership opportunities for women across PETROSOL.",
      },
    ],
  },
];

function getArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

function getRelated(article: NewsArticle, count = 3) {
  const related = newsArticles.filter(
    (candidate) => candidate.slug !== article.slug && candidate.tag === article.tag,
  );
  for (const candidate of newsArticles) {
    if (related.length >= count) break;
    if (candidate.slug !== article.slug && !related.includes(candidate)) {
      related.push(candidate);
    }
  }
  return related.slice(0, count);
}

function readingMinutes(article: NewsArticle) {
  const words = [
    article.lead,
    ...article.sections.map((section) => `${section.heading} ${section.body}`),
  ]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export {
  getArticle,
  getRelated,
  newsArticles,
  readingMinutes,
  type NewsArticle,
};
