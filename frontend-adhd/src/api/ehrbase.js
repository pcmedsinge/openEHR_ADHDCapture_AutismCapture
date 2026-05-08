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

// Looks up the EHR for a subject; creates one if it does not exist yet.
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
  // 404 → new patient, create EHR
  return createEhr(subjectId, namespace);
}

export async function submitComposition(ehrId, flatPayload) {
  const url =
    `${BASE}/openehr/v1/ehr/${ehrId}/composition` +
    `?format=FLAT&templateId=adhd_initial_assessment`;
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
  // FLAT response body contains a key ending in /_uid with the composition UID
  const uidKey = Object.keys(body).find(k => k.endsWith('/_uid'));
  const uid = uidKey ? body[uidKey] : '(saved — UID unavailable)';
  return { uid };
}

// ─── at-code lookup tables (derived from archetype at-code sequence) ──────────

const ASRS_ITEM_NAMES = [
  'item_1','item_2','item_3','item_4','item_5','item_6',
  'item_7','item_8','item_9','item_10','item_11','item_12',
  'item_13','item_14','item_15','item_16','item_17','item_18',
];

// 5 ordinal codes per item (Never=0 … Very Often=4)
// item_6 was added late → at0113 base instead of at0032
const ASRS_CODES = [
  ['at0002','at0003','at0004','at0005','at0006'],  // item_1
  ['at0008','at0009','at0010','at0011','at0012'],  // item_2
  ['at0014','at0015','at0016','at0017','at0018'],  // item_3
  ['at0020','at0021','at0022','at0023','at0024'],  // item_4
  ['at0026','at0027','at0028','at0029','at0030'],  // item_5
  ['at0113','at0114','at0115','at0116','at0117'],  // item_6 (late add)
  ['at0038','at0039','at0040','at0041','at0042'],  // item_7
  ['at0044','at0045','at0046','at0047','at0048'],  // item_8
  ['at0050','at0051','at0052','at0053','at0054'],  // item_9
  ['at0056','at0057','at0058','at0059','at0060'],  // item_10
  ['at0062','at0063','at0064','at0065','at0066'],  // item_11
  ['at0068','at0069','at0070','at0071','at0072'],  // item_12
  ['at0074','at0075','at0076','at0077','at0078'],  // item_13
  ['at0080','at0081','at0082','at0083','at0084'],  // item_14
  ['at0086','at0087','at0088','at0089','at0090'],  // item_15
  ['at0092','at0093','at0094','at0095','at0096'],  // item_16
  ['at0098','at0099','at0100','at0101','at0102'],  // item_17
  ['at0104','at0105','at0106','at0107','at0108'],  // item_18
];
const ASRS_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

// Functional impact: 5 ordinal codes per domain (None=0 … Very Severe=4)
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

// Comorbidity: 3 ordinal codes per domain (No concern=0 … Significant=2)
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

// ─── Composition builder ──────────────────────────────────────────────────────

export function buildComposition(fd) {
  const b = 'adhd_initial_assessment/story_history/any_event:0';
  const now = new Date().toISOString();

  const flat = {
    'adhd_initial_assessment/category|value': 'event',
    'adhd_initial_assessment/category|code': '433',
    'adhd_initial_assessment/category|terminology': 'openehr',
    'adhd_initial_assessment/context/start_time': now,
    'adhd_initial_assessment/context/setting|code': '225',
    'adhd_initial_assessment/context/setting|value': 'home',
    'adhd_initial_assessment/context/setting|terminology': 'openehr',
    'adhd_initial_assessment/composer|name': fd.clinicianName || 'ADHDCapture',
    'adhd_initial_assessment/territory|code': 'GB',
    'adhd_initial_assessment/territory|terminology': 'ISO_3166-1',
    [`${b}/time`]: now,
    [`${b}/story:0`]: fd.story || 'ADHD initial assessment',
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

  // ── ASRS v1.1 ─────────────────────────────────────────────────────────────
  fd.asrs.forEach((ordinal, i) => {
    const key = ASRS_ITEM_NAMES[i];
    flat[`${b}/asrs_v11_screener/${key}|ordinal`] = ordinal;
    flat[`${b}/asrs_v11_screener/${key}|code`] = ASRS_CODES[i][ordinal];
    flat[`${b}/asrs_v11_screener/${key}|value`] = ASRS_LABELS[ordinal];
  });

  const partAScore = fd.asrs.slice(0, 6).reduce((s, v) => s + v, 0);
  const partBScore = fd.asrs.slice(6).reduce((s, v) => s + v, 0);
  flat[`${b}/asrs_v11_screener/part_a_score`] = partAScore;
  flat[`${b}/asrs_v11_screener/part_b_score`] = partBScore;
  flat[`${b}/asrs_v11_screener/total_score`] = partAScore + partBScore;

  // NICE NG87 Part A threshold: items 1–3 positive ≥ Sometimes(2), items 4–6 ≥ Often(3); screen+ if ≥4 positive
  let posCount = 0;
  for (let i = 0; i < 3; i++) if (fd.asrs[i] >= 2) posCount++;
  for (let i = 3; i < 6; i++) if (fd.asrs[i] >= 3) posCount++;
  flat[`${b}/asrs_v11_screener/part_a_positive_screen`] = posCount >= 4;

  // ── DIVA-5 ────────────────────────────────────────────────────────────────
  // Childhood inattention: item_1 … item_9 (9 items)
  fd.diva_ci.forEach((val, i) => {
    flat[`${b}/diva_5_interview/childhood_inattention/inattention_item_${i + 1}`] = val;
  });
  // Adulthood inattention: item_2 … item_9 (8 items — item_1 absent in archetype)
  fd.diva_ai.forEach((val, i) => {
    flat[`${b}/diva_5_interview/adulthood_inattention/inattention_item_${i + 2}`] = val;
  });
  // Childhood HI: hi_item_2 … hi_item_9 (8 items — hi_item_1 absent in archetype)
  fd.diva_chi.forEach((val, i) => {
    flat[`${b}/diva_5_interview/childhood_hyperactivity_impulsivity/hi_item_${i + 2}`] = val;
  });
  // Adulthood HI: hi_item_1 … hi_item_9 (9 items)
  fd.diva_ahi.forEach((val, i) => {
    flat[`${b}/diva_5_interview/adulthood_hyperactivity_impulsivity/hi_item_${i + 1}`] = val;
  });

  flat[`${b}/diva_5_interview/childhood_inattention_count`] = fd.diva_ci.filter(Boolean).length;
  flat[`${b}/diva_5_interview/adulthood_inattention_count`] = fd.diva_ai.filter(Boolean).length;
  flat[`${b}/diva_5_interview/childhood_hi_count`] = fd.diva_chi.filter(Boolean).length;
  flat[`${b}/diva_5_interview/adulthood_hi_count`] = fd.diva_ahi.filter(Boolean).length;

  flat[`${b}/diva_5_interview/age_of_onset|code`] = fd.ageOnsetCode;
  flat[`${b}/diva_5_interview/age_of_onset|value`] = fd.ageOnsetValue;
  flat[`${b}/diva_5_interview/age_of_onset|terminology`] = 'local';

  Object.entries(fd.impDomains).forEach(([k, v]) => {
    flat[`${b}/diva_5_interview/impairment_domains/${k}`] = v;
  });

  if (fd.clinicianSummary) flat[`${b}/diva_5_interview/clinician_summary`] = fd.clinicianSummary;

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
      flat[`adhd_initial_assessment/family_history_summary/per_problem:${i}/problem_diagnosis_name`] = p.name.trim();
    }
  });
  fd.famMembers.forEach((m, i) => {
    if (m.name.trim()) {
      flat[`adhd_initial_assessment/family_history_summary/per_family_member:${i}/family_member_name`] = m.name.trim();
      if (m.relationshipCode) {
        flat[`adhd_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|code`] = m.relationshipCode;
        flat[`adhd_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|value`] = m.relationship;
        flat[`adhd_initial_assessment/family_history_summary/per_family_member:${i}/relationship_degree|terminology`] = 'local';
      }
    }
  });

  return flat;
}
