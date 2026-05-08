// Realistic test scenario: 29-year-old male, GP referral, ADHD suspected
// ASRS Part A POSITIVE (4 items above threshold)
// DIVA: 7/9 childhood inattention, 6/8 adulthood inattention
// Moderate functional impact; anxiety comorbidity; family history of ADHD

export const TEST_DATA = {
  // Step 1
  subjectId: 'NEURO-TEST-001',
  clinicianName: 'Dr. Test Clinician',
  ehrId: null, // filled at runtime by EHR creation

  // Step 2 — Developmental History
  story: '29-year-old male referred by GP with long-standing difficulties with concentration, organisation and time management. Reports symptoms since childhood. Significant impact on work and relationships.',
  informantCode: 'at0002',
  informantValue: 'Self only',
  ageOfFirstConcerns: '8',
  childhoodPresentation: 'Difficulty concentrating in school, frequently lost belongings, struggled to complete homework. Often described as "daydreaming" by teachers. Never formally assessed.',
  motorDevCode: 'at0014',
  motorDev: 'Normal',
  speechLangCode: 'at0019',
  speechLang: 'Normal',
  socialDevCode: 'at0025',
  socialDev: 'Delayed',
  milestoneDetails: 'Social development mildly delayed — few close friendships throughout school. Motor and speech milestones within normal limits.',
  specialEd: true,
  ehcp: false,
  prevProfInput: false,
  collateralDocCode: 'at0035',
  collateralDoc: 'School reports',
  devComment: 'School reports describe poor attention, frequent off-task behaviour. No prior professional assessment or intervention.',

  // Step 3 — ASRS v1.1
  // Ordinals: Never=0, Rarely=1, Sometimes=2, Often=3, Very Often=4
  // Part A: items 1-6 = [3,3,2,3,2,2] → score 15/24
  // Positive: items 1-3 ≥2 (3/3 positive), items 4-6 ≥3 (1/3 positive) → 4 positive = SCREEN+
  asrs: [
    3, // item_1: Often — trouble finishing final details
    3, // item_2: Often — difficulty organising tasks
    2, // item_3: Sometimes — forgetting appointments
    3, // item_4: Often — avoiding thought-intensive tasks
    2, // item_5: Sometimes — fidgeting when seated
    2, // item_6: Sometimes — feeling driven by a motor
    3, // item_7: Often — careless mistakes
    3, // item_8: Often — difficulty sustaining attention
    2, // item_9: Sometimes — not listening when spoken to
    3, // item_10: Often — misplacing things
    3, // item_11: Often — distracted by activity/noise
    1, // item_12: Rarely — leaving seat
    2, // item_13: Sometimes — restless/fidgety
    2, // item_14: Sometimes — difficulty unwinding
    2, // item_15: Sometimes — talking too much
    1, // item_16: Rarely — finishing others' sentences
    2, // item_17: Sometimes — difficulty waiting turn
    2, // item_18: Sometimes — interrupting others
  ],

  // Step 4 — DIVA-5
  diva_ci: [true, true, true, true, true, true, true, false, false],   // 7/9 childhood inattention
  diva_ai: [true, true, true, true, true, true, false, false],          // 6/8 adulthood inattention (items 2-9)
  diva_chi: [false, false, true, true, true, false, false, false],      // 3/8 childhood HI (items 2-9)
  diva_ahi: [true, false, false, false, true, true, false, false, false], // 3/9 adulthood HI
  ageOnsetCode: 'at0051',
  ageOnsetValue: 'Before age 7',
  impDomains: {
    work_or_education: true,
    relationships: true,
    social_functioning: true,
    leisure_activities: false,
    self_confidence: true,
  },
  clinicianSummary: 'Patient endorses 7 of 9 inattention criteria in childhood and 6 in adulthood, meeting DIVA-5 threshold for inattention. HI symptoms below threshold. Age of onset before 7. Symptoms impair work, relationships, social functioning and self-confidence.',

  // Step 5 — Functional Impact (0=None … 4=Very Severe)
  funcImpact: [
    2, // occupational_work_impairment: Moderate
    2, // academic_educational_impairment: Moderate
    1, // relationship_family_impairment: Mild
    1, // social_functioning_impairment: Mild
    2, // daily_living_self_care_impairment: Moderate
    1, // financial_management_impairment: Mild
    2, // global_functional_impairment: Moderate
  ],
  domainDescription: 'Patient reports significant difficulty meeting work deadlines and managing projects. Household tasks frequently left incomplete. Financial organisation poor — bills forgotten, subscriptions untracked.',
  funcComment: '5 of 6 specific domains impaired at least mildly. Global rating: Moderate.',

  // Step 6 — Comorbidity (0=No concern, 1=Possible concern, 2=Significant concern)
  comorbidity: [
    2, // anxiety: Significant concern
    1, // depression: Possible concern
    1, // sleep_disorder: Possible concern
    0, // mood_disorder_bipolar: No concern
    0, // ocd: No concern
    0, // trauma_ptsd: No concern
    0, // eating_disorder: No concern
    0, // substance_use_concern: No concern
  ],
  substanceDetail: '',
  dyslexia: true,
  dyscalculia: false,
  dcdDyspraxia: false,
  crossCondScreen: 'at0046',
  crossCondScreenValue: 'Not screened',
  crossCondName: '',
  otherComorbidities: '',
  referralRec: true,
  comorbComment: 'Significant anxiety likely masking and compounding ADHD symptoms. Referral to psychology recommended for anxiety assessment. Possible sleep difficulty — sleep hygiene advice given.',

  // Step 7 — Family History
  famProblems: [
    { name: 'ADHD' },
    { name: 'Anxiety disorder' },
  ],
  famMembers: [
    { name: 'Father',        relationship: 'First degree relative',  relationshipCode: 'at0065' },
    { name: 'Paternal uncle', relationship: 'Second degree relative', relationshipCode: 'at0066' },
  ],
};
