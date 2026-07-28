type Award = readonly [title: string, organization: string];
type TimelineEntry = readonly [year: string, awards: readonly Award[]];

const achievementStats = [
  ["36+", "Total awards"],
  ["10", "Years recognised"],
  ["8+", "Award bodies"],
  ["3", "National quality awards"],
] as const;

const recentAwards = [
  ["2025", "Marketing Campaign of the Year", "Ghana Oil and Gas Awards, 2025"],
  ["2025", "Energy Business Leadership Award", "Ghana Energy Awards, 2025"],
  [
    "2025",
    "Best HR Management in Oil and Gas (Indigenous)",
    "HR Focus Conference, 2025",
  ],
  [
    "2025",
    "CEO of the Year — Downstream Petroleum",
    "OMC Award, 9th CEO Summit, 2025",
  ],
  [
    "2024",
    "Overall Best National Quality Award",
    "Association of Ghana Industries & Ghana Standards Authority, 2024",
  ],
] as const;

const awardCategories = [
  ["12+", "Quality & excellence"],
  ["7+", "CSR & sustainability"],
  ["6+", "HR & leadership"],
  ["5+", "Safety & environment"],
] as const;

const awardsTimeline: readonly TimelineEntry[] = [
  [
    "2025",
    [
      ["Marketing Campaign of the Year", "Ghana Oil and Gas Awards, 2025"],
      ["Energy Business Leadership Award", "Ghana Energy Awards, 2025"],
      [
        "Best HR Management in Oil and Gas (Indigenous)",
        "HR Focus Conference, 2025",
      ],
      [
        "CEO of the Year — Downstream Petroleum",
        "OMC Award, 9th CEO Summit, 2025",
      ],
    ],
  ],
  [
    "2024",
    [
      ["Chamber Business Man of the Year", "4th Chamber Business Award, 2024"],
      [
        "Excellence in Corporate Responsibility Award",
        "Ghana Oil and Gas Award, 2024",
      ],
      [
        "Unsung Hero of the Year — Reachel Talata Sabil",
        "Ghana Oil and Gas Awards, 2024",
      ],
      [
        "National Quality Award (Diamond) — Non-Food Category",
        "Association of Ghana Industries & Ghana Standards Authority, 2024",
      ],
      [
        "Overall Best National Quality Award",
        "Association of Ghana Industries & Ghana Standards Authority, 2024",
      ],
      ["Sustainable OMC of the Year Award", "Sustainable and Investment Awards, 2024"],
      ["Corporate Social Responsibility of the Year Award", "Ghana Energy Awards, 2024"],
      [
        "Best in the Oil and Gas Industry (Downstream/Upstream)",
        "4th Chamber Business Awards, 2024",
      ],
    ],
  ],
  [
    "2023",
    [
      ["Brand of the Year", "Ghana Energy Awards, 2023"],
      [
        "Outstanding Achiever of the Decade — Michael Bozumbil",
        "Ghana Oil and Gas Awards, 2023",
      ],
      ["Unsung Hero of the Year — Timothy Akook", "Ghana Oil and Gas Awards, 2023"],
      [
        "Employer of the Year Championing Diversity and Inclusion",
        "Women in Mining and Energy Awards, 2023",
      ],
      ["Most Promising HR Management in Oil and Gas", "HR Focus Awards, 2023"],
      [
        "National Quality Award — Diamond (Non-Food Industry)",
        "Association of Ghana Industries & Ghana Standards Authority, 2023",
      ],
    ],
  ],
  ["2022", [["Energy Company of the Year", "Ghana Energy Awards, 2022"]]],
  ["2021", [["Lubricants Product of the Year", "Ghana Oil and Gas Awards, 2021"]]],
  [
    "2020",
    [
      ["Indigenous Oil Company of the Year", "Ghana Oil and Gas Awards, 2020"],
      ["Osagyefo Young Leadership Award", "Ghana Energy Awards, 2020"],
    ],
  ],
  [
    "2019",
    [
      ["Rising Star Award — Company", "Ghana Energy Awards, 2019"],
      [
        "Best Company in Customer Safety and Security Management Practices",
        "Health, Environment Safety and Security Awards (HESS), 2019",
      ],
      [
        "Service Station Facility Excellence Award",
        "Health, Environment Safety and Security Awards (HESS), 2019",
      ],
      [
        "Best Company in Health and Safety Management Practices",
        "Health, Environment Safety and Security Awards (HESS), 2019",
      ],
    ],
  ],
  [
    "2018",
    [
      [
        "Best Company in Health and Safety Management Practices",
        "Health, Environment Safety and Security Awards (HESS), 2018",
      ],
      [
        "Accountancy and Finance Team of the Year — Oil and Gas Sector",
        "Ghana Accountancy and Finance Awards (GAFAS), 2018",
      ],
      [
        "Chamber Business Awards — Oil and Gas (Downstream and Upstream)",
        "Ghana National Chamber of Commerce and Industries (GNCCI), 2018",
      ],
      ["CEO of the Year (Downstream)", "Ghana Oil and Gas Awards (GOGAS), 2018"],
    ],
  ],
  [
    "2017",
    [
      ["Marketing Campaign of the Year", "Ghana Oil and Gas Awards (GOGAS), 2017"],
      ["Best Growing Oil and Gas Company", "2017"],
      [
        "Accountancy and Finance Team of the Year — Oil and Gas Sector",
        "Ghana Accountancy and Finance Awards (GAFAS), 2017",
      ],
    ],
  ],
  [
    "2016",
    [
      [
        "Chamber Business Awards — Mining/Oil and Gas",
        "Ghana National Chamber of Commerce and Industries (GNCCI), 2016",
      ],
      ["Fastest Growing OMC", "Chamber of Petroleum Consumers (COPEC) Award, 2016"],
      ["Attendant of the Year", "Chamber of Petroleum Consumers (COPEC) Award, 2016"],
    ],
  ],
];

export {
  achievementStats,
  awardCategories,
  awardsTimeline,
  recentAwards,
};
