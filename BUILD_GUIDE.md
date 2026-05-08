# Archetype Designer — Step-by-Step Build Guide

*Written during build session — 2026-05-07*
*Use this to repeat or continue any archetype build in a new session*

---

## Part 1 — One-Time Setup (already done — skip if repository exists)

### Step A — Open Archetype Designer
1. Go to tools.openehr.org/designer
2. Log in with your account (paragmedsinge@gmail.com)
3. The Repositories screen appears listing all existing repositories

### Step B — Create the Module 3 repository
1. Click **New Repository** (or **+ New** on the repositories screen)
2. Fill in:
   - **Name:** `Module3_NeuroCapture`
   - **Description:** `ADHDCapture + AutismCapture — shared clusters and assessment templates`
3. Leave everything else default (empty repository, not cloning from Git)
4. Click **Create**
5. The empty repository opens — shows `Archetypes (0)` and `Templates (0)`

### Step C — Import all CKM archetypes from ZIP
1. Click **Import** in the top navbar
2. Select **Import from ZIP** (or Upload ZIP)
3. Select the full CKM archetypes ZIP file from your local machine
4. Wait for import to complete — Archetypes count will jump to ~937
5. Verify: filter by "Cluster" and search `education_record` — should return 1 result (`openEHR-EHR-CLUSTER.education_record.v1`)

**Note:** The ZIP only needs to be imported once. If the repository already has 937 archetypes, skip this step.

---

## Part 2 — Tool Reference

**Tool:** Better Archetype Designer (tools.openehr.org/designer) — v1.25.6-A2
**Repository:** `Module3_NeuroCapture`

### Left Sidebar Icon Map (confirmed)

| Position | Label | openEHR Type |
|----------|-------|--------------|
| 1st | Text | DV_TEXT |
| 2nd | Coded Text | DV_CODED_TEXT |
| 3rd | Quantity | DV_QUANTITY |
| 4th | Proportion | DV_PROPORTION |
| 5th | Count | DV_COUNT |
| 6th | DateTime | DV_DATE_TIME |
| 7th | Time | DV_TIME |
| 8th | Date | DV_DATE |
| 9th | Ordinal | DV_ORDINAL |
| 10th | Boolean | DV_BOOLEAN |
| 11th | Any | DV_ANY |
| 12th | Cluster | nested CLUSTER |
| 13th | Slot (cluster) | CLUSTER SLOT |
| 14th | Duration | DV_DURATION |
| 15th | Identifier | DV_IDENTIFIER |

### General Rules
- Always select the **parent node** before clicking a left sidebar icon — the new element is added as a child of the selected node
- **Naming a node:** click the pencil/edit icon on the node row → type the name → confirm
- **Occurrences:** click the Occurrences field in the right panel → type new value (e.g. `1..1`, `0..1`, `0..*`)
- **DV_CODED_TEXT internal value set:** select Internal coded → click Edit → add terms one by one with + Add → Save
- **DV_QUANTITY unit:** click + next to Units → Category: Time → Unit: `a` (for years) → Add
- **Saving the archetype:** top navbar → Save (do this regularly)
- **Copy-paste a node:** click copy icon on the node → select parent/root node → click paste icon on parent toolbar → rename the copy

---

## CLUSTER 1 — `openEHR-EHR-CLUSTER.developmental_history.v0`

### Step 1 — Create the archetype
1. Inside `Module3_NeuroCapture` repository → click green **+ New** → **Cluster**
2. Dialog: Concept = `developmental_history`, Version = `0`, Language = `English (en)` → **Create**
3. Archetype editor opens with root node `developmental_history`

---

### Step 2 — Node 1: Informant (DV_CODED_TEXT, mandatory)
1. Select root `developmental_history` node
2. Click **2nd icon — Coded Text**
3. Click pencil icon → name: `Informant` → confirm
4. Right panel: Occurrences → change to `1..1`
5. Right panel: click **Internal coded** radio button
6. Click blue **Edit** button → Create term dialog opens
7. Add 8 terms (click **+ Add** between each):
   - `Self only`
   - `Parent or guardian`
   - `Partner or spouse`
   - `Sibling`
   - `School report`
   - `Previous assessment report`
   - `Multiple sources`
   - `Other`
8. Click **Save**

---

### Step 3 — Node 2: Age of first concerns (DV_QUANTITY, optional)
1. Select root `developmental_history` node
2. Click **3rd icon — Quantity**
3. Click pencil icon → name: `Age of first concerns` → confirm
4. Occurrences stays `0..1` (optional)
5. Right panel: click **+** next to Units → Add unit dialog:
   - Category: `Time`
   - Unit: `a`
   - Click **Add**
6. Right panel: **Limit decimal places** → type `0`

---

### Step 4 — Node 3: Childhood presentation (DV_TEXT, optional)
1. Select root `developmental_history` node
2. Click **1st icon — Text**
3. Click pencil icon → name: `Childhood presentation` → confirm
4. Occurrences stays `0..1`
5. No other constraints needed

---

### Step 5 — Node 4: Developmental milestones (nested CLUSTER)
1. Select root `developmental_history` node
2. Click **12th icon — Cluster**
3. Click pencil icon → name: `Developmental milestones` → confirm
4. Occurrences stays `0..1`

#### Node 4a: Motor development (DV_CODED_TEXT)
1. Select `Developmental milestones` node
2. Click **2nd icon — Coded Text**
3. Name: `Motor development`, Occurrences `0..1`, Internal coded
4. Terms: `Normal` / `Delayed` / `Significantly delayed` / `Unknown`

#### Node 4b: Speech and language (DV_CODED_TEXT)
1. Select `Developmental milestones` node
2. Click **2nd icon — Coded Text**
3. Name: `Speech and language`, Occurrences `0..1`, Internal coded
4. Terms: `Normal` / `Delayed` / `Significantly delayed` / `Unknown`

#### Node 4c: Social development (DV_CODED_TEXT)
1. Select `Developmental milestones` node
2. Click **2nd icon — Coded Text**
3. Name: `Social development`, Occurrences `0..1`, Internal coded
4. Terms: `Normal` / `Atypical` / `Significantly atypical` / `Unknown`

#### Node 4d: Milestone details (DV_TEXT)
1. Select `Developmental milestones` node
2. Click **1st icon — Text**
3. Name: `Milestone details`, Occurrences `0..1`
4. No other constraints

---

### Step 6 — Node 5: Educational history (CLUSTER SLOT, 0..*)
1. Select root `developmental_history` node
2. Click **13th icon — Slot (cluster)**
3. Click pencil icon → name: `Educational history` → confirm
4. Occurrences: `0..*` (already set by default for slots)
5. Right panel — constrain the slot:
   - Uncheck **Include all**
   - Click the **+** button that appears in the Includes section
   - An **"Add assertions"** dialog opens with a search field
   - Type `education` in the search field
   - `openEHR-EHR-CLUSTER.education_record.v1` appears in the list
   - Click on it to select it (row highlights)
   - Click **Add**
   - Slot is now constrained to only accept `education_record.v1`

---

### Step 7 — Node 6: Special educational needs (DV_BOOLEAN, optional)
1. Select root `developmental_history` node
2. Click **10th icon — Boolean**
3. Name: `Special educational needs`, Occurrences `0..1`

---

### Step 8 — Node 7: EHCP or SEN statement (DV_BOOLEAN, optional)
1. Select root `developmental_history` node
2. Click **10th icon — Boolean**
3. Name: `EHCP or SEN statement`, Occurrences `0..1`

---

### Step 9 — Node 8: Previous professional input (DV_TEXT, optional)
1. Select root `developmental_history` node
2. Click **1st icon — Text**
3. Name: `Previous professional input`, Occurrences `0..1`

---

### Step 10 — Node 9: Collateral documentation (DV_CODED_TEXT, optional)
1. Select root `developmental_history` node
2. Click **2nd icon — Coded Text**
3. Name: `Collateral documentation`, Occurrences `0..1`, Internal coded
4. Terms:
   - `None available`
   - `School reports`
   - `Previous assessment reports`
   - `Parent questionnaire completed`
   - `Multiple documents`

---

### Step 11 — Node 10: Comment (DV_TEXT, optional)
1. Select root `developmental_history` node
2. Click **1st icon — Text**
3. Name: `Comment`, Occurrences `0..1`

---

### Step 12 — Add archetype metadata
1. Select the root `developmental_history` node in the tree
2. Click **Details** tab (top right panel)
3. The Details tab shows **Description**, **Comment**, and **Bindings** only (no separate Purpose/Use/Misuse fields in this version)
4. Fill in:
   - **Description:** `Captures childhood developmental evidence required by NICE NG87 (ADHD) and NG142 (Autism) to establish neurodevelopmental onset. Informant field is mandatory — self-report-only history has different diagnostic weight than corroborated history.`
   - **Comment:** `Use in Section 5 of both ADHDCapture and AutismCapture templates. Not for recording current adult functional status — use the functional_impact cluster for that.`
   - Leave **Bindings** empty

---

### Step 13 — Save
Top navbar → **Save**

---

## CLUSTER 2 — `openEHR-EHR-CLUSTER.functional_impact.v0`

*(Build after developmental_history is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `functional_impact`, Version: `0` → Create

### Step 2 — Node 1: Occupational / work impairment (DV_ORDINAL)
1. Select root node → **9th icon — Ordinal**
2. Name: `Occupational work impairment`, Occurrences `0..1`
3. Right panel — add ordinal values (click + to add each row):
   | Value | Label |
   |-------|-------|
   | 0 | None |
   | 1 | Mild |
   | 2 | Moderate |
   | 3 | Severe |

### Step 3 — Nodes 2–6: Remaining domain impairments (DV_ORDINAL, same scale)
Repeat Step 2 for each — same 4 ordinal values (0=None / 1=Mild / 2=Moderate / 3=Severe):
- `Academic educational impairment`
- `Relationship family impairment`
- `Social functioning impairment`
- `Daily living self care impairment`
- `Financial management impairment`

### Step 4 — Node 7: Domain impairment description (DV_TEXT)
1st icon → `Domain impairment description`, `0..1`

### Step 5 — Node 8: Number of domains impaired (DV_COUNT)
5th icon → `Number of domains impaired`, `0..1`

### Step 6 — Node 9: Global functional impairment (DV_ORDINAL)
9th icon → `Global functional impairment`, `0..1`, same 4-value scale (0=None / 1=Mild / 2=Moderate / 3=Severe)

### Step 7 — Node 10: Comment (DV_TEXT)
1st icon → `Comment`, `0..1`

### Step 8 — Details tab
- Purpose: Records degree of functional impairment across life domains as required by NICE NG87 Section 1.3 and NG142 Section 1.2
- Misuse: Not a diagnostic instrument — impairment ratings support clinical impression only

### Step 9 — Save

---

## CLUSTER 3 — `openEHR-EHR-CLUSTER.comorbidity_screening.v0`

*(Build after functional_impact is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `comorbidity_screening`, Version: `0` → Create

### Nodes 1–7: Condition severity screens (DV_ORDINAL, 0..1 each)
Same 4-value ordinal scale for each: 0=No concern / 1=Mild / 2=Moderate / 3=Severe concern

Use **9th icon — Ordinal** for each:
- `Anxiety`
- `Depression`
- `Sleep disorder`
- `Mood disorder bipolar`
- `OCD`
- `Trauma PTSD`
- `Eating disorder`

### Node 8: Substance use concern (DV_ORDINAL)
Same scale: 0=No concern / 1=Mild / 2=Moderate / 3=Severe concern

### Node 9: Substance detail (DV_TEXT)
1st icon → `Substance detail`, `0..1`

### Nodes 10–12: Learning difficulties (DV_BOOLEAN, 0..1 each)
10th icon — Boolean for each:
- `Dyslexia`
- `Dyscalculia`
- `DCD dyspraxia`

### Node 13: Cross-condition screen (DV_CODED_TEXT)
2nd icon → `Cross condition screen`, `0..1`, Internal coded
Terms: `Not screened` / `Screened negative` / `Screened positive` / `Previously diagnosed`

### Node 14: Cross-condition name (DV_TEXT)
1st icon → `Cross condition name`, `0..1`

### Node 15: Other comorbidities (DV_TEXT)
1st icon → `Other comorbidities`, `0..1`

### Node 16: Referral recommended (DV_BOOLEAN)
10th icon → `Referral recommended`, `0..1`

### Node 17: Comment (DV_TEXT)
1st icon → `Comment`, `0..1`

### Details tab
- Purpose: Structured screening for conditions commonly co-occurring with ADHD and Autism, required by NICE NG87 Section 1.3.4 and NG142 Section 1.2.6
- Misuse: Not for recording confirmed diagnoses — use problem_diagnosis for confirmed conditions

### Save

---

## CLUSTER 4 — `openEHR-EHR-CLUSTER.asrs_v11_screener.v0`

*(ADHDCapture only — build after comorbidity_screening is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `asrs_v11_screener`, Version: `0` → Create

---

### Steps 2–19 — Items 1 through 18 (DV_ORDINAL, all identical)

For **each** of the 18 items, repeat this sequence:
1. Select root `asrs_v11_screener` node
2. Click **9th icon — Ordinal**
3. Click pencil icon → name: `Item N` (e.g. `Item 1`, `Item 2` … `Item 18`) → confirm
4. Occurrences: `0..1` (default)
5. Right panel → click **Edit**
6. Add 5 ordinal rows (click + for each row):
   | Value | Text |
   |-------|------|
   | 0 | Never |
   | 1 | Rarely |
   | 2 | Sometimes |
   | 3 | Often |
   | 4 | Very Often |
7. Click **Save**

**Important:** The copy button does not work in v1.25.6-A2 — each item must be created manually.

**Part A = Items 1–6, Part B = Items 7–18.** Build all 18 in sequence under the root node.

If any item is skipped, it can be added afterwards by creating it at the root level and dragging it into the correct position in the tree.

---

### Step 20 — Part A score (DV_COUNT)
1. Select root node → **5th icon — Count**
2. Name: `Part A score`, Occurrences `0..1`
3. Right panel: check **Min** → type `0`; check **Max** → type `24`

### Step 21 — Part B score (DV_COUNT)
1. Select root node → **5th icon — Count**
2. Name: `Part B score`, Occurrences `0..1`
3. Right panel: Min `0`, Max `48`

### Step 22 — Total score (DV_COUNT)
1. Select root node → **5th icon — Count**
2. Name: `Total score`, Occurrences `0..1`
3. Right panel: Min `0`, Max `72`

**Note on DV_COUNT vs DV_QUANTITY for scores:** DV_COUNT is correct here — scores are plain integers with no physical unit. DV_QUANTITY requires a unit category (the Add unit dialog only offers categories like Time, Mass, etc. — no "dimensionless" option). Use DV_COUNT for any unitless integer.

### Step 23 — Part A positive screen (DV_BOOLEAN)
1. Select root node → **10th icon — Boolean**
2. Name: `Part A positive screen`, Occurrences `0..1`

---

### Step 24 — Details tab
1. Select root `asrs_v11_screener` node → click **Details** tab
2. Fill in:
   - **Description:** `18-item WHO ADHD Self-Report Scale v1.1 (ASRS-v1.1). Items 1-6 form Part A — a score of 4 or more on Part A is a positive screen indicating high probability of ADHD and warrants full diagnostic interview. Items 7-18 form Part B providing additional symptom detail.`
   - **Comment:** `Use in ADHDCapture template only. Part A positive screen flag should be auto-calculated from Item 1-6 scores in the application layer. Scores reflect frequency: 0=Never, 1=Rarely, 2=Sometimes, 3=Often, 4=Very Often.`

### Step 25 — Save
Top navbar → **Save**

---

## CLUSTER 5 — `openEHR-EHR-CLUSTER.diva_5_interview.v0`

*(ADHDCapture only — build after asrs_v11_screener is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `diva_5_interview`, Version: `0` → Create

---

### Step 2 — Sub-cluster: Childhood inattention
1. Select root `diva_5_interview` node → **12th icon — Cluster**
2. Name: `Childhood inattention`, Occurrences `0..1`
3. Select `Childhood inattention` node → add 9 boolean items (**10th icon — Boolean**, `0..1` each):
   - `Inattention item 1` through `Inattention item 9`
4. After adding, scroll through tree and verify all 9 are present — items are frequently skipped accidentally

### Step 3 — Sub-cluster: Adulthood inattention
1. Select root node → **12th icon — Cluster**
2. Name: `Adulthood inattention`, Occurrences `0..1`
3. Select `Adulthood inattention` node → add 9 boolean items:
   - `Inattention item 1` through `Inattention item 9`

### Step 4 — Sub-cluster: Childhood hyperactivity impulsivity
1. Select root node → **12th icon — Cluster**
2. Name: `Childhood hyperactivity impulsivity`, Occurrences `0..1`
3. Select sub-cluster → add 9 boolean items:
   - `HI item 1` through `HI item 9`

### Step 5 — Sub-cluster: Adulthood hyperactivity impulsivity
1. Select root node → **12th icon — Cluster**
2. Name: `Adulthood hyperactivity impulsivity`, Occurrences `0..1`
3. Select sub-cluster → add 9 boolean items:
   - `HI item 1` through `HI item 9`

**Note:** After each sub-cluster, verify item count before moving on. Missing items (accidentally skipped) must be added and dragged into position.

---

### Steps 6–9 — Count nodes (at root level)
Select root node for each → **5th icon — Count**, `0..1`, Min `0`, Max `9`:
- `Childhood inattention count`
- `Adulthood inattention count`
- `Childhood HI count`
- `Adulthood HI count`

---

### Step 10 — Age of onset (DV_CODED_TEXT)
1. Select root node → **2nd icon — Coded Text**
2. Name: `Age of onset`, Occurrences `0..1`
3. Internal coded → Edit → add 4 terms:
   - `Before age 7`
   - `Before age 12`
   - `After age 12`
   - `Unclear`
4. Save

---

### Step 11 — Sub-cluster: Impairment domains
1. Select root node → **12th icon — Cluster**
2. Name: `Impairment domains`, Occurrences `0..1`
3. Select `Impairment domains` node → add 5 boolean items (**10th icon — Boolean**, `0..1` each):
   - `Work or education`
   - `Relationships`
   - `Social functioning`
   - `Leisure activities`
   - `Self confidence`

---

### Step 12 — Clinician summary (DV_TEXT)
1. Select root node → **1st icon — Text**
2. Name: `Clinician summary`, Occurrences `0..1`

---

### Step 13 — Details tab
Select root node → Details tab:
- **Description:** `Structured diagnostic interview for adult ADHD (DIVA-5). Captures DSM-5 symptom presence across childhood and adulthood timepoints for both inattention and hyperactivity-impulsivity domains. Required by NICE NG87 for confirmed ADHD diagnosis in adults.`
- **Comment:** `Use in ADHDCapture template only. Item text (full DSM-5 wording) is rendered by the frontend — archetypes store structured boolean responses only. Count nodes should be auto-calculated from item responses in the application layer.`

### Step 14 — Save
Top navbar → **Save**

---

## CLUSTER 6 — `openEHR-EHR-CLUSTER.aq10_screener.v0`

*(AutismCapture only — build after diva_5_interview is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `aq10_screener`, Version: `0` → Create

### Steps 2–11 — Items 1 through 10 (DV_ORDINAL)
For each item: select root `aq10_screener` node → **9th icon — Ordinal** → name `Item N` → Occurrences `0..1` → Edit → add 4 values → Save:

| Value | Text |
|-------|------|
| 0 | Definitely agree |
| 1 | Slightly agree |
| 2 | Slightly disagree |
| 3 | Definitely disagree |

### Step 12 — Total score (DV_COUNT)
Root node → **5th icon — Count** → `Total score`, `0..1`, Min `0`, Max `10`

### Step 13 — Threshold met (DV_BOOLEAN)
Root node → **10th icon — Boolean** → `Threshold met`, `0..1`

### Step 14 — Details tab
- **Description:** `10-item Autism Spectrum Quotient screening tool (AQ-10). A total score of 6 or above indicates possible autism and warrants referral for full diagnostic assessment. Used in line with NICE NG142 recommendation for initial screening of adults.`
- **Comment:** `Use in AutismCapture template only. Scoring logic (which response scores 1 point per item) is applied in the application layer — items 1, 7, 8, 10 score on agree responses; items 2, 3, 4, 5, 6, 9 score on disagree responses.`

### Step 15 — Save
Top navbar → **Save**

---

## CLUSTER 7 — `openEHR-EHR-CLUSTER.raads_r_assessment.v0`

*(AutismCapture only — build after aq10_screener is saved)*

### Step 1 — Create
+ New → Cluster → Concept: `raads_r_assessment`, Version: `0` → Create

### Step 2 — Create Item 1 (template for all 80 items)
1. Select root `raads_r_assessment` node → **9th icon — Ordinal**
2. Name: `Item 1`, Occurrences `0..1`
3. Edit → add 4 values:

| Value | Text |
|-------|------|
| 0 | Never true |
| 1 | True only when I was younger than 16 |
| 2 | True only now |
| 3 | True now and when I was younger than 16 |

4. Save

### Steps 3–81 — Items 2 through 80 (copy-paste method)
**Copy-paste process (confirmed working in v1.25.6-A2):**
1. Click **copy icon** on the node to duplicate
2. Select root `raads_r_assessment` node
3. Click **paste icon** on the root node toolbar
4. Rename the pasted copy to the next item number

Repeat for Items 2–80. Verify count before adding score nodes.

### Steps 82–86 — Subscale and total scores (DV_COUNT)
Select root node for each → **5th icon — Count**, `0..1`:

| Node name | Min | Max |
|-----------|-----|-----|
| `Social relatedness score` | 0 | 135 |
| `Language score` | 0 | 21 |
| `Sensory motor score` | 0 | 54 |
| `Circumscribed interests score` | 0 | 30 |
| `Total score` | 0 | 240 |

### Step 87 — Threshold met (DV_BOOLEAN)
Root node → **10th icon — Boolean** → `Threshold met`, `0..1`

### Step 88 — Details tab
- **Description:** `80-item Ritvo Autism Asperger Diagnostic Scale — Revised (RAADS-R). Each item captures lifetime symptom presence across four domains: social relatedness, language, sensory-motor, and circumscribed interests. A total score of 65 or above is a strong indicator of autism spectrum disorder in adults.`
- **Comment:** `Use in AutismCapture template only. Item text is rendered by the frontend. Subscale and total scores should be calculated by the application layer from item responses. Threshold ≥65 for total score. Administered as a clinician-guided self-report.`

### Step 89 — Save
Top navbar → **Save**

---

## TEMPLATE 1 — `adhd_initial_assessment`

*(Build after all CLUSTER archetypes are saved)*

### Step 1 — Create the template
1. In `Module3_NeuroCapture` repository → click **+ New** → **Template**
2. Dialog:
   - **Rm Type:** `COMPOSITION` (already set)
   - **Root Archetype Id:** click dropdown → search `encounter` → select `openEHR-EHR-COMPOSITION.encounter.v1`
   - **Template Id:** `adhd_initial_assessment`
3. Click **Create**
4. Template editor opens showing composition structure with `context` and `content` sections

### Step 2 — Save dialog
When clicking Save for the first time a "Save changes" dialog appears:
- **New version:** `0.1.0` (auto-filled) — leave as-is
- Click **Save**

### Step 3 — Add Story/History entry archetype
1. Click **`→ content`** node in the tree
2. In right panel "Add archetype" search, type `story`
3. Select **`openEHR-EHR-OBSERVATION.story.v1`** → Add
4. Story/History entry appears under content with `Structured detail` CLUSTER slot

### Step 4 — Add all 5 CLUSTERs to Structured detail
Click **`Structured detail`** node (inside Story/History → data → Any event → data). Right panel shows "Add archetype". Add each CLUSTER by searching and clicking:

| Search term | Archetype to add |
|-------------|-----------------|
| `developmental` | `openEHR-EHR-CLUSTER.developmental_history.v0` |
| `asrs` | `openEHR-EHR-CLUSTER.asrs_v11_screener.v0` |
| `diva` | `openEHR-EHR-CLUSTER.diva_5_interview.v0` |
| `functional` | `openEHR-EHR-CLUSTER.functional_impact.v0` |
| `comorbidity` | `openEHR-EHR-CLUSTER.comorbidity_screening.v0` |

**Note on why all CLUSTERs go under Structured detail:** No dedicated self-rating OBSERVATION archetype is available in CKM for ASRS/DIVA-5. Structured detail (SLOT CLUSTER, 0..*) accepts any CLUSTER — using Story/History as the shared entry archetype container is pragmatic for a teaching module. In production, build custom ENTRY archetypes for each CLUSTER.

### Step 5 — Add Family history at content level
1. Click **`→ content`** node
2. Search `family_history` → add **`openEHR-EHR-EVALUATION.family_history.v2`**

### Step 6 — Add Problem/Diagnosis at content level
1. Click **`→ content`** node
2. Search `problem_diagnosis` → add **`openEHR-EHR-EVALUATION.problem_diagnosis.v1`**

### Step 7 — Save
Top navbar → **Save**

**Final template structure:**
```
adhd_initial_assessment (encounter.v1)
└── content
    ├── Story/History (story.v1)
    │   └── Structured detail
    │       ├── developmental_history.v0
    │       ├── asrs_v11_screener.v0
    │       ├── diva_5_interview.v0
    │       ├── functional_impact.v0
    │       └── comorbidity_screening.v0
    ├── Family history summary (family_history.v2)
    └── Problem/Diagnosis (problem_diagnosis.v1)
```

---

## TEMPLATE 2 — `autism_initial_assessment`

*(Build after adhd_initial_assessment is saved)*

### Step 1 — Create the template
1. **+ New** → **Template**
2. Root Archetype Id: `openEHR-EHR-COMPOSITION.encounter.v1`
3. Template Id: `autism_initial_assessment`
4. Click **Create** → Save dialog → version `0.1.0` → **Save**

### Step 2 — Add Story/History
Click **`→ content`** → search `story` → add `openEHR-EHR-OBSERVATION.story.v1`

### Step 3 — Add 5 CLUSTERs to Structured detail
Click **`Structured detail`** node → add each:

| Search | Archetype |
|--------|-----------|
| `developmental` | `openEHR-EHR-CLUSTER.developmental_history.v0` |
| `aq10` | `openEHR-EHR-CLUSTER.aq10_screener.v0` |
| `raads` | `openEHR-EHR-CLUSTER.raads_r_assessment.v0` |
| `functional` | `openEHR-EHR-CLUSTER.functional_impact.v0` |
| `comorbidity` | `openEHR-EHR-CLUSTER.comorbidity_screening.v0` |

### Step 4 — Add Family history and Problem/Diagnosis at content level
Click **`→ content`** for each:
- Search `family_history` → add `openEHR-EHR-EVALUATION.family_history.v2`
- Search `problem_diagnosis` → add `openEHR-EHR-EVALUATION.problem_diagnosis.v1`

### Step 5 — Save
Top navbar → **Save**

**Final template structure:**
```
autism_initial_assessment (encounter.v1)
└── content
    ├── Story/History (story.v1)
    │   └── Structured detail
    │       ├── developmental_history.v0
    │       ├── aq10_screener.v0
    │       ├── raads_r_assessment.v0
    │       ├── functional_impact.v0
    │       └── comorbidity_screening.v0
    ├── Family history summary (family_history.v2)
    └── Problem/Diagnosis (problem_diagnosis.v1)
```
