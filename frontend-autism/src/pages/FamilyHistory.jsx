// at-codes from openEHR-EHR-EVALUATION.family_history.v2
const RELATIONSHIP_OPTS = [
  { code: '',       value: '— select —' },
  { code: 'at0065', value: 'First degree relative' },
  { code: 'at0066', value: 'Second degree relative' },
  { code: 'at0067', value: 'Third degree relative' },
];

const AQ10_AGREE = new Set([0, 6, 7, 9]);
function aq10Score(aq10) {
  return aq10.reduce((sum, ordinal, i) => sum + (AQ10_AGREE.has(i) ? (ordinal <= 1 ? 1 : 0) : (ordinal >= 2 ? 1 : 0)), 0);
}
const RAADS_SCORES = [0, 1, 2, 3];

export default function FamilyHistory({ fd, update, submitResult }) {
  const addProblem    = () => update('famProblems', [...fd.famProblems, { name: '' }]);
  const removeProblem = i  => update('famProblems', fd.famProblems.filter((_, idx) => idx !== i));
  const setProblem    = (i, v) => { const n=[...fd.famProblems]; n[i]={name:v}; update('famProblems',n); };

  const addMember    = () => update('famMembers', [...fd.famMembers, { name: '', relationship: '', relationshipCode: '' }]);
  const removeMember = i  => update('famMembers', fd.famMembers.filter((_, idx) => idx !== i));
  const setMember    = (i, f, v) => { const n=[...fd.famMembers]; n[i]={...n[i],[f]:v}; update('famMembers',n); };
  const setRelationship = (i, code) => {
    const opt = RELATIONSHIP_OPTS.find(o => o.code === code);
    const n = [...fd.famMembers];
    n[i] = { ...n[i], relationshipCode: code, relationship: opt?.value || '' };
    update('famMembers', n);
  };

  const aqScore = aq10Score(fd.aq10);
  const raadsTotal = fd.raads.reduce((sum, ordinal) => sum + RAADS_SCORES[ordinal], 0);

  return (
    <>
      <div className="card">
        <div className="card-title">Family History — Conditions</div>
        <div className="card-body">
          <p className="card-subtitle">List diagnoses or conditions that run in the family.</p>
          {fd.famProblems.map((p, i) => (
            <div key={i} className="repeater-row">
              <input type="text" value={p.name} onChange={e => setProblem(i, e.target.value)}
                placeholder="Condition / diagnosis (e.g. Autism, ADHD, anxiety)" />
              {fd.famProblems.length > 1 && (
                <button className="btn-icon btn-remove" onClick={() => removeProblem(i)}>×</button>
              )}
            </div>
          ))}
          <button className="btn-icon btn-add" onClick={addProblem}
            style={{ width:'auto', padding:'5px 14px', fontSize:13, borderRadius:7 }}>
            + Add condition
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Family History — Members</div>
        <div className="card-body">
          <p className="card-subtitle">Record relevant family members and their relationship to the patient.</p>
          {fd.famMembers.map((m, i) => (
            <div key={i} className="repeater-row">
              <input type="text" value={m.name} onChange={e => setMember(i,'name',e.target.value)}
                placeholder="Name or identifier (e.g. Mother)" style={{ flex:2 }} />
              <select value={m.relationshipCode || ''} onChange={e => setRelationship(i, e.target.value)}
                style={{ flex:1, padding:'8px 32px 8px 12px', border:'1.5px solid #e2e8f0', borderRadius:7, fontFamily:'inherit', fontSize:13.5, appearance:'none', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center` }}>
                {RELATIONSHIP_OPTS.map(o => <option key={o.code} value={o.code}>{o.value}</option>)}
              </select>
              {fd.famMembers.length > 1 && (
                <button className="btn-icon btn-remove" onClick={() => removeMember(i)}>×</button>
              )}
            </div>
          ))}
          <button className="btn-icon btn-add" onClick={addMember}
            style={{ width:'auto', padding:'5px 14px', fontSize:13, borderRadius:7 }}>
            + Add family member
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Assessment Summary</div>
        <div className="card-body">
          <p className="card-subtitle">Review before submitting to EHRbase.</p>
          <div className="summary-grid">
            <div className="summary-chip">
              <div className="label">Patient ID</div>
              <div className="value">{fd.subjectId || '—'}</div>
            </div>
            <div className="summary-chip">
              <div className="label">AQ-10 Score</div>
              <div className="value" style={{ color: aqScore >= 6 ? '#be123c' : undefined }}>
                {aqScore} / 10 {aqScore >= 6 ? '— +ve' : ''}
              </div>
            </div>
            <div className="summary-chip">
              <div className="label">RAADS-R Total</div>
              <div className="value" style={{ color: raadsTotal >= 65 ? '#be123c' : undefined }}>
                {raadsTotal} / 240 {raadsTotal >= 65 ? '— +ve' : ''}
              </div>
            </div>
            <div className="summary-chip">
              <div className="label">Func. Domains Impaired</div>
              <div className="value">{fd.funcImpact.slice(0, 6).filter(v => v > 0).length} / 6</div>
            </div>
            <div className="summary-chip">
              <div className="label">Comorbidities Flagged</div>
              <div className="value">{fd.comorbidity.filter(v => v > 0).length} / 8</div>
            </div>
            <div className="summary-chip">
              <div className="label">EHR</div>
              <div className="value" style={{ fontFamily:'monospace', fontSize:11 }}>
                {fd.ehrId ? fd.ehrId.slice(0,16)+'…' : 'Auto on submit'}
              </div>
            </div>
          </div>

          {!fd.subjectId.trim() && (
            <div className="alert alert-warn" style={{ marginTop: 16 }}>
              No Patient ID entered. Go back to Step 1 and enter an identifier before submitting.
            </div>
          )}
          {submitResult && (
            <div className="alert alert-success" style={{ marginTop: 16 }}>
              <strong>Composition saved successfully.</strong>
              <div style={{ fontFamily: 'monospace', fontSize: 12, marginTop: 6, wordBreak: 'break-all' }}>
                {submitResult.uid}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
