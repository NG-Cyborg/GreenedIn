export type Lesson = {
  id: string;
  title: string;
  duration: string;
  content: string;
};

export type Course = {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lessons: number;
  imageKey: string;
  description: string;
  lessonList: Lesson[];
};

export const courses: Course[] = [
  {
    id: "c01",
    title: "Precision Poultry Nutrition & Feed Formulation",
    instructor: "GreenedIn Poultry Team",
    duration: "2h 30min",
    level: "Intermediate",
    category: "Poultry",
    lessons: 4,
    imageKey: "poultry",
    description:
      "Feed represents up to 70% of total operational costs in poultry farming. This course equips enterprise managers with the core scientific principles required to formulate high-efficiency, cost-optimized rations across a flock's life cycle — from chick starter to layer mash.",
    lessonList: [
      {
        id: "c01-l01",
        title: "Life-Stage Nutritional Dynamics",
        duration: "35min",
        content: `Feed formulation must align with three metabolic windows in a bird's life. Each stage has unique protein and mineral requirements.

**Chick Starter (0–8 Weeks)**
This stage is focused on rapid bone development and immune system priming. The target crude protein level is 18%–20%. High-quality protein at this stage ensures strong skeletal structure and sets the foundation for productive adult performance.

**Grower (9–18 Weeks)**
Focused on controlled framing and fat regulation. Protein drops to a medium target of 15%–17% to prevent premature onset of lay. Overfeeding protein at this stage leads to excessive body fat, which reduces egg production efficiency later.

**Layer Mash (19+ Weeks)**
Tailored for sustained reproductive output. Targets 16%–18% crude protein with significantly enhanced calcium content. Calcium is the single most critical macro-mineral for egg production — without it, the hen must draw from her own skeleton.

**Key Principle:** Never rush layer mash. Introducing it before Week 18 can trigger premature egg laying, leading to prolapse and permanently reduced production capacity.`,
      },
      {
        id: "c01-l02",
        title: "Raw Material Allocation Framework",
        duration: "40min",
        content: `The standard benchmark for precision feed blending is a 100 kg batch. This simplifies scale-up, micro-ingredient measurement, and auditing for farm staff.

**Standard Ingredient Profile per 100 kg batch:**

| Ingredient | Chick Starter | Grower | Layer Mash |
|---|---|---|---|
| Maize (Energy Base) | 54.0 kg | 57.0 kg | 50.0 kg |
| Soya Bean Meal (Protein) | 28.0 kg | 22.0 kg | 20.0 kg |
| Fish Meal (Animal Protein) | 8.0 kg | 5.0 kg | 4.0 kg |
| Wheat Bran (Fiber) | 5.0 kg | 10.0 kg | 10.0 kg |
| Limestone (Calcium) | 1.0 kg | 1.0 kg | 9.0 kg |
| DCP (Dicalcium Phosphate) | 2.0 kg | 2.0 kg | 2.0 kg |
| Premix (Vitamins/Minerals) | 0.5 kg | 0.5 kg | 0.5 kg |
| Salt (Electrolytes) | 0.3 kg | 0.3 kg | 0.3 kg |
| Lysine (Amino Acid) | 0.1 kg | 0.1 kg | 0.1 kg |
| Methionine (Amino Acid) | 0.1 kg | 0.1 kg | 0.1 kg |
| **Total** | **100.0 kg** | **100.0 kg** | **100.0 kg** |

**Field Note:** Maize forms the energy backbone of all three rations. Soya Bean Meal provides the primary plant protein, while Fish Meal adds superior digestible animal protein with excellent amino acid profiles. Never substitute Fish Meal with low-grade alternative proteins without adjusting total amino acid balances.`,
      },
      {
        id: "c01-l03",
        title: "The Calcium and Macro-Mineral Shift",
        duration: "30min",
        content: `The most critical nutritional transition in layer farming occurs at the onset of egg production.

**Why Calcium Spikes in Layer Mash**
Eggshell manufacturing demands massive active calcium reserves. Note the 900% surge in Limestone — from 1 kg in the Grower phase to 9 kg in Layer Mash. This is not optional.

Failing to meet this calcium requirement forces the hen to mobilize calcium from her own skeleton. This leads to:
- Cage fatigue and reduced mobility
- Hairline bone fractures that go undetected until mortality
- Soft-shelled or shell-less eggs that break in the nest
- Permanent reduction in peak production rates

**Target Nutrient Summary:**
- STARTER: Protein 18–20% | Calcium 0.9–1.1% | Purpose: Structural Growth
- GROWER: Protein 15–17% | Calcium 0.9–1.0% | Purpose: Weight & Frame Management
- LAYER MASH: Protein 16–18% | Calcium 3.5–4.5% | Purpose: Sustained Lay & Eggshell Strength

**Phosphorus Balance:** For every gram of calcium, approximately 0.35–0.40 g of available phosphorus must also be present. DCP (Dicalcium Phosphate) serves this dual function. Do not over-supplement phosphorus — excess causes kidney damage and urinary tract disorders.`,
      },
      {
        id: "c01-l04",
        title: "Blending and Micro-Dosing Protocols",
        duration: "45min",
        content: `Proper blending technique is as critical as the formulation itself. Uneven mixing leads to some birds receiving excess nutrients while others receive deficiencies — both are harmful.

**Step-by-Step Mixing Protocol:**

1. Pre-mix micro-ingredients (Lysine, Methionine, Salt, and Premix) with a small quantity of Maize — approximately 3–5 kg — before adding to the main batch. This ensures uniform distribution of low-dose but critical components.

2. Crush maize to a uniform medium grit. Fine milling decreases feed palatability, causes respiratory irritation from fine dust, and reduces pellet binding quality. Coarse grinding improves gizzard development in young birds.

3. Add Limestone last, after all protein ingredients are blended. This prevents the high-alkalinity limestone from disrupting enzyme activity in the premix during mixing.

4. Always run the mixer for a minimum of 8 minutes after the last ingredient is added. Under-mixing is the most common cause of inconsistent bird performance across a flock.

**Storage Principles:**
- Store completed rations in sealed, dry containers away from direct sunlight.
- Never store feed for more than 3 weeks — mycotoxin growth from mold rapidly degrades nutrient quality.
- If feed smells musty or shows clumping, discard the entire batch. Mycotoxins suppress immunity, depress growth, and are invisible to the naked eye.

**Cost Optimization Tip:** In periods of high maize prices, sorghum can substitute up to 30% of maize on a dry matter equivalent basis without significantly affecting performance. Ensure sorghum is tannin-free or low-tannin varieties only.`,
      },
    ],
  },
  {
    id: "c02",
    title: "Pullet Health & Vaccination Architecture",
    instructor: "GreenedIn Veterinary Team",
    duration: "2h 15min",
    level: "Intermediate",
    category: "Poultry",
    lessons: 4,
    imageKey: "poultry",
    description:
      "Rearing commercial replacement layers requires strict preventative biosecurity from day one. This course provides a professional-grade healthcare schedule mapping day-to-day management from bird arrival through the onset of production at Week 20.",
    lessonList: [
      {
        id: "c02-l01",
        title: "The Critical Brooding Window (Days 1–10)",
        duration: "35min",
        content: `The first 10 days after placement are the most vulnerable period in a pullet's life. Mistakes made here compound into permanent production deficits.

**Day 1 — Arrival Protocol**
Administer Glucose and Multivitamins dissolved in clean drinking water within the first 2 hours of placement. This restores the electrolyte balance depleted during transit and accelerates yolk sac absorption — the primary nutrition source for chicks in their first 48 hours.

Check that water lines are pre-filled and at correct nipple pressure. A chick that cannot find water in its first 6 hours suffers irreversible dehydration stress.

**Days 2–4 — Prophylactic Antibiotics**
Broad-spectrum antibiotics combined with vitamins are administered orally to cover baseline transportation-related bacterial exposure. Birds are exposed to diverse microbial environments during hatchery-to-farm transit. This window closes potential early-mortality events.

**Day 5 — Marek's Disease Vaccination**
Marek's Disease Vaccine prevents neoplastic (cancerous) cell proliferation caused by a highly contagious herpesvirus. This vaccine is administered as an injection or spray. Failure to vaccinate at Day 5 leaves birds permanently susceptible — Marek's has no treatment, only prevention.

**Brooding Temperature Targets:**
- Day 1: 32–34°C directly under brooder
- Week 1 end: 30–32°C
- Reduce by 2–3°C per week until reaching 18–20°C ambient house temperature
- Watch chick behavior, not just thermometers. Huddling = too cold. Spreading away from heat = too hot.`,
      },
      {
        id: "c02-l02",
        title: "Weeks 1–4 Vaccination Timeline",
        duration: "35min",
        content: `The early vaccination schedule builds layered viral immunity before exposure risk increases.

**Full Day-by-Day Schedule (Days 1–31):**

| Day | Protocol | Purpose |
|---|---|---|
| Day 1 | Glucose + Multivitamins (Oral) | Rehydration & Energy |
| Days 2–4 | Antibiotics + Vitamins (Oral) | Bacterial Prophylaxis |
| Day 5 | Marek's Disease Vaccine | Marek's Herpesvirus |
| Day 6 | Vitamins Only | Immune Support |
| Days 7–9 | Anticoccidial + Vitamins | Coccidiosis Prevention |
| Day 10 | Gumboro Vaccine — 1st Dose (IBD) | Infectious Bursal Disease |
| Day 11 | Vitamins (Vitamix / Vitalyte) | Post-Vaccine Stress Recovery |
| Day 12 | Infectious Bronchitis Vaccine — 1st Dose | Respiratory Coronaviral Defense |
| Days 13–14 | Vitamins Only | Systemic Conditioning |
| Days 15–17 | Anticoccidial / Anti-Bacterial Therapy | Intestinal Health Integrity |
| Day 18 | Vitamins Support | Metabolic Optimization |
| Day 19 | LaSota Vaccine — 1st Dose | Newcastle Disease |
| Day 20 | Vitamins Therapy | Stress Management |
| Days 21–25 | Anti-CRD Treatment | Chronic Respiratory Disease |
| Day 26 | Gumboro Vaccine — 2nd Dose | IBD Booster |
| Day 27 | Vitamins Support | Recovery Phase |
| Days 28–31 | Antibiotics + Vitamins | Secondary Infection Coverage |

**Critical Rule:** Never vaccinate stressed or sick birds. Vaccination of compromised birds produces weak immune responses and can accelerate disease spread. Always monitor feed and water consumption as the primary health proxy — a 10% drop in water intake is an early warning sign.`,
      },
      {
        id: "c02-l03",
        title: "Weeks 5–13 Booster Schedule",
        duration: "30min",
        content: `After the initial foundation vaccines, the booster schedule builds lasting immunity for the 72-week production cycle ahead.

**Weeks 5–13 Protocol:**

| Age | Protocol | Target Pathology |
|---|---|---|
| Days 32–37 | LaSota Vaccine — 2nd Dose | Newcastle Disease Booster |
| Day 38 | Infectious Bronchitis Vaccine — 2nd Dose | Respiratory Booster |
| Days 39–42 | Anticoccidial + Vitamins | Intestinal Parasitism Shift |
| Day 43 | Deworming Therapy (1-Day) | Nematode & Helminth Control |
| Week 7 | Newcastle Disease Komarov (Injectable) + Fowlpox Vaccine | Systemic Viral Shielding |
| Week 8 | Fowl Typhoid Vaccine — 1st Dose | Salmonella gallinarum Control |
| Week 9 | Anticoccidial + Vitamins | Intestinal Monitoring |
| Weeks 9–10 | LaSota Booster in Water | Sustained Newcastle Immunity |
| Week 11 | Debeaking Management | Cannibalism & Feed Waste Prevention |
| Week 12 | Anti-CRD + Vitamins | Respiratory Clearance |
| Weeks 12–13 | Fowl Typhoid Vaccine — 2nd Dose | Long-Term Salmonellosis Shield |

**Fowlpox Note:** Fowlpox spreads through mosquito bites and contact with infected birds. It is particularly devastating in open-sided housing during rainy seasons when insect vectors are abundant. The injectable Komarov vaccine at Week 7 provides 6–9 months of dual Newcastle and Fowlpox protection.`,
      },
      {
        id: "c02-l04",
        title: "Pre-Production Finalization (Weeks 14–20)",
        duration: "35min",
        content: `The final weeks before peak lay require specific interventions to ensure birds enter production healthy, well-immunized, and free of parasites.

**Weeks 14–20 Schedule:**

| Age | Protocol | Purpose |
|---|---|---|
| Week 14 | 2-Day Strategic Deworming | Gastrointestinal Clearing |
| Week 15 | Plain Clean Water Only | Kidney Flushing Window |
| Weeks 15–16 | Anticoccidial + Vitamins | Pre-Lay Intestinal Guard |
| Weeks 16–17 | Komarov Oil-Based Inactivated Vaccine (Injectable) | Peak Lay Viral Protection |
| Week 18 | Antibiotics + Vitamins (5-Day Course) | Pre-Lay Systemic Cleanse |
| Weeks 19–20 | Anticoccidial + Vitamins | Final Field Transition |

**The Kidney Flush at Week 15**
Pure water only for one full week before Weeks 16–17 vaccination allows the renal system to clear any residual antibiotic metabolites and reduce uric acid buildup. This is especially critical for birds housed in warm climates with lower water turnover.

**Core Management Directives:**
- Source chicks exclusively from certified, disease-free hatcheries. One infected batch can compromise an entire farm for months.
- Isolate sick birds immediately to a pen positioned downstream from the main air current — never upstream.
- Maintain a farm log recording every administration, batch number, and bird response. This is your most important diagnostic tool during an outbreak.
- At Week 20, birds should weigh 1.5–1.7 kg for most commercial layer breeds, have full feathering, and be showing the first signs of comb reddening — which precedes first egg by approximately 2 weeks.`,
      },
    ],
  },
  {
    id: "c03",
    title: "Avian Visual Diagnostics & Pathology",
    instructor: "GreenedIn Veterinary Team",
    duration: "1h 45min",
    level: "Advanced",
    category: "Poultry",
    lessons: 3,
    imageKey: "poultry",
    description:
      "Early identification of clinical pathology protects large-scale operations from catastrophic flock losses. This course trains operators to use droppings analysis as an instant, non-invasive diagnostic methodology — learning to spot early-stage health changes before symptoms spread across the flock.",
    lessonList: [
      {
        id: "c03-l01",
        title: "Intestinal Protozoan & Haemorrhagic Syndromes",
        duration: "35min",
        content: `Intestinal damage presents as distinct visual changes in droppings long before behavioral symptoms emerge. Flock-wide damage is often underway for 24–48 hours before mortality spikes are visible. Prompt fecal inspection is your first and fastest diagnostic tool.

**Coccidiosis — The Primary Hemorrhagic Threat**

Coccidiosis is caused by Eimeria protozoa that attack and destroy the intestinal lining. Visual presentation varies by species:

- **Bloody / Bright Red Feces:** Classic sign of intestinal coccidiosis. Caused by severe cellular destruction of intestinal villi in the mid-gut. Demands immediate treatment with Amprolium or Toltrazuril administered in drinking water across the entire flock.

- **Chocolate-Brown / Dark Red Feces:** Pathognomonic (definitive indicator) for Cecal Coccidiosis caused by Eimeria tenella. This species targets the ceca — two blind pouches at the end of the intestine. Indicates upper-intestinal bleeding and tissue sloughing. Mortality risk is extreme if untreated within 48 hours.

- **Mucus-Mixed Feces:** Corresponds to early-stage Enteritis or initial coccidial challenges before full hemorrhage occurs. This is your actionable early warning. Begin monitoring water consumption and reduce stocking density stress immediately.

**Response Protocol for Red Feces:**
1. Remove litter samples from 5 different spots across the shed floor.
2. Examine under natural light — bright red is an emergency.
3. Treat the entire flock that day, not just visibly sick birds.
4. Rehydrate with electrolytes alongside anticoccidials.
5. Repeat treatment for 3–5 days until feces normalize.`,
      },
      {
        id: "c03-l02",
        title: "Systemic Diagnostic Matrix",
        duration: "35min",
        content: `Each fecal presentation links to a specific underlying pathology. This matrix is your rapid-reference field guide.

**Complete Visual Diagnostic Table:**

| Fecal Presentation | Primary Diagnosis | Pathogen Type | Action Protocol |
|---|---|---|---|
| Bloody / Red | Coccidiosis (Intestinal) | Protozoan | Emergency Anticoccidial |
| Chocolate-Brown | Cecal Coccidiosis (E. tenella) | Protozoan | Flock-Wide Medication |
| White / Chalky | Gumboro (IBD) / Metabolic Kidney Disease | Viral / Metabolic | Electrolytes / Isolation |
| Bright Green | Newcastle Disease / Avian Influenza / Septicemia | Viral / Bacterial | Quarantine & Vet Testing |
| Yellow | Histomoniasis / Salmonellosis | Protozoan / Bacterial | Targeted Antimicrobials |
| Foamy / Aerated | Salmonellosis / Clostridial Enteritis | Bacterial | Intestinal Disinfection |
| Undigested Feed | Malabsorption Syndrome | Metabolic / Viral | Enzyme Support & Ration Review |
| Mucus-Mixed | Early Enteritis / Early Coccidiosis | Bacterial Baseline | Probiotics & Gut Flush |
| Dark Green | Acute Liver Disease / Systemic Toxicosis | Toxin / Organ Failure | Mycotoxin Binder Application |
| Watery / Pasty | Nephropathogenic Infectious Bronchitis (IB) | Viral Strain | Thermoregulation Assessment |

**Reading Multiple Presentations Together**
Real-world fecal presentations are rarely pure. A common combined presentation is bloody feces alongside white urate deposits — suggesting concurrent coccidiosis AND kidney stress, possibly from poor ventilation or high-density ammonia buildup. Always look at the whole picture.`,
      },
      {
        id: "c03-l03",
        title: "Clinical Interpretations & Biosecurity Responses",
        duration: "35min",
        content: `Fecal inspection must always be paired with overall behavioral assessments. A single abnormal dropping is a data point. Five or more in one inspection walk is an outbreak signal.

**Interpreting Key Presentations:**

**Chalky White Droppings**
Point to severe urate accumulation — the avian equivalent of kidney failure. Two primary causes:
- Viral destruction of the bursa (Gumboro / IBD) disrupting immune-kidney function
- Renal failure from chronic poor ventilation, toxic ammonia levels, or contaminated feed

In both cases, mortality escalates quickly. Isolate affected birds, ensure maximum ventilation, and provide electrolyte therapy.

**Bright Green Droppings**
Indicate severe systemic bile buildup. This happens when major viral infections — particularly Newcastle Disease — cause birds to stop eating entirely. With an empty digestive tract, concentrated bile flows through undigested, producing vivid green coloration.

The critical distinction: if bright green droppings appear alongside nervous symptoms (twisted necks, walking in circles, sudden prostration) or sudden mortality spikes in multiple sections of the shed — this is a Newcastle Disease emergency.

**Biosecurity Emergency Protocol for Bright Green + Nervous Signs:**
1. Immediately quarantine the entire affected house. Lock doors.
2. Do not transport or sell any birds from the premises.
3. Contact a state veterinary officer or licensed veterinarian within hours.
4. Apply footbaths at all entry/exit points.
5. Do not share equipment — water lines, feeders, crates — between houses until clearance.

Newcastle Disease is a notifiable disease in most African countries. Failure to report is a serious legal and public health violation.

**Foamy / Aerated Droppings**
Indicate active Clostridial Enteritis or Salmonella. Clostridium perfringens produces gas as it ferments intestinal contents. Treat with Metronidazole or Penicillin-based antibiotics and apply intestinal disinfection protocols.

**Daily Inspection Habit**
Walk through your shed every morning before feeding. Observe feces, behavior, and feed/water consumption together. This 10-minute daily habit prevents 80% of flock emergencies by catching problems before they spread.`,
      },
    ],
  },
  {
    id: "c04",
    title: "Accelerated Broiler Production & Optimization",
    instructor: "GreenedIn Poultry Team",
    duration: "2h 00min",
    level: "Intermediate",
    category: "Poultry",
    lessons: 3,
    imageKey: "poultry",
    description:
      "Broiler production requires a high-velocity management style focused on maximizing feed conversion efficiency within a tight 6-week window. This course provides a complete medication, vaccination, and support protocol designed to achieve target slaughter weights safely and efficiently.",
    lessonList: [
      {
        id: "c04-l01",
        title: "The 42-Day Broiler Program (Days 1–42)",
        duration: "40min",
        content: `Broiler farming operates on a strict 42-day cycle. Every day of suboptimal management costs you in final live weight and feed conversion. This schedule is the operational backbone of a profitable commercial broiler enterprise.

**Complete Medication & Vaccination Schedule:**

| Day | Protocol | Administration |
|---|---|---|
| Day 1 | Glucose & Multivitamin Solution | Oral — First 12 hours post-placement |
| Days 2–5 | Prophylactic Broad-Spectrum Antibiotics | Oral — Prevent early chick mortality |
| Day 6 | Multivitamin Support Solution | Oral — Stabilize immune recovery |
| Day 7 | Quality Unmedicated Drinking Water | Oral — Systemic physiological flushing |
| Day 8 | 1st Gumboro Vaccine (IBD) | Oral — Targeted bursal defense |
| Day 9 | Multivitamin Post-Vaccination Sweep | Oral — Sustained weight gain catalyst |
| Days 10–13 | Anticoccidial Preventive Block | Oral — Mid-brooding intestinal shield |
| Days 14–15 | Multivitamin Solution Block | Oral — Metabolic optimization |
| Day 16 | 1st LaSota Vaccine (Newcastle Disease) | Oral — Primary systemic viral barrier |
| Days 17–19 | Multivitamin Maintenance Line | Oral — Skeletal expansion support |
| Days 20–21 | Quality Unmedicated Drinking Water | Oral — Renal clearing window |
| Day 22 | 2nd Gumboro Vaccine (Booster) | Oral — Final IBD lockdown phase |
| Day 23 | Multivitamin Stress Minimizer Course | Oral — Post-vaccinal recovery |
| Days 24–26 | 2nd Antibiotic Prophylactic Block | Oral — Respiratory protection sweep |
| Day 27 | Multivitamin Growth Formulation | Oral — Muscle mass optimization |
| Day 28 | Quality Unmedicated Drinking Water | Oral — Systemic clearing |
| Day 29 | 2nd LaSota Vaccine (Booster) | Oral — Final Newcastle protection |
| Days 30–33 | High-Density Multivitamin Solution | Oral — Accelerated meat-weight finish |
| Days 34–42 | Pure Drinking Water / Multivitamin Only | Oral — Strict Chemical Withdrawal Phase |

**Performance Targets by Week:**
- Week 1 end: 180–200 g live weight
- Week 2 end: 450–500 g live weight
- Week 3 end: 900–1,000 g live weight
- Week 6 end (slaughter): 2.2–2.6 kg live weight`,
      },
      {
        id: "c04-l02",
        title: "Chemical Withdrawal — The Final 8 Days",
        duration: "30min",
        content: `Days 34–42 represent the most critical period for meat safety and quality. This phase directly determines your product's compliance with commercial food safety standards.

**Why Withdrawal Is Non-Negotiable**

When antibiotics, coccidiostats, or synthetic growth promoters are consumed by a bird in its final days before slaughter, residues remain detectable in muscle tissue, liver, and kidneys. These residues:

1. **Pose consumer health risks** — Antibiotic residues in meat contribute directly to the development of antibiotic-resistant bacteria in human populations.

2. **Fail laboratory testing** — Commercial processors and export buyers routinely test carcasses. A single positive test result causes batch rejection, financial penalties, and permanent contract blacklisting.

3. **Violate local and international food safety law** — In Nigeria, Kenya, South Africa, and most African markets, antibiotic withdrawal periods are legally mandated. Violations attract prosecution and farm closure.

**What Is Permitted During Withdrawal:**
- Pure, clean, cool drinking water at all times
- Low-dose multivitamins that carry no withdrawal requirements
- Organic acidifiers (apple cider vinegar at 1 ml/litre) for gut health maintenance

**What Is Strictly Prohibited:**
- Any antibiotic (injectable or water-soluble)
- Synthetic coccidiostats (Amprolium, Toltrazuril, Salinomycin)
- Any hormonal growth promoters

**Record Keeping:** Maintain a written withdrawal record specifying the date the last chemical treatment was administered. This document protects you legally and operationally in the event of a buyer audit.`,
      },
      {
        id: "c04-l03",
        title: "Maximizing Feed Conversion Efficiency (FCR)",
        duration: "50min",
        content: `Feed Conversion Ratio (FCR) is the single most important metric in broiler production. FCR measures how many kilograms of feed are required to produce one kilogram of live weight gain.

**FCR Formula:**
FCR = Total Feed Consumed (kg) ÷ Total Live Weight Gained (kg)

A good commercial FCR for broilers is 1.6–1.8. An FCR above 2.0 signals significant management inefficiency.

**Top Factors That Damage FCR:**

**1. Water Restriction**
This is the most underestimated problem on African farms. Broilers drink 1.8–2.2 times more water than the weight of feed they consume. A 10% reduction in water intake directly reduces feed intake by 10% — and growth rate by 6–7%.

Check nipple pressure and line flow rate daily. A clogged nipple serving 10 birds can set back an entire pen.

**2. Feed Freshness and Timing**
Provide fresh feed during the cooler parts of the day — before 8 AM and after 5 PM in tropical climates. Broilers in heat stress eat less, drink more, and convert inefficiently. Nighttime feeding windows (with supplemental lighting) during weeks 5–6 can add 80–120 g of additional live weight per bird.

**3. Feeder and Drinker Space**
- Minimum feeder space: 2.5 cm per bird for pan feeders
- Minimum nipple drinker: 1 nipple per 8–10 birds
- Reduce pan height progressively as birds grow to minimize feed wastage

**4. Litter Quality**
Wet litter increases ammonia levels, which irritates the respiratory tract and reduces feed intake. Target litter moisture below 30%. Improve ventilation before adding fresh litter — new litter on a wet floor absorbs moisture and worsens within 48 hours.

**5. Temperature Management**
Broilers perform best at 18–22°C in weeks 4–6. Every 1°C above 28°C reduces feed intake by approximately 1.5%. Install shade netting, evaporative cooling pads, or tunnel ventilation on high-heat farms.

**Practical Weekly FCR Check:**
Weigh a sample of 40–50 birds (from at least 4 locations in the shed) every 7 days. Divide total feed consumed that week by total live weight gained. If FCR trends above 1.85 before week 4, investigate water, ventilation, and feed quality immediately.`,
      },
    ],
  },
  {
    id: "c05",
    title: "Broiler Farm Setup & Management Fundamentals",
    instructor: "GreenedIn Poultry Team",
    duration: "3h 15min",
    level: "Beginner",
    category: "Poultry",
    lessons: 5,
    imageKey: "poultry",
    description:
      "A complete foundation course for setting up and managing a profitable broiler operation on the African continent. Covers farm design, chick placement, environmental control, feeding systems, and the fundamentals of stockmanship that separate successful farmers from struggling ones.",
    lessonList: [
      {
        id: "c05-l01",
        title: "The Principles of Good Stockmanship",
        duration: "35min",
        content: `Good stockmanship is the foundation of profitable broiler farming. It cannot be replaced by technology, automation, or medication. A skilled stockperson prevents problems before they occur.

**What Stockmanship Means in Practice**

Stockmanship is the ability to observe, interpret, and act on signals from your birds and your environment in real time. It requires daily consistency — the farmer who visits the shed only when problems are obvious has already lost.

**The Five Core Stockmanship Habits:**

1. **Daily Early Morning Inspection** — Enter the shed at dawn before activating feeding systems. In the quiet, you can hear abnormal respiratory sounds (sneezing, rattling, gasping) that are masked by feeding activity. Listen for 2–3 minutes at the entrance before walking through.

2. **Behavioral Mapping** — Observe bird distribution. Healthy broilers spread evenly across the shed floor. Clustering near heat sources means too cold. Avoiding the center means draftiness. Panting and wing-spreading means too hot. Huddling in corners means fear or poor lighting.

3. **Mortality Counting** — Collect and count dead birds every morning and record them. Normal mortality is less than 0.5% per week. A single morning with 0.5% mortality in one collection is an emergency signal.

4. **Feed and Water Consumption Monitoring** — Weigh or measure feed delivered versus what remains. A 10–15% drop in daily consumption precedes almost every disease outbreak by 24–48 hours.

5. **Record Keeping** — A farm without records is a farm without memory. Track daily mortality, feed consumption, water intake, weights, treatments, and environmental temperature. These records become your diagnostic tool when problems arise.

**The Relationship Between Stockmanship and Bird Welfare**
Birds under chronic stress — from heat, cold, crowding, noise, feed restriction, or fear — never achieve their genetic potential regardless of the quality of nutrition and vaccination. Stress directly suppresses the immune system, reduces feed conversion, and makes birds susceptible to opportunistic disease.`,
      },
      {
        id: "c05-l02",
        title: "Farm Preparation & Chick Placement",
        duration: "40min",
        content: `Proper preparation before chick arrival is as important as any post-placement management. The shed environment determines the first week's performance, and the first week determines the entire cycle.

**Farm Preparation Timeline (7 Days Before Chick Arrival):**

**Day -7 (1 week before):**
- Clean all feed and water equipment thoroughly with detergent, rinse with clean water.
- Apply an approved disinfectant solution (glutaraldehyde-based or quaternary ammonium) to all surfaces.
- Fumigate the closed house with formaldehyde gas or commercial fumigant. Seal for 24 hours.

**Day -5:**
- Inspect all electrical connections, heaters, fans, and drinker systems. Replace failed nipples and cracked drinker lines.
- Spread fresh, dry litter (wood shavings, rice husks, or sugarcane bagasse) to a depth of 5–8 cm. Do not use newspaper — it becomes slippery and causes leg disorders.

**Day -2:**
- Pre-heat the brooding zone to 32–34°C at bird level (5–10 cm above litter surface).
- Pre-fill all drinkers. Check nipple flow rates manually.
- Prepare glucose and multivitamin solution for Day 1.

**Chick Placement — First 6 Hours:**
- Open boxes gently. Do not shake or drop crates.
- Dip the beak of the first 10% of birds placed into the water source to teach drinking behavior. Remaining birds follow.
- Place paper feeding sheets directly on litter for the first 3 days to encourage early feed consumption.
- Maintain darkness for 2 hours after placement to reduce stress, then introduce 23-hour lighting for the first 7 days.

**Chick Quality Assessment:**
A good quality day-old chick: weighs 38–44 g, has a clean, dry navel, bright alert eyes, stands upright within seconds of being placed, and has clean legs with no swelling. Reject batches with high proportions of pasted navels, splayed legs, or abnormally small birds.`,
      },
      {
        id: "c05-l03",
        title: "Environmental Control & Ventilation",
        duration: "40min",
        content: `Environmental control is the skill that differentiates profitable farms from struggling ones in tropical climates. Most African broiler farms lose between 5–15% of production potential through preventable environmental failures.

**Temperature Management by Age:**

| Bird Age | Target House Temperature |
|---|---|
| Day 1–3 | 32–34°C at bird level |
| Day 4–7 | 30–32°C |
| Week 2 | 28–30°C |
| Week 3 | 26–28°C |
| Week 4 onwards | 22–24°C |

Use bird behavior as your primary thermometer. Instruments measure air — birds respond to effective temperature, which includes humidity and air movement.

**Ventilation Principles:**

Ventilation serves three purposes:
1. Remove heat and moisture produced by bird respiration
2. Dilute harmful gases — ammonia, carbon dioxide, hydrogen sulfide
3. Supply fresh oxygen for optimal metabolic function

**Minimum Ventilation** is the amount of fresh air exchange needed even on cold nights to remove moisture and gases. In closed houses, this is typically achieved by running fans at 20–30% capacity continuously.

**Ammonia Management:**
Ammonia targets: Below 10 ppm at bird level at all times. Above 25 ppm causes respiratory mucosa damage. Above 50 ppm is acutely toxic and causes permanent eye and lung damage.
Measure by entering the shed in the morning and crouching to bird level. If your eyes sting within 30 seconds, ammonia exceeds safe limits. Increase ventilation rate before adding litter.

**Open-Sided House Management in African Climates:**
Open-sided houses are common on smallholder farms. In the dry harmattan season, hang side curtains (tarpaulins or shade netting) to reduce cold wind exposure. In the rainy season, maintain all ventilation openings to prevent moisture buildup and mold growth in litter.`,
      },
      {
        id: "c05-l04",
        title: "Feeding & Drinking Systems",
        duration: "35min",
        content: `Feed and water delivery systems are the arteries of your broiler operation. System failures translate directly to FCR losses and growth depression within 24 hours.

**Feeding System Design:**

**Pan Feeders (Automatic):**
- Set pan height at bird back level as birds grow — weekly adjustments are necessary.
- Fill pans to two-thirds maximum to reduce spillage wastage. Overflowing pans waste 2–3% of total feed budget.
- Clean pans completely twice per week. Stale feed at the bottom of pans reduces daily intake.

**Linear Trough Feeders:**
- Minimum 2.5 cm of linear trough space per bird in weeks 1–3, increasing to 4 cm in weeks 4–6.
- Position feeders at 30–40 cm intervals across the shed width.
- Check feed flow from tube to pan daily — blockages in auger tubes go undetected for hours.

**Drinking System Design:**

**Nipple Drinker Systems (Preferred):**
- Maximum 8–10 birds per nipple
- Adjust nipple height: Week 1 — birds reach up at 35–45° angle. Week 4–6 — birds reach up at 45–75° angle.
- Check water pressure daily. Nipples at the far end of long water lines lose pressure. Minimum flow: 60 ml/minute per nipple.

**Open Bell Drinkers (Common on small farms):**
- Clean and refill at least twice daily — open drinkers accumulate dust, feces, and feed within hours.
- Place on raised platforms (bricks) to reduce contamination.
- Remove bell drinkers and replace with nipple lines from Week 3 onwards if capacity allows.

**Water Quality Testing:**
Test water pH and bacterial count at the source twice per year. High iron content blocks nipples and reduces consumption. pH above 8.0 reduces antibiotic and vaccine efficacy in medicated water systems.`,
      },
      {
        id: "c05-l05",
        title: "Catch, Transport & Pre-Processing Management",
        duration: "25min",
        content: `The final 24–48 hours before slaughter are often the most stressful period for broilers. Poor pre-catch management destroys the weight gain and quality achieved over 42 days. Every kilogram lost in transit is a kilogram that cost you 1.7 kg of feed to build.

**Feed Withdrawal Timing:**
Withdraw feed 6–8 hours before slaughter. Do not extend beyond 12 hours — this causes gut contents to shift backward, increasing carcass contamination risk during processing.

Water must remain available until 2 hours before loading. Withholding water causes dehydration, which shrinks liver size and concentrates blood in muscle tissue, reducing meat quality and shelf life.

**Lighting for Catch:**
Dim shed lights to their lowest level 2 hours before the catching crew arrives. Broilers are calmer in low-light conditions and can be caught without the explosive panic that bruises breast meat. Blue lighting is the most effective calming wavelength when available.

**Catching Protocol:**
- Catch birds by both legs simultaneously — never by one leg or by the wing.
- Maximum 4 birds per hand. More than 4 per hand causes joint dislocations and wing fractures.
- Carry birds heads-down to reduce struggle.
- Place into crates immediately — do not pile loose birds on the floor.

**Crate Loading Density:**
- Nighttime loading (below 25°C): 55–60 kg live weight per square meter of crate space
- Daytime loading (above 28°C): 40–45 kg per square meter to prevent heat stress in transit

**Transit:**
Load the truck from back to front. Start engine and ventilation before closing the last crate doors. Park in shade at destination. Inspect for dead-on-arrivals (DOA) and report to processor — excessive DOA rates are a farm-level accountability issue that impacts pricing contracts.`,
      },
    ],
  },
];

export const featuredCourses = courses.slice(0, 3);
