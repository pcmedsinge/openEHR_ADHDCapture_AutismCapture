const MENTAL_HEALTH = [
  'Anxiety disorder',
  'Depression / persistent depressive disorder',
  'Sleep disorder',
  'Mood disorder / bipolar spectrum',
  'OCD',
  'Trauma / PTSD',
  'Eating disorder',
  'Substance use concern',
];
const CONCERN_LABELS = ['No concern', 'Possible concern', 'Significant concern'];
const CROSS_OPTS = [
  { code:'at0046', value:'Not screened' },
  { code:'at0047', value:'Screened — negative' },
  { code:'at0048', value:'Screened positive — not referred' },
  { code:'at0049', value:'Screened positive — referred' },
];

const sectionLabel = { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 10, display: 'block' };
const divider = { borderTop: '1px solid #f1f5f9', margin: '16px 0' };

export default function ComorbidityScreening({ fd, update }) {
  function setComorb(i, val) {
    const next = [...fd.comorbidity];
    next[i] = val;
    update('comorbidity', next);
  }
  function setCross(code) {
    const o = CROSS_OPTS.find(x => x.code === code);
    update('crossCondScreen', code);
    update('crossCondScreenValue', o.value);
  }

  return (
    <div className="card">
      <div className="card-title">Comorbidity Screening</div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left — mental health ordinals */}
          <div>
            <span style={sectionLabel}>Mental health — level of clinical concern</span>
            {MENTAL_HEALTH.map((label, i) => (
              <div key={i} className="ordinal-row-compact">
                <label>{label}</label>
                <select value={fd.comorbidity[i]} onChange={e => setComorb(i, parseInt(e.target.value))}>
                  {CONCERN_LABELS.map((l, idx) => <option key={idx} value={idx}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Right — neurodevelopmental + cross-condition + referral */}
          <div>
            <span style={sectionLabel}>Neurodevelopmental comorbidities</span>
            <div className="checkbox-field">
              <input type="checkbox" id="dyslexia" checked={fd.dyslexia} onChange={e => update('dyslexia', e.target.checked)} />
              <label htmlFor="dyslexia">Dyslexia</label>
            </div>
            <div className="checkbox-field">
              <input type="checkbox" id="dyscalculia" checked={fd.dyscalculia} onChange={e => update('dyscalculia', e.target.checked)} />
              <label htmlFor="dyscalculia">Dyscalculia</label>
            </div>
            <div className="checkbox-field">
              <input type="checkbox" id="dcd" checked={fd.dcdDyspraxia} onChange={e => update('dcdDyspraxia', e.target.checked)} />
              <label htmlFor="dcd">DCD / Dyspraxia</label>
            </div>

            <div style={divider} />

            <span style={sectionLabel}>Cross-condition screening</span>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>
              If another condition was co-screened during this appointment, record the outcome.
            </p>
            <div className="field">
              <label>Screening outcome</label>
              <select value={fd.crossCondScreen} onChange={e => setCross(e.target.value)}>
                {CROSS_OPTS.map(o => <option key={o.code} value={o.code}>{o.value}</option>)}
              </select>
            </div>
            {fd.crossCondScreen !== 'at0046' && (
              <div className="field">
                <label>Condition screened for</label>
                <input type="text" value={fd.crossCondName} onChange={e => update('crossCondName', e.target.value)}
                  placeholder="e.g. Autism / ASD" />
              </div>
            )}

            <div style={divider} />

            <div className="checkbox-field">
              <input type="checkbox" id="referral" checked={fd.referralRec} onChange={e => update('referralRec', e.target.checked)} />
              <label htmlFor="referral">Referral recommended for a comorbidity</label>
            </div>
          </div>
        </div>

        {/* Full-width bottom row */}
        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 20, paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: fd.comorbidity[7] > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16 }}>
            {fd.comorbidity[7] > 0 && (
              <div className="field">
                <label>Substance use detail</label>
                <textarea value={fd.substanceDetail} onChange={e => update('substanceDetail', e.target.value)}
                  placeholder="Type, frequency, impact on functioning" style={{ minHeight: 68 }} />
              </div>
            )}
            <div className="field">
              <label>Other comorbidities</label>
              <textarea value={fd.otherComorbidities} onChange={e => update('otherComorbidities', e.target.value)}
                placeholder="Any conditions not listed above" style={{ minHeight: 68 }} />
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea value={fd.comorbComment} onChange={e => update('comorbComment', e.target.value)}
                placeholder="Clinical notes on comorbidity screening" style={{ minHeight: 68 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
