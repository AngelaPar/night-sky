// ===== Temp data =====
// One number per day = commits that day. Will be replaced with real GitHub data.
const days = Array.from({ length: 365 }, () =>
  Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 8)
);

// ===== Colours (same as the CSS palette) =====
const COLOURS = {
  rest: '#5a5a66',      // rest day: faint dot
  progress: '#e6e6ee',  // progress day: small star
  bigArm: '#ffd08a',    // big day: star arms
  bigCore: '#ffe0a8',   // big day: star centre
};
const BIG_DAY = 5;      // commits needed for a "big day" star

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

// ===== Draw the sky: columns = weeks, rows = days =====
let lit = 0;
days.forEach((count, i) => {
  const x = 10 + Math.floor(i / 7) * 11.9;
  const y = 8 + (i % 7) * 16;

  // Rest day: tiny faint dot
  if (count === 0) {
    px(x, y, 1.5, COLOURS.rest);
    return;
  }

  lit++;

  // Normal progress day: small star
  if (count < BIG_DAY) {
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
document.getElementById('lit').textContent =
  `${lit} / ${days.length} DAYS LIT · ${Math.round((lit / days.length) * 100)}%`;
