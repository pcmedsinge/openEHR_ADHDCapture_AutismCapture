# NeuroCapture Suite — openEHR Neurodevelopmental Assessment Platform

A clinically structured, openEHR-compliant assessment platform for neurodevelopmental conditions.  
Built on EHRbase. Every data point is stored as a valid openEHR composition — structured, coded, and queryable from day one.

---

## Modules

| Module | Condition | Guideline | Instruments |
|---|---|---|---|
| **ADHDCapture** | Adult ADHD | NICE NG87 | ASRS v1.1 · DIVA-5 |
| **AutismCapture** | Adult Autism | NICE NG142 | AQ-10 · RAADS-R *(in development)* |

---

## ADHDCapture — 7-Step Assessment

1. **Patient Setup** — Subject identifier, EHR auto-creation with namespace matching
2. **Developmental History** — Referral narrative, informant, milestones, educational history
3. **ASRS v1.1** — 18-item WHO Adult ADHD Self-Report Scale, live Part A screening logic
4. **DIVA-5** — Inattention and Hyperactivity-Impulsivity domains, childhood and adulthood
5. **Functional Impact** — 7 life domains rated by severity
6. **Comorbidity Screening** — 8 mental health categories + neurodevelopmental comorbidities
7. **Family History** — Conditions and family members with relationship degree

Completed assessment persists to EHRbase as a single valid openEHR composition.

---

## openEHR Architecture

### Custom Archetypes
All archetypes authored from scratch in Better Archetype Designer:

- `openEHR-EHR-CLUSTER.developmental_history.v0`
- `openEHR-EHR-OBSERVATION.asrs_v1_1.v0`
- `openEHR-EHR-OBSERVATION.diva_5.v0`
- `openEHR-EHR-OBSERVATION.functional_impact_adhd.v0`
- `openEHR-EHR-OBSERVATION.comorbidity_screening_adhd.v0`

Standard archetypes reused:
- `openEHR-EHR-OBSERVATION.story.v1` (with developmental history CLUSTER via SLOT)
- `openEHR-EHR-EVALUATION.family_history.v2`

### Template
`adhd_initial_assessment` — compiled OPT in `/templates/`

### Key technical decisions
- **SLOT mechanism** — developmental history CLUSTER embedded inside story OBSERVATION via openEHR SLOT, not as flat fields
- **At-code validation** — all codes validated directly against the compiled OPT; several differ from CKM defaults in the final template
- **RM types** — DV_ORDINAL for scored instruments (ordinal + code + value), DV_CODED_TEXT for clinical classifications, DV_BOOLEAN, DV_COUNT, DV_QUANTITY per archetype constraint
- **FLAT JSON** — composition submitted in FLAT format to EHRbase REST API

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| EHR Backend | EHRbase 2.11.0 |
| Archetype Authoring | Better Archetype Designer |
| Composition Format | openEHR FLAT JSON |
| Infrastructure | Docker |

---

## Running Locally

**Prerequisites:** Docker Desktop

```powershell
# Start EHRbase
docker-compose up -d

# Start ADHDCapture frontend (port 5173)
cd frontend-adhd
npm install
npm run dev
```

EHRbase REST API: `http://localhost:8082/ehrbase/rest`  
ADHDCapture: `http://localhost:5173`

Default credentials: `ehrbase / ehrbase`

Upload the template before first use:
```
POST http://localhost:8082/ehrbase/rest/openehr/v1/definition/template/adl1.4
Content-Type: application/xml
Body: templates/adhd_initial_assessment.opt
```

---

## Repository Structure

```
├── frontend-adhd/          # ADHDCapture React application
├── frontend-autism/        # AutismCapture (in development)
├── templates/              # Compiled OPT files + FLAT JSON examples
├── archetypes/             # Source archetype files
├── docker-compose.yml      # EHRbase + PostgreSQL
├── ARCHETYPE_DESIGN.md     # Archetype design decisions and rationale
├── BUILD_GUIDE.md          # Step-by-step Archetype Designer guide
└── NEURODEVELOPMENTAL_DOMAIN.md  # Clinical domain reference
```

---

## Target Context

NHS Right to Choose (RTC) providers conducting adult neurodevelopmental assessments.  
Designed to demonstrate openEHR-compliant structured data capture for conditions where assessment data is typically lost in unstructured documents.

---

*Part of a two-module series. AutismCapture (AQ-10 + RAADS-R, NICE NG142) in development.*
