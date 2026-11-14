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

// Parks and neighbourhoods (Dad's rule: a park or area name is OK, never a street, address or exact spot).
// The map pin goes in the middle of the area.
const AREAS = {
  "Marlay Park": [53.274, -6.271],
  "Bushy Park": [53.307, -6.271],
  "St Enda's Park": [53.288, -6.290],
  "Rathfarnham": [53.298, -6.283],
  "Templeogue": [53.296, -6.308],
  "Tymon Park": [53.300, -6.335],
  "Dundrum": [53.290, -6.244],
  "Ticknock": [53.255, -6.255],
  "Herbert Park": [53.326, -6.234],
  "St Stephen's Green": [53.338, -6.259],
  "Phoenix Park": [53.356, -6.330],
  "Cabinteely Park": [53.262, -6.152],
  "Killiney Hill": [53.264, -6.110],
  "Howth": [53.378, -6.067],
  "Bray": [53.203, -6.098],
};
const areaOptions = `<datalist id="areas">${Object.keys(AREAS).map(a => `<option value="${a}">`).join("")}</datalist>`;
const coord = (place, area) => AREAS[area] || PLACES[place];
const label = (place, area) => area ? `${area}, ${place.split(", ")[0]}` : place;

const COLORS = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
const EMOJIS = ["🌊", "⭐", "🦋", "🌈", "🐞", "🌻", "🐬", "🍀", "🦄", "🐢"];

const SAMPLE_ROCKS = [
  { id: 1, name: "Lily", emoji: "🦋", color: "#ffd6a5", painter: "Lily",
    journey: [
      { date: "2026-11-10", found: "Dublin, Ireland", hidden: "Dublin, Ireland", note: "Just painted! 🎨" },
    ] },
  { id: 2, name: "Rocky", emoji: "⭐", color: "#9bf6ff", painter: "Rock Star",
    journey: [
      { date: "2026-11-10", found: "Dublin, Ireland", hidden: "Dublin, Ireland", note: "Just painted! 🎨" },
      { date: "2026-11-12", found: "Paris, France", note: "Someone took me to Paris on holiday ✈️" },
    ] },
];

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("travelling-rocks"));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(SAMPLE_ROCKS));
}
function save() {
  try { localStorage.setItem("travelling-rocks", JSON.stringify(rocks)); return true; }
  catch (e) { alert("Not enough space to save more photos on this device 😕"); return false; }
}

// Shrinks a photo to max 600px and re-saves it as JPEG.
// Re-drawing removes hidden photo data (like GPS location), which keeps everyone safe.
function readPhoto(file) {
  return new Promise(resolve => {
    if (!file || !file.size) return resolve("");
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 600 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = () => resolve("");
    img.src = URL.createObjectURL(file);
  });
}
const photoInput = `<label>📸 Take a photo of the rock (just the rock!)</label>
        <input type="file" name="photo" accept="image/*" capture="environment">`;
const safeSrc = s => typeof s === "string" && s.startsWith("data:image/") ? s : "";

let rocks = load();
const app = document.getElementById("app");
let activeMap = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Where it is hidden now is a secret: we only show where it was last FOUND.
const lastStop = r => r.journey[r.journey.length - 1] || { found: "Dublin, Ireland" };
const lastPlace = r => label(lastStop(r).found, lastStop(r).foundArea);
const lastCoord = r => coord(lastStop(r).found, lastStop(r).foundArea);
const placeOptions = sel => Object.keys(PLACES).map(p => `<option ${p === sel ? "selected" : ""}>${p}</option>`).join("");
const rockBadge = r => safeSrc(r.photo)
  ? `<img class="rock-photo" src="${safeSrc(r.photo)}" alt="${esc(r.name)}">`
  : `<div class="rock-emoji" style="background:${esc(r.color)}">${esc(r.emoji)}</div>`;
const countries = r => new Set(r.journey.map(j => j.found.split(", ")[1])).size;

function makeMap(el, rockList) {
  if (activeMap) { activeMap.remove(); activeMap = null; }
  if (typeof L === "undefined") { el.innerHTML = "<p class='notice'>The map could not load right now 🗺️</p>"; return; }
  activeMap = L.map(el, { scrollWheelZoom: false }).setView([50, 5], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap", maxZoom: 13,
  }).addTo(activeMap);
  const bounds = [];
  rockList.forEach(r => {
    const path = [];
    r.journey.forEach(j => {
      const c = coord(j.found, j.foundArea);
      if (c && (!path.length || path[path.length - 1] !== c)) path.push(c);
    });
    if (path.length > 1) L.polyline(path, { color: r.color === "#fdffb6" ? "#e0a800" : r.color, weight: 4, dashArray: "6 8" }).addTo(activeMap);
    const now = lastCoord(r);
    if (now) {
      L.marker(now).addTo(activeMap).bindPopup(`${esc(r.emoji)} <b>#${r.id} ${esc(r.name)}</b><br>${esc(lastPlace(r))}<br><a href="#rock/${r.id}">See journey</a>`);
      bounds.push(now);
    }
    path.forEach(p => bounds.push(p));
  });
  if (bounds.length > 1) activeMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
  else if (bounds.length === 1) activeMap.setView(bounds[0], 11);
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
      <div class="card step"><div class="num">🎨</div><b>1. Paint</b><br>Paint a rock and give it a special name.</div>
      <div class="card step"><div class="num">🌳</div><b>2. Hide</b><br>Hide it in a park, anywhere in the world!</div>
      <div class="card step"><div class="num">🔎</div><b>3. Find</b><br>Found a rock? Come here and tell us where!</div>
      <div class="card step"><div class="num">✈️</div><b>4. Hide again</b><br>Hide it in a different park. Shh, don't tell anyone where! 🤫</div>
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
      <p>🎨 Painted by: ${esc(r.painter || "a rock artist")}<br>
      📍 Last found in: <b>${esc(lastPlace(r))}</b> (now hiding somewhere new 🤫)<br>
      🌍 Countries visited: ${countries(r)} · Updates: ${r.journey.length}</p>
      <a class="btn" href="#found/${r.id}">I found this rock! 🎉</a>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>🗺️ Journey map</h2>
      <div id="map"></div>
      <h2>📜 Journey</h2>
      <ul class="timeline">
        ${r.journey.map(j => `<li><b>${esc(j.date)}</b>: found in <b>${esc(label(j.found, j.foundArea))}</b>${j.note ? `<br><i>${esc(j.note)}</i>` : ""}${safeSrc(j.photo) ? `<br><img class="journey-photo" src="${safeSrc(j.photo)}" alt="Rock photo">` : ""}</li>`).join("")}
      </ul>
      <form id="pic" class="no-print">
        ${photoInput}
        <button class="btn secondary" type="submit">${safeSrc(r.photo) ? "Change photo 📸" : "Add photo 📸"}</button>
      </form>
    </div>`;
  makeMap(document.getElementById("map"), [r]);
  document.getElementById("pic").addEventListener("submit", async e => {
    e.preventDefault();
    const photo = await readPhoto(e.target.photo.files[0]);
    if (!photo) return;
    r.photo = photo;
    if (save()) rockPage(r.id);
  });
}

function found(id = "") {
  const today = new Date().toISOString().slice(0, 10);
  app.innerHTML = `
    <h1>🎉 I Found a Rock!</h1>
    <div class="card">
      <p>Yay, you found a Travelling Rock! Tell us where 🌍</p>
      ${areaOptions}
      <form id="f">
        <label>Rock number or name</label>
        <input name="rock" required value="${esc(id)}" placeholder="e.g. 2 or Rocky">
        ${photoInput}
        <h2>🔎 Where did you find it?</h2>
        <label>Park or area name</label>
        <input name="foundArea" list="areas" maxlength="40" placeholder="e.g. Marlay Park">
        <label>City</label>
        <select name="found">${placeOptions("Dublin, Ireland")}</select>
        <label>Date you found it</label>
        <input type="date" name="date" value="${today}" required>
        <div class="notice">🤫 Now hide it in a new park. Shh, it's a secret!</div>
        <label>A short message (optional)</label>
        <input name="note" maxlength="120" placeholder="e.g. Found it near a big tree! 🌳">
        <button class="btn" type="submit">Update journey 🚀</button>
      </form>
      <div id="msg"></div>
    </div>
`;
  document.getElementById("f").addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const photo = await readPhoto(d.photo);
    const key = d.rock.trim().toLowerCase().replace("#", "");
    const r = rocks.find(x => String(x.id) === key || x.name.toLowerCase() === key);
    const msg = document.getElementById("msg");
    if (!r) { msg.innerHTML = `<p class="notice">Hmm, no rock called "${esc(d.rock)}". Check the number on the rock 🔎</p>`; return; }
    const foundArea = (d.foundArea || "").trim().slice(0, 40);
    if (/\d/.test(foundArea)) { msg.innerHTML = `<p class="notice">Just the park name please, no numbers 😊</p>`; return; }
    r.journey.push({ date: d.date, found: d.found, foundArea, note: d.note.slice(0, 120), photo });
    if (photo && !r.photo) r.photo = photo;
    if (!save()) { r.journey.pop(); return; }
    location.hash = `#rock/${r.id}`;
  });
}

function rules() {
  app.innerHTML = `
    <h1>🌟 Rock Rules</h1>
    <div class="card">
      <ul class="rules">
        <li>🌳 Hide rocks in parks, somewhere safe and easy to reach.</li>
        <li>🌿 Be kind to nature.</li>
        <li>📝 Write only the park name, nothing about you.</li>
        <li>🤫 Keep the new hiding place a secret!</li>
      </ul>
    </div>`;
}

function classPage() {
  app.innerHTML = `
    <h1>🎨 Add a Rock</h1>
    <div class="card no-print">
      <h2>Add a new rock</h2>
      <form id="add">
        <label>Rock name</label>
        <input name="name" required maxlength="30" placeholder="e.g. Sparkle">
        <label>Painted by (first name or nickname)</label>
        <input name="painter" maxlength="30" placeholder="e.g. Rock Star">
        ${photoInput}
        <label>No photo? Pick an emoji instead</label>
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
  document.getElementById("add").addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const photo = await readPhoto(d.photo);
    const id = rocks.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    rocks.push({ id, name: d.name.trim(), painter: d.painter.trim() || "a rock artist", emoji: d.emoji, color: d.color, photo,
      journey: [{ date: new Date().toISOString().slice(0, 10), found: "Dublin, Ireland", note: "Just painted! 🎨" }] });
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
