// AQ-10: items 1,7,8,10 score on AGREE; items 2,3,4,5,6,9 score on DISAGREE
// Ordinals: 0=Definitely agree, 1=Slightly agree, 2=Slightly disagree, 3=Definitely disagree
// Threshold: ≥6 = positive screen (NICE NG142)

const ITEMS = [
  'I often notice small sounds when others do not.',
  'I usually concentrate more on the whole picture, rather than the small details.',
  'I find it easy to do more than one thing at once.',
  'If there is an interruption, I can switch back to what I was doing very quickly.',
  "I find it easy to 'read between the lines' when someone is talking to me.",
  'I know how to tell if someone listening to me is getting bored.',
  "When I'm reading a story, I find it difficult to work out the characters' intentions.",
  'I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant).',
  'I find it easy to work out what someone is thinking or feeling just by looking at their face.',
  "I find it difficult to work out people's intentions.",
];

// 0-indexed positions of items that score on AGREE (items 1,7,8,10 in 1-based)
const AGREE_ITEMS = new Set([0, 6, 7, 9]);

const LABELS = ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'];

function scoreItem(index, ordinal) {
  if (AGREE_ITEMS.has(index)) return ordinal <= 1 ? 1 : 0;
  return ordinal >= 2 ? 1 : 0;
}

export default function Aq10Screener({ fd, update }) {
  function setItem(i, val) {
    const next = [...fd.aq10];
    next[i] = val;
    update('aq10', next);
  }

  const total = fd.aq10.reduce((sum, ordinal, i) => sum + scoreItem(i, ordinal), 0);
  const positive = total >= 6;

  return (
    <div className="card">
      <div className="card-title">AQ-10 Autism Spectrum Screening (NICE NG142)</div>
      <div className="card-body">
        <p className="card-subtitle">
          10-item Autism Spectrum Quotient screener. Score ≥6 indicates possible autism and warrants
          referral for full diagnostic assessment. Items 1, 7, 8, 10 score on agree; items 2, 3, 4, 5, 6, 9 score on disagree.
        </p>

        <table className="asrs-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}>#</th>
              <th className="item-col">Statement</th>
              {LABELS.map(l => <th key={l} style={{ width: 110 }}>{l}</th>)}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((text, i) => (
              <tr key={i}>
                <td className="item-num">{i + 1}</td>
                <td className="item-text">{text}</td>
                {LABELS.map((_, col) => (
                  <td key={col} className="radio-cell">
                    <input
                      type="radio"
                      name={`aq10_${i}`}
                      checked={fd.aq10[i] === col}
                      onChange={() => setItem(i, col)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="asrs-score-box">
          <span className={`asrs-score-chip${positive ? ' positive' : ''}`}>
            AQ-10 Score: {total} / 10
          </span>
          <span className={`asrs-score-chip${positive ? ' positive' : ''}`}>
            {positive ? 'Screen POSITIVE — ≥6 (refer for full assessment)' : 'Screen negative — <6'}
          </span>
        </div>
      </div>
    </div>
  );
}
