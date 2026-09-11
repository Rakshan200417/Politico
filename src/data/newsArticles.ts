export interface NewsArticle {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  deck: string;
  byline: string;
  authorRole: string;
  authorBio: string;
  authorAvatar?: string;
  authorLinkedin?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  image: string;
  imageCaption: string;
  paragraphs: string[];
  keyTakeaways?: string[];
  tags: string[];
}

export function slugify(text?: string): string {
  if (!text || typeof text !== "string") return "article";
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "article";
}

export const featuredNewsArticles: Record<string, NewsArticle> = {
  "dont-take-this-one-for-granted-new-hampshire-democrats-brace-for-a-tough-senate-race": {
    slug: "dont-take-this-one-for-granted-new-hampshire-democrats-brace-for-a-tough-senate-race",
    category: "Congress",
    categorySlug: "congress",
    title: "‘Don’t take this one for granted’: New Hampshire Democrats brace for a tough Senate race",
    deck: "The Granite State contest could decide the Senate majority as national Republicans eye an unexpected pickup opportunity in the battleground.",
    byline: "LISA KASHINSKY",
    authorRole: "National Political Reporter",
    authorBio: "Lisa Kashinsky covers campaigns and elections for POLITICO, focusing on competitive Senate and gubernatorial races across New England.",
    authorLinkedin: "https://www.linkedin.com/in/lisakashinsky",
    publishedAt: "September 11, 2026 • 11:45 AM EDT",
    updatedAt: "September 11, 2026 • 12:30 PM EDT",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
    imageCaption: "A campaign rally in Manchester, N.H., where local organizers are preparing for one of the cycle's most expensive Senate contests. (Photo: Unsplash / POLITICO)",
    paragraphs: [
      "MANCHESTER, N.H. — New Hampshire Democrats are sounding early alarms about what was once expected to be a dependable Senate seat, warning that changing economic headwinds and energetic Republican recruitment have transformed the Granite State into an essential battleground for control of the chamber.",
      "Party strategists and state leaders are cautioning national donors not to overlook New Hampshire in favor of traditional swing states like Pennsylvania or Wisconsin. With razor-thin margins in the Senate, even a slight shift in suburban voter sentiment could dismantle Democrats' defense strategy.",
      "“We cannot afford to take a single precinct for granted,” said a senior campaign official during an organizing breakfast in Concord on Wednesday. “The playbook that worked two years ago is not sufficient for today’s voter priorities. Inflation, housing costs, and regional energy rates are dominating every doorstep conversation.”",
      "Republicans, meanwhile, sense their best opportunity in a decade to capture a federal seat in the state. Buoyed by recent internal polling showing tightening margins among independent voters, national GOP super PACs have already reserved more than $14 million in autumn airtime across the Boston and Manchester media markets.",
      "The race is expected to draw immense national attention over the summer as both parties test contrasting messaging on federal spending, judicial appointments, and regional trade policy.",
    ],
    keyTakeaways: [
      "National Republicans have reserved $14 million in airtime across New Hampshire media markets.",
      "Independent and suburban voters in southern New Hampshire are expressing heightened concern over energy costs.",
      "Democratic organizers are launching earlier voter-turnout drives than in past midterm cycles.",
    ],
    tags: ["Congress", "Senate", "Elections", "New Hampshire", "Midterms"],
  },

  "susan-collins-says-the-white-house-has-underestimated-impact-of-canada-tariffs": {
    slug: "susan-collins-says-the-white-house-has-underestimated-impact-of-canada-tariffs",
    category: "Markets",
    categorySlug: "markets",
    title: "Susan Collins says the White House has ‘underestimated’ impact of Canada tariffs",
    deck: "The Maine senator warned that cross-border supply chains and forest product industries face severe disruption without immediate diplomatic adjustments.",
    byline: "JESSICA PIPER",
    authorRole: "Congressional Trade Reporter",
    authorBio: "Jessica Piper covers trade policy, federal appropriations, and northern border economic developments for POLITICO.",
    authorLinkedin: "https://www.linkedin.com/in/jessicapiper",
    publishedAt: "September 11, 2026 • 10:15 AM EDT",
    updatedAt: "September 11, 2026 • 11:00 AM EDT",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Freight moving across the northern border corridor. Cross-border trade accounts for billions in bilateral commerce annually. (Photo: Unsplash / POLITICO)",
    paragraphs: [
      "WASHINGTON — Sen. Susan Collins (R-Maine) issued a stern warning to administration officials on Thursday, cautioning that new tariffs on Canadian imports will inflict severe collateral damage on northern border communities and vital manufacturing sectors.",
      "Speaking during an appropriations subcommittee hearing, Collins pressed senior economic advisers on the cascading effects of trade duties, specifically highlighting pulp, paper, and hydroelectric energy interconnects shared between New England and eastern Canadian provinces.",
      "“These tariffs reflect a fundamental misunderstanding of how integrated our regional economies are,” Collins remarked. “When you penalize inputs that domestic mills require to produce finished goods, you are not protecting American workers — you are jeopardizing their jobs.”",
      "Lawmakers from border states on both sides of the aisle have echoed similar concerns, forming an informal bipartisan coalition urging the administration to negotiate sector-specific exemptions before reciprocal retaliatory tariffs take effect next month.",
    ],
    keyTakeaways: [
      "Sen. Collins warns of cascading supply disruptions in forestry and regional power grids.",
      "Bipartisan border lawmakers are pushing for targeted exemptions ahead of reciprocal duties.",
      "Canadian trade officials have signaled willingness to discuss border security agreements.",
    ],
    tags: ["Trade", "Canada", "Economy", "Congress", "Susan Collins"],
  },

  "trump-promises-more-strikes-after-us-and-iran-trade-blows-for-first-time-in-a-month": {
    slug: "trump-promises-more-strikes-after-us-and-iran-trade-blows-for-first-time-in-a-month",
    category: "Global",
    categorySlug: "global",
    title: "Trump promises more strikes after US and Iran trade blows for first time in a month",
    deck: "Military officials confirm precision strikes on regional proxies following drone interceptions near naval transit corridors.",
    byline: "ALEXANDER WARD",
    authorRole: "National Security Reporter",
    authorBio: "Alexander Ward reports on defense strategy, international conflict, and the Pentagon for POLITICO.",
    authorLinkedin: "https://www.linkedin.com/in/alexanderward",
    publishedAt: "September 11, 2026 • 09:30 AM EDT",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Naval operations in international waters following heightened security advisories for maritime shipping. (Photo: Unsplash / POLITICO)",
    paragraphs: [
      "WASHINGTON — Former President Donald Trump pledged decisive retaliatory action early Friday morning after the United States and Iranian-backed proxies exchanged military strikes for the first time in more than four weeks.",
      "Defense officials confirmed that U.S. forces carried out precision strikes targeting command facilities and drone staging depots after multiple airborne threats were intercepted in international airspace.",
      "Regional allies have urged de-escalation while reinforcing air defense batteries. Congressional leaders have requested an immediate classified briefing on maritime safety protocols across critical shipping bottlenecks.",
    ],
    keyTakeaways: [
      "U.S. forces intercepted airborne drones targeting commercial shipping lanes.",
      "Diplomatic channels in Geneva are seeking to prevent wider escalation.",
    ],
    tags: ["Defense", "National Security", "Foreign Affairs", "Middle East"],
  },
};

export function getNewsArticle(slug: string): NewsArticle {
  const normalized = slug.toLowerCase().trim();
  if (featuredNewsArticles[normalized]) {
    return featuredNewsArticles[normalized];
  }

  // Fallback: Generate a rich, formatted POLITICO article based on the slug
  const readableTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    slug: normalized,
    category: "Politics",
    categorySlug: "politics",
    title: readableTitle,
    deck: "An inside look at the key players, political calculations, and national policy ramifications driving today's headlines.",
    byline: "POLITICO STAFF",
    authorRole: "Senior Editorial Reporter",
    authorBio: "POLITICO's editorial team provides breaking news, authoritative political journalism, and policy reporting from Washington and around the globe.",
    authorLinkedin: "https://www.linkedin.com/company/politico",
    publishedAt: "September 11, 2026 • 12:00 PM EDT",
    updatedAt: "September 11, 2026 • 12:30 PM EDT",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Capitol Hill and federal offices in Washington, D.C., where lawmakers and officials are deliberating on major legislative and policy initiatives. (Photo: Unsplash / POLITICO)",
    paragraphs: [
      `WASHINGTON — Major developments surrounding “${readableTitle}” have sparked intense debate across Washington and within state capitals today as stakeholders assess the broader implications for governance and upcoming elections.`,
      "Congressional leaders and administration officials spent the morning holding closed-door consultations with industry leaders and constitutional experts to formulate their strategic response.",
      "“This is a pivotal moment that will shape both the regulatory environment and public sentiment over the coming months,” noted one veteran political strategist familiar with ongoing discussions. “Both parties understand the stakes, and neither is willing to surrender the narrative.”",
      "Public interest groups and business associations have also stepped up advocacy efforts, submitting formal policy briefs and launching targeted media campaigns to ensure their perspectives are heard before final decisions are announced.",
      "As negotiations continue through the weekend, observers expect further legislative proposals and executive announcements to be introduced in the coming days.",
    ],
    keyTakeaways: [
      "Key leaders are coordinating responses ahead of upcoming committee hearings.",
      "Market analysts and political observers anticipate policy guidelines will be finalized shortly.",
      "State officials are monitoring federal actions for potential regional economic impacts.",
    ],
    tags: ["POLITICO News", "Politics", "Government", "Policy", "Washington"],
  };
}
