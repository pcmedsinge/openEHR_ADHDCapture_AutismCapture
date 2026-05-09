const DOMAINS = [
  'Occupational / work performance',
  'Academic / educational performance',
  'Relationship and family functioning',
  'Social functioning',
  'Daily living and self-care',
  'Financial management',
  'Global functional impairment (overall)',
];
const LABELS = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];

export default function FunctionalImpact({ fd, update }) {
  function setImpact(i, val) {
    const next = [...fd.funcImpact];
    next[i] = val;
    update('funcImpact', next);
  }
  const domainsImpaired = fd.funcImpact.slice(0, 6).filter(v => v > 0).length;

  return (
    <div className="card">
      <div className="card-title">Functional Impact Assessment</div>
      <div className="card-body">
        <p className="card-subtitle">
          Rate severity of impact on each life domain. Domain count is auto-calculated ({domainsImpaired} / 6 impaired).
        </p>
        {DOMAINS.map((label, i) => (
          <div key={i} className="ordinal-row">
            <label>{label}</label>
            <select value={fd.funcImpact[i]} onChange={e => setImpact(i, parseInt(e.target.value))}>
              {LABELS.map((l, idx) => <option key={idx} value={idx}>{l}</option>)}
            </select>
          </div>
        ))}
        <div className="field-row" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Domain impairment description</label>
            <textarea value={fd.domainDescription} onChange={e => update('domainDescription', e.target.value)}
              placeholder="Describe how symptoms affect each domain in the patient's own words" />
          </div>
          <div className="field">
            <label>Comment</label>
            <textarea value={fd.funcComment} onChange={e => update('funcComment', e.target.value)}
              placeholder="Additional functional assessment notes" />
          </div>
        </div>
      </div>
    </div>
  );
}
