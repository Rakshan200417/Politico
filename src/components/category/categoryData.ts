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
    slug: "breaking-news",
    name: "Breaking News",
    description: "The latest breaking news, analysis and updates.",
    lead: {
      title: "How Breaking News is counting down to a consequential midterms convention",
      deck: "The latest fights on Capitol Hill are setting the terms for the next phase of the political year.",
      byline: "BY STAFF | SEPTEMBER 04, 2026 03:17 PM",
      image: images.campaign,
    },
    sideStories: [
      { title: "I don't think anyone is really comfortable: Democrats navigate a new fight", deck: "The latest arguments are raising alarms across Capitol Hill.", byline: "BY RILEY ROGERSON AND KELSEY BRUGGER", image: images.briefing },
      { title: "House leaders' message to states: Count faster", deck: "The parties are preparing for a difficult fall.", byline: "BY STAFF", image: images.podium },
    ],
  },
  {
    slug: "companies",
    name: "Companies",
    description: "Corporate news, analysis and updates.",
    lead: { title: "Inside the corporate strategy for the next political fight", deck: "Companies are balancing policy priorities with pressure from allies and opponents.", byline: "BY STAFF | SEPTEMBER 04, 2026 02:45 PM", image: images.briefing },
    sideStories: [
      { title: "Allies sharpen their case on the road", deck: "Companies are turning to a familiar political playbook.", byline: "BY STAFF", image: images.campaign },
      { title: "The policy choices testing the administration", deck: "Officials are weighing the next moves.", byline: "BY STAFF", image: images.capitol },
    ],
  },
  {
    slug: "startups",
    name: "Startups",
    description: "Startup news, funding, and analysis.",
    lead: { title: "Startups political test is arriving sooner than expected", deck: "A new round of negotiations is putting pressure on leaders across the country.", byline: "BY STAFF | SEPTEMBER 04, 2026 01:20 PM", image: images.city },
    sideStories: [
      { title: "Startups weigh a new approach to trade", deck: "The decision could affect businesses on both sides of the border.", byline: "BY STAFF", image: images.briefing },
      { title: "The provinces pushing back", deck: "Regional politics are reshaping the national conversation.", byline: "BY STAFF", image: images.people },
    ],
  },
  {
    slug: "markets",
    name: "Markets",
    description: "Market trends, analysis and updates.",
    lead: { title: "The market debate is moving into a new phase", deck: "Officials and lawmakers are confronting a changing security landscape.", byline: "BY STAFF | SEPTEMBER 04, 2026 12:10 PM", image: images.briefing },
    sideStories: [
      { title: "Leaders outline their priorities", deck: "The new agenda is meeting questions from Congress.", byline: "BY STAFF", image: images.podium },
      { title: "Allies watch Washington's next move", deck: "The stakes are rising for a familiar coalition.", byline: "BY STAFF", image: images.campaign },
    ],
  },
  {
    slug: "economy",
    name: "Economy",
    description: "Economic news, analysis and updates.",
    lead: { title: "The economy that could redraw the political map", deck: "Candidates and strategists are preparing for a campaign season unlike any other.", byline: "BY STAFF | SEPTEMBER 04, 2026 11:00 AM", image: images.election },
    sideStories: [
      { title: "Candidates test their message with voters", deck: "The early contests are already defining the field.", byline: "BY STAFF", image: images.people },
      { title: "What the newest polls are showing", deck: "The numbers reveal both movement and uncertainty.", byline: "BY STAFF", image: images.campaign },
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Financial news, analysis and updates.",
    lead: { title: "The financial choices shaping America's next economy", deck: "A competition over infrastructure and investment is changing the policy debate.", byline: "BY STAFF | SEPTEMBER 04, 2026 10:15 AM", image: images.city },
    sideStories: [
      { title: "States race to build the next power network", deck: "The investment is creating new winners and difficult tradeoffs.", byline: "BY STAFF", image: images.technology },
      { title: "Industry leaders make their case", deck: "The debate over the future of finance is getting louder.", byline: "BY STAFF", image: images.briefing },
    ],
  },
  {
    slug: "technology",
    name: "Technology",
    description: "Technology news, innovation and analysis.",
    lead: { title: "Washington is racing to write the rules for the next tech boom", deck: "A growing push for regulation is colliding with an industry moving at full speed.", byline: "BY STAFF | SEPTEMBER 04, 2026 08:45 AM", image: images.technology },
    sideStories: [
      { title: "The AI policy debate gets more concrete", deck: "Lawmakers are moving from broad principles to detailed rules.", byline: "BY STAFF", image: images.capitol },
      { title: "Tech executives make their Washington pitch", deck: "The industry is asking for certainty as the stakes grow.", byline: "BY STAFF", image: images.people },
    ],
  },
  {
    slug: "industries",
    name: "Industries",
    description: "Industry news, analysis and updates.",
    lead: { title: "Industries next political battle is already taking shape", deck: "The state's leaders are facing pressure from voters, business and a changing national map.", byline: "BY STAFF | SEPTEMBER 04, 2026 08:10 AM", image: images.city },
    sideStories: [
      { title: "Sacramento debates the next big priority", deck: "The proposal is testing old alliances.", byline: "BY STAFF", image: images.capitol },
      { title: "The voters reshaping industries", deck: "A new coalition is emerging across the state.", byline: "BY STAFF", image: images.people },
    ],
  },
  {
    slug: "global",
    name: "Global",
    description: "Global news, analysis and updates.",
    lead: { title: "Global leaders confront a crowded political agenda", deck: "The next decisions will reverberate well beyond.", byline: "BY STAFF | SEPTEMBER 04, 2026 07:45 AM", image: images.city },
    sideStories: [
      { title: "Power players take new positions", deck: "The negotiations are beginning earlier than expected.", byline: "BY STAFF", image: images.briefing },
      { title: "The issues driving Global voters", deck: "Housing, jobs and public safety remain central.", byline: "BY STAFF", image: images.people },
    ],
  },
  {
    slug: "leaders",
    name: "Leaders",
    description: "Leadership news, analysis and updates.",
    lead: { title: "The power players setting Washington's fall agenda", deck: "The people with the most influence are preparing for a season of high-stakes decisions.", byline: "BY STAFF | SEPTEMBER 04, 2026 07:00 AM", image: images.capitol },
    sideStories: [
      { title: "The conversations happening behind the scenes", deck: "What Washington is saying when the cameras are off.", byline: "BY STAFF", image: images.people },
      { title: "The morning's essential reads", deck: "The stories and signals you need to know.", byline: "BY STAFF", image: images.briefing },
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
