const INFORMANT_OPTS = [
  { code: 'at0002', value: 'Self only' },
  { code: 'at0003', value: 'Parent/carer only' },
  { code: 'at0004', value: 'Self and informant' },
  { code: 'at0005', value: 'Informant only (no self)' },
];
const MOTOR_OPTS  = [{ code:'at0014',value:'Normal'},{ code:'at0015',value:'Delayed'},{ code:'at0016',value:'Uncertain'}];
const SPEECH_OPTS = [{ code:'at0019',value:'Normal'},{ code:'at0020',value:'Delayed'},{ code:'at0021',value:'Uncertain'}];
const SOCIAL_OPTS = [{ code:'at0024',value:'Normal'},{ code:'at0025',value:'Delayed'},{ code:'at0026',value:'Uncertain'}];
const COLLATERAL_OPTS = [
  { code:'at0034',value:'None available'},
  { code:'at0035',value:'School reports'},
  { code:'at0036',value:'Previous assessment reports'},
  { code:'at0037',value:'Parent questionnaire completed'},
  { code:'at0038',value:'Multiple documents'},
];

function Sel({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.code} value={o.code}>{o.value}</option>)}
      </select>
    </div>
  );
}

const col2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' };

export default function DevelopmentalHistory({ fd, update }) {
  const pick = (opts, code) => opts.find(o => o.code === code);

  return (
    <>
      <div className="card">
        <div className="card-title">Presenting Story</div>
        <div className="card-body">
          <div style={col2}>
            <div className="field">
              <label>Chief complaint / referral summary</label>
              <textarea value={fd.story} onChange={e => update('story', e.target.value)}
                placeholder="Brief narrative of the presenting concerns and referral reason"
                style={{ minHeight: 120 }} />
            </div>
            <div>
              <div className="field-row">
                <Sel label="Informant" value={fd.informantCode} options={INFORMANT_OPTS}
                  onChange={c => { const o=pick(INFORMANT_OPTS,c); update('informantCode',c); update('informantValue',o.value); }} />
                <div className="field">
                  <label>Age of first concerns (yrs)</label>
                  <input type="number" min="0" max="80" step="0.5" value={fd.ageOfFirstConcerns}
                    onChange={e => update('ageOfFirstConcerns', e.target.value)} placeholder="e.g. 5" />
                </div>
              </div>
              <div className="field">
                <label>Childhood presentation</label>
                <textarea value={fd.childhoodPresentation} onChange={e => update('childhoodPresentation', e.target.value)}
                  placeholder="Symptoms and behaviours observed during childhood"
                  style={{ minHeight: 72 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Developmental History</div>
        <div className="card-body">
          <div style={col2}>
            <div>
              <div className="field-row-3">
                <Sel label="Motor" value={fd.motorDevCode} options={MOTOR_OPTS}
                  onChange={c => { const o=pick(MOTOR_OPTS,c); update('motorDevCode',c); update('motorDev',o.value); }} />
                <Sel label="Speech & language" value={fd.speechLangCode} options={SPEECH_OPTS}
                  onChange={c => { const o=pick(SPEECH_OPTS,c); update('speechLangCode',c); update('speechLang',o.value); }} />
                <Sel label="Social" value={fd.socialDevCode} options={SOCIAL_OPTS}
                  onChange={c => { const o=pick(SOCIAL_OPTS,c); update('socialDevCode',c); update('socialDev',o.value); }} />
              </div>
              <div className="field">
                <label>Milestone details</label>
                <textarea value={fd.milestoneDetails} onChange={e => update('milestoneDetails', e.target.value)}
                  placeholder="Any relevant details about developmental milestones"
                  style={{ minHeight: 68 }} />
              </div>
            </div>
            <div>
              <div className="field" style={{ marginBottom: 8 }}>
                <label>Education & support history</label>
              </div>
              <div className="checkbox-field">
                <input type="checkbox" id="specialEd" checked={fd.specialEd} onChange={e => update('specialEd', e.target.checked)} />
                <label htmlFor="specialEd">Special educational needs (SEN)</label>
              </div>
              <div className="checkbox-field">
                <input type="checkbox" id="ehcp" checked={fd.ehcp} onChange={e => update('ehcp', e.target.checked)} />
                <label htmlFor="ehcp">EHCP or SEN statement in place</label>
              </div>
              <div className="checkbox-field" style={{ marginBottom: 14 }}>
                <input type="checkbox" id="prevProf" checked={fd.prevProfInput} onChange={e => update('prevProfInput', e.target.checked)} />
                <label htmlFor="prevProf">Previous professional input received</label>
              </div>
              <Sel label="Collateral documentation" value={fd.collateralDocCode} options={COLLATERAL_OPTS}
                onChange={c => { const o=pick(COLLATERAL_OPTS,c); update('collateralDocCode',c); update('collateralDoc',o.value); }} />
              <div className="field">
                <label>Comment</label>
                <textarea value={fd.devComment} onChange={e => update('devComment', e.target.value)}
                  placeholder="Additional developmental notes" style={{ minHeight: 60 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
