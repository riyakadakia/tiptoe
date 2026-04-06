import { type Article, type Category } from './types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

const fallbackStories: Record<Category, Article[]> = {
  general: [
    {
      id: 'g1',
      headline: 'Federal Budget Deal Reached After Weeks of Negotiations',
      source: 'Associated Press',
      summary:
        'Congressional leaders announced a bipartisan budget agreement late Tuesday, averting a government shutdown that had been set to begin at midnight. The deal includes funding for domestic programs and border security measures that both parties had long disputed. A vote is expected in the House and Senate before the end of the week.',
      url: '#',
      publishedAt: h(1),
      category: 'general',
    },
    {
      id: 'g2',
      headline: 'Supreme Court Agrees to Hear Major Privacy Case This Term',
      source: 'Reuters',
      summary:
        'The Supreme Court agreed Monday to take up a case that could redefine how much data the government can collect from third-party platforms without a warrant. The case involves location data obtained from a wireless carrier and used in a criminal conviction. A ruling is expected by late June and could affect millions of users.',
      url: '#',
      publishedAt: h(3),
      category: 'general',
    },
    {
      id: 'g3',
      headline: 'Midwest Storm System Leaves Hundreds of Thousands Without Power',
      source: 'The Weather Channel',
      summary:
        'A powerful spring storm swept through the central United States overnight, knocking out power for more than 400,000 homes and businesses across five states. High winds and hail caused widespread damage to infrastructure, with some areas not expected to have power restored for several days. Emergency crews are prioritizing hospitals and shelters.',
      url: '#',
      publishedAt: h(5),
      category: 'general',
    },
    {
      id: 'g4',
      headline: "US Inflation Eases to 3.1%, Lowest Rate in Two Years",
      source: 'Bloomberg',
      summary:
        'The Consumer Price Index rose 3.1 percent year-over-year in March, the lowest reading since early 2022, according to data released Tuesday by the Bureau of Labor Statistics. Falling energy prices and slower rent growth drove most of the deceleration. Fed officials said the data was encouraging but that they needed more months of improvement before cutting interest rates.',
      url: '#',
      publishedAt: h(6),
      category: 'general',
    },
    {
      id: 'g5',
      headline: "Mayor Proposes Largest Public Transit Expansion in City's History",
      source: 'City Tribune',
      summary:
        "The mayor unveiled a $4.2 billion plan to expand the city's subway and bus network, adding 18 new stations and extending three existing lines. The proposal would be funded through a combination of federal grants, a new congestion pricing scheme, and municipal bonds. Public hearings are scheduled to begin next month.",
      url: '#',
      publishedAt: h(8),
      category: 'general',
    },
    {
      id: 'g6',
      headline: 'National Park Service Reports Record Visitor Numbers Last Year',
      source: 'National Geographic',
      summary:
        'The National Park Service hosted more than 325 million visits in the previous year, breaking the record set in 2016. The most popular sites — Yellowstone, Grand Canyon, and Great Smoky Mountains — each saw double-digit growth. Officials are weighing timed entry permits at the busiest parks to reduce overcrowding and protect ecosystems.',
      url: '#',
      publishedAt: h(10),
      category: 'general',
    },
    {
      id: 'g7',
      headline: 'Diplomatic Talks Resume Between US and Regional Partners',
      source: 'Foreign Policy',
      summary:
        'Senior State Department officials met with counterparts from seven allied nations in Geneva to discuss coordinated responses to regional security challenges. The talks, the first in-person gathering of this group in over a year, focused on trade corridors and humanitarian access. A joint statement is expected to be released by end of week.',
      url: '#',
      publishedAt: h(12),
      category: 'general',
    },
    {
      id: 'g8',
      headline: 'Surgeon General Issues New Guidelines on Social Media and Teen Mental Health',
      source: 'NPR',
      summary:
        'The U.S. Surgeon General released updated guidance calling on platforms to implement stronger protections for users under 18, including default content filters and limits on nighttime notifications. The report cited a growing body of research linking heavy social media use to anxiety and depression in adolescents. Several states have already introduced legislation based on earlier drafts.',
      url: '#',
      publishedAt: h(14),
      category: 'general',
    },
    {
      id: 'g9',
      headline: 'EPA Finalizes New Limits on PFAS Chemicals in Drinking Water',
      source: 'The Guardian',
      summary:
        'The Environmental Protection Agency published final rules setting maximum contaminant levels for six PFAS compounds — often called "forever chemicals" — in public drinking water systems. Water utilities will have five years to comply, and the agency estimates the rule will prevent thousands of deaths annually. Industry groups have signaled they plan to challenge the rules in court.',
      url: '#',
      publishedAt: h(16),
      category: 'general',
    },
  ],

  technology: [
    {
      id: 't1',
      headline: 'OpenAI Releases New Model Aimed at Scientific Research',
      source: 'The Verge',
      summary:
        'OpenAI announced a specialized language model designed to assist with scientific literature review, hypothesis generation, and experimental design. The model was trained on a curated corpus of peer-reviewed papers and can cite sources directly within its responses. Early access is being offered to universities and research institutions.',
      url: '#',
      publishedAt: h(2),
      category: 'technology',
    },
    {
      id: 't2',
      headline: 'Google Antitrust Trial Moves Into Remedies Phase',
      source: 'Wired',
      summary:
        "Following last year's ruling that Google illegally maintained its search monopoly, a federal judge is now hearing arguments about what remedies to impose. Government lawyers are seeking structural changes, including potentially forcing Google to divest the Chrome browser. Google argues that behavioral remedies would be sufficient and less disruptive to consumers.",
      url: '#',
      publishedAt: h(3),
      category: 'technology',
    },
    {
      id: 't3',
      headline: 'Apple Announces Major Redesign of iPhone Software at Spring Event',
      source: 'MacRumors',
      summary:
        "Apple previewed a sweeping redesign of iOS with a new home screen layout, updated notification system, and deeper integration of its on-device AI features. The software update is set to ship in the fall alongside new hardware. Developers can access a public beta starting next month.",
      url: '#',
      publishedAt: h(4),
      category: 'technology',
    },
    {
      id: 't4',
      headline: 'Chipmakers Signal Slowdown in Data Center Demand After AI Spending Surge',
      source: 'Reuters',
      summary:
        'Several major semiconductor manufacturers warned investors that orders from cloud providers are moderating after an extraordinary two-year build-out driven by AI infrastructure spending. Analysts say customers are now working through large backlogs of chips before placing new orders. Shares of several chipmakers fell sharply on the news.',
      url: '#',
      publishedAt: h(7),
      category: 'technology',
    },
    {
      id: 't5',
      headline: 'Cybersecurity Agency Warns of Critical Vulnerability in Widely Used Router Firmware',
      source: 'Ars Technica',
      summary:
        'CISA issued an emergency advisory urging businesses and consumers to update firmware on a popular line of home and office routers after researchers discovered a critical remote-code-execution vulnerability. The flaw affects millions of devices and has already been observed in active exploitation. Patches were released by the manufacturer late Monday.',
      url: '#',
      publishedAt: h(9),
      category: 'technology',
    },
    {
      id: 't6',
      headline: 'Electric Vehicle Sales Growth Slows as Early Adopters Reach Saturation',
      source: 'Electrek',
      summary:
        'New electric vehicle registrations grew just 6 percent in the first quarter, down sharply from the 28 percent growth seen a year ago, according to industry data. Analysts attribute the slowdown to the exhaustion of early-adopter demand and persistent concerns about charging infrastructure. Automakers are responding with lower-priced models targeting mainstream buyers.',
      url: '#',
      publishedAt: h(11),
      category: 'technology',
    },
    {
      id: 't7',
      headline: "EU Regulators Open Formal Investigation Into Microsoft's AI Partnerships",
      source: 'Financial Times',
      summary:
        "European competition authorities launched a formal investigation into Microsoft's investments in and agreements with several AI startups, including OpenAI. Regulators are examining whether the arrangements constitute a form of merger that bypasses standard notification rules. Microsoft said it is cooperating fully and that its investments do not confer operational control.",
      url: '#',
      publishedAt: h(13),
      category: 'technology',
    },
    {
      id: 't8',
      headline: 'Researchers Demonstrate Quantum Error Correction Milestone',
      source: 'MIT Technology Review',
      summary:
        'A team at a major research university published results showing they had achieved practical quantum error correction at a scale previously thought to be years away. The experiment used a novel approach to detecting and fixing qubit errors without collapsing the quantum state. Experts say the work is a meaningful step toward fault-tolerant quantum computers.',
      url: '#',
      publishedAt: h(15),
      category: 'technology',
    },
    {
      id: 't9',
      headline: 'FTC Proposes Rule Requiring Clear Disclosure of AI-Generated Content',
      source: 'Politico',
      summary:
        'The Federal Trade Commission released a proposed rule that would require companies to clearly label text, images, audio, and video produced or substantially modified by AI systems. Violations would carry fines of up to $50,000 per incident. The public comment period runs for 60 days before any final rule can be issued.',
      url: '#',
      publishedAt: h(18),
      category: 'technology',
    },
  ],

  business: [
    {
      id: 'b1',
      headline: "Federal Reserve Holds Rates Steady, Signals Caution on Cuts",
      source: 'Wall Street Journal',
      summary:
        'The Federal Reserve left its benchmark interest rate unchanged for the fourth consecutive meeting, citing persistent services inflation and a resilient labor market. Chair Jerome Powell indicated that the committee wants to see several more months of favorable inflation data before cutting. Markets had priced in two cuts this year, and futures prices fell sharply after the announcement.',
      url: '#',
      publishedAt: h(2),
      category: 'business',
    },
    {
      id: 'b2',
      headline: 'Amazon Reports Strong Quarter, Driven by Cloud and Advertising Revenue',
      source: 'CNBC',
      summary:
        'Amazon beat analyst expectations in its latest earnings report, with AWS cloud revenue growing 17 percent year-over-year and advertising revenue up 24 percent. The company also reported its fifth consecutive quarter of improved operating margins. Shares rose more than 8 percent in after-hours trading.',
      url: '#',
      publishedAt: h(4),
      category: 'business',
    },
    {
      id: 'b3',
      headline: 'US Imposes New Tariffs on Steel and Aluminum Imports From Three Countries',
      source: 'Reuters',
      summary:
        'The Biden administration announced new tariffs on steel and aluminum imports from Vietnam, Malaysia, and Thailand, following an investigation that found those countries were routing Chinese products through their ports to avoid existing duties. The tariffs, ranging from 25 to 200 percent, take effect in 30 days. Trading partners called the action "deeply troubling."',
      url: '#',
      publishedAt: h(6),
      category: 'business',
    },
    {
      id: 'b4',
      headline: 'Airline Industry Warns of Overcapacity as Travel Demand Normalizes',
      source: 'Bloomberg',
      summary:
        'Major US carriers are signaling that the post-pandemic travel boom has peaked, with several airlines cutting summer capacity and lowering revenue forecasts. Domestic ticket prices have dropped 12 percent on average compared to last year as airlines compete for a smaller pool of discretionary travelers. Labor costs remain elevated, squeezing margins further.',
      url: '#',
      publishedAt: h(8),
      category: 'business',
    },
    {
      id: 'b5',
      headline: "Grocery Chain's Merger Blocked by Federal Judge on Antitrust Grounds",
      source: 'Associated Press',
      summary:
        "A federal district court judge blocked the proposed merger between the country's two largest grocery chains, ruling that the combination would substantially reduce competition and harm consumers through higher prices. The companies had proposed divesting hundreds of stores to win regulatory approval, but the judge found the remedy insufficient. Both companies said they are evaluating their options.",
      url: '#',
      publishedAt: h(10),
      category: 'business',
    },
    {
      id: 'b6',
      headline: 'Commercial Real Estate Loan Defaults Rise to Decade High',
      source: 'Financial Times',
      summary:
        'The rate of defaults on commercial real estate loans reached its highest level in ten years last quarter, driven by distress in office and retail properties, according to data from the Mortgage Bankers Association. Regional banks with heavy exposure to the sector are drawing increased scrutiny from regulators. Several analysts warned the situation could deteriorate further if interest rates remain elevated.',
      url: '#',
      publishedAt: h(12),
      category: 'business',
    },
    {
      id: 'b7',
      headline: 'Dollar Strengthens as Global Growth Outlook Dims',
      source: 'Economist',
      summary:
        'The US dollar index rose to its highest level in eight months as investors moved into safe-haven assets amid signs of economic slowdown in Europe and China. A stronger dollar makes American exports more expensive and puts pressure on emerging market economies that borrow in US currency. Currency strategists say the trend is likely to continue through mid-year.',
      url: '#',
      publishedAt: h(14),
      category: 'business',
    },
    {
      id: 'b8',
      headline: 'Startup Funding Rebounds in First Quarter After Two Years of Decline',
      source: 'TechCrunch',
      summary:
        'Venture capital funding in the US totaled $47 billion in the first quarter, up 18 percent from the same period a year ago and the first year-over-year increase since 2021. AI-related companies captured nearly 40 percent of total investment. Analysts cautioned that the rebound is concentrated in a narrow set of sectors and that most early-stage startups still face a difficult fundraising environment.',
      url: '#',
      publishedAt: h(16),
      category: 'business',
    },
    {
      id: 'b9',
      headline: 'Auto Industry Pushes Back on Proposed Emissions Standards',
      source: 'Detroit Free Press',
      summary:
        'Major automakers sent a joint letter to the EPA asking for a delay and revision of proposed tailpipe emissions rules they say are technically infeasible given the current pace of EV adoption. The standards would require roughly 56 percent of new vehicle sales to be electric by 2032. Environmental groups urged the agency to hold firm, saying the industry has consistently underestimated transition speed.',
      url: '#',
      publishedAt: h(20),
      category: 'business',
    },
  ],

  science: [
    {
      id: 's1',
      headline: "NASA Confirms Water Ice in Permanently Shadowed Craters Near Moon's South Pole",
      source: 'NASA JPL',
      summary:
        'Using data from the Lunar Reconnaissance Orbiter and new thermal modeling, scientists have confirmed the presence of stable water ice deposits in several permanently shadowed craters near the lunar south pole. The findings strengthen the case for establishing a long-term human presence in the region, where ice could be converted to drinking water and rocket propellant. A crewed landing targeting this area is planned for later this decade.',
      url: '#',
      publishedAt: h(1),
      category: 'science',
    },
    {
      id: 's2',
      headline: 'New Antibiotic Class Effective Against Drug-Resistant Bacteria in Trial',
      source: 'New England Journal of Medicine',
      summary:
        'Clinical trial results published in a leading medical journal show that a new class of antibiotics cleared infections caused by carbapenem-resistant bacteria — among the most dangerous drug-resistant organisms — in 78 percent of patients with severe infections. The drug works by a mechanism distinct from all existing antibiotics, making cross-resistance unlikely. Regulatory review is expected to begin later this year.',
      url: '#',
      publishedAt: h(3),
      category: 'science',
    },
    {
      id: 's3',
      headline: 'Scientists Sequence Complete Genome of Ancient Human Lineage',
      source: 'Nature',
      summary:
        'Researchers have assembled a near-complete genome from a 200,000-year-old fossil discovered in a cave in central Europe, representing a previously unknown branch of the human family tree. The genome shows evidence of interbreeding with both Neanderthals and early modern humans. The findings complicate existing models of human migration and evolution.',
      url: '#',
      publishedAt: h(5),
      category: 'science',
    },
    {
      id: 's4',
      headline: 'Global Ocean Temperatures Reach Record High for Fourteenth Consecutive Month',
      source: 'Climate Central',
      summary:
        'Sea surface temperatures broke records for the fourteenth month in a row, according to data from the Copernicus Climate Change Service. Scientists say the sustained anomaly is being driven by a combination of long-term climate change and a strong El Niño event. The elevated temperatures are linked to increased hurricane intensity, coral bleaching, and disruption of marine food chains.',
      url: '#',
      publishedAt: h(7),
      category: 'science',
    },
    {
      id: 's5',
      headline: 'Fusion Energy Startup Achieves Sustained Plasma for Record Duration',
      source: 'Science Magazine',
      summary:
        'A private fusion company announced it had maintained a stable plasma state for 47 seconds — nearly double the previous record for a compact tokamak design. The experiment did not produce net energy but demonstrated the plasma control needed before energy-positive reactions can be attempted. Investors have poured more than $2 billion into the company over the past three years.',
      url: '#',
      publishedAt: h(9),
      category: 'science',
    },
    {
      id: 's6',
      headline: "James Webb Telescope Finds Evidence of Carbon Dioxide in Exoplanet's Atmosphere",
      source: 'Space.com',
      summary:
        "Astronomers using the James Webb Space Telescope have detected carbon dioxide in the atmosphere of a rocky exoplanet about 40 light-years away, the first confirmed detection of this molecule on an Earth-sized world outside our solar system. The planet orbits within its star's habitable zone, though researchers caution that CO₂ alone does not indicate the presence of life. Follow-up observations are planned to search for other biosignature gases.",
      url: '#',
      publishedAt: h(11),
      category: 'science',
    },
    {
      id: 's7',
      headline: 'Study Links Ultra-Processed Food Consumption to Accelerated Brain Aging',
      source: 'JAMA Neurology',
      summary:
        'A large longitudinal study following more than 30,000 adults found that those who derived more than 20 percent of their daily calories from ultra-processed foods showed measurably faster cognitive decline over a decade compared to those who ate less. The association held even after controlling for other dietary factors, physical activity, and socioeconomic status. Researchers say the mechanisms are not yet understood but may involve systemic inflammation.',
      url: '#',
      publishedAt: h(13),
      category: 'science',
    },
    {
      id: 's8',
      headline: 'Arctic Permafrost Thawing Faster Than Models Predicted, Study Warns',
      source: 'Science Advances',
      summary:
        'A new study using satellite measurements and ground sensors found that Arctic permafrost is thawing at a rate 30 to 50 percent faster than the best-available climate models projected. As permafrost thaws, it releases stored carbon as methane and CO₂, potentially accelerating warming in a feedback loop. The findings have prompted calls to revise carbon budget estimates used in international climate negotiations.',
      url: '#',
      publishedAt: h(17),
      category: 'science',
    },
    {
      id: 's9',
      headline: "mRNA Vaccine Platform Shows Promise Against Aggressive Pancreatic Cancer",
      source: 'The Lancet',
      summary:
        "Early trial results show that a personalized mRNA vaccine, similar in design to COVID-19 vaccines, produced immune responses in 16 of 18 patients with pancreatic cancer — one of the deadliest forms of the disease. Patients who received the vaccine alongside standard chemotherapy had significantly longer periods without disease progression. A larger phase-two trial is now enrolling patients at multiple centers.",
      url: '#',
      publishedAt: h(20),
      category: 'science',
    },
  ],

  health: [
    {
      id: 'h1',
      headline: 'FDA Approves First Drug to Slow Progression of a Common Form of Blindness',
      source: 'STAT News',
      summary:
        'The Food and Drug Administration granted approval to a new injection therapy for geographic atrophy, the advanced form of age-related macular degeneration that affects more than a million Americans. Clinical trials showed the drug slowed the rate of vision loss by about 25 percent compared to a placebo. It is the first approved treatment targeting the underlying progression of the disease rather than its symptoms.',
      url: '#',
      publishedAt: h(2),
      category: 'health',
    },
    {
      id: 'h2',
      headline: 'GLP-1 Drugs Show Cardiovascular Benefits Beyond Weight Loss in Large Trial',
      source: 'New England Journal of Medicine',
      summary:
        'A major cardiovascular outcomes trial found that patients taking a GLP-1 receptor agonist had a 20 percent reduction in heart attacks and strokes compared to placebo, independent of how much weight they lost. The finding suggests the drugs may have direct protective effects on the heart and blood vessels. Researchers say the results could reshape guidelines for treating patients at high cardiovascular risk.',
      url: '#',
      publishedAt: h(4),
      category: 'health',
    },
    {
      id: 'h3',
      headline: 'CDC Reports Measles Cases at Highest Level in 25 Years',
      source: 'Associated Press',
      summary:
        'The Centers for Disease Control and Prevention reported more than 800 measles cases nationally so far this year, the highest number since 2000 when the disease was declared eliminated in the United States. The surge is driven by clusters in under-vaccinated communities across several states. Health officials are urging parents to ensure children have received both doses of the MMR vaccine.',
      url: '#',
      publishedAt: h(5),
      category: 'health',
    },
    {
      id: 'h4',
      headline: 'New Sleep Guidelines Recommend Seven to Nine Hours for Adults of All Ages',
      source: 'American Academy of Sleep Medicine',
      summary:
        'Updated clinical guidelines released by sleep medicine specialists reaffirm that adults of all ages need between seven and nine hours of sleep per night for optimal health. The guidelines add new language warning against weekend "catch-up" sleep as a substitute for consistent nightly rest. The panel also addressed specific recommendations for shift workers and travelers crossing multiple time zones.',
      url: '#',
      publishedAt: h(8),
      category: 'health',
    },
    {
      id: 'h5',
      headline: 'Long COVID Clinic Waitlists Stretch to Six Months in Major Cities',
      source: 'Washington Post',
      summary:
        'Specialized long COVID clinics in New York, Los Angeles, and Chicago are reporting wait times of up to six months for new patients, even as federal funding for research and treatment has declined. Patients describe difficulty getting diagnoses accepted by insurers and primary care doctors unfamiliar with the condition. Advocates are calling on Congress to restore funding cut in the last budget cycle.',
      url: '#',
      publishedAt: h(10),
      category: 'health',
    },
    {
      id: 'h6',
      headline: 'Study Finds Strength Training Twice Weekly Cuts Dementia Risk by 18 Percent',
      source: 'British Journal of Sports Medicine',
      summary:
        'A meta-analysis covering more than 400,000 participants found that adults who engaged in muscle-strengthening activities at least twice a week had an 18 percent lower risk of developing dementia compared to inactive adults. The benefit was observed even at modest intensities and held across age groups and sexes. Researchers say the mechanism may involve improved blood flow and reduced neuroinflammation.',
      url: '#',
      publishedAt: h(12),
      category: 'health',
    },
    {
      id: 'h7',
      headline: 'Insurers Quietly Narrowing Mental Health Provider Networks, Report Finds',
      source: 'Kaiser Health News',
      summary:
        'An investigation by a health policy nonprofit found that major insurance companies have been reducing the number of in-network mental health providers without public disclosure, effectively increasing costs and wait times for patients seeking therapy or psychiatric care. The report documented cases in which listed providers were unavailable or no longer in-network. Federal parity law requires mental health coverage equivalent to physical health, but enforcement remains limited.',
      url: '#',
      publishedAt: h(14),
      category: 'health',
    },
    {
      id: 'h8',
      headline: 'US Life Expectancy Rises for Second Consecutive Year After Pandemic Drop',
      source: 'CDC',
      summary:
        'Americans born in 2024 can expect to live to an average age of 78.4 years, up from 77.5 the prior year, according to new data from the National Center for Health Statistics. The two-year recovery has closed about half the gap opened by the COVID-19 pandemic, which caused the sharpest drop in US life expectancy since World War II. Drug overdose deaths and heart disease mortality both declined in the latest reporting period.',
      url: '#',
      publishedAt: h(16),
      category: 'health',
    },
    {
      id: 'h9',
      headline: 'Hospital Groups Sue Over Medicare Reimbursement Rate Cuts',
      source: 'Modern Healthcare',
      summary:
        'A coalition of hospital associations filed suit in federal court challenging Medicare reimbursement rate cuts set to take effect next quarter. The groups argue the cuts were calculated using flawed data and will force rural and safety-net hospitals to reduce services or close. The Centers for Medicare and Medicaid Services said the methodology is sound and consistent with existing law.',
      url: '#',
      publishedAt: h(19),
      category: 'health',
    },
  ],
};

export default fallbackStories;
