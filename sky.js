// ===== Real data (falls back to temp data if contributions.json isn't there) =====
// level: 0 = none, 1–2 = some, 3–4 = lots (GitHub's own 5 shades)
async function loadDays() {
  try {
    const res = await fetch('contributions.json');
    const data = await res.json();
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' });
    const days = data.map(d => (d.date <= today ? d.level : null));
    while (days.length < 365) days.push(null);   // pad to a full year
    return days;
  } catch {
    return Array.from({ length: 365 }, () => Math.floor(Math.random() * 5));
  }
}

// ===== Colours (same as the CSS palette) =====
const COLOURS = {
  rest: '#5a5a66',      // rest day: faint dot
  progress: '#e6e6ee',  // progress day: small star
  bigArm: '#ffd08a',    // big day: star arms
  bigCore: '#ffe0a8',   // big day: star centre
  future: '#2e2e38',    // days that haven't happened yet: dim but visible
};
const BIG_DAY = 3;      // GitHub level needed for a "big day" star (3–4 = lots)

const svg = document.getElementById('sky');
const NS = 'http://www.w3.org/2000/svg';

// Draw one square pixel
function px(x, y, size, colour, parent = svg) {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', x);
  r.setAttribute('y', y);
  r.setAttribute('width', size);
  r.setAttribute('height', size);
  r.setAttribute('fill', colour);
  parent.appendChild(r);
}

loadDays().then(days => {
  // ===== Draw the sky: columns = weeks, rows = days =====
  let lit = 0;
  days.forEach((level, i) => {
    const x = 10 + Math.floor(i / 7) * 11.9;
    const y = 8 + (i % 7) * 16;

    // Future day: barely-there dot
    if (level === null) {
      px(x, y, 1.5, COLOURS.future);
      return;
    }

    // Rest day: tiny faint dot
    if (level === 0) {
      px(x, y, 1.5, COLOURS.rest);
      return;
    }

    lit++;

    // Normal progress day: small star
    if (level < BIG_DAY) {
      px(x - 0.5, y - 0.5, 2.5, COLOURS.progress);
      return;
    }

    // Big day: pixel cross that twinkles
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'big-star');
    g.style.animationDelay = `${(i % 10) * 0.3}s`;  // stagger so they don't all blink together
    svg.appendChild(g);

    [[0, 0], [-2.5, 0], [2.5, 0], [0, -2.5], [0, 2.5]].forEach(([dx, dy], k) =>
      px(x - 1 + dx, y - 1 + dy, 2.5, k ? COLOURS.bigArm : COLOURS.bigCore, g)
    );
  });

  // ===== "X / Y DAYS LIT" counter =====
  const sofar = days.filter(l => l !== null).length;
  document.getElementById('lit').textContent = `${lit} / ${sofar} DAYS LIT · ${Math.round((lit / sofar) * 100)}%`;
});