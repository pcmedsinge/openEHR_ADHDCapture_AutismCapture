# Archetype Design — Module 3 Custom Archetypes

*Written progressively during build session — 2026-05-07*
*Document every custom archetype before opening Archetype Designer*

---

## Overview

Three custom CLUSTER archetypes + one published EVALUATION reused:

| Archetype | Type | Status |
|-----------|------|--------|
| `openEHR-EHR-CLUSTER.developmental_history.v0` | Custom | Built ✓ |
| `openEHR-EHR-CLUSTER.functional_impact.v0` | Custom | Built ✓ |
| `openEHR-EHR-CLUSTER.comorbidity_screening.v0` | Custom | Built ✓ |
| `openEHR-EHR-EVALUATION.family_history.v2` | CKM published | Use directly — no custom needed |

### Build Log — `comorbidity_screening.v0`

| Node | Type | Status |
|------|------|--------|
| Anxiety | DV_ORDINAL 0..1 | Built ✓ — 0=No concern / 1=Mild / 2=Moderate / 3=Severe concern |
| Depression | DV_ORDINAL 0..1 | Built ✓ |
| Sleep disorder | DV_ORDINAL 0..1 | Built ✓ |
| Mood disorder bipolar | DV_ORDINAL 0..1 | Built ✓ |
| OCD | DV_ORDINAL 0..1 | Built ✓ |
| Trauma PTSD | DV_ORDINAL 0..1 | Built ✓ |
| Eating disorder | DV_ORDINAL 0..1 | Built ✓ |
| Substance use concern | DV_ORDINAL 0..1 | Built ✓ |
| Substance detail | DV_TEXT 0..1 | Built ✓ |
| Dyslexia | DV_BOOLEAN 0..1 | Built ✓ |
| Dyscalculia | DV_BOOLEAN 0..1 | Built ✓ |
| DCD dyspraxia | DV_BOOLEAN 0..1 | Built ✓ |
| Cross condition screen | DV_CODED_TEXT 0..1 | Built ✓ — 4 terms: Not screened / Screened negative / Screened positive / Previously diagnosed |
| Cross condition name | DV_TEXT 0..1 | Built ✓ |
| Other comorbidities | DV_TEXT 0..1 | Built ✓ |
| Referral recommended | DV_BOOLEAN 0..1 | Built ✓ |
| Comment | DV_TEXT 0..1 | Built ✓ |

**Key design note:** Ordinal scale uses "No concern / Severe concern" (not "None / Severe") — these are screening concern levels, not confirmed severity ratings. Cross condition screen captures ASD on ADHD form and ADHD on Autism form — set at template level.

---

### Build Log — `functional_impact.v0`

| Node | Type | Status |
|------|------|--------|
| Occupational work impairment | DV_ORDINAL 0..1 | Built ✓ — 0=None / 1=Mild / 2=Moderate / 3=Severe |
| Academic educational impairment | DV_ORDINAL 0..1 | Built ✓ |
| Relationship family impairment | DV_ORDINAL 0..1 | Built ✓ |
| Social functioning impairment | DV_ORDINAL 0..1 | Built ✓ |
| Daily living self care impairment | DV_ORDINAL 0..1 | Built ✓ |
| Financial management impairment | DV_ORDINAL 0..1 | Built ✓ |
| Domain impairment description | DV_TEXT 0..1 | Built ✓ |
| Number of domains impaired | DV_COUNT 0..1 | Built ✓ |
| Global functional impairment | DV_ORDINAL 0..1 | Built ✓ — same 4-value scale |
| Comment | DV_TEXT 0..1 | Built ✓ |

**Archetype Designer notes:**
- DV_ORDINAL values entered via Edit button → Value (integer) + Text columns
- All 6 domain nodes use identical ordinal scale — build one, repeat pattern for remaining 5
- DV_COUNT has no unit or constraint needed — leave default

---

### Build Log — `developmental_history.v0`

| Node | at-code | Status |
|------|---------|--------|
| Informant | at0001 | Built ✓ — DV_CODED_TEXT, 1..1, 8 internal terms |
| Age of first concerns | at0010 | Built ✓ — DV_QUANTITY, 0..1, unit `a`, 0 decimal places |
| Childhood presentation | — | Built ✓ — DV_TEXT, 0..1 |
| Developmental milestones (sub-cluster) | — | Built ✓ — nested CLUSTER, 0..1 |
| → Motor development | — | Built ✓ — DV_CODED_TEXT, 4 terms |
| → Speech and language | — | Built ✓ — DV_CODED_TEXT, 4 terms |
| → Social development | — | Built ✓ — DV_CODED_TEXT, 4 terms (Atypical not Delayed) |
| → Milestone details | — | Built ✓ — DV_TEXT, 0..1 |
| Educational history | — | Built ✓ — SLOT constrained to education_record.v1, 0..* |
| Special educational needs | — | Built ✓ — DV_BOOLEAN, 0..1 |
| EHCP or SEN statement | — | Built ✓ — DV_BOOLEAN, 0..1 |
| Previous professional input | — | Built ✓ — DV_TEXT, 0..1 |
| Collateral documentation | — | Built ✓ — DV_CODED_TEXT, 5 internal terms |
| Comment | — | Built ✓ — DV_TEXT, 0..1 |

**Archetype Designer notes:**
- Unit `a` is under category "Time" in the Add unit dialog (UCUM — annum = year)
- Internal coded text requires at least one term before saving
- at-codes are auto-assigned by Archetype Designer (not sequential — depends on order of creation)

Four assessment-specific CLUSTERs (built after shared clusters):

| Archetype | Used in | Status |
|-----------|---------|--------|
| `openEHR-EHR-CLUSTER.asrs_v11_screener.v0` | ADHDCapture only | Built ✓ |
| `openEHR-EHR-CLUSTER.diva_5_interview.v0` | ADHDCapture only | Built ✓ |
| `openEHR-EHR-CLUSTER.aq10_screener.v0` | AutismCapture only | Built ✓ |
| `openEHR-EHR-CLUSTER.raads_r_assessment.v0` | AutismCapture only | Built ✓ |

---

## CLUSTER 1 — `openEHR-EHR-CLUSTER.developmental_history.v0`

### Clinical Purpose
Captures childhood evidence required by NICE NG87 (ADHD) and NG142 (Autism) to establish neurodevelopmental onset. NICE NG87 requires evidence of symptoms before age 12. NICE NG142 requires childhood developmental evidence including milestones and school history. This cluster is slotted into Section 5 of both assessment templates.

### CKM Search Result
No equivalent in CKM. `CLUSTER.birth_detail.v0` covers perinatal only. `CLUSTER.education_record.v1` covers formal schooling but not milestones or SEN. Custom archetype required.

### Design Decisions
- **Age of first concerns as DV_QUANTITY (years):** Adults recall approximate age, not dates. Module 4 AQL requires `magnitude < 12` to confirm childhood onset — numeric is the only queryable form.
- **Informant is mandatory (1..1):** A self-report-only developmental history has different diagnostic weight than a corroborated one. Clinically essential.
- **Milestone sub-cluster as DV_CODED_TEXT (not DV_TEXT):** Keeps values queryable. "Delayed speech" must be countable across cohort — not buried in narrative.
- **Slot to `CLUSTER.education_record.v1`:** Reuses published CKM archetype for formal school periods. One slot instance per school attended. No need to rebuild.
- **SEN and EHCP as separate DV_BOOLEANs:** EHCP (Education, Health and Care Plan) is England-specific but clinically important — confirms formal recognition of need. Fast boolean flags rather than text.

### Node Structure

**Root: `developmental_history` (CLUSTER)**

| # | Node | Data Type | Cardinality | Notes |
|---|------|-----------|-------------|-------|
| 1 | Informant | DV_CODED_TEXT | 1..1 | Who provided developmental history |
| 2 | Age of first concerns | DV_QUANTITY | 0..1 | unit: `a` (UCUM years), integer magnitude |
| 3 | Childhood presentation | DV_TEXT | 0..1 | Clinician narrative of childhood symptoms |
| 4 | Developmental milestones | CLUSTER | 0..1 | Sub-cluster — see below |
| 5 | Educational history | SLOT → `CLUSTER.education_record.v1` | 0..* | One instance per school/period |
| 6 | Special educational needs | DV_BOOLEAN | 0..1 | SEN identified at school |
| 7 | EHCP or SEN statement | DV_BOOLEAN | 0..1 | Formal plan issued (England) |
| 8 | Previous professional input | DV_TEXT | 0..1 | CAMHS, paediatrician, EP, SALT, etc. |
| 9 | Collateral documentation | DV_CODED_TEXT | 0..1 | What evidence is available |
| 10 | Comment | DV_TEXT | 0..1 | Additional free text |

**Node 1 — Informant value set (local codes):**
- Self only
- Parent or guardian
- Partner or spouse
- Sibling
- School report
- Previous assessment report
- Multiple sources
- Other

**Node 4 — Sub-cluster: `developmental_milestones`**

| # | Node | Data Type | Cardinality | Value set |
|---|------|-----------|-------------|-----------|
| 4a | Motor development | DV_CODED_TEXT | 0..1 | Normal / Delayed / Significantly delayed / Unknown |
| 4b | Speech and language | DV_CODED_TEXT | 0..1 | Normal / Delayed / Significantly delayed / Unknown |
| 4c | Social development | DV_CODED_TEXT | 0..1 | Normal / Atypical / Significantly atypical / Unknown |
| 4d | Milestone details | DV_TEXT | 0..1 | Free text if any domain flagged |

**Node 9 — Collateral documentation value set (local codes):**
- None available
- School reports
- Previous assessment reports
- Parent questionnaire completed
- Multiple documents

### FLAT JSON Path Preview (once in template)
```
adhd_initial_assessment/developmental_history/informant|value
adhd_initial_assessment/developmental_history/informant|code
adhd_initial_assessment/developmental_history/age_of_first_concerns|magnitude
adhd_initial_assessment/developmental_history/age_of_first_concerns|unit
adhd_initial_assessment/developmental_history/childhood_presentation|value
adhd_initial_assessment/developmental_history/developmental_milestones/motor_development|value
adhd_initial_assessment/developmental_history/developmental_milestones/motor_development|code
adhd_initial_assessment/developmental_history/developmental_milestones/speech_and_language|value
adhd_initial_assessment/developmental_history/developmental_milestones/social_development|value
adhd_initial_assessment/developmental_history/special_educational_needs|value
adhd_initial_assessment/developmental_history/ehcp_or_sen_statement|value
adhd_initial_assessment/developmental_history/previous_professional_input|value
adhd_initial_assessment/developmental_history/collateral_documentation|value
adhd_initial_assessment/developmental_history/collateral_documentation|code
adhd_initial_assessment/developmental_history/comment|value
```
*(Exact paths confirmed from EHRbase example endpoint after template upload — these are illustrative)*

---

## CLUSTER 2 — `openEHR-EHR-CLUSTER.functional_impact.v0`

### Clinical Purpose
Records the degree of functional impairment across life domains as required by NICE NG87 (Section 1.3) and NICE NG142 (Section 1.2). Both guidelines mandate assessment across occupational, academic, social, and daily living domains before a diagnosis can be confirmed. Each domain rated on a severity scale so Module 4 AQL can aggregate impairment profiles across cohorts.

### CKM Search Result
No equivalent. `EVALUATION.occupation_summary.v1` covers job history only, explicitly excludes health impact. PROMIS `ability_participate.v0` is DRAFT (4 items, incomplete). Custom archetype required.

### Design Decisions
- **DV_ORDINAL for each domain (not DV_CODED_TEXT):** Ordinals preserve numeric order — Module 4 AQL can do `WHERE occupational_impairment|ordinal > 1` (i.e., moderate or severe). DV_CODED_TEXT cannot be compared numerically.
- **Ordinal scale: None(0) / Mild(1) / Moderate(2) / Severe(3):** Standard NICE terminology. Consistent across all domains for AQL uniformity.
- **Six domains + one global rating:** The six domains are the DIVA-5 impairment domains (also used in NICE NG87). Global rating is a single clinician summary for quick AQL filtering.
- **Impairment description per domain is optional DV_TEXT:** Clinicians often elaborate only on impaired domains — keep optional to avoid form fatigue.
- **Number of domains impaired as DV_COUNT:** Derived field but worth storing explicitly. Module 4 needs it for diagnostic threshold analysis (DSM-5 requires impairment in ≥2 settings).

### Node Structure

**Root: `functional_impact` (CLUSTER)**

| # | Node | Data Type | Cardinality | Ordinal values |
|---|------|-----------|-------------|----------------|
| 1 | Occupational / work impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 2 | Academic / educational impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 3 | Relationship / family impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 4 | Social functioning impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 5 | Daily living / self-care impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 6 | Financial management impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 7 | Domain impairment description | DV_TEXT | 0..1 | Narrative across all affected domains |
| 8 | Number of domains impaired | DV_COUNT | 0..1 | Clinician-entered count (0–6) |
| 9 | Global functional impairment | DV_ORDINAL | 0..1 | 0=None, 1=Mild, 2=Moderate, 3=Severe |
| 10 | Comment | DV_TEXT | 0..1 | Additional notes |

### FLAT JSON Path Preview
```
adhd_initial_assessment/functional_impact/occupational_work_impairment|value
adhd_initial_assessment/functional_impact/occupational_work_impairment|ordinal
adhd_initial_assessment/functional_impact/academic_educational_impairment|value
adhd_initial_assessment/functional_impact/academic_educational_impairment|ordinal
adhd_initial_assessment/functional_impact/relationship_family_impairment|value
adhd_initial_assessment/functional_impact/social_functioning_impairment|value
adhd_initial_assessment/functional_impact/daily_living_self_care_impairment|value
adhd_initial_assessment/functional_impact/financial_management_impairment|value
adhd_initial_assessment/functional_impact/number_of_domains_impaired|value
adhd_initial_assessment/functional_impact/global_functional_impairment|value
adhd_initial_assessment/functional_impact/global_functional_impairment|ordinal
```

---

## CLUSTER 3 — `openEHR-EHR-CLUSTER.comorbidity_screening.v0`

### Clinical Purpose
Structured screening for conditions that commonly co-occur with ADHD and Autism. Required by NICE NG87 (Section 1.3.4) and NICE NG142 (Section 1.2.6). Screening (not diagnosis) — each item establishes whether clinical concern is present and at what severity, prompting further assessment. The ADHD form includes an ASD screen; the Autism form includes an ADHD screen.

### CKM Search Result
No equivalent. `symptom_sign.v2` is for individual symptom episodes; its own misuse note excludes screening questionnaire use. Custom archetype required.

### Design Decisions
- **DV_ORDINAL (not DV_BOOLEAN) for most items:** "Is anxiety present?" is clinically insufficient. Clinicians need severity to decide whether to refer. Ordinal 0–3 (None/Mild/Moderate/Severe concern) is the right resolution.
- **DV_CODED_TEXT for cross-condition screen (ADHD screen on Autism form, ASD screen on ADHD form):** These warrant a richer status — Not screened / Screened negative / Screened positive / Previously diagnosed. That's nominal, not ordinal.
- **Substance use as DV_ORDINAL + free text detail:** Severity of concern + which substances (cannabis, alcohol, stimulants are most relevant for ADHD/Autism).
- **Learning difficulties as DV_BOOLEAN per type:** Dyslexia, dyscalculia, DCD (developmental coordination disorder) are binary — either identified or not. Different from severity screening.
- **"Other comorbidities" as DV_TEXT:** Catch-all for anything not in the list. Required for clinical completeness.

### Node Structure

**Root: `comorbidity_screening` (CLUSTER)**

| # | Node | Data Type | Cardinality | Values |
|---|------|-----------|-------------|--------|
| 1 | Anxiety | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 2 | Depression | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 3 | Sleep disorder | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 4 | Mood disorder / bipolar | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 5 | OCD | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 6 | Trauma / PTSD | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 7 | Eating disorder | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 8 | Substance use concern | DV_ORDINAL | 0..1 | 0=No concern, 1=Mild, 2=Moderate, 3=Severe concern |
| 9 | Substance detail | DV_TEXT | 0..1 | Which substances (free text) |
| 10 | Dyslexia | DV_BOOLEAN | 0..1 | Identified / not identified |
| 11 | Dyscalculia | DV_BOOLEAN | 0..1 | Identified / not identified |
| 12 | DCD (dyspraxia) | DV_BOOLEAN | 0..1 | Identified / not identified |
| 13 | Cross-condition screen | DV_CODED_TEXT | 0..1 | Not screened / Screened negative / Screened positive / Previously diagnosed |
| 14 | Cross-condition name | DV_TEXT | 0..1 | "ASD" (on ADHD form) or "ADHD" (on Autism form) — set at template level |
| 15 | Other comorbidities | DV_TEXT | 0..1 | Free text catch-all |
| 16 | Referral recommended | DV_BOOLEAN | 0..1 | Clinician flags if comorbidity warrants onward referral |
| 17 | Comment | DV_TEXT | 0..1 | Additional notes |

### FLAT JSON Path Preview
```
adhd_initial_assessment/comorbidity_screening/anxiety|value
adhd_initial_assessment/comorbidity_screening/anxiety|ordinal
adhd_initial_assessment/comorbidity_screening/depression|value
adhd_initial_assessment/comorbidity_screening/sleep_disorder|value
adhd_initial_assessment/comorbidity_screening/mood_disorder_bipolar|value
adhd_initial_assessment/comorbidity_screening/ocd|value
adhd_initial_assessment/comorbidity_screening/trauma_ptsd|value
adhd_initial_assessment/comorbidity_screening/eating_disorder|value
adhd_initial_assessment/comorbidity_screening/substance_use_concern|value
adhd_initial_assessment/comorbidity_screening/substance_detail|value
adhd_initial_assessment/comorbidity_screening/dyslexia|value
adhd_initial_assessment/comorbidity_screening/dyscalculia|value
adhd_initial_assessment/comorbidity_screening/dcd_dyspraxia|value
adhd_initial_assessment/comorbidity_screening/cross_condition_screen|value
adhd_initial_assessment/comorbidity_screening/cross_condition_screen|code
adhd_initial_assessment/comorbidity_screening/cross_condition_name|value
adhd_initial_assessment/comorbidity_screening/other_comorbidities|value
adhd_initial_assessment/comorbidity_screening/referral_recommended|value
adhd_initial_assessment/comorbidity_screening/comment|value
```

---

## Published EVALUATION — `openEHR-EHR-EVALUATION.family_history.v2`

### Why no custom archetype
CKM published archetype. Comprehensive dual structure: per-problem summary (with `family_prevalence` CLUSTER slot) + per-family-member detail. Constraining it at template level to psychiatric conditions (ADHD, Autism, mood disorders, anxiety, schizophrenia) is sufficient — creating a custom CLUSTER would duplicate published work.

### Template-level constraint
At template level, the `Per problem` repeating section will have the problem/diagnosis name constrained to a SNOMED CT value set including:
- 406506008 — ADHD
- 35919005 — Autism spectrum disorder
- 13746004 — Bipolar disorder
- 197480006 — Anxiety disorder
- 35489007 — Depressive disorder
- 58214004 — Schizophrenia

Family member relationship coded values (first/second/third degree relative) are already in the published archetype.

---

## Assessment-Specific CLUSTERs

### Build Log — `asrs_v11_screener.v0`

**Status: Built ✓**

| Node | Type | Cardinality | Notes |
|------|------|-------------|-------|
| Item 1 | DV_ORDINAL | 0..1 | 0=Never / 1=Rarely / 2=Sometimes / 3=Often / 4=Very Often |
| Item 2 | DV_ORDINAL | 0..1 | same scale |
| Item 3 | DV_ORDINAL | 0..1 | same scale |
| Item 4 | DV_ORDINAL | 0..1 | same scale |
| Item 5 | DV_ORDINAL | 0..1 | same scale |
| Item 6 | DV_ORDINAL | 0..1 | same scale — Part A ends here |
| Item 7 | DV_ORDINAL | 0..1 | Part B starts here |
| Item 8 | DV_ORDINAL | 0..1 | same scale |
| Item 9 | DV_ORDINAL | 0..1 | same scale |
| Item 10 | DV_ORDINAL | 0..1 | same scale |
| Item 11 | DV_ORDINAL | 0..1 | same scale |
| Item 12 | DV_ORDINAL | 0..1 | same scale |
| Item 13 | DV_ORDINAL | 0..1 | same scale |
| Item 14 | DV_ORDINAL | 0..1 | same scale |
| Item 15 | DV_ORDINAL | 0..1 | same scale |
| Item 16 | DV_ORDINAL | 0..1 | same scale |
| Item 17 | DV_ORDINAL | 0..1 | same scale |
| Item 18 | DV_ORDINAL | 0..1 | same scale — Part B ends here |
| Part A score | DV_COUNT | 0..1 | Range 0–24 (sum of Items 1–6) |
| Part B score | DV_COUNT | 0..1 | Range 0–48 (sum of Items 7–18) |
| Total score | DV_COUNT | 0..1 | Range 0–72 |
| Part A positive screen | DV_BOOLEAN | 0..1 | True if Part A score ≥ 4 |

**Design decisions:**
- **DV_COUNT for scores (not DV_QUANTITY):** Scores are plain integers with no physical unit. DV_QUANTITY requires a unit category; DV_COUNT does not. Range constraints set directly (Min/Max) in Archetype Designer.
- **Item naming as "Item 1" through "Item 18" (not question text):** ASRS question text is copyright WHO — stored in the frontend, not the archetype. The archetype stores structured response data only.
- **Part A positive screen as DV_BOOLEAN:** Threshold ≥4 on Part A is the ASRS clinical cut-off. Boolean flag stored explicitly so AQL can filter `WHERE part_a_positive_screen = true` without recalculating from item scores.
- **Part A items 1–6 / Part B items 7–18:** No sub-cluster needed — all at root level. Template can render them in two groups by using form sections.

**Archetype Designer notes:**
- Item 6 was accidentally omitted during build — added and dragged into correct position between Item 5 and Item 7
- Copy button does not work in v1.25.6-A2 — each ordinal item must be created manually
- DV_COUNT Range: Min checkbox + value field on left, Max checkbox + value field on right

### FLAT JSON Path Preview
```
adhd_initial_assessment/asrs_v11_screener/item_1|value
adhd_initial_assessment/asrs_v11_screener/item_1|ordinal
adhd_initial_assessment/asrs_v11_screener/item_6|value
adhd_initial_assessment/asrs_v11_screener/item_6|ordinal
adhd_initial_assessment/asrs_v11_screener/item_18|value
adhd_initial_assessment/asrs_v11_screener/part_a_score|value
adhd_initial_assessment/asrs_v11_screener/part_b_score|value
adhd_initial_assessment/asrs_v11_screener/total_score|value
adhd_initial_assessment/asrs_v11_screener/part_a_positive_screen|value
```

---

## Remaining Assessment-Specific CLUSTERs (to be built)

### `openEHR-EHR-CLUSTER.asrs_v11_screener.v0`
- 18 items × DV_ORDINAL (Never=0 / Rarely=1 / Sometimes=2 / Often=3 / Very Often=4)
- Part A score (items 1–6) — DV_COUNT, range 0–24
- Part B score (items 7–18) — DV_COUNT, range 0–48
- Total score — DV_COUNT, range 0–72
- Part A positive screen flag (≥4) — DV_BOOLEAN
- **STATUS: Built ✓**

### Build Log — `diva_5_interview.v0`

**Status: Built ✓**

| Node | Type | Cardinality | Notes |
|------|------|-------------|-------|
| Childhood inattention (sub-cluster) | CLUSTER | 0..1 | Contains items 1–9 |
| → Inattention item 1–9 | DV_BOOLEAN × 9 | 0..1 each | DSM-5 inattention criteria, childhood |
| Adulthood inattention (sub-cluster) | CLUSTER | 0..1 | Contains items 1–9 |
| → Inattention item 1–9 | DV_BOOLEAN × 9 | 0..1 each | DSM-5 inattention criteria, adulthood |
| Childhood hyperactivity impulsivity (sub-cluster) | CLUSTER | 0..1 | Contains HI items 1–9 |
| → HI item 1–9 | DV_BOOLEAN × 9 | 0..1 each | DSM-5 HI criteria, childhood |
| Adulthood hyperactivity impulsivity (sub-cluster) | CLUSTER | 0..1 | Contains HI items 1–9 |
| → HI item 1–9 | DV_BOOLEAN × 9 | 0..1 each | DSM-5 HI criteria, adulthood |
| Childhood inattention count | DV_COUNT | 0..1 | Range 0–9 |
| Adulthood inattention count | DV_COUNT | 0..1 | Range 0–9 |
| Childhood HI count | DV_COUNT | 0..1 | Range 0–9 |
| Adulthood HI count | DV_COUNT | 0..1 | Range 0–9 |
| Age of onset | DV_CODED_TEXT | 0..1 | Before age 7 / Before age 12 / After age 12 / Unclear |
| Impairment domains (sub-cluster) | CLUSTER | 0..1 | 5 boolean domain flags |
| → Work or education | DV_BOOLEAN | 0..1 | |
| → Relationships | DV_BOOLEAN | 0..1 | |
| → Social functioning | DV_BOOLEAN | 0..1 | |
| → Leisure activities | DV_BOOLEAN | 0..1 | |
| → Self confidence | DV_BOOLEAN | 0..1 | |
| Clinician summary | DV_TEXT | 0..1 | Free text clinical conclusion |

**Design decisions:**
- **Nested CLUSTERs for each timepoint/domain:** Keeps FLAT JSON paths clean and groups related items for frontend rendering.
- **Item names "Inattention item 1–9" / "HI item 1–9":** Full DSM-5 wording is copyright — stored in the frontend, not the archetype.
- **DV_COUNT for symptom counts:** Plain integers, no units. Count nodes are application-layer derived values stored explicitly for AQL querying.
- **Age of onset as DV_CODED_TEXT:** NICE NG87 requires childhood onset (before 12). The "Before age 7" option supports DSM-IV legacy coding still used in some records.

### Build Log — `aq10_screener.v0`

**Status: Built ✓**

| Node | Type | Cardinality | Notes |
|------|------|-------------|-------|
| Item 1–10 | DV_ORDINAL × 10 | 0..1 each | 0=Definitely agree / 1=Slightly agree / 2=Slightly disagree / 3=Definitely disagree |
| Total score | DV_COUNT | 0..1 | Range 0–10 |
| Threshold met | DV_BOOLEAN | 0..1 | True if total score ≥ 6 |

**Design decisions:**
- **DV_ORDINAL (not DV_BOOLEAN) per item:** Raw response preserved — application layer applies scoring logic (agree scores on items 1,7,8,10; disagree scores on items 2,3,4,5,6,9).
- **Ordinal scale 0–3 (not 1–4):** Starts at 0 to be consistent with ASRS and DIVA-5 ordinal conventions in this module.
- **Threshold met as DV_BOOLEAN:** Application-calculated flag stored explicitly for AQL filtering (`WHERE threshold_met = true`).

### Build Log — `raads_r_assessment.v0`

**Status: Built ✓**

| Node | Type | Cardinality | Notes |
|------|------|-------------|-------|
| Item 1–80 | DV_ORDINAL × 80 | 0..1 each | 0=Never true / 1=True only when I was younger than 16 / 2=True only now / 3=True now and when I was younger than 16 |
| Social relatedness score | DV_COUNT | 0..1 | Range 0–135 |
| Language score | DV_COUNT | 0..1 | Range 0–21 |
| Sensory motor score | DV_COUNT | 0..1 | Range 0–54 |
| Circumscribed interests score | DV_COUNT | 0..1 | Range 0–30 |
| Total score | DV_COUNT | 0..1 | Range 0–240 |
| Threshold met | DV_BOOLEAN | 0..1 | True if total score ≥ 65 |

**Design decisions:**
- **All 80 items stored (not just scores):** Individual responses enable clinician review, audit, and future AQL queries on specific symptom patterns.
- **DV_COUNT for scores (not DV_QUANTITY):** Scores are plain integers with no physical units.
- **Copy-paste method used in Archetype Designer:** Copy node → select root → click paste icon on root toolbar → rename. Confirmed working in v1.25.6-A2. Significantly faster than creating each item from scratch.
- **Ordinal labels use "younger than 16" (not "as a child"):** Matches the published RAADS-R instrument wording exactly.
- **No subscale threshold flags:** Only total score threshold stored — subscale interpretation is clinical judgement, not a binary cutoff.
