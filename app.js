// Travelling Rocks - Lily's class project.
// Prototype: rocks and journeys are saved in this browser (localStorage).
// Later Dad can connect a real database (e.g. Firebase) so everyone shares the same data.

const SITE_URL = "catchkill9.github.io/travelling-rocks";

// Places are shown only at city level (never an exact spot), to keep everyone safe.
const PLACES = {
  "Dublin, Ireland": [53.35, -6.26],
  "Cork, Ireland": [51.90, -8.47],
  "Galway, Ireland": [53.27, -9.05],
  "Wicklow, Ireland": [52.98, -6.04],
  "Kerry, Ireland": [52.15, -9.57],
  "Belfast, UK": [54.60, -5.93],
  "London, UK": [51.51, -0.13],
  "Edinburgh, UK": [55.95, -3.19],
  "Paris, France": [48.86, 2.35],
  "Nice, France": [43.70, 7.27],
  "Barcelona, Spain": [41.39, 2.17],
  "Madrid, Spain": [40.42, -3.70],
  "Lisbon, Portugal": [38.72, -9.14],
  "Rome, Italy": [41.90, 12.50],
  "Venice, Italy": [45.44, 12.32],
  "Berlin, Germany": [52.52, 13.40],
  "Amsterdam, Netherlands": [52.37, 4.90],
  "Prague, Czechia": [50.08, 14.44],
  "Vienna, Austria": [48.21, 16.37],
  "Athens, Greece": [37.98, 23.73],
  "Tel Aviv, Israel": [32.08, 34.78],
  "Jerusalem, Israel": [31.77, 35.21],
  "Haifa, Israel": [32.79, 34.99],
  "Eilat, Israel": [29.56, 34.95],
  "New York, USA": [40.71, -74.01],
  "Orlando, USA": [28.54, -81.38],
  "Toronto, Canada": [43.65, -79.38],
  "Sydney, Australia": [-33.87, 151.21],
  "Tokyo, Japan": [35.68, 139.69],
  "Cape Town, South Africa": [-33.92, 18.42],
};

const COLORS = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
const EMOJIS = ["🌊", "⭐", "🦋", "🌈", "🐞", "🌻", "🐬", "🍀", "🦄", "🐢"];

const SAMPLE_ROCKS = [
  { id: 1, name: "Lily", emoji: "🦋", color: "#ffd6a5", painter: "Lily",
    journey: [
      { date: "2026-11-10", found: "Dublin, Ireland", hidden: "Dublin, Ireland", note: "Rock was born in class! 🎨" },
    ] },
  { id: 2, name: "Rocky", emoji: "⭐", color: "#9bf6ff", painter: "5th class",
    journey: [
      { date: "2026-11-10", found: "Dublin, Ireland", hidden: "Dublin, Ireland", note: "Painted in class" },
      { date: "2026-11-12", found: "Dublin, Ireland", hidden: "Paris, France", note: "Flew to Paris with a family on holiday ✈️" },
    ] },
];

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("travelling-rocks"));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(SAMPLE_ROCKS));
}
function save() { localStorage.setItem("travelling-rocks", JSON.stringify(rocks)); }

let rocks = load();
const app = document.getElementById("app");
let activeMap = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lastPlace = r => r.journey.length ? r.journey[r.journey.length - 1].hidden : "Dublin, Ireland";
const placeOptions = sel => Object.keys(PLACES).map(p => `<option ${p === sel ? "selected" : ""}>${p}</option>`).join("");
const rockBadge = r => `<div class="rock-emoji" style="background:${esc(r.color)}">${esc(r.emoji)}</div>`;
const countries = r => new Set(r.journey.flatMap(j => [j.found, j.hidden]).map(p => p.split(", ")[1])).size;

function makeMap(el, rockList) {
  if (activeMap) { activeMap.remove(); activeMap = null; }
  if (typeof L === "undefined") { el.innerHTML = "<p class='notice'>The map could not load right now 🗺️</p>"; return; }
  activeMap = L.map(el, { scrollWheelZoom: false }).setView([50, 5], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap", maxZoom: 8,
  }).addTo(activeMap);
  const bounds = [];
  rockList.forEach(r => {
    const path = [];
    r.journey.forEach(j => [j.found, j.hidden].forEach(p => {
      const c = PLACES[p];
      if (c && (!path.length || path[path.length - 1] !== c)) path.push(c);
    }));
    if (path.length > 1) L.polyline(path, { color: r.color === "#fdffb6" ? "#e0a800" : r.color, weight: 4, dashArray: "6 8" }).addTo(activeMap);
    const now = PLACES[lastPlace(r)];
    if (now) {
      L.marker(now).addTo(activeMap).bindPopup(`${esc(r.emoji)} <b>#${r.id} ${esc(r.name)}</b><br>${esc(lastPlace(r))}<br><a href="#rock/${r.id}">See journey</a>`);
      bounds.push(now);
    }
    path.forEach(p => bounds.push(p));
  });
  if (bounds.length > 1) activeMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
}

// ---------- Pages ----------

function home() {
  const totalMoves = rocks.reduce((n, r) => n + r.journey.length, 0);
  app.innerHTML = `
    <section class="hero">
      <h1>🪨 Travelling Rocks 🌍</h1>
      <p>Painted rocks that travel the world, one hiding place at a time!</p>
      <a class="btn" href="#found">I found a rock! 🎉</a>
      <a class="btn secondary" href="#rocks">Find a rock 🔎</a>
    </section>
    <div class="steps">
      <div class="card step"><div class="num">🎨</div><b>1. Paint</b><br>Every student paints a rock and gives it a special name.</div>
      <div class="card step"><div class="num">🌳</div><b>2. Hide</b><br>Take it on a trip and hide it in a safe, allowed place.</div>
      <div class="card step"><div class="num">🔎</div><b>3. Find</b><br>Found a rock? Come here and tell us where!</div>
      <div class="card step"><div class="num">✈️</div><b>4. Hide again</b><br>Hide it somewhere new so the journey continues.</div>
    </div>
    <div class="card">
      <h2>🗺️ Where are the rocks now?</h2>
      <p>${rocks.length} rocks · ${totalMoves} journey updates</p>
      <div id="map"></div>
    </div>`;
  makeMap(document.getElementById("map"), rocks);
}

function rockList(q = "") {
  app.innerHTML = `
    <h1>🔎 Find a Rock</h1>
    <input class="search" id="q" placeholder="Search by rock name or number..." value="${esc(q)}">
    <div class="rock-grid" id="grid"></div>`;
  const grid = document.getElementById("grid");
  const draw = text => {
    const t = text.trim().toLowerCase().replace("#", "");
    const list = rocks.filter(r => !t || r.name.toLowerCase().includes(t) || String(r.id) === t);
    grid.innerHTML = list.length ? list.map(r => `
      <a class="card rock-card" href="#rock/${r.id}">
        ${rockBadge(r)}
        <b>#${r.id} ${esc(r.name)}</b><br>
        📍 ${esc(lastPlace(r))}<br>
        <span class="status ${r.journey.length > 1 ? "" : "home"}">${r.journey.length > 1 ? "Travelling ✈️" : "At home 🏠"}</span>
      </a>`).join("") : "<p>No rock found with that name or number 🤔</p>";
  };
  const input = document.getElementById("q");
  input.addEventListener("input", () => draw(input.value));
  draw(q);
}

function rockPage(id) {
  const r = rocks.find(x => x.id === Number(id));
  if (!r) { app.innerHTML = "<h1>Rock not found 🤔</h1><a class='btn' href='#rocks'>Back to all rocks</a>"; return; }
  app.innerHTML = `
    <div class="card">
      ${rockBadge(r)}
      <h1>#${r.id} ${esc(r.name)}</h1>
      <p>🎨 Painted by: ${esc(r.painter || "a 5th class student")}<br>
      📍 Now hiding in: <b>${esc(lastPlace(r))}</b><br>
      🌍 Countries visited: ${countries(r)} · Updates: ${r.journey.length}</p>
      <a class="btn" href="#found/${r.id}">I found this rock! 🎉</a>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>🗺️ Journey map</h2>
      <div id="map"></div>
      <h2>📜 Journey</h2>
      <ul class="timeline">
        ${r.journey.map(j => `<li><b>${esc(j.date)}</b>: found in ${esc(j.found)}, hidden in <b>${esc(j.hidden)}</b>${j.note ? `<br><i>${esc(j.note)}</i>` : ""}</li>`).join("")}
      </ul>
    </div>`;
  makeMap(document.getElementById("map"), [r]);
}

function found(id = "") {
  const today = new Date().toISOString().slice(0, 10);
  app.innerHTML = `
    <h1>🎉 I Found a Rock!</h1>
    <div class="card">
      <p>Yay, you found a Travelling Rock! Tell us about it so we can follow its journey.</p>
      <div class="notice">🛡️ Only write the <b>city</b>, never your home address, your full name or your school.</div>
      <form id="f">
        <label>Rock number or name</label>
        <input name="rock" required value="${esc(id)}" placeholder="e.g. 2 or Rocky">
        <label>Where did you find it? (city)</label>
        <select name="found">${placeOptions("Dublin, Ireland")}</select>
        <label>Date you found it</label>
        <input type="date" name="date" value="${today}" required>
        <label>Where did you hide it again? (city)</label>
        <select name="hidden">${placeOptions("Dublin, Ireland")}</select>
        <label>A short message (optional)</label>
        <input name="note" maxlength="120" placeholder="e.g. Found it near a big tree! 🌳">
        <button class="btn" type="submit">Update journey 🚀</button>
      </form>
      <div id="msg"></div>
    </div>
    <p>Can't see your city? Pick the closest one. 😊</p>`;
  document.getElementById("f").addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const key = d.rock.trim().toLowerCase().replace("#", "");
    const r = rocks.find(x => String(x.id) === key || x.name.toLowerCase() === key);
    const msg = document.getElementById("msg");
    if (!r) { msg.innerHTML = `<p class="notice">Hmm, no rock called "${esc(d.rock)}". Check the number on the rock 🔎</p>`; return; }
    r.journey.push({ date: d.date, found: d.found, hidden: d.hidden, note: d.note.slice(0, 120) });
    save();
    location.hash = `#rock/${r.id}`;
  });
}

function rules() {
  app.innerHTML = `
    <h1>🛡️ Safety Rules</h1>
    <div class="card">
      <ul class="rules">
        <li>✅ Hide rocks only in places where it's allowed to leave things.</li>
        <li>🚶 Never hide rocks on paths, roads or stairs, where someone could trip.</li>
        <li>⚠️ Never go into dangerous places to find or hide a rock.</li>
        <li>🌊 Never hide rocks near water, cliffs or other dangerous places.</li>
        <li>🌿 Don't disturb plants, animals or nature.</li>
        <li>🚫 Don't leave a rock where it's not allowed to take or leave things.</li>
        <li>🤔 Not sure it's allowed? Don't hide it there.</li>
        <li>👨‍👩‍👧 Younger kids play together with an adult.</li>
        <li>🔒 On the website, write only the city. Never your address, full name, school or photos of people.</li>
      </ul>
    </div>`;
}

function classPage() {
  app.innerHTML = `
    <h1>🎨 For the Class</h1>
    <div class="card no-print">
      <h2>Add a new rock</h2>
      <form id="add">
        <label>Rock name</label>
        <input name="name" required maxlength="30" placeholder="e.g. Sparkle">
        <label>Painted by (first name only, or "5th class")</label>
        <input name="painter" maxlength="30" placeholder="5th class">
        <label>Rock picture</label>
        <select name="emoji">${EMOJIS.map(e => `<option>${e}</option>`).join("")}</select>
        <label>Colour</label>
        <select name="color">${COLORS.map((c, i) => `<option value="${c}">Colour ${i + 1}</option>`).join("")}</select>
        <button class="btn" type="submit">Add rock 🪨</button>
      </form>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>🏷️ Labels for the back of the rocks</h2>
      <p class="no-print">Print this page and stick a label on the back of each rock (or copy it with a marker).</p>
      <button class="btn secondary no-print" onclick="window.print()">Print labels 🖨️</button>
      <div class="labels" style="margin-top:12px">
        ${rocks.map(r => `<div class="label"><b>🪨 Travelling Rocks</b><span>Rock #${r.id}: ${esc(r.name)}</span><small>Found me? Tell us at</small><small><b>${SITE_URL}</b></small><small>then hide me again! 🌍</small></div>`).join("")}
      </div>
    </div>`;
  document.getElementById("add").addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const id = rocks.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    rocks.push({ id, name: d.name.trim(), painter: d.painter.trim() || "5th class", emoji: d.emoji, color: d.color,
      journey: [{ date: new Date().toISOString().slice(0, 10), found: "Dublin, Ireland", hidden: "Dublin, Ireland", note: "Painted in class! 🎨" }] });
    save();
    classPage();
  });
}

function route() {
  if (activeMap) { activeMap.remove(); activeMap = null; }
  const [page, arg] = (location.hash.slice(1) || "home").split("/");
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + page));
  ({ home, rocks: () => rockList(), rock: () => rockPage(arg), found: () => found(arg), rules, class: classPage }[page] || home)();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
