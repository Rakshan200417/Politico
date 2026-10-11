const mysql = require('mysql2/promise');

async function seed() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'politico_db',
  });

  const writers = [
    { name: 'Rakshan', email: 'writer@example.com' },
    { name: 'Sarah Jenkins', email: 'sarah.jenkins@politico.mock' },
    { name: 'Marcus Sterling', email: 'marcus.sterling@politico.mock' },
    { name: 'Elena Rostova', email: 'elena.rostova@politico.mock' },
    { name: 'David Chen', email: 'david.chen@politico.mock' },
    { name: 'Aisha Rahman', email: 'aisha.rahman@politico.mock' },
    { name: "James O'Connor", email: 'james.oconnor@politico.mock' },
    { name: 'Chloe Dubois', email: 'chloe.dubois@politico.mock' },
    { name: 'Michael Chang', email: 'michael.chang@politico.mock' },
    { name: 'Sophia Martinez', email: 'sophia.martinez@politico.mock' }
  ];

  const articlesData = [
    {
      title: "Senate Advances Landmark Bipartisan Artificial Intelligence Oversight Framework",
      category: "Politics",
      subcategories: ["Congress", "Tech Policy"],
      tags: "AI, Congress, Senate, Regulation, Technology",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      caption: "Capitol Hill lawmakers debate foundational regulatory standards for high-capability models.",
      deck: "The bipartisan package establishes transparency requirements for frontier foundational models while safeguarding open-source innovation."
    },
    {
      title: "Federal Reserve Signals Prolonged Pause as Core Inflation Cools Toward 2% Target",
      category: "Finance",
      subcategories: ["Central Banks", "Monetary Policy"],
      tags: "Fed, Inflation, Interest Rates, Wall Street",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      caption: "Federal Reserve headquarters in Washington, D.C. as markets digest rate projections.",
      deck: "Chair emphasizes patient policy calibration as labor market realignment moderates wage pressures across key metropolitan sectors."
    },
    {
      title: "Global Semiconductor Alliance Unveils $120B Next-Gen Sub-2nm Foundry Initiative",
      category: "Technology",
      subcategories: ["Hardware", "Supply Chain"],
      tags: "Chips, Semiconductor, Silicon, Foundries, Tech",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      caption: "Silicon wafer manufacturing facility gearing up for sub-2-nanometer gate-all-around architectures.",
      deck: "Coordinated multilateral private-public investments aim to insulate global advanced compute supply chains against regional disruptions."
    },
    {
      title: "European Union Finalizes Strategic Critical Minerals Accord with Pacific Partners",
      category: "World",
      subcategories: ["Europe", "Trade", "Diplomacy"],
      tags: "EU, Critical Minerals, Trade, Global Economy",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
      caption: "European Commission flags fly at the Berlaymont building in Brussels following bilateral negotiations.",
      deck: "The comprehensive pact guarantees preferential access to lithium, nickel, and cobalt refining channels over the coming two decades."
    },
    {
      title: "Offshore Wind Power Surge Hits Milestone as North Sea Grid Connection Goes Live",
      category: "Energy",
      subcategories: ["Renewables", "Infrastructure"],
      tags: "Clean Energy, Wind Power, North Sea, Green Transition",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
      caption: "High-capacity offshore turbines operating at peak maritime wind capacity.",
      deck: "Interconnected multi-terminal high-voltage direct current grid powers over 15 million households across four coastal nations."
    },
    {
      title: "Treasury Department Tightens Cross-Border Inbound Investment Screening Rules",
      category: "Economy",
      subcategories: ["Trade", "National Security"],
      tags: "Treasury, CFIUS, Foreign Investment, Trade Policy",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
      caption: "U.S. Department of the Treasury building illuminated in downtown Washington.",
      deck: "New mandates require heightened scrutiny for sovereign wealth acquisitions of sensitive dual-use technological infrastructure."
    },
    {
      title: "Space Exploration Consortium Prepares Crewed Lunar Gateway Logistics Mission",
      category: "Technology",
      subcategories: ["Aerospace", "Science"],
      tags: "Space, NASA, Lunar Gateway, Commercial Space",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      caption: "Deep space staging platform simulation rendering for next-decade lunar operations.",
      deck: "Commercial spaceflight partners complete critical orbital vibration tests ahead of scheduled trans-lunar injection launch window."
    },
    {
      title: "Defense Department Accelerates Autonomous Drone Fleet Interoperability Contracts",
      category: "Defense",
      subcategories: ["Military Tech", "Procurement"],
      tags: "Defense, Pentagon, Autonomous Systems, Military",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
      caption: "Unmanned aerial tactical system demonstrated during joint military interoperability drills.",
      deck: "Multi-domain command protocols ensure autonomous reconnaissance squadrons share unified sensor telemetry in real time."
    },
    {
      title: "Biotech Breakthrough: Precision Gene Editing Platform Secures Fast-Track Review",
      category: "Healthcare",
      subcategories: ["Biomedicine", "FDA"],
      tags: "Biotech, Gene Editing, Medicine, FDA Approval",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
      caption: "Molecular genetics laboratory testing novel synthetic guide RNA candidates.",
      deck: "Clinical trials report unprecedented efficacy rates in targeting hereditary cardiovascular anomalies with negligible off-target cleavage."
    },
    {
      title: "Commercial Real Estate Debt Refinancing Clears Hurdle Amid Regional Bank Strength",
      category: "Markets",
      subcategories: ["Banking", "Real Estate"],
      tags: "Real Estate, Banking, Credit Markets, Finance",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      caption: "Metropolitan financial district skyline where commercial asset restructurings continue.",
      deck: "Securitized debt extensions prevent expected default cliffs as institutional lenders structure modified amortization agreements."
    },
    {
      title: "Global Carbon Credit Verification Standards Reach Unanimous International Treaty",
      category: "Energy",
      subcategories: ["Climate Policy", "Sustainability"],
      tags: "Carbon Offsets, Climate, COP, Green Economy",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      caption: "High-level delegates finalize unified criteria for cross-border carbon accounting.",
      deck: "Strict satellite auditing and verifiable biomass tracking eradicate speculative greenwashing across voluntary credit markets."
    },
    {
      title: "Supreme Court Hears Arguments on Regulatory Scope of Independent Agency Powers",
      category: "Politics",
      subcategories: ["Judiciary", "Administrative Law"],
      tags: "SCOTUS, Legal, Judicial Review, Constitution",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      caption: "The Supreme Court of the United States marble facade in Washington, D.C.",
      deck: "Justices probe statutory delegations of authority that could redefine administrative rulemaking across federal energy and labor bureaus."
    },
    {
      title: "Automakers Pioneer Solid-State Battery Mass Production with 700-Mile Range Test",
      category: "Technology",
      subcategories: ["Automotive", "Clean Tech"],
      tags: "EVs, Batteries, Automotive, Solid State",
      image: "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1200&q=80",
      caption: "Next-generation solid-state battery cell pack undergoing thermal dissipation stress testing.",
      deck: "Ceramic electrolyte barrier eliminates fire hazards while enabling 10-minute ultra-fast charging under extreme winter temperatures."
    },
    {
      title: "G7 Finance Ministers Pledge Harmonized Framework on Sovereign Digital Currencies",
      category: "Finance",
      subcategories: ["CBDC", "Global Finance"],
      tags: "G7, Digital Currency, FinTech, Global Economics",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
      caption: "International central bankers assemble for high-level monetary coordination summit.",
      deck: "Interoperability standards guarantee instantaneous wholesale liquidity settlement without destabilizing domestic retail deposits."
    },
    {
      title: "Smart Grid Modernization Grants Awarded to 35 States to Fortify Winter Resilience",
      category: "Energy",
      subcategories: ["Utilities", "Infrastructure"],
      tags: "Power Grid, Energy, Utilities, Resilience",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
      caption: "High-voltage transmission pylons cutting across winter landscape.",
      deck: "Department of Energy funds deploy predictive AI load-balancing switches to insulate suburban substations against extreme polar vortex events."
    },
    {
      title: "Antitrust Regulators Scrutinize Cloud Computing Bundling and Egress Fee Contracts",
      category: "Technology",
      subcategories: ["Antitrust", "Enterprise Tech"],
      tags: "Cloud, FTC, DOJ, Antitrust, Big Tech",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      caption: "Server racks humming inside hyper-scale cloud data center.",
      deck: "Federal trade officials question whether restrictive licensing policies artificially inflate client migration barriers."
    },
    {
      title: "Pacific Rim Maritime Trade Flows Rebound Following Bilateral Port Modernization",
      category: "Economy",
      subcategories: ["Shipping", "Logistics"],
      tags: "Trade, Shipping, Supply Chains, Logistics",
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
      caption: "Container ships loading cargo with automated gantry cranes at a deepwater terminal.",
      deck: "Automated berth scheduling and digital customs clearing slash container dwell times across key western coast transshipment points."
    },
    {
      title: "Hospital Networks Expand Remote Patient Monitoring as Rural Access Gains Ground",
      category: "Healthcare",
      subcategories: ["Health Tech", "Public Health"],
      tags: "Healthcare, Telehealth, Rural Medicine, Tech",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      caption: "Medical staff reviewing real-time cardiac telemetry in modern regional clinic.",
      deck: "Cellular-connected wearable diagnostics dramatically decrease 30-day readmission rates for chronic geriatric patient cohorts."
    },
    {
      title: "Municipal Bond Market Sees Record Inflows as Cities Fund Climate Adaptation Projects",
      category: "Markets",
      subcategories: ["Bonds", "Public Finance"],
      tags: "Muni Bonds, Fixed Income, Climate Finance, Infrastructure",
      image: "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=1200&q=80",
      caption: "Civil engineers overseeing seawall reinforcement construction funded through green munis.",
      deck: "Tax-exempt offerings attract institutional asset managers seeking defensive yield alongside tangible municipal ESG metrics."
    },
    {
      title: "Quantum Encryption Prototype Secures Inter-Governmental Diplomatic Cable Network",
      category: "Technology",
      subcategories: ["Cybersecurity", "Quantum"],
      tags: "Quantum, Cyber, Cryptography, National Security",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
      caption: "Fiber-optic quantum key distribution testing module in defense research facility.",
      deck: "Entangled photon distribution verifies inviolable secure comms resistant to harvest-now, decrypt-later offensive capabilities."
    },
    {
      title: "Congressional Committee Weighs Comprehensive Digital Privacy and Minor Protection Act",
      category: "Politics",
      subcategories: ["Legislation", "Privacy"],
      tags: "Privacy, Congress, Social Media, Tech Law",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
      caption: "House Energy and Commerce committee hearing on consumer algorithmic protections.",
      deck: "Sweeping rules would prohibit algorithmic profiling of teenage consumers and impose mandatory third-party audit standards."
    },
    {
      title: "Nuclear Fusion Research Milestone: Net Energy Gain Sustained for Five Minutes",
      category: "Energy",
      subcategories: ["Clean Tech", "Physics"],
      tags: "Fusion, Nuclear Energy, Science, Clean Power",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80",
      caption: "Magnetic confinement tokamak vessel glowing during steady-state plasma pulse.",
      deck: "Superconducting high-temperature magnets keep deuterium-tritium plasma stable without disruptive wall containment breaches."
    },
    {
      title: "Agricultural Tech Startups Pioneer Autonomous Harvesters to Solve Labor Gaps",
      category: "Technology",
      subcategories: ["AgTech", "Robotics"],
      tags: "AgTech, Robotics, Agriculture, Automation",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80",
      caption: "Autonomous tractor harvesting field with precision lidar and computer vision.",
      deck: "GPS-guided electric harvesting fleets reduce crop waste by eighteen percent while operating around the clock in rural heartland."
    },
    {
      title: "Sovereign Debt Restructuring Mechanism Agreed for Developing Climate-Vulnerable States",
      category: "World",
      subcategories: ["Global Economy", "IMF"],
      tags: "IMF, World Bank, Sovereign Debt, Climate",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      caption: "Multilateral development bank executives assemble in Geneva for climate debt talks.",
      deck: "Debt-for-nature swaps allow nations to divert servicing payments toward verifiable mangrove and coral reef restoration projects."
    },
    {
      title: "Commercial Aviation Industry Tests 100% Synthetic Sustainable Fuel on Transatlantic Route",
      category: "Economy",
      subcategories: ["Aviation", "Sustainability"],
      tags: "Aviation, SAF, Airlines, Green Travel",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      caption: "Commercial twin-engine airliner cruising at 35,000 feet fueled entirely by sustainable kerosene.",
      deck: "Zero fossil fuel blend achieves nominal engine temperature readouts and identical thrust profiles during rigorous test flight."
    },
    {
      title: "Venture Capital Focus Shifts toward Physical AI and Industrial Automation Hardware",
      category: "Markets",
      subcategories: ["Venture Capital", "Startups"],
      tags: "VC, Robotics, Industrial Tech, Startups",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      caption: "Engineers collaborating on humanoid robot actuator assemblies in startup incubator.",
      deck: "Investors redirect capital from pure-play software apps toward robotic warehouse automation and advanced tactile fabrication."
    },
    {
      title: "Critical Water Infrastructure Modernization Overcomes Western Drought Pressures",
      category: "Energy",
      subcategories: ["Water Rights", "Utilities"],
      tags: "Water, Drought, Infrastructure, Colorado River",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      caption: "Reservoir dam operating upgraded sluice gates with recycled municipal water inflows.",
      deck: "Desalination and aquifer replenishment reservoirs stabilize agricultural irrigation quotas along seven key western state basins."
    },
    {
      title: "Defense Intelligence Agency Outlines Strategic Hypersonic Detection Satellite Constellation",
      category: "Defense",
      subcategories: ["Space Force", "National Security"],
      tags: "Defense, Space Force, Hypersonic, Satellites",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80",
      caption: "Low-Earth orbit infrared tracking satellite deploying solar wings in space simulation.",
      deck: "Proliferated sensor mesh offers continuous unbroken tracking of high-velocity glide bodies across global trans-polar corridors."
    },
    {
      title: "Pharmaceutical Supply Chains Diversify with New Domestic Active Ingredient Plants",
      category: "Healthcare",
      subcategories: ["Pharma", "Manufacturing"],
      tags: "Pharma, Supply Chain, Medicine, Healthcare",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      caption: "Automated pharmaceutical sterile manufacturing cleanroom producing essential antibiotics.",
      deck: "Federal incentives bring manufacturing of critical life-saving generic compounds back to industrial corridors in Ohio and Virginia."
    },
    {
      title: "FinTech Regulators Propose Strict Standards for Automated Algorithmic Lending Engines",
      category: "Finance",
      subcategories: ["FinTech", "Banking"],
      tags: "FinTech, Lending, AI, Consumer Credit",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      caption: "Data analysts examining machine learning risk models for institutional credit approval.",
      deck: "Consumer Financial Protection Bureau issues guidance requiring explainable audits to prevent discriminatory automated credit denials."
    },
    {
      title: "High-Speed Rail Corridor Breaks Ground Connecting Pacific Northwest Innovation Hubs",
      category: "Economy",
      subcategories: ["Transit", "Infrastructure"],
      tags: "Rail, Transit, Transportation, Infrastructure",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
      caption: "Modern bullet train arriving at passenger platform in newly constructed transit terminal.",
      deck: "Electrified bullet train promises to slash travel times between Seattle and Portland to under one hour by the early 2030s."
    },
    {
      title: "Cybersecurity Agency Issues Patch Advisory for Critical Zero-Day Vulnerability in Routers",
      category: "Technology",
      subcategories: ["Cybersecurity", "CISA"],
      tags: "Cyber, CISA, Zero-Day, Networking",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      caption: "Cyber threat monitoring operational war room monitoring global distributed exploit attempts.",
      deck: "Network administrators urged to deploy emergency firmware updates preventing unauthorized firmware overwrite attacks."
    },
    {
      title: "Global Maritime Alliance Implements Green Corridors for Zero-Emission Bulk Freighters",
      category: "World",
      subcategories: ["Maritime", "Climate"],
      tags: "Shipping, Green Shipping, IMO, World Trade",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
      caption: "Cargo vessel equipped with automated rigid wind sails gliding across maritime channel.",
      deck: "Green ammonia bunkering stations established across five premier global container transshipment ports."
    },
    {
      title: "National Park Service Implements AI-Driven Wildfire Early Detection Sensor Grids",
      category: "Energy",
      subcategories: ["Conservation", "Wildfires"],
      tags: "Wildfires, AI, Climate, Sensors, Environment",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      caption: "Thermal infrared imaging camera mounted on high-altitude forest ranger lookout tower.",
      deck: "Solar-powered gas and particulate sniffer sensors detect sub-canopy smoldering within six minutes of ignition."
    },
    {
      title: "Biotechnology Researchers Engineer High-Yield Nitrogen-Fixing Cereal Crops",
      category: "Healthcare",
      subcategories: ["Genetics", "Agriculture"],
      tags: "Biotech, Food Security, Crops, Genetics",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80",
      caption: "Experimental greenhouse wheat varieties thriving without synthetic chemical nitrogen fertilizers.",
      deck: "Microbial symbiosis reduces dependence on fossil-fuel-derived synthetic fertilizer while maintaining harvest weight consistency."
    },
    {
      title: "Retail Investors Fuel Surge in Decentralized Prediction Markets on Macro Indicators",
      category: "Markets",
      subcategories: ["Crypto", "Derivatives"],
      tags: "Prediction Markets, Crypto, Macro, Trading",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
      caption: "Cryptocurrency market order book trading screens displaying live conditional contract prices.",
      deck: "Regulated prediction platforms see hundreds of millions in volume hedging inflation prints and congressional voting outcomes."
    },
    {
      title: "Department of Transportation Unveils National Autonomous Trucking Safety Protocols",
      category: "Politics",
      subcategories: ["Transportation", "Safety"],
      tags: "Autonomous Vehicles, Trucking, Safety, DOT",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      caption: "Class-8 commercial semi-truck cruising on interstate with autonomous sensor array.",
      deck: "Uniform federal standards preempt fractured state laws, setting rigorous fail-safe deceleration rules in adverse weather."
    },
    {
      title: "Geothermal Deep-Drilling Breakthrough Unlocks Abundant Baseload Power Everywhere",
      category: "Energy",
      subcategories: ["Geothermal", "Clean Energy"],
      tags: "Geothermal, Clean Energy, Drilling, Innovation",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
      caption: "Millimeter-wave drilling rig vaporizing super-hot crystalline granite rock miles below earth surface.",
      deck: "Contactless thermal beam drilling penetrates twenty kilometers underground to tap constant multi-hundred degree bedrock."
    },
    {
      title: "Global Supply Chains Embrace Nearshoring as Regional Manufacturing Clusters Expand",
      category: "Economy",
      subcategories: ["Manufacturing", "Supply Chains"],
      tags: "Nearshoring, Trade, Factories, Global Economy",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      caption: "High-tech automated manufacturing plant assembling precision industrial electronics.",
      deck: "Proximity to end consumers outweighs cheap offshore labor costs as corporations prioritize inventory agility and resilience."
    },
    {
      title: "Mental Health Digital Therapeutics Receive Landmark Insurance Reimbursement Approval",
      category: "Healthcare",
      subcategories: ["Digital Health", "Insurance"],
      tags: "Mental Health, Digital Health, Therapy, Insurance",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      caption: "Patient using clinical software application designed for cognitive behavioral symptom tracking.",
      deck: "Major commercial insurers extend full coverage to clinically validated digital software programs targeting anxiety and depression."
    },
    {
      title: "Defense Contractors Accelerate Laser Directed-Energy Counter-Drone Field Tests",
      category: "Defense",
      subcategories: ["Directed Energy", "R&D"],
      tags: "Defense, Laser, Military, Counter-Drone",
      image: "https://images.unsplash.com/photo-1517976487507-5b3b4b45f912?auto=format&fit=crop&w=1200&q=80",
      caption: "High-energy fiber-optic laser turret undergoing tracking and neutralization test firing.",
      deck: "Cost per engagement drops from six-figure missile interceptors to mere dollars of electrical energy per neutralized aerial drone."
    },
    {
      title: "Next-Gen Carbon Fiber Production Slashes Aerospace Fabrication Costs by 40%",
      category: "Technology",
      subcategories: ["Materials Science", "Aviation"],
      tags: "Materials Science, Aerospace, Carbon Fiber, Tech",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      caption: "Continuous robotic placement of thermoplastic carbon fiber composite tape on aircraft fuselage.",
      deck: "Novel bio-based polyacrylonitrile precursors lower embodied emissions while retaining ultra-high tensile yield strength."
    },
    {
      title: "Central Banks Explore Tokenized Interbank Deposits for Instant Cross-Border Clearing",
      category: "Finance",
      subcategories: ["Payments", "Tokenization"],
      tags: "FinTech, Banking, Tokenization, Cross-Border",
      image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
      caption: "Banking executives reviewing real-time distributed settlement architecture dashboards.",
      deck: "Shared unified ledger eliminates multi-day correspondent banking delays and credit counterparty risk across currencies."
    },
    {
      title: "Renewable Hydrogen Pipeline Network Gets Regulatory Greenlight Across Gulf Coast",
      category: "Energy",
      subcategories: ["Hydrogen", "Pipelines"],
      tags: "Hydrogen, Clean Energy, Gulf Coast, Infrastructure",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      caption: "Industrial electrolysis plant producing pressurized green hydrogen with solar power.",
      deck: "Converted transmission arteries will transport green hydrogen directly to heavy steel and chemical refineries in Louisiana and Texas."
    },
    {
      title: "Federal Trade Commission Tightens Scrutiny on Subscription Auto-Renewal Dark Patterns",
      category: "Politics",
      subcategories: ["Consumer Protection", "FTC"],
      tags: "FTC, Consumer Rights, Subscriptions, Dark Patterns",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      caption: "FTC headquarters building situated on Pennsylvania Avenue in Washington, D.C.",
      deck: "New enforcement rules require one-click cancellations and prominent pre-charge billing disclosures across digital platforms."
    },
    {
      title: "Global Ocean Freight Operators Deploy Robotic Underwater Hull Cleaning Fleets",
      category: "Economy",
      subcategories: ["Maritime", "Robotics"],
      tags: "Maritime, Robotics, Fuel Efficiency, Shipping",
      image: "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80",
      caption: "Remotely operated autonomous crawling robot scrubbing biofouling off cargo hull.",
      deck: "Removing marine barnacles and algae slime cuts hydrodynamic resistance, saving millions of gallons of heavy fuel per voyage."
    },
    {
      title: "Vascular Surgery Breakthrough: Artificial Smart Stents Self-Regulate Blood Flow",
      category: "Healthcare",
      subcategories: ["Cardiology", "Medical Devices"],
      tags: "Healthcare, Cardiology, Medical Devices, Biotech",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      caption: "Bio-compatible microscopic shape memory alloy stent under electron microscope.",
      deck: "Embedded micro-sensors broadcast real-time arterial pressure fluctuations to physicians' smartphones via secure NFC pulses."
    },
    {
      title: "Private Equity Realignment: Capital Floods into Renewable Energy Storage Infrastructure",
      category: "Markets",
      subcategories: ["Private Equity", "Clean Energy"],
      tags: "Private Equity, Batteries, Storage, Investments",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      caption: "Commercial utility-scale lithium iron phosphate battery storage farm connected to grid.",
      deck: "Investors target predictable cash flows from frequency regulation ancillary services as renewable grid penetration deepens."
    },
    {
      title: "Defense Agencies Partner with Tech Incubators on Edge-Compute Micro-Satellites",
      category: "Defense",
      subcategories: ["Defense Tech", "Satellites"],
      tags: "Defense, Edge AI, Satellites, Space",
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
      caption: "CubeSat constellation undergoing pre-launch optical calibration inside aerospace cleanroom.",
      deck: "On-orbit artificial intelligence models process synthetic aperture radar images before downlinking only actionable threat packets."
    },
    {
      title: "Global Literacy and STEM Education Initiative Powered by Offline AI Classrooms",
      category: "World",
      subcategories: ["Education", "Technology"],
      tags: "Education, AI, Global Development, STEM",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      caption: "Students collaborating with local tablet devices connected to solar-powered local AI hub.",
      deck: "Compact solar-charged localized language models provide personalized curriculum tutoring in remote and developing communities."
    }
  ];

  console.log(`Inserting ${articlesData.length} pending articles...`);

  let count = 0;
  for (let i = 0; i < articlesData.length; i++) {
    const item = articlesData[i];
    const writer = writers[i % writers.length];
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + (Date.now().toString().slice(-4) + i);

    const contentHtml = `
      <p class="font-bold text-lg mb-4">${item.deck}</p>
      <p class="mb-4">As policymakers, market strategists, and international observers monitor the unfolding developments, this strategic milestone marks a significant pivot point in the evolution of ${item.category.toLowerCase()} priorities worldwide.</p>
      <p class="mb-4">Key stakeholders emphasized that the coordinated initiative addresses longstanding structural inefficiencies. According to regulatory filings and briefing papers circulated earlier this week, the comprehensive approach provides unambiguous standards that safeguard both long-term operational resilience and competitive integrity.</p>
      <blockquote class="border-l-4 border-[#d71920] pl-4 italic text-gray-700 my-6">"Our objective has always been clear: to establish enduring mechanisms that stand up to complex global headwinds while fostering sustainable innovation."</blockquote>
      <p class="mb-4">With implementation timelines slated to begin over the coming quarter, industry analysts forecast wide-reaching secondary impacts across affiliated regional ecosystems. As additional oversight milestones approach, follow-up briefings will further elucidate specific benchmark compliance criteria.</p>
    `;

    const subcatsJson = JSON.stringify(item.subcategories);
    const tagsJson = JSON.stringify(item.tags.split(',').map(s => s.trim()));
    const readTime = `${4 + (i % 5)} min read`;
    
    // Stagger dates over the last few days
    const createdDate = new Date(Date.now() - (i * 3600 * 1000 * 2));
    const createdStr = createdDate.toISOString().slice(0, 19).replace('T', ' ');

    await pool.query(
      `INSERT INTO articles (
        writer_email, writer_name, title, slug, deck, content, category, 
        subcategories, tags, read_time, status, rejection_reason, card_summary,
        focus_keyword, meta_description, created_at, updated_at, image,
        image_caption, image_credit, views, comments_count, homepage_placement,
        targeted_email_distribution, is_sponsored
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'None', '', 0)`,
      [
        writer.email,
        writer.name,
        item.title,
        slug,
        item.deck,
        contentHtml,
        item.category,
        subcatsJson,
        tagsJson,
        readTime,
        item.deck,
        item.category,
        item.deck,
        createdStr,
        createdStr,
        item.image,
        item.caption,
        'Reuters / POLITICO',
        Math.floor(Math.random() * 50),
        0
      ]
    );
    count++;
  }

  console.log(`Successfully inserted ${count} pending dummy articles!`);
  await pool.end();
}

seed().catch(err => {
  console.error("Error seeding pending articles:", err);
  process.exit(1);
});
