export interface CategoryStory {
  title: string;
  deck: string;
  byline: string;
  image: string;
}

export interface CategoryPageData {
  slug: string;
  name: string;
  description: string;
  lead: CategoryStory;
  sideStories: CategoryStory[];
  moreStories: CategoryStory[];
}

const images = {
  campaign: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
  capitol: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
  podium: "https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=900&q=80",
  briefing: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
  city: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  election: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=900&q=80",
  people: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
};

const sharedMoreStories = (name: string): CategoryStory[] => [
  {
    title: `${name} leaders face a new test as Washington enters a decisive stretch`,
    deck: `The latest developments are reshaping the debate around ${name.toLowerCase()} and what comes next.`,
    byline: "BY POLITICO STAFF | SEPTEMBER 04, 2026 08:00 AM",
    image: images.capitol,
  },
  {
    title: `What to know about the fight defining ${name.toLowerCase()} right now`,
    deck: "New alliances and old disagreements are driving the story as lawmakers and voters weigh their options.",
    byline: "BY POLITICO REPORTERS | SEPTEMBER 03, 2026 07:59 AM",
    image: images.briefing,
  },
  {
    title: `The people and policy decisions changing ${name.toLowerCase()}`,
    deck: "The newest reporting offers a closer look at the forces behind the headlines.",
    byline: "BY POLITICO STAFF | SEPTEMBER 03, 2026 06:30 PM",
    image: images.people,
  },
  {
    title: `Inside the next chapter of ${name.toLowerCase()}`,
    deck: "A closer look at the personalities, stakes and consequences shaping the next phase.",
    byline: "BY POLITICO STAFF | SEPTEMBER 03, 2026 05:30 PM",
    image: images.city,
  },
];

const definitions: Array<Omit<CategoryPageData, "moreStories">> = [
  {
    slug: "congress",
    name: "Congress",
    description: "The latest news, analysis and updates on Congress, including Senate and House politics and policy.",
    lead: {
      title: "How Congress is counting down to a consequential midterms convention",
      deck: "The latest fights on Capitol Hill are setting the terms for the next phase of the political year.",
      byline: "BY POLITICO CONGRESS TEAM | SEPTEMBER 04, 2026 03:17 PM",
      image: images.campaign,
    },
    sideStories: [
      { title: "I don't think anyone is really comfortable: Democrats navigate a new fight", deck: "The latest arguments are raising alarms across Capitol Hill.", byline: "BY RILEY ROGERSON AND KELSEY BRUGGER", image: images.briefing },
      { title: "House leaders' message to states: Count faster", deck: "The parties are preparing for a difficult fall.", byline: "BY POLITICO STAFF", image: images.podium },
    ],
  },
  {
    slug: "white-house",
    name: "White House",
    description: "Breaking news and analysis from the White House, the administration and the president's agenda.",
    lead: { title: "Inside the White House strategy for the next political fight", deck: "The administration is balancing policy priorities with pressure from allies and opponents.", byline: "BY MEGAN MESSERLY | SEPTEMBER 04, 2026 02:45 PM", image: images.briefing },
    sideStories: [
      { title: "Trump allies sharpen their case on the road", deck: "The White House is turning to a familiar political playbook.", byline: "BY POLITICO STAFF", image: images.campaign },
      { title: "The policy choices testing the administration", deck: "Officials are weighing the next moves.", byline: "BY POLITICO STAFF", image: images.capitol },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    description: "The latest Canadian politics, policy and breaking news from Ottawa and across the country.",
    lead: { title: "Canada's next political test is arriving sooner than expected", deck: "A new round of negotiations is putting pressure on leaders across the country.", byline: "BY POLITICO CANADA | SEPTEMBER 04, 2026 01:20 PM", image: images.city },
    sideStories: [
      { title: "Ottawa weighs a new approach to trade", deck: "The decision could affect businesses on both sides of the border.", byline: "BY POLITICO STAFF", image: images.briefing },
      { title: "The provinces pushing back", deck: "Regional politics are reshaping the national conversation.", byline: "BY POLITICO STAFF", image: images.people },
    ],
  },
  {
    slug: "defense",
    name: "Defense",
    description: "Defense policy, national security and the people shaping America's military and strategic decisions.",
    lead: { title: "The defense debate is moving into a new phase", deck: "Officials and lawmakers are confronting a changing security landscape.", byline: "BY POLITICO DEFENSE TEAM | SEPTEMBER 04, 2026 12:10 PM", image: images.briefing },
    sideStories: [
      { title: "Pentagon leaders outline their priorities", deck: "The new agenda is meeting questions from Congress.", byline: "BY POLITICO STAFF", image: images.podium },
      { title: "Allies watch Washington's next move", deck: "The stakes are rising for a familiar coalition.", byline: "BY POLITICO STAFF", image: images.campaign },
    ],
  },
  {
    slug: "elections",
    name: "Elections",
    description: "Campaign news, polling and analysis from the races that will shape the next election.",
    lead: { title: "The races that could redraw the political map", deck: "Candidates and strategists are preparing for a campaign season unlike any other.", byline: "BY POLITICO ELECTIONS TEAM | SEPTEMBER 04, 2026 11:00 AM", image: images.election },
    sideStories: [
      { title: "Candidates test their message with voters", deck: "The early contests are already defining the field.", byline: "BY POLITICO STAFF", image: images.people },
      { title: "What the newest polls are showing", deck: "The numbers reveal both movement and uncertainty.", byline: "BY POLITICO STAFF", image: images.campaign },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    description: "The latest energy, climate and environmental policy news from Washington and beyond.",
    lead: { title: "The energy choices shaping America's next economy", deck: "A competition over infrastructure and investment is changing the policy debate.", byline: "BY POLITICO ENERGY TEAM | SEPTEMBER 04, 2026 10:15 AM", image: images.city },
    sideStories: [
      { title: "States race to build the next power network", deck: "The investment is creating new winners and difficult tradeoffs.", byline: "BY POLITICO STAFF", image: images.technology },
      { title: "Industry leaders make their case", deck: "The debate over the future of energy is getting louder.", byline: "BY POLITICO STAFF", image: images.briefing },
    ],
  },
  {
    slug: "health-care",
    name: "Health Care",
    description: "Health policy, medicine and the business of health care, covered from Washington and across the country.",
    lead: { title: "The health care fight is moving beyond the familiar lines", deck: "Patients, providers and lawmakers are confronting a new set of choices.", byline: "BY POLITICO HEALTH CARE TEAM | SEPTEMBER 04, 2026 09:40 AM", image: images.people },
    sideStories: [
      { title: "Hospitals prepare for another policy shift", deck: "The changes could affect millions of patients.", byline: "BY POLITICO STAFF", image: images.briefing },
      { title: "The lawmakers leading the debate", deck: "A bipartisan group is searching for common ground.", byline: "BY POLITICO STAFF", image: images.capitol },
    ],
  },
  {
    slug: "legal",
    name: "Legal",
    description: "Supreme Court news, legal analysis and the cases changing American law and politics.",
    lead: { title: "The legal battles that could define the next term", deck: "Courts are weighing a series of cases with consequences far beyond the courtroom.", byline: "BY JOSH GERSTEIN | SEPTEMBER 04, 2026 09:05 AM", image: images.capitol },
    sideStories: [
      { title: "Justices prepare for a consequential docket", deck: "The coming arguments are drawing attention across Washington.", byline: "BY POLITICO STAFF", image: images.briefing },
      { title: "The lawyers shaping the cases", deck: "The legal strategy is becoming part of the political story.", byline: "BY POLITICO STAFF", image: images.podium },
    ],
  },
  {
    slug: "tech",
    name: "Tech",
    description: "Technology policy, innovation and the companies changing Washington and the world.",
    lead: { title: "Washington is racing to write the rules for the next tech boom", deck: "A growing push for regulation is colliding with an industry moving at full speed.", byline: "BY POLITICO TECH TEAM | SEPTEMBER 04, 2026 08:45 AM", image: images.technology },
    sideStories: [
      { title: "The AI policy debate gets more concrete", deck: "Lawmakers are moving from broad principles to detailed rules.", byline: "BY POLITICO STAFF", image: images.capitol },
      { title: "Tech executives make their Washington pitch", deck: "The industry is asking for certainty as the stakes grow.", byline: "BY POLITICO STAFF", image: images.people },
    ],
  },
  {
    slug: "california",
    name: "California",
    description: "California politics, policy and the people shaping the nation's largest state.",
    lead: { title: "California's next political battle is already taking shape", deck: "The state's leaders are facing pressure from voters, business and a changing national map.", byline: "BY POLITICO CALIFORNIA TEAM | SEPTEMBER 04, 2026 08:10 AM", image: images.city },
    sideStories: [
      { title: "Sacramento debates the next big priority", deck: "The proposal is testing old alliances.", byline: "BY POLITICO STAFF", image: images.capitol },
      { title: "The voters reshaping California politics", deck: "A new coalition is emerging across the state.", byline: "BY POLITICO STAFF", image: images.people },
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    description: "New York politics and policy news from Albany, New York City and across the state.",
    lead: { title: "New York leaders confront a crowded political agenda", deck: "The state's next decisions will reverberate well beyond Albany.", byline: "BY POLITICO NEW YORK TEAM | SEPTEMBER 04, 2026 07:45 AM", image: images.city },
    sideStories: [
      { title: "Albany's power players take new positions", deck: "The negotiations are beginning earlier than expected.", byline: "BY POLITICO STAFF", image: images.briefing },
      { title: "The issues driving New York voters", deck: "Housing, jobs and public safety remain central.", byline: "BY POLITICO STAFF", image: images.people },
    ],
  },
  {
    slug: "playbook",
    name: "Playbook",
    description: "The essential guide to the people, power and politics shaping Washington.",
    lead: { title: "The power players setting Washington's fall agenda", deck: "The people with the most influence are preparing for a season of high-stakes decisions.", byline: "BY POLITICO PLAYBOOK | SEPTEMBER 04, 2026 07:00 AM", image: images.capitol },
    sideStories: [
      { title: "The conversations happening behind the scenes", deck: "What Washington is saying when the cameras are off.", byline: "BY POLITICO STAFF", image: images.people },
      { title: "The morning's essential reads", deck: "The stories and signals you need to know.", byline: "BY POLITICO STAFF", image: images.briefing },
    ],
  },
  {
    slug: "columns",
    name: "Columns",
    description: "Opinion and analysis from POLITICO's columnists and contributors.",
    lead: { title: "The argument Washington is still avoiding", deck: "A closer look at the assumptions driving the capital's biggest debate.", byline: "BY POLITICO COLUMNISTS | SEPTEMBER 04, 2026 06:30 AM", image: images.people },
    sideStories: [
      { title: "What the latest debate gets wrong", deck: "The conventional wisdom is missing an important piece.", byline: "BY POLITICO COLUMNISTS", image: images.briefing },
      { title: "A different way to read the moment", deck: "The political consequences may be larger than they first appear.", byline: "BY POLITICO COLUMNISTS", image: images.city },
    ],
  },
  {
    slug: "newsletters",
    name: "Newsletters",
    description: "The POLITICO newsletters that keep you informed on the issues and people that matter.",
    lead: { title: "The newsletters Washington reads first", deck: "Get the essential reporting, analysis and insight delivered to your inbox.", byline: "BY POLITICO NEWSLETTERS | SEPTEMBER 04, 2026", image: images.briefing },
    sideStories: [
      { title: "Inside Congress", deck: "Your first read on Capitol Hill politics and policy.", byline: "SIGN UP FOR THE LATEST EDITION", image: images.capitol },
      { title: "West Wing Playbook", deck: "The latest from the White House and the administration.", byline: "SIGN UP FOR THE LATEST EDITION", image: images.campaign },
    ],
  },
  {
    slug: "magazine",
    name: "Magazine",
    description: "Ambitious reporting, ideas and storytelling from POLITICO Magazine.",
    lead: { title: "The stories behind the politics", deck: "Long-form reporting and sharp analysis on the people and ideas changing the country.", byline: "BY POLITICO MAGAZINE | SEPTEMBER 04, 2026", image: images.people },
    sideStories: [
      { title: "The new power map", deck: "How a changing country is producing a new class of political leaders.", byline: "BY POLITICO MAGAZINE", image: images.city },
      { title: "A portrait of a political moment", deck: "The people at the center of the story explain what comes next.", byline: "BY POLITICO MAGAZINE", image: images.briefing },
    ],
  },
  {
    slug: "podcasts",
    name: "Podcasts",
    description: "POLITICO's podcasts bring you news, analysis and conversations from Washington and beyond.",
    lead: { title: "The conversations shaping the week's biggest stories", deck: "Listen to the latest reporting and analysis from the people closest to the news.", byline: "BY POLITICO PODCASTS | SEPTEMBER 04, 2026", image: images.briefing },
    sideStories: [
      { title: "The latest from POLITICO Playbook", deck: "The insiders explain what is happening in Washington.", byline: "LISTEN NOW", image: images.capitol },
      { title: "Energy and the future of AI", deck: "A conversation about the policy choices ahead.", byline: "LISTEN NOW", image: images.technology },
    ],
  },
  {
    slug: "polling",
    name: "Polling",
    description: "The latest polls, surveys and data-driven analysis from POLITICO.",
    lead: { title: "The numbers revealing the country's political mood", deck: "New polling offers a clearer picture of what voters want and where they may move next.", byline: "BY POLITICO POLLING TEAM | SEPTEMBER 04, 2026", image: images.election },
    sideStories: [
      { title: "What voters are saying about the economy", deck: "The newest data points to a complicated political landscape.", byline: "BY POLITICO STAFF", image: images.people },
      { title: "The races where every vote matters", deck: "Small shifts could have major consequences.", byline: "BY POLITICO STAFF", image: images.campaign },
    ],
  },
];

export const categoryPages: CategoryPageData[] = definitions.map((category) => ({
  ...category,
  moreStories: sharedMoreStories(category.name),
}));

export const categorySlugs = categoryPages.map((category) => category.slug);

export function getCategoryPage(slug: string) {
  return categoryPages.find((category) => category.slug === slug);
}
