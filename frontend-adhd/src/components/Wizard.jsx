export default function Wizard({ step, total, stepName, children, onBack, onNext, onSubmit, submitting, submitError }) {
  return (
    <div className="wizard-frame">
      <div className="wizard-scroll">
        {submitError && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>{submitError}</div>
        )}
        {children}
      </div>

      <div className="wizard-nav">
        <button className="btn btn-secondary" onClick={onBack} disabled={step === 0}>
          ← Back
        </button>
        <span className="nav-step-label">Step {step + 1} of {total} — {stepName}</span>
        {step < total - 1 ? (
          <button className="btn btn-primary" onClick={onNext}>
            Next →
          </button>
        ) : (
          <button className="btn btn-success" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit to EHRbase'}
          </button>
        )}
      </div>
    </div>
  );
}
