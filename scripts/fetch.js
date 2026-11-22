// Fetch my public GitHub contribution grid and save it as contributions.json
const fs = require('fs');

const USER = process.env.GH_USER;
const year = new Date().getFullYear();
const url = `https://github.com/users/${USER}/contributions?from=${year}-01-01&to=${year}-12-31`;

(async () => {
  const html = await (await fetch(url)).text();

  // Each day looks like: data-date="2026-01-01" ... data-level="2"
  const days = [];
  const cell = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  let m;
  while ((m = cell.exec(html))) days.push({ date: m[1], level: Number(m[2]) });

  days.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync('contributions.json', JSON.stringify(days, null, 2));
  console.log(`Saved ${days.length} days`);
})();
