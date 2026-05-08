# openEHR Concepts — Module 3 Reference

*Written: 2026-05-07 — covers concepts introduced or deepened in this module*

---

## Concept Map for This Module

Module 3 introduces the most complex openEHR modelling in the bootcamp so far:

| Concept | Where Used | New in M3? |
|---------|-----------|------------|
| Custom archetype creation | ASRS-v1.1, DIVA-5, AQ-10, RAADS-R clusters | Yes |
| Archetype specialisation | Shared clusters extending CKM archetypes | Yes |
| CLUSTER archetype | All scored questionnaire sections | Yes |
| Slot constraints | EVALUATION slots constrained to specific CLUSTERs | Yes |
| Shared cluster reuse | 4 clusters slotted into both templates | Yes |
| Coded text (DV_CODED_TEXT) | Symptom frequency, severity, functional impact | Deepened |
| DV_ORDINAL | Scored questionnaire items | Yes |
| External terminology binding | ICD-10 + ICD-11 + SNOMED CT on one node | Yes |
| Dual terminology binding | Same node, two simultaneous bindings | Yes |
| FLAT JSON format | Composition API calls | Deepened (M1 used FLAT, M2 used Canonical) |
| AQL query with template filter | Always filter by template_id | Deepened |

---

## FLAT JSON Format

### Why FLAT, Not Canonical

Module 2 used Canonical JSON. Lesson learned: `compositions.ts` was 320 lines for 8 archetypes. This module has 15+ fields per section across 7 sections per form. Canonical would be ~1500 lines of nested structure. FLAT is the correct choice.

**FLAT JSON** is EHRbase's proprietary simplified format. It flattens the full RM hierarchy into key-value pairs using path notation.

### FLAT vs Canonical comparison

```
Canonical JSON (Module 2 pattern):
{
  "_type": "OBSERVATION",
  "archetype_node_id": "openEHR-EHR-OBSERVATION.blood_pressure.v2",
  "data": {
    "_type": "HISTORY",
    "origin": { "_type": "DV_DATE_TIME", "value": "2026-05-07T10:00:00Z" },
    "events": [{
      "_type": "POINT_EVENT",
      "time": { "_type": "DV_DATE_TIME", "value": "2026-05-07T10:00:00Z" },
      "data": {
        "_type": "ITEM_TREE",
        "items": [{
          "_type": "ELEMENT",
          "archetype_node_id": "at0004",
          "value": { "_type": "DV_QUANTITY", "magnitude": 120, "units": "mm[Hg]" }
        }]
      }
    }]
  }
}

FLAT JSON equivalent:
{
  "blood_pressure/systolic|magnitude": 120,
  "blood_pressure/systolic|unit": "mm[Hg]"
}
```

### FLAT Path Structure

Paths follow the archetype node structure, flattened with `/` separators:

```
{template-id}/{archetype-name}/{path-in-archetype}|{attribute}
```

Examples:
```
adhd_initial_assessment/asrs_screener/item_1|value
adhd_initial_assessment/asrs_screener/item_1|code
adhd_initial_assessment/problem_diagnosis/diagnosis|code
adhd_initial_assessment/problem_diagnosis/diagnosis|terminology
adhd_initial_assessment/problem_diagnosis/diagnosis|value
```

For repeated sections (e.g., multiple adverse events in Module 2):
```
trial_encounter/adverse_event:0/event_name|value
trial_encounter/adverse_event:1/event_name|value
```

### Getting the Exact FLAT Paths

Do NOT guess FLAT paths. Get them from EHRbase:

```
GET /ehrbase/rest/openehr/v1/definition/template/adl1.4/{template-id}/example?format=FLAT
```

This returns a complete example FLAT JSON with all paths and sample values. Build the React API layer from this — not from the archetype editor.

---

## CLUSTER Archetypes

### What a CLUSTER Is

In openEHR's Reference Model, a CLUSTER is a reusable structural element that contains a set of related data elements. CLUSTERs cannot exist standalone — they must be slotted into a parent ENTRY archetype (OBSERVATION, EVALUATION, INSTRUCTION, ACTION) or another CLUSTER.

**Key property:** A CLUSTER archetype, once created, can be slotted into any number of templates. This is the mechanism for data reuse at the clinical data repository level.

### This Module's CLUSTER Strategy

Four shared clusters built once, slotted into both templates:

```
openEHR-EHR-CLUSTER.developmental_history.v0
  └── Used in: adhd_initial_assessment, autism_initial_assessment
  └── Captures: Childhood onset, milestones, school history, collateral informant

openEHR-EHR-CLUSTER.functional_impact.v0
  └── Used in: adhd_initial_assessment, autism_initial_assessment
  └── Captures: Impairment in work, education, relationships, social, daily living

openEHR-EHR-CLUSTER.comorbidity_screening.v0
  └── Used in: adhd_initial_assessment, autism_initial_assessment
  └── Captures: Anxiety, depression, sleep disorders, substance use, learning difficulties

openEHR-EHR-CLUSTER.family_psychiatric_history.v0
  └── Used in: adhd_initial_assessment, autism_initial_assessment
  └── Captures: Family history of ADHD, Autism, mood disorders, other psychiatric conditions
```

Four assessment-specific clusters:

```
openEHR-EHR-CLUSTER.asrs_v11_screener.v0
  └── Used in: adhd_initial_assessment only
  └── 18 items, Part A score (6 items), Part B score (12 items)

openEHR-EHR-CLUSTER.diva_5_interview.v0
  └── Used in: adhd_initial_assessment only
  └── Childhood symptoms, adulthood symptoms, age of onset, 5 impairment domains

openEHR-EHR-CLUSTER.aq10_screener.v0
  └── Used in: autism_initial_assessment only
  └── 10 items, total score, threshold flag (≥6)

openEHR-EHR-CLUSTER.raads_r_assessment.v0
  └── Used in: autism_initial_assessment only
  └── 80 items, 4 subscale scores, total score
```

### Archetype vs Template — Critical Distinction

| | Archetype | Template |
|--|-----------|----------|
| **What** | Clinical concept definition | Constrained archetype set for one use case |
| **Reusability** | Reusable across any template/system | Specific to one application context |
| **Storage** | Archetype repository (CKM, local) | EHRbase (as `.opt` file) |
| **Format** | ADL 1.4 or ADL 2 | Operational Template (OPT) |
| **Module 3 example** | `CLUSTER.asrs_v11_screener.v0` | `adhd_initial_assessment` |

The OPT file bundles: the root COMPOSITION archetype + all included archetypes (with any additional constraints applied at template level). EHRbase validates compositions against the OPT.

---

## Slots

A SLOT in an archetype is a placeholder that says "any archetype matching this constraint can go here."

```
SLOT "Assessment instruments"
  include: matches {
    archetype_id matches {
      /openEHR-EHR-CLUSTER.asrs.*/,
      /openEHR-EHR-CLUSTER.diva.*/
    }
  }
```

In the ADHD template, the assessment section has slots constrained to the ADHD-specific CLUSTERs. The developmental history section has a slot constrained to `openEHR-EHR-CLUSTER.developmental_history.v0`. This is how the four shared clusters are included — not by copying, but by slotting.

**Template-level slot filling:** In Archetype Designer, you fill the slot at template level — selecting which specific archetype(s) go into each slot for this particular template.

---

## Data Types Used in This Module

### DV_ORDINAL

Used for scored questionnaire items where the response is an ordered set of options.

```
DV_ORDINAL example — ASRS item (Never / Rarely / Sometimes / Often / Very Often):
{
  "value": 2,       ← ordinal integer (0-based or defined in archetype)
  "symbol": {
    "_type": "DV_CODED_TEXT",
    "value": "Sometimes",
    "defining_code": {
      "terminology_id": { "value": "local" },
      "code_string": "at0004"
    }
  }
}

In FLAT JSON:
"asrs_screener/item_1|value": 2,
"asrs_screener/item_1|code": "at0004",
"asrs_screener/item_1|ordinal": 2
```

**Why DV_ORDINAL, not DV_CODED_TEXT:** DV_ORDINAL preserves the numeric order AND the coded label. This makes the ordinal value queryable as a number in AQL (for score distributions in Module 4). DV_CODED_TEXT would only give you the label.

### DV_QUANTITY

Used for calculated scores (Part A score, total RAADS-R score):

```
"asrs_screener/part_a_score|magnitude": 4,
"asrs_screener/part_a_score|unit": "1"   ← dimensionless count
```

**Important for Module 4:** Every scored field must be `DV_QUANTITY` or `DV_ORDINAL` — not embedded in free text. AQL can aggregate quantities; it cannot parse numbers out of strings.

### DV_CODED_TEXT

Used for fields with a defined value set:

```
"problem_diagnosis/diagnosis|value": "Attention deficit hyperactivity disorder",
"problem_diagnosis/diagnosis|code": "F90.2",
"problem_diagnosis/diagnosis|terminology": "ICD-10-CM"
```

### DV_TEXT

Used for free-text fields with no constrained value set:

```
"reason_for_encounter/presenting_complaint|value": "Patient reports long-standing concentration difficulties..."
```

### DV_BOOLEAN

Used for threshold flags:

```
"aq10_screener/threshold_met|value": true
```

### DV_DATE_TIME

Used for timestamps and date fields:

```
"referral_details/referral_date|value": "2026-04-15"
```

---

## Terminology Bindings

### The Three-Binding Pattern

Every diagnosis node in this module carries three simultaneous bindings:

```
Diagnosis element (DV_CODED_TEXT)
  ↓ ICD-10-CM binding
  "code": "F90.2", "terminology": "ICD-10-CM"    ← NHS national submission

  ↓ ICD-11 binding (stored as second DV_CODED_TEXT or via FHIR extension node)
  "code": "6A05.2", "terminology": "ICD-11"      ← clinical documentation

  ↓ SNOMED CT binding
  "code": "406506008", "terminology": "SNOMED-CT" ← interoperability
```

**openEHR binding model:** At the archetype level, a `DV_CODED_TEXT` node can have a `terminology_id` constraint pointing to an external terminology. Multiple bindings are declared in the archetype's `terminology` section under `term_bindings`. The template inherits these and can add additional constraints.

**Practical approach for Module 3:** Store the clinician-entered code in the primary `DV_CODED_TEXT`. The template/archetype declares the binding constraint — EHRbase validates that the entered code belongs to the declared terminology. The UI presents a code picker pre-filtered to the correct terminology.

---

## AQL — Module 3 Patterns

### Critical Rule: Always Filter by Template ID

Both templates share one EHRbase. Without a template filter, a query against ADHD compositions will also return Autism compositions.

```sql
-- WRONG — returns both ADHD and Autism compositions:
SELECT c/uid/value FROM EHR e CONTAINS COMPOSITION c

-- CORRECT — ADHD only:
SELECT c/uid/value
FROM EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1]
WHERE e/ehr_id/value = '{ehrId}'
  AND c/archetype_details/template_id/value = 'adhd_initial_assessment'

-- CORRECT — Autism only:
SELECT c/uid/value
FROM EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1]
WHERE e/ehr_id/value = '{ehrId}'
  AND c/archetype_details/template_id/value = 'autism_initial_assessment'
```

### Querying Cluster Data

To retrieve a scored field from inside a CLUSTER:

```sql
SELECT
  e/ehr_id/value,
  c/content[openEHR-EHR-EVALUATION.problem_diagnosis.v1]/data[at0001]/items[at0002]/value/value AS diagnosis,
  o/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.asrs_v11_screener.v0]/items[at0010]/value/magnitude AS part_a_score
FROM EHR e
  CONTAINS COMPOSITION c
  CONTAINS OBSERVATION o [openEHR-EHR-OBSERVATION.self_reported_symptoms.v0]
WHERE c/archetype_details/template_id/value = 'adhd_initial_assessment'
```

**Note:** Get exact AQL paths from EHRbase's Web Templates endpoint or by running test queries against a real composition. Paths in AQL must match the archetype node IDs exactly.

### EHR Subject Namespace for This Module

Both apps use the same namespace:

```json
{
  "subject": {
    "external_ref": {
      "id": {
        "_type": "GENERIC_ID",
        "value": "NHS-1234567890",
        "scheme": "nhs_number"
      },
      "namespace": "neuro_patients",
      "type": "PERSON"
    }
  }
}
```

Lookup by NHS number:
```
GET /ehrbase/rest/openehr/v1/ehr?subject_id=NHS-1234567890&subject_namespace=neuro_patients
```

---

## CKM Search Strategy

Before creating any custom archetype:

1. Search CKM International (ckm.openehr.org) with multiple terms:
   - Exact instrument name (e.g., "ASRS", "RAADS")
   - Clinical concept (e.g., "ADHD symptom", "autism screening")
   - Generic concept (e.g., "questionnaire", "functional impact")

2. If a CKM archetype exists:
   - Can it be used as-is? → use it (reference in template)
   - Is it 80% right but needs extra fields? → **specialise it**

3. If no CKM archetype exists:
   - Create custom archetype in Archetype Designer
   - Aim to contribute back to CKM after the module (openEHR community practice)

4. Specialisation rule: a specialised archetype must be valid everywhere its parent is valid. Do not change the meaning of inherited nodes — only constrain them further or add new nodes.

**Expected CKM gaps in this module:** ASRS-v1.1, DIVA-5, AQ-10, and RAADS-R are not in CKM as of 2026. The four shared CLUSTERs may have partial CKM matches (check `problem_diagnosis`, `social_history`, `family_history` — these may cover some ground).

---

## Data Types — When to Use Which

| Type | Use when | AQL queryable as | Example in this module |
|------|----------|-----------------|----------------------|
| DV_ORDINAL | Ordered scale — options have numeric rank | `\|ordinal > 1` (numeric comparison) | Severity screens — None/Mild/Moderate/Severe |
| DV_CODED_TEXT | Categorical pick-list — no ordering | `\|value = 'X'` (equality only) | Informant, Collateral documentation |
| DV_TEXT | Free narrative — clinician types anything | `LIKE '%keyword%'` | Childhood presentation, Comment |
| DV_QUANTITY | Measured number with unit | `\|magnitude < 12` | Age of first concerns (years) |
| DV_COUNT | Plain integer, no unit | `\|value >= 2` | Number of domains impaired |
| DV_BOOLEAN | True/false only | `= true` | SEN identified, EHCP issued |
| DV_DATE_TIME | Date and/or time | date comparisons | Referral date |
| CLUSTER SLOT | Placeholder for another archetype | — | Educational history → education_record.v1 |

### The critical DV_ORDINAL vs DV_CODED_TEXT distinction

Both are pick-lists in the UI — the difference is invisible to the clinician but critical for analytics:

**DV_CODED_TEXT** — categories with no order:
```
AQL: WHERE informant|value = 'Parent or guardian'   ✓
AQL: WHERE informant|ordinal > 1                    ✗ (no ordinal)
```

**DV_ORDINAL** — ranked scale with integers:
```
AQL: WHERE anxiety|value = 'Moderate'               ✓
AQL: WHERE anxiety|ordinal > 1                      ✓ (moderate OR severe)
AQL: avg(anxiety|ordinal)                           ✓ (mean severity across cohort)
```

Use DV_ORDINAL whenever the values have a meaningful order AND you will want to aggregate or compare them numerically in Module 4.

---

## at-codes (Archetype Term Codes)

### What they are
Every node in an archetype gets an `at` code assigned by the authoring tool (e.g. `at0001`, `at0012`). These are local identifiers within a single archetype.

### No collision between archetypes
The fully qualified node identity is always:
```
{archetype-id} :: {at-code}
```
Example:
```
openEHR-EHR-CLUSTER.developmental_history.v0 :: at0001   ← Informant node
openEHR-EHR-CLUSTER.education_record.v1 :: at0001        ← completely separate node
```
Each archetype is its own namespace. The same at-code number in two different archetypes refers to two completely different things — no collision is possible.

### Where at-codes appear
- **AQL:** path expressions use at-codes to identify specific nodes — `items[at0001]`
- **ADL source:** the machine-readable archetype definition uses them internally
- **FLAT JSON:** uses human-readable path names (e.g. `/informant`) — React API layer never sees at-codes directly

### One permanent rule
Once an archetype is published and data exists against it, **never reassign an existing at-code**. New nodes get new codes. Existing codes are permanent identifiers — changing them would break all existing data and queries.

### Custom archetype at-codes
Custom archetypes start fresh from `at0000` (root). Archetype Designer assigns codes sequentially in creation order. The numbers themselves are meaningless — only their uniqueness within the archetype matters.

---

## Module 3 Architecture Decisions (Reference)

| Decision | Choice | Reason |
|----------|--------|--------|
| Composition format | FLAT JSON | Canonical = 320 lines for 8 archetypes (Module 2 lesson) |
| EHRbase instance | Shared (one for both apps) | CDR-as-platform — one EHR per patient, both apps write to it |
| EHRbase version | 2.11.0 | Same as M1+M2 — no version risk |
| Ports | EHRbase 8082, PG 5434 | No conflict with M1 (8080/5432) or M2 (8080/5432) |
| Frontend | Two independent Vite React apps | Each app independently deployable — no shared code |
| Subject namespace | `neuro_patients` | Consistent across both apps — one EHR per patient |
| Scored fields | DV_ORDINAL or DV_QUANTITY | Required for Module 4 AQL aggregation |
| Build order | ADHDCapture first | ASRS (18 items) simpler than RAADS-R (80 items) |
| Form navigation | Wizard-style (7 sections) | Single-scroll too long for complex assessments |
