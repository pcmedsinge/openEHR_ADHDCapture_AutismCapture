const BASE = 'http://localhost:8082/ehrbase/rest';
const AUTH = 'Basic ' + btoa('ehrbase:ehrbase');
const JSON_HEADERS = {
  Authorization: AUTH,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function createEhr(subjectId, namespace) {
  const res = await fetch(`${BASE}/openehr/v1/ehr`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify({
      _type: 'EHR_STATUS',
      archetype_node_id: 'openEHR-EHR-EHR_STATUS.generic.v1',
      name: { _type: 'DV_TEXT', value: 'EHR Status' },
      subject: {
        external_ref: {
          id: { _type: 'GENERIC_ID', value: subjectId, scheme: 'id-scheme' },
          namespace,
          type: 'PERSON',
        },
      },
      is_modifiable: true,
      is_queryable: true,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create EHR failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.ehr_id.value;
}

export async function findOrCreateEhr(subjectId, namespace = 'neuro_patients') {
  const lookupRes = await fetch(
    `${BASE}/openehr/v1/ehr?subject_id=${encodeURIComponent(subjectId)}&subject_namespace=${encodeURIComponent(namespace)}`,
    { headers: JSON_HEADERS }
  );
  if (lookupRes.ok) {
    const data = await lookupRes.json();
    return data.ehr_id.value;
  }
  if (lookupRes.status !== 404) {
    const text = await lookupRes.text();
    throw new Error(`EHR lookup failed (${lookupRes.status}): ${text}`);
  }
  return createEhr(subjectId, namespace);
}

export async function submitComposition(ehrId, flatPayload) {
  const url =
    `${BASE}/openehr/v1/ehr/${ehrId}/composition` +
    `?format=FLAT&templateId=autism_initial_assessment`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify(flatPayload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Submit composition failed (${res.status}): ${text}`);
  }
  const body = await res.json();
  const uidKey = Object.keys(body).find(k => k.endsWith('/_uid'));
  const uid = uidKey ? body[uidKey] : '(saved — UID unavailable)';
  return { uid };
}

// ─── AQ-10 at-codes (from openEHR-EHR-CLUSTER.aq10_screener.v0) ──────────────
// Item N codes: at0{(N-1)*5+2} .. at0{(N-1)*5+5}
// Ordinals: 0=Definitely agree, 1=Slightly agree, 2=Slightly disagree, 3=Definitely disagree
function atCode(n) { return 'at' + String(n).padStart(4, '0'); }

const AQ10_CODES = Array.from({ length: 10 }, (_, i) => {
  const base = i * 5 + 2;
  return [atCode(base), atCode(base + 1), atCode(base + 2), atCode(base + 3)];
});
const AQ10_LABELS = ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'];

// ─── RAADS-R at-codes (from openEHR-EHR-CLUSTER.raads_r_assessment.v0) ────────
// Same 5-code-per-item pattern; ordinals: 0=Never true, 1=True <16, 2=True now, 3=True now+<16
const RAADS_CODES = Array.from({ length: 80 }, (_, i) => {
  const base = i * 5 + 2;
  return [atCode(base), atCode(base + 1), atCode(base + 2), atCode(base + 3)];
});
const RAADS_LABELS = [
  'Never true',
  'True only when I was younger than 16',
  'True only now',
  'True now and when I was younger than 16',
];
// Archetype uses raw ordinal values as scores (0,1,2,3); total max = 80×3 = 240
const RAADS_POINTS = [0, 1, 2, 3];

// ─── Subscale item membership (0-based indices) ───────────────────────────────
const SR_ITEMS = new Set([0,1,3,4,6,9,10,13,14,15,16,17,18,19,21,23,24,26,27,28,30,31,33,34,38,39,40,42,43,45,46,49,57,58,63,72,73,74,75]);
const L_ITEMS  = new Set([2,25,52,53,54,55,56]);
const SM_ITEMS = new Set([5,7,8,11,12,20,22,29,32,35,36,37,41,44,47,48,50,51,59,60]);
const CI_ITEMS = new Set([61,62,64,65,66,67,68,69,70,71,76,77,78,79]);

// ─── Shared archetype at-codes (identical to ADHD template — same archetypes) ──

const FUNC_KEYS = [
  'occupational_work_impairment',
  'academic_educational_impairment',
  'relationship_family_impairment',
  'social_functioning_impairment',
  'daily_living_self_care_impairment',
  'financial_management_impairment',
  'global_functional_impairment',
];
const FUNC_CODES = [
  ['at0002','at0003','at0004','at0005','at0006'],
  ['at0007','at0008','at0009','at0010','at0011'],
  ['at0012','at0013','at0014','at0015','at0016'],
  ['at0017','at0018','at0019','at0020','at0021'],
  ['at0022','at0023','at0024','at0025','at0026'],
  ['at0027','at0028','at0029','at0030','at0031'],
  ['at0034','at0035','at0036','at0037','at0038'],
];
const FUNC_LABELS = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];

const COMORB_KEYS = [
  'anxiety', 'depression', 'sleep_disorder', 'mood_disorder_bipolar',
  'ocd', 'trauma_ptsd', 'eating_disorder', 'substance_use_concern',
];
const COMORB_CODES = [
  ['at0002','at0003','at0004'],
  ['at0007','at0008','at0009'],
  ['at0012','at0013','at0014'],
  ['at0017','at0018','at0019'],
  ['at0022','at0023','at0024'],
  ['at0027','at0028','at0029'],
  ['at0032','at0033','at0034'],
  ['at0037','at0038','at0039'],
];
const COMORB_LABELS = ['No concern', 'Possible concern', 'Significant concern'];

// ─── AQ-10 scoring helpers ────────────────────────────────────────────────────
const AQ10_AGREE_ITEMS = new Set([0, 6, 7, 9]); // 0-based: items 1,7,8,10
function aq10ItemScore(index, ordinal) {
  return AQ10_AGREE_ITEMS.has(index) ? (ordinal <= 1 ? 1 : 0) : (ordinal >= 2 ? 1 : 0);
}

// ─── Composition builder ──────────────────────────────────────────────────────

export function buildComposition(fd) {
  const b = 'autism_initial_assessment/story_history/any_event:0';
  const now = new Date().toISOString();

  const flat = {
    'autism_initial_assessment/category|value': 'event',
    'autism_initial_assessment/category|code': '433',
    'autism_initial_assessment/category|terminology': 'openehr',
    'autism_initial_assessment/context/start_time': now,
    'autism_initial_assessment/context/setting|code': '225',
    'autism_initial_assessment/context/setting|value': 'home',
    'autism_initial_assessment/context/setting|terminology': 'openehr',
    'autism_initial_assessment/composer|name': fd.clinicianName || 'AutismCapture',
    'autism_initial_assessment/territory|code': 'GB',
    'autism_initial_assessment/territory|terminology': 'ISO_3166-1',
    [`${b}/time`]: now,
    [`${b}/story:0`]: fd.story || 'Autism initial assessment',
  };

  // ── Developmental History ──────────────────────────────────────────────────
  flat[`${b}/developmental_history/informant|code`] = fd.informantCode;
  flat[`${b}/developmental_history/informant|value`] = fd.informantValue;
  flat[`${b}/developmental_history/informant|terminology`] = 'local';

  if (fd.ageOfFirstConcerns !== '') {
    flat[`${b}/developmental_history/age_of_first_concerns|magnitude`] = parseFloat(fd.ageOfFirstConcerns);
    flat[`${b}/developmental_history/age_of_first_concerns|unit`] = 'a';
  }
  if (fd.childhoodPresentation) {
    flat[`${b}/developmental_history/childhood_presentation`] = fd.childhoodPresentation;
  }

  flat[`${b}/developmental_history/developmental_milestones/motor_development|code`] = fd.motorDevCode;
  flat[`${b}/developmental_history/developmental_milestones/motor_development|value`] = fd.motorDev;
  flat[`${b}/developmental_history/developmental_milestones/motor_development|terminology`] = 'local';

  flat[`${b}/developmental_history/developmental_milestones/speech_and_language|code`] = fd.speechLangCode;
  flat[`${b}/developmental_history/developmental_milestones/speech_and_language|value`] = fd.speechLang;
  flat[`${b}/developmental_history/developmental_milestones/speech_and_language|terminology`] = 'local';

  flat[`${b}/developmental_history/developmental_milestones/social_development|code`] = fd.socialDevCode;
  flat[`${b}/developmental_history/developmental_milestones/social_development|value`] = fd.socialDev;
  flat[`${b}/developmental_history/developmental_milestones/social_development|terminology`] = 'local';

  if (fd.milestoneDetails) {
    flat[`${b}/developmental_history/developmental_milestones/milestone_details`] = fd.milestoneDetails;
  }

  flat[`${b}/developmental_history/special_educational_needs`] = fd.specialEd;
  flat[`${b}/developmental_history/ehcp_or_sen_statement`] = fd.ehcp;
  flat[`${b}/developmental_history/previous_professional_input`] = fd.prevProfInput;

  flat[`${b}/developmental_history/collateral_documentation|code`] = fd.collateralDocCode;
  flat[`${b}/developmental_history/collateral_documentation|value`] = fd.collateralDoc;
  flat[`${b}/developmental_history/collateral_documentation|terminology`] = 'local';

  if (fd.devComment) flat[`${b}/developmental_history/comment`] = fd.devComment;

  // ── AQ-10 Screener ────────────────────────────────────────────────────────
  fd.aq10.forEach((ordinal, i) => {
    const key = `item_${i + 1}`;
    flat[`${b}/aq10_screener/${key}|ordinal`] = ordinal;
    flat[`${b}/aq10_screener/${key}|code`] = AQ10_CODES[i][ordinal];
    flat[`${b}/aq10_screener/${key}|value`] = AQ10_LABELS[ordinal];
  });

  const aq10Total = fd.aq10.reduce((sum, ordinal, i) => sum + aq10ItemScore(i, ordinal), 0);
  flat[`${b}/aq10_screener/total_score`] = aq10Total;
  flat[`${b}/aq10_screener/threshold_met`] = aq10Total >= 6;

  // ── RAADS-R Assessment ────────────────────────────────────────────────────
  let srScore = 0, lScore = 0, smScore = 0, ciScore = 0;

  fd.raads.forEach((ordinal, i) => {
    const key = `item_${i + 1}`;
    flat[`${b}/raads_r_assessment/${key}|ordinal`] = ordinal;
    flat[`${b}/raads_r_assessment/${key}|code`] = RAADS_CODES[i][ordinal];
    flat[`${b}/raads_r_assessment/${key}|value`] = RAADS_LABELS[ordinal];

    const pts = RAADS_POINTS[ordinal];
    if (SR_ITEMS.has(i)) srScore += pts;
    else if (L_ITEMS.has(i)) lScore += pts;
    else if (SM_ITEMS.has(i)) smScore += pts;
    else if (CI_ITEMS.has(i)) ciScore += pts;
  });

  // Subscale scores omitted: archetype item membership differs from published RAADS-R.
  // Total is sum of all 80 raw ordinals (archetype max = 240 = 80×3).
  const raadsTotal = srScore + lScore + smScore + ciScore;
  flat[`${b}/raads_r_assessment/total_score`] = raadsTotal;
  flat[`${b}/raads_r_assessment/threshold_met`] = raadsTotal >= 65;

  // ── Functional Impact ─────────────────────────────────────────────────────
  fd.funcImpact.forEach((ordinal, i) => {
    flat[`${b}/functional_impact/${FUNC_KEYS[i]}|ordinal`] = ordinal;
    flat[`${b}/functional_impact/${FUNC_KEYS[i]}|code`] = FUNC_CODES[i][ordinal];
    flat[`${b}/functional_impact/${FUNC_KEYS[i]}|value`] = FUNC_LABELS[ordinal];
  });
  if (fd.domainDescription) flat[`${b}/functional_impact/domain_impairment_description`] = fd.domainDescription;
  flat[`${b}/functional_impact/number_of_domains_impaired`] = fd.funcImpact.slice(0, 6).filter(v => v > 0).length;
  if (fd.funcComment) flat[`${b}/functional_impact/comment`] = fd.funcComment;

  // ── Comorbidity Screening ─────────────────────────────────────────────────
  fd.comorbidity.forEach((ordinal, i) => {
    flat[`${b}/comorbidity_screening/${COMORB_KEYS[i]}|ordinal`] = ordinal;
    flat[`${b}/comorbidity_screening/${COMORB_KEYS[i]}|code`] = COMORB_CODES[i][ordinal];
    flat[`${b}/comorbidity_screening/${COMORB_KEYS[i]}|value`] = COMORB_LABELS[ordinal];
  });
  if (fd.substanceDetail) flat[`${b}/comorbidity_screening/substance_detail`] = fd.substanceDetail;
  flat[`${b}/comorbidity_screening/dyslexia`] = fd.dyslexia;
  flat[`${b}/comorbidity_screening/dyscalculia`] = fd.dyscalculia;
  flat[`${b}/comorbidity_screening/dcd_dyspraxia`] = fd.dcdDyspraxia;
  flat[`${b}/comorbidity_screening/cross_condition_screen|code`] = fd.crossCondScreen;
  flat[`${b}/comorbidity_screening/cross_condition_screen|value`] = fd.crossCondScreenValue;
  flat[`${b}/comorbidity_screening/cross_condition_screen|terminology`] = 'local';
  if (fd.crossCondName) flat[`${b}/comorbidity_screening/cross_condition_name`] = fd.crossCondName;
  if (fd.otherComorbidities) flat[`${b}/comorbidity_screening/other_comorbidities`] = fd.otherComorbidities;
  flat[`${b}/comorbidity_screening/referral_recommended`] = fd.referralRec;
  if (fd.comorbComment) flat[`${b}/comorbidity_screening/comment`] = fd.comorbComment;

  // ── Family History ─────────────────────────────────────────────────────────
  fd.famProblems.forEach((p, i) => {
    if (p.name.trim()) {
      flat[`autism_initial_assessment/family_history_summary/per_problem:${i}/problem_diagnosis_name`] = p.name.trim();
    }
  });
  fd.famMembers.forEach((m, i) => {
    if (m.name.trim()) {
      flat[`autism_initial_assessment/family_history_summary/per_family_member:${i}/family_member_name`] = m.name.trim();
      if (m.relationshipCode) {
        flat[`autism_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|code`] = m.relationshipCode;
        flat[`autism_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|value`] = m.relationship;
        flat[`autism_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|terminology`] = 'local';
      }
    }
  });

  return flat;
}
