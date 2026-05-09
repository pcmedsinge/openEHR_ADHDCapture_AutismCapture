import { useState } from 'react';
import Wizard from './components/Wizard';
import PatientSetup from './pages/PatientSetup';
import DevelopmentalHistory from './pages/DevelopmentalHistory';
import Aq10Screener from './pages/Aq10Screener';
import RaadsrAssessment from './pages/RaadsrAssessment';
import FunctionalImpact from './pages/FunctionalImpact';
import ComorbidityScreening from './pages/ComorbidityScreening';
import FamilyHistory from './pages/FamilyHistory';
import { buildComposition, submitComposition, findOrCreateEhr } from './api/ehrbase';
import { TEST_DATA } from './testData';

const STEPS = [
  'Patient Setup',
  'Developmental History',
  'AQ-10 Screener',
  'RAADS-R Assessment',
  'Functional Impact',
  'Comorbidity',
  'Family History',
];

const INIT = {
  subjectId: '',
  clinicianName: '',
  ehrId: null,

  story: '',
  informantCode: 'at0002',
  informantValue: 'Self only',
  ageOfFirstConcerns: '',
  childhoodPresentation: '',
  motorDevCode: 'at0014',
  motorDev: 'Normal',
  speechLangCode: 'at0019',
  speechLang: 'Normal',
  socialDevCode: 'at0024',
  socialDev: 'Normal',
  milestoneDetails: '',
  specialEd: false,
  ehcp: false,
  prevProfInput: false,
  collateralDocCode: 'at0034',
  collateralDoc: 'None available',
  devComment: '',

  aq10: Array(10).fill(2),

  raads: Array(80).fill(0),

  funcImpact: Array(7).fill(0),
  domainDescription: '',
  funcComment: '',

  comorbidity: Array(8).fill(0),
  substanceDetail: '',
  dyslexia: false,
  dyscalculia: false,
  dcdDyspraxia: false,
  crossCondScreen: 'at0046',
  crossCondScreenValue: 'Not screened',
  crossCondName: '',
  otherComorbidities: '',
  referralRec: false,
  comorbComment: '',

  famProblems: [{ name: '' }],
  famMembers: [{ name: '', relationship: '', relationshipCode: '' }],
};

export default function App() {
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  function update(key, value) {
    setFd(prev => ({ ...prev, [key]: value }));
  }

  function loadTestData() {
    setFd(prev => ({ ...TEST_DATA, ehrId: prev.ehrId }));
    setSubmitResult(null);
    setSubmitError('');
  }

  function resetForm() {
    if (!window.confirm('Start a new assessment? All unsaved data will be lost.')) return;
    setFd(INIT);
    setStep(0);
    setSubmitResult(null);
    setSubmitError('');
  }

  async function handleSubmit() {
    if (!fd.subjectId.trim()) {
      setSubmitError('Enter a Patient ID on Step 1 before submitting.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const ehrId = fd.ehrId || await findOrCreateEhr(fd.subjectId.trim());
      if (!fd.ehrId) update('ehrId', ehrId);
      const payload = buildComposition({ ...fd, ehrId });
      const result = await submitComposition(ehrId, payload);
      setSubmitResult(result);
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const pages = [
    <PatientSetup fd={fd} update={update} />,
    <DevelopmentalHistory fd={fd} update={update} />,
    <Aq10Screener fd={fd} update={update} />,
    <RaadsrAssessment fd={fd} update={update} />,
    <FunctionalImpact fd={fd} update={update} />,
    <ComorbidityScreening fd={fd} update={update} />,
    <FamilyHistory fd={fd} update={update} submitResult={submitResult} />,
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">NeuroCapture</div>
          <div className="brand-sub">Autism Initial Assessment</div>
        </div>

        {fd.subjectId.trim() && (
          <div className="patient-context">
            <div className="patient-context-label">Patient</div>
            <div className="patient-context-id">{fd.subjectId.trim()}</div>
          </div>
        )}

        <nav className="step-list">
          {STEPS.map((name, i) => (
            <button
              key={i}
              className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              onClick={() => i <= step && setStep(i)}
            >
              <span className="step-num">
                {i < step ? '✓' : i + 1}
              </span>
              <span className="step-name">{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-sidebar" onClick={loadTestData}>Load demo patient</button>
          <button className="btn-sidebar btn-sidebar-danger" onClick={resetForm}>New assessment</button>
        </div>
      </aside>

      <div className="main-pane">
        <Wizard
          step={step}
          total={STEPS.length}
          stepName={STEPS[step]}
          onBack={() => setStep(s => Math.max(0, s - 1))}
          onNext={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        >
          {pages[step]}
        </Wizard>
      </div>
    </div>
  );
}
