# Neurodevelopmental Domain — Module 3 Context

*Written: 2026-05-07 — read before building anything*

---

## What This Module Is

Two clinical apps for structured neurodevelopmental assessment:

| App | Condition | Guideline | Primary Instruments |
|-----|-----------|-----------|---------------------|
| **ADHDCapture** | Adult ADHD | NICE NG87 (Nov 2018, updated 2023) | ASRS-v1.1 (screener) + DIVA-5 (structured interview) |
| **AutismCapture** | Adult Autism | NICE NG142 (Jun 2021) | AQ-10 (screener) + RAADS-R (structured assessment) |

Target users: NHS Right to Choose (RTC) providers, private assessment clinics (ADHD360, Psychiatry UK, Clinical Partners).

---

## Why This Market Exists

- NHS ADHD/Autism waiting lists: **5–7 years** in many regions
- NHS Right to Choose (2023 expansion): patients can choose any NHS-commissioned provider — created a wave of new providers needing compliant documentation systems
- No dominant openEHR-native platform in this space — most providers use paper, PDF, or fragmented SaaS tools
- NICE mandates structured multi-domain assessment (NG87 section 1.3, NG142 section 1.2) but implementation is fragmented
- EHDS (European Health Data Space, enacted March 2025) explicitly prioritises neurodevelopmental conditions as a cross-border data use case
- Private providers are paying for solutions now — no NHS procurement cycle

---

## NHS Right to Choose (RTC) Pathway

**How it works:**
1. GP refers patient to NHS mental health service
2. Patient is told they can choose any NHS-commissioned provider
3. Patient selects a provider (e.g. ADHD360, Psychiatry UK)
4. Provider conducts full NICE-aligned assessment
5. Provider submits outcome report → triggers NHS payment milestone

**Documentation requirements driving this app:**
- Structured capture of presenting complaint + history (not free text)
- Screener scores (ASRS-v1.1 Part A, AQ-10 threshold) must be recorded
- Full assessment instrument (DIVA-5, RAADS-R) must be documented
- ICD-10 diagnostic code required for MHSDS national dataset submission
- Outcome report must be structured (diagnosis confirmed/deferred/not confirmed + recommendations)

**Why RTC providers need this module's approach:**
- MHSDS submission requires structured data — free text is not submittable
- CQC inspections check that structured assessment tools were used and scored correctly
- Medicolegal risk: undocumented clinical rationale = liability exposure

---

## Condition Reference

### ADHD (Attention Deficit Hyperactivity Disorder)

**Diagnostic criteria:** DSM-5 (18 symptoms across inattention + hyperactivity/impulsivity domains) — NICE NG87 uses DSM-5 criteria
**Onset criterion:** Symptoms must have been present before age 12 (DSM-5) — DIVA-5 explicitly captures this
**Subtypes:**
- Predominantly Inattentive (formerly ADD)
- Predominantly Hyperactive-Impulsive
- Combined Presentation (most common in adults)

**Adult presentation differences from childhood:**
- Hyperactivity often presents as internal restlessness, not physical overactivity
- Inattention symptoms dominate in adults
- Collateral history (partner, parent) is important but not always available
- Compensation strategies can mask symptoms until high-demand life stage (university, new job)

**Codes:**
- ICD-10: F90.0 (predominantly inattentive), F90.1 (hyperactive-impulsive), F90.2 (combined), F90.9 (unspecified)
- ICD-11: 6A05 (ADHD), 6A05.0 (inattentive), 6A05.1 (hyperactive-impulsive), 6A05.2 (combined)
- SNOMED CT: 406506008 (attention deficit hyperactivity disorder)

**Common co-morbidities (must screen):** Anxiety disorders, depression, sleep disorders, substance use disorder, learning difficulties (dyslexia/dyscalculia), ASD (30–50% co-occurrence)

---

### Autism (Autism Spectrum Disorder / Autistic Spectrum Condition)

**Diagnostic criteria:** ICD-11 uses "Autism Spectrum Disorder" — NICE NG142 explicitly references ICD-11 criteria clinically while acknowledging ICD-10 for coding purposes
**Core feature domains:**
1. Persistent differences in social communication and interaction
2. Restricted, repetitive patterns of behaviour, interests, or activities

**Adult assessment challenges:**
- Masking/camouflaging: learned social scripts hide autistic traits — more common in women
- Late diagnosis pathway: many adults presenting now were diagnosed with anxiety/depression in childhood
- No single gold-standard instrument for adults (ADOS-2 and ADI-R require specialist training — NOT in scope here)
- Qualitative clinical description is as important as scored instruments

**Codes:**
- ICD-10: F84.0 (childhood autism), F84.5 (Asperger syndrome), F84.9 (unspecified) — note: ICD-10 codes are clinically imprecise for adults
- ICD-11: 6A02 (ASD), 6A02.0 (without disorder of intellectual development, functional language not impaired), 6A02.1–6A02.5 (subspecifiers)
- SNOMED CT: 35919005 (autism spectrum disorder)

**Common co-morbidities:** ADHD (30–50% co-occurrence), anxiety disorders, depression, OCD, sensory processing differences, sleep disorders, eating disorders

---

## Assessment Instruments

### ASRS-v1.1 (Adult ADHD Self-Report Scale, version 1.1)

- **Developer:** World Health Organization (WHO) / Kessler et al.
- **Purpose:** ADHD symptom screener for adults
- **Format:** 18 items (Part A = 6 items, Part B = 12 items)
- **Scoring:** 5-point frequency scale (Never / Rarely / Sometimes / Often / Very Often)
  - Part A items scored: Never/Rarely = 0, Sometimes/Often/Very Often = 1
  - Part A score ≥4 = positive screen (high sensitivity for ADHD)
  - Part B informs overall clinical picture but does not threshold
- **LOINC:** 58120-7
- **Note:** ASRS-v1.1 is a screener, not diagnostic — a positive screen triggers full DIVA-5 interview
- **Copyright:** WHO — free to use clinically, no licence fee

---

### DIVA-5 (Diagnostic Interview for ADHD in Adults, version 5)

- **Developer:** Kooij & Francken (Dutch ADHD research group)
- **Purpose:** Structured diagnostic interview for adult ADHD — most widely used in UK private/RTC sector
- **Format:** Structured interview with examiner and patient (+ collateral informant where available)
- **Sections:**
  1. Current ADHD symptoms (18 DSM-5 items, rated for childhood AND adulthood)
  2. Age of onset evidence
  3. Impairment domains: Work/education, Relationships/family, Social contacts, Leisure, Self-confidence/self-image
- **Scoring:** Clinical judgement + threshold counts (≥6 inattentive OR ≥6 hyperactive/impulsive in childhood AND adulthood)
- **Not in CKM** — requires custom archetype
- **Copyright:** DIVA Foundation — free to use, available at divafoundation.org

---

### AQ-10 (Autism Spectrum Quotient — 10 item version)

- **Developer:** Baron-Cohen et al., Cambridge Autism Research Centre
- **Purpose:** Brief autism screener for adults
- **Format:** 10 items, agree/disagree (4-point Likert collapsed to binary)
- **Scoring:** Score ≥6 → proceed to full assessment (threshold for clinical concern)
- **LOINC:** Check before building — LOINC may not have AQ-10 specifically
- **Note:** AQ-10 is a triage tool — a negative screen does not rule out autism if clinical suspicion is high
- **Copyright:** ARC Cambridge — free to use clinically

---

### RAADS-R (Ritvo Autism Asperger Diagnostic Scale — Revised)

- **Developer:** Ritvo et al.
- **Purpose:** Structured autism assessment for adults — 80 items across 4 subscales
- **Format:** Self-report with clinician review; 4-point scale (True now and when a child / True only now / True only when a child / Never true)
- **Subscales and thresholds:**
  | Subscale | Items | Clinical threshold |
  |----------|-------|--------------------|
  | Social Relatedness | 39 | ≥31 |
  | Language | 7 | ≥4 |
  | Sensory-Motor | 20 | ≥16 |
  | Circumscribed Interests | 14 | ≥15 |
  | **Total** | **80** | **≥65** |
- **Note:** Total score ≥65 is consistent with autism — but diagnosis is clinical, not score-only
- **Copyright:** Ritvo et al. — freely available for clinical use

---

## ICD-10 vs ICD-11 — Why Both Matter

**Current NHS position (2026):**
- ICD-10 is **mandatory** for all national dataset submissions (MHSDS, HES)
- No confirmed ICD-11 migration date from NHS England
- ICD-11 transition has been delayed repeatedly (latest: "no earlier than 2027")

**Clinical position:**
- NICE NG142 (2021) explicitly states ICD-11 criteria should be used clinically for autism
- ICD-11 autism categories are more clinically precise than ICD-10 (F84.x codes are outdated)
- Clinicians are using ICD-11 criteria in documentation, ICD-10 codes for billing

**openEHR solution:** One archetype node, two simultaneous terminology bindings
- `ICD-10-CM` binding → national coding (mandatory)
- `ICD-11` binding → clinical documentation
- `SNOMED CT` binding → interoperability

This is not a hack — it is the intended use of openEHR's terminology binding model.

---

## NICE Guideline Summary

### NG87 — ADHD (Nov 2018, updated 2023)

Key requirements for initial assessment:
- Full psychiatric history including onset in childhood
- Detailed account of everyday activities and difficulties (DIVA-5 covers this)
- Collateral history where possible
- Mental state examination
- Physical examination (before medication — not in scope for this app)
- Rule out alternative explanations
- Assess for co-morbidities (especially anxiety, depression, ASD)
- Consider cultural and linguistic factors

### NG142 — Autism (Jun 2021)

Key requirements for initial assessment:
- Multidisciplinary input recommended (though single-clinician assessment is common in RTC)
- Developmental history (ideally with school reports or parent)
- Current presentation across both core domains
- Mental state examination
- Validated assessment tools (AQ-10 for screening; RAADS-R for structured assessment)
- Assess for co-morbidities
- Consider masking — especially in women and people of colour
- Outcome letter must address diagnosis, recommendations, and onward referral

---

## Data Flow in This Module

```
Patient registers (NHS number + name → EHR created in shared EHRbase)
         ↓
ADHDCapture: Clinician completes 7-section ADHD assessment form
         → Composition stored as adhd_initial_assessment
         ↓
AutismCapture: Same patient, separate Autism assessment form
         → Composition stored as autism_initial_assessment
         ↓
Both compositions in same patient EHR (CDR-as-platform model)
         ↓
Module 4 AQL Dashboard queries both composition types for cohort analytics
```

---

## What Is NOT Clinical Scope for These Apps

- ADOS-2 / ADI-R (require specialist training — clinician-administered observational tools)
- Medication management or prescribing
- Follow-up / monitoring appointments (initial assessment only)
- MHSDS submission pipeline (data is captured; submission is infrastructure)
- Patient-facing portal
- Multi-clinician team collaboration
- NHS Spine / e-Referral integration
- Cohort analytics (Module 4)
