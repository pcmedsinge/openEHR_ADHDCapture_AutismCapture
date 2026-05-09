// Realistic test scenario: 26-year-old female, GP referral, autism suspected
// AQ-10: 8/10 — POSITIVE screen (≥6)
// RAADS-R: total ~135 — well above threshold of 65
// Moderate functional impact; anxiety comorbidity; family history of autism

export const TEST_DATA = {
  // Step 1
  subjectId: 'NEURO-ASD-001',
  clinicianName: 'Dr. Test Clinician',
  ehrId: null,

  // Step 2 — Developmental History
  story: '26-year-old female referred by GP following self-identification as potentially autistic. Reports lifelong difficulties with social interaction, sensory sensitivities, and a tendency toward rigid routines. Burnout at work triggered the referral.',
  informantCode: 'at0002',
  informantValue: 'Self only',
  ageOfFirstConcerns: '4',
  childhoodPresentation: 'Described as a "quiet, odd" child by family. Preferred solitary play; intense interest in animals. Struggled to understand playground social rules. Sensory difficulties with certain fabrics and loud environments noted by parents.',
  motorDevCode: 'at0014',
  motorDev: 'Normal',
  speechLangCode: 'at0020',
  speechLang: 'Delayed',
  socialDevCode: 'at0025',
  socialDev: 'Delayed',
  milestoneDetails: 'Speech delayed by approximately 6 months. Social milestones significantly delayed — limited imaginative play, preferred structured or solitary activities. Motor milestones within normal range.',
  specialEd: true,
  ehcp: false,
  prevProfInput: true,
  collateralDocCode: 'at0037',
  collateralDoc: 'Parent questionnaire completed',
  devComment: 'Parent questionnaire confirms early social communication difficulties and sensory sensitivities consistent with autism. Previous CAMHS assessment inconclusive.',

  // Step 3 — AQ-10
  // Ordinals: 0=Definitely agree, 1=Slightly agree, 2=Slightly disagree, 3=Definitely disagree
  // Items 1,7,8,10 score on AGREE (ordinal ≤1); items 2,3,4,5,6,9 score on DISAGREE (ordinal ≥2)
  // Score target: 9/10 positive
  aq10: [
    0, // item 1: Definitely agree — notices small sounds (AGREE item → 1pt)
    3, // item 2: Definitely disagree — does NOT concentrate on whole picture (DISAGREE item → 1pt)
    3, // item 3: Definitely disagree — does NOT find it easy to do two things at once (DISAGREE → 1pt)
    3, // item 4: Definitely disagree — cannot switch back quickly after interruption (DISAGREE → 1pt)
    3, // item 5: Definitely disagree — does NOT read between the lines easily (DISAGREE → 1pt)
    2, // item 6: Slightly disagree — finds it hard to tell if someone is bored (DISAGREE → 1pt)
    0, // item 7: Definitely agree — difficult to work out characters' intentions (AGREE → 1pt)
    0, // item 8: Definitely agree — likes to collect categories of things (AGREE → 1pt)
    0, // item 9: Definitely agree — does find it easy to read faces (AGREE → DISAGREE item → 0pt)
    0, // item 10: Definitely agree — difficult to work out intentions (AGREE → 1pt)
  ],
  // AQ-10 score: items 1✓,2✓,3✓,4✓,5✓,6✓,7✓,8✓,9✗(agree on disagree item),10✓ = 9/10

  // Step 4 — RAADS-R (80 items)
  // Ordinals: 0=Never true, 1=True only <16, 2=True only now, 3=True now and when younger
  // Archetype scoring: raw ordinals 0→0pts, 1→1pt, 2→2pts, 3→3pts (total max 240)
  // Target: total ~170 (well above threshold 65)
  raads: [
    3,3,3,3,3, // items 1-5: SR/L/SR/SR/SR — consistently true across life
    1,3,1,3,3, // items 6-10
    3,1,0,1,1, // items 11-15
    3,1,3,0,3, // items 16-20
    1,1,3,0,1, // items 21-25
    3,0,3,0,1, // items 26-30
    3,3,1,3,0, // items 31-35
    3,3,1,3,3, // items 36-40
    3,3,3,1,3, // items 41-45
    3,3,3,3,3, // items 46-50
    3,3,3,3,3, // items 51-55
    3,3,3,0,3, // items 56-60
    3,3,3,3,3, // items 61-65
    3,3,3,3,3, // items 66-70
    3,3,3,3,3, // items 71-75
    3,1,1,0,0, // items 76-80
  ],

  // Step 5 — Functional Impact (0=None, 1=Mild, 2=Moderate, 3=Severe, 4=Very Severe)
  funcImpact: [
    3, // occupational: Severe — burnout triggered referral
    1, // academic: Mild — managed well in structured school environment
    2, // relationship: Moderate — difficulty maintaining friendships
    3, // social: Severe — exhausting masking in social situations
    2, // daily living: Moderate — routines help but changes cause distress
    1, // financial: Mild
    2, // global: Moderate
  ],
  domainDescription: 'Patient describes extensive "masking" at work leading to autistic burnout. Social situations are exhausting; she often withdraws for days after social events. Relies heavily on daily routines — any deviation causes significant anxiety.',
  funcComment: '5 of 6 specific domains impaired. Occupational and social functioning most severely affected due to masking and burnout.',

  // Step 6 — Comorbidity (0=No concern, 1=Possible concern, 2=Significant concern)
  comorbidity: [
    2, // anxiety: Significant concern
    1, // depression: Possible concern
    2, // sleep_disorder: Significant concern
    0, // mood_disorder_bipolar: No concern
    0, // ocd: No concern
    0, // trauma_ptsd: No concern
    0, // eating_disorder: No concern
    0, // substance_use_concern: No concern
  ],
  substanceDetail: '',
  dyslexia: false,
  dyscalculia: false,
  dcdDyspraxia: false,
  crossCondScreen: 'at0047',
  crossCondScreenValue: 'Screened — negative',
  crossCondName: 'ADHD',
  otherComorbidities: '',
  referralRec: true,
  comorbComment: 'Significant anxiety and sleep disturbance — likely secondary to autism and masking demands. ADHD screened during this appointment; result negative. Referral to psychology recommended for anxiety and post-diagnostic support.',

  // Step 7 — Family History
  famProblems: [
    { name: 'Autism spectrum disorder' },
    { name: 'Anxiety disorder' },
  ],
  famMembers: [
    { name: 'Brother',       relationship: 'First degree relative',  relationshipCode: 'at0065' },
    { name: 'Maternal aunt', relationship: 'Second degree relative', relationshipCode: 'at0066' },
  ],
};
