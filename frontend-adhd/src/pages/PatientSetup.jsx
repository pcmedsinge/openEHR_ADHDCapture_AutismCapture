export default function PatientSetup({ fd, update }) {
  return (
    <div className="card">
      <div className="card-title">Patient Setup</div>
      <div className="card-body">
        <p className="card-subtitle">
          Enter the patient identifier. The EHR will be looked up (or created automatically)
          when you submit the completed form on the final step.
        </p>

        <div className="field-row">
          <div className="field">
            <label>Patient ID (subject identifier)</label>
            <input
              type="text"
              value={fd.subjectId}
              onChange={e => update('subjectId', e.target.value)}
              placeholder="e.g. NEURO-001 or NHS number"
            />
          </div>
          <div className="field">
            <label>Clinician name (composer)</label>
            <input
              type="text"
              value={fd.clinicianName}
              onChange={e => update('clinicianName', e.target.value)}
              placeholder="e.g. Dr. Smith"
            />
          </div>
        </div>

        {fd.ehrId && (
          <div className="alert alert-success">
            EHR active — <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{fd.ehrId}</span>
          </div>
        )}

        <div className="alert alert-info" style={{ marginTop: 8 }}>
          <strong>Namespace:</strong> neuro_patients &nbsp;·&nbsp;
          <strong>EHRbase:</strong> localhost:8082 &nbsp;·&nbsp;
          Returning patients are matched automatically.
        </div>
      </div>
    </div>
  );
}
