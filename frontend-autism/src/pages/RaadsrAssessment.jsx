// RAADS-R: 80 items, 4 response options
// Ordinals: 0=Never true (0pts), 1=True only <16 (1pt), 2=True only now (2pts), 3=True now and when younger (3pts)
// Archetype uses raw ordinal values as scores; total max = 240 (80×3); total threshold ≥65
// Subscale thresholds shown in UI are approximate (display only — not submitted to EHRbase)

const LABELS = [
  'Never true',
  'True only when I was younger than 16',
  'True only now',
  'True now and when I was younger than 16',
];
// Archetype stores raw ordinals as scores; max per item = 3, total max = 240
const SCORES = [0, 1, 2, 3];

// item index (0-based) → subscale
const SUBSCALE = (() => {
  const SR = new Set([0,1,3,4,6,9,10,13,14,15,16,17,18,19,21,23,24,26,27,28,30,31,33,34,38,39,40,42,43,45,46,49,57,58,63,72,73,74,75]);
  const L  = new Set([2,25,52,53,54,55,56]);
  const SM = new Set([5,7,8,11,12,20,22,29,32,35,36,37,41,44,47,48,50,51,59,60]);
  const CI = new Set([61,62,64,65,66,67,68,69,70,71,76,77,78,79]);
  return i => SR.has(i) ? 'SR' : L.has(i) ? 'L' : SM.has(i) ? 'SM' : CI.has(i) ? 'CI' : 'SR';
})();

const SUBSCALE_LABELS = {
  SR: 'Social Relatedness',
  L:  'Language',
  SM: 'Sensory-Motor',
  CI: 'Circumscribed Interests',
};

const ITEMS = [
  // 1-10
  'It is difficult for me to understand how other people are feeling when we are talking.',
  'Some ordinary textures that do not bother others feel very offensive when they touch my skin.',
  'It is very difficult for me to work with others in a group.',
  'It is difficult to figure out what other people expect of me.',
  "I often don't know how to act in social situations.",
  'I can chat and make small talk with people.',
  'When I feel overwhelmed by my senses, I have to isolate myself to get away from them.',
  'I have to use my imagination to figure out what other people want.',
  'I always notice how food feels in my mouth; this is more important to me than how it tastes.',
  'My voice has a flat or monotone quality to it.',
  // 11-20
  'I feel very uncomfortable if my daily routine is changed.',
  'I am good at math and/or science.',
  'I am fascinated by dates.',
  'I am good at figuring out what other people feel.',
  'I make friends easily.',
  'It is hard for me to figure out what people mean by their tone of voice.',
  "I find it easy to 'read between the lines' when someone is talking to me.",
  'I focus on details rather than the overall idea.',
  'I am very good at taking care of myself without any help from other people.',
  'I sometimes have strange or unfamiliar feelings that come from inside my body.',
  // 21-30
  'When I am in a crowded room, I can easily adjust myself to other people.',
  'I feel like I can tell people how they feel and what they are thinking.',
  'When I see someone get hurt, I am very upset.',
  'I am not very good at remembering dates.',
  'When I talk, I can tell when other people are interested in what I am saying.',
  'I am often told that I talk too much.',
  'I like to read fiction.',
  'It is very hard for me to understand when someone is embarrassed.',
  'When I am reading, I always notice the author\'s style.',
  'When I am in a noisy place, it doesn\'t bother me.',
  // 31-40
  'It is difficult for me to understand when someone feels sad.',
  'It is hard for me to tell when someone is interested in what I am saying.',
  'I like to learn things by reading about them.',
  'When I am in a group of people, I have trouble keeping track of what everyone is saying.',
  'I am good at picking up on subtle meanings in social contexts.',
  'I sometimes have to smell or touch objects to make sure they are safe.',
  'I dislike noise and confusion.',
  'I do not become overwhelmed by loud noise and bright light.',
  'When I am in a crowd of people, I have trouble making sense of what is going on.',
  'It is hard for me to follow what is being said in group conversations.',
  // 41-50
  "I'm confused when someone compliments me or gets upset with me.",
  'My handwriting is very poor.',
  'I have difficulty making friends.',
  'I am comfortable being in a place that is very crowded with people.',
  'I get very upset if the rules or routines I rely on are changed.',
  'When I am dealing with people, I tend to take things literally.',
  'When I was young, I was often interested in activities that other children didn\'t like.',
  "I can't tolerate wearing shoes or certain types of clothing.",
  'I prefer to do things the same way over and over again.',
  'I have trouble understanding things written for people of my age.',
  // 51-60
  'I am bothered by certain sounds in my surroundings.',
  'I get upset when someone changes my routine.',
  'My sentences often come out wrong; they are not what I mean to say.',
  'I have difficulty getting my words out.',
  'Sometimes I say things that seem rude to other people even though I didn\'t mean it that way.',
  "I don't talk the way other people do.",
  'I have trouble maintaining a conversation.',
  'When talking to others, it is difficult to maintain the topic of conversation.',
  'I can pick up quickly if someone says one thing but means another.',
  'I have a hard time figuring out how to match what I say to the feelings of the person I am talking to.',
  // 61-70
  'When I am talking to someone, I like to talk about the things I am most interested in rather than having a social conversation.',
  'I have a hard time looking at someone in the eye.',
  'I can be very picky about foods, clothes, or other ordinary things.',
  'I have often been told that I ask embarrassing questions.',
  'I always have a favourite topic I love to talk about.',
  'I have a special collection of things that I keep.',
  'I have certain routines I have to follow every day.',
  'I get very upset when something I want to happen doesn\'t happen.',
  'I get very upset if someone moves my belongings.',
  'I have a very strong interest in one or two particular things.',
  // 71-80
  'I find it hard to wait for something I really want.',
  'I have trouble shifting from one activity to another.',
  'I have a tendency to speak too quickly.',
  'I have a tendency to speak too slowly.',
  'I am often misunderstood when I am talking.',
  'I often think about how things affect the people around me.',
  'I know when my behaviour is making others uncomfortable.',
  'I am very sensitive to criticism.',
  'I am interested in new activities.',
  'I am flexible about changes to daily routines.',
];

const SUBSCALE_ORDER = ['SR', 'L', 'SM', 'CI'];

function calcScores(raads) {
  const scores = { SR: 0, L: 0, SM: 0, CI: 0 };
  raads.forEach((ordinal, i) => {
    scores[SUBSCALE(i)] += SCORES[ordinal];
  });
  return scores;
}

export default function RaadsrAssessment({ fd, update }) {
  function setItem(i, val) {
    const next = [...fd.raads];
    next[i] = val;
    update('raads', next);
  }

  const scores = calcScores(fd.raads);
  const total = scores.SR + scores.L + scores.SM + scores.CI;
  // Approximate UI thresholds (display only — subscale scores not sent to EHRbase)
  const thresholds = { SR: 31, L: 4, SM: 16, CI: 15 };

  // Group items by subscale, maintaining item order within each subscale group
  const bySubscale = {};
  SUBSCALE_ORDER.forEach(s => { bySubscale[s] = []; });
  ITEMS.forEach((text, i) => {
    bySubscale[SUBSCALE(i)].push({ i, text });
  });

  return (
    <>
      {SUBSCALE_ORDER.map(sub => (
        <div key={sub} className="card">
          <div className="card-title">
            RAADS-R — {SUBSCALE_LABELS[sub]} ({bySubscale[sub].length} items)
          </div>
          <div className="card-body">
            <table className="asrs-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th>
                  <th className="item-col">Statement</th>
                  {LABELS.map((l, idx) => (
                    <th key={idx} style={{ width: idx < 2 ? 90 : 110, fontSize: 10.5 }}>{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bySubscale[sub].map(({ i, text }) => (
                  <tr key={i}>
                    <td className="item-num">{i + 1}</td>
                    <td className="item-text">{text}</td>
                    {LABELS.map((_, col) => (
                      <td key={col} className="radio-cell">
                        <input
                          type="radio"
                          name={`raads_${i}`}
                          checked={fd.raads[i] === col}
                          onChange={() => setItem(i, col)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="asrs-score-box">
              <span className={`asrs-score-chip${scores[sub] >= thresholds[sub] ? ' positive' : ''}`}>
                {SUBSCALE_LABELS[sub]}: {scores[sub]} (threshold ≥{thresholds[sub]})
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="card-title">RAADS-R Score Summary</div>
        <div className="card-body">
          <div className="asrs-score-box">
            {SUBSCALE_ORDER.map(sub => (
              <span key={sub} className={`asrs-score-chip${scores[sub] >= thresholds[sub] ? ' positive' : ''}`}>
                {SUBSCALE_LABELS[sub]}: {scores[sub]} / {thresholds[sub]} threshold
              </span>
            ))}
            <span className={`asrs-score-chip${total >= 65 ? ' positive' : ''}`}>
              Total: {total} / 240 — {total >= 65 ? 'Threshold MET (≥65)' : 'Below threshold (<65)'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
