const ASRS_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

const ASRS_QUESTIONS = [
  'How often do you have trouble wrapping up the final details of a project once the challenging parts are done?',
  'How often do you have difficulty getting things in order when you have to do a task that requires organisation?',
  'How often do you have problems remembering appointments or obligations?',
  'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
  'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
  'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
  'How often do you make careless mistakes when you have to work on a boring or difficult project?',
  'How often do you have difficulty keeping your attention when you are doing boring or repetitive work?',
  'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?',
  'How often do you misplace or have difficulty finding things at home or at work?',
  'How often are you distracted by activity or noise around you?',
  'How often do you leave your seat in meetings or other situations where you are expected to remain seated?',
  'How often do you feel restless or fidgety?',
  'How often do you have difficulty unwinding and relaxing when you have time to yourself?',
  'How often do you find yourself talking too much when in social situations?',
  'When in a conversation, how often do you finish the sentences of the people you are talking to before they can finish them themselves?',
  'How often do you have difficulty waiting your turn in situations when turn-taking is required?',
  'How often do you interrupt others when they are busy?',
];

function computeScore(asrs) {
  const partA = asrs.slice(0, 6).reduce((s, v) => s + v, 0);
  const partB = asrs.slice(6).reduce((s, v) => s + v, 0);
  let pos = 0;
  for (let i = 0; i < 3; i++) if (asrs[i] >= 2) pos++;
  for (let i = 3; i < 6; i++) if (asrs[i] >= 3) pos++;
  return { partA, partB, total: partA + partB, positive: pos >= 4 };
}

export default function AsrsScreener({ fd, update }) {
  const { partA, partB, total, positive } = computeScore(fd.asrs);

  function setItem(i, val) {
    const next = [...fd.asrs];
    next[i] = val;
    update('asrs', next);
  }

  const tableRows = [];
  ASRS_QUESTIONS.forEach((q, i) => {
    if (i === 0) tableRows.push(
      <tr key="div-a" className="asrs-divider">
        <td colSpan={7}>Part A — Items 1–6 (screening items)</td>
      </tr>
    );
    if (i === 6) tableRows.push(
      <tr key="div-b" className="asrs-divider">
        <td colSpan={7}>Part B — Items 7–18 (extended symptom assessment)</td>
      </tr>
    );
    tableRows.push(
      <tr key={i}>
        <td className="item-num">{i + 1}</td>
        <td className="item-text">{q}</td>
        {ASRS_LABELS.map((_, colIdx) => (
          <td key={colIdx} className="radio-cell">
            <input type="radio" name={`asrs_${i}`} checked={fd.asrs[i] === colIdx} onChange={() => setItem(i, colIdx)} />
          </td>
        ))}
      </tr>
    );
  });

  return (
    <div className="card">
      <div className="card-title">ASRS-v1.1 — WHO Adult ADHD Self-Report Scale</div>
      <div className="card-body">
        <p className="card-subtitle">
          18-item frequency scale. Part A (items 1–6) is the primary screen.
          Screen positive if ≥ 4 Part A items are above threshold
          (items 1–3: Sometimes or higher · items 4–6: Often or higher).
        </p>
        <div className="asrs-score-box" style={{ marginBottom: 16 }}>
          <span className="asrs-score-chip">Part A: {partA} / 24</span>
          <span className="asrs-score-chip">Part B: {partB} / 48</span>
          <span className="asrs-score-chip">Total: {total} / 72</span>
          <span className={`asrs-score-chip ${positive ? 'positive' : ''}`}>
            Screen: {positive ? 'POSITIVE' : 'Negative'}
          </span>
        </div>
        <table className="asrs-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th className="item-col">Question</th>
              {ASRS_LABELS.map(l => <th key={l}>{l}</th>)}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
}
