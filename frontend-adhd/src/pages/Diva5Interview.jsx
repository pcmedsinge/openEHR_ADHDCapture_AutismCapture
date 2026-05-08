const INATT = [
  'Often fails to give close attention to details / makes careless mistakes',
  'Often has difficulty sustaining attention in tasks or play',
  'Often does not seem to listen when spoken to directly',
  'Often does not follow through on instructions / fails to finish tasks',
  'Often has difficulty organising tasks and activities',
  'Often avoids / dislikes tasks requiring sustained mental effort',
  'Often loses things necessary for tasks or activities',
  'Often easily distracted by extraneous stimuli',
  'Often forgetful in daily activities',
];
const HI = [
  'Often fidgets with / taps hands or feet, or squirms in seat',
  'Often leaves seat when remaining seated is expected',
  'Often runs about / climbs in situations where it is inappropriate',
  'Often unable to play or take part in leisure activities quietly',
  'Often "on the go" / acts as if "driven by a motor"',
  'Often talks excessively',
  'Often blurts out an answer before a question is completed',
  'Often has difficulty waiting their turn',
  'Often interrupts or intrudes on others',
];
const AGE_OPTS = [
  { code:'at0051', value:'Before age 7' },
  { code:'at0052', value:'Age 7–12' },
  { code:'at0053', value:'After age 12' },
  { code:'at0054', value:'Unable to determine' },
];
const IMP_DOMAINS = [
  { key:'work_or_education',   label:'Work or education' },
  { key:'relationships',       label:'Relationships' },
  { key:'social_functioning',  label:'Social functioning' },
  { key:'leisure_activities',  label:'Leisure activities' },
  { key:'self_confidence',     label:'Self-confidence / self-esteem' },
];

function CheckSection({ title, criteria, values, onChange }) {
  return (
    <div>
      <div className="diva-section-label">{title}</div>
      {criteria.map((c, i) => (
        <div key={i} className="diva-item">
          <input type="checkbox" id={`${title}${i}`} checked={values[i]}
            onChange={e => { const n=[...values]; n[i]=e.target.checked; onChange(n); }} />
          <label htmlFor={`${title}${i}`}>{c}</label>
        </div>
      ))}
      <div className="diva-count">
        Endorsed: {values.filter(Boolean).length} / {criteria.length}
        {values.filter(Boolean).length >= 5 && '  ✓ threshold met'}
      </div>
    </div>
  );
}

export default function Diva5Interview({ fd, update }) {
  const setOnset = c => {
    const o = AGE_OPTS.find(x => x.code === c);
    update('ageOnsetCode', c);
    update('ageOnsetValue', o.value);
  };

  return (
    <>
      <div className="card">
        <div className="card-title">DIVA-5 — Inattention Domain</div>
        <div className="card-body">
          <p className="card-subtitle">
            Check each DSM-5 criterion present in childhood AND adulthood.
            Threshold ≥ 5 per domain per age period.
            Note: adulthood inattention captures criteria 2–9 only (archetype limitation).
          </p>
          <div className="diva-grid">
            <CheckSection title="Childhood inattention (criteria 1–9)" criteria={INATT}
              values={fd.diva_ci} onChange={v => update('diva_ci', v)} />
            <CheckSection title="Adulthood inattention (criteria 2–9)" criteria={INATT.slice(1)}
              values={fd.diva_ai} onChange={v => update('diva_ai', v)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">DIVA-5 — Hyperactivity / Impulsivity Domain</div>
        <div className="card-body">
          <p className="card-subtitle">
            Childhood HI captures criteria 2–9 only (archetype limitation). Adulthood HI captures all 9.
          </p>
          <div className="diva-grid">
            <CheckSection title="Childhood HI (criteria 2–9)" criteria={HI.slice(1)}
              values={fd.diva_chi} onChange={v => update('diva_chi', v)} />
            <CheckSection title="Adulthood HI (criteria 1–9)" criteria={HI}
              values={fd.diva_ahi} onChange={v => update('diva_ahi', v)} />
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 20, paddingTop: 16,
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
            <div>
              <div className="field">
                <label>Age of onset of symptoms</label>
                <select value={fd.ageOnsetCode} onChange={e => setOnset(e.target.value)}>
                  {AGE_OPTS.map(o => <option key={o.code} value={o.code}>{o.value}</option>)}
                </select>
              </div>
              <div className="diva-section-label" style={{ marginTop: 14 }}>Impairment domains affected</div>
              {IMP_DOMAINS.map(d => (
                <div key={d.key} className="checkbox-field">
                  <input type="checkbox" id={`imp_${d.key}`} checked={fd.impDomains[d.key]}
                    onChange={e => update('impDomains', { ...fd.impDomains, [d.key]: e.target.checked })} />
                  <label htmlFor={`imp_${d.key}`}>{d.label}</label>
                </div>
              ))}
            </div>
            <div className="field">
              <label>Clinician summary</label>
              <textarea value={fd.clinicianSummary} onChange={e => update('clinicianSummary', e.target.value)}
                placeholder="Overall clinical impression from the DIVA-5 interview"
                style={{ minHeight: 160 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
