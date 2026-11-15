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
const EMOJIS = [
  "🌊", "⭐", "🌟", "✨", "🌈", "☀️", "🌙", "⚡", "❄️", "🔥", "💧", "🌍", "🪐", "🚀", "🛸",
  "🦋", "🐞", "🐝", "🐢", "🐬", "🐳", "🐙", "🦀", "🐠", "🦈", "🐸", "🦊", "🐱", "🐶", "🐰",
  "🐼", "🐨", "🦁", "🐯", "🐵", "🦄", "🐉", "🦖", "🦕", "🦉", "🦜", "🐧", "🦩", "🐌", "🦔",
  "🌻", "🌸", "🌷", "🌹", "🌺", "🍀", "🌵", "🌴", "🍄", "🍁", "🌳",
  "🍓", "🍉", "🍒", "🍋", "🍑", "🥑", "🍭", "🧁", "🍦",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🩷", "💖", "💎", "👑", "🎀", "🎈", "🎨", "🎵", "⚽", "🏀",
  "😀", "😎", "🤓", "🥰", "😝", "🥴", "🤩", "😇", "🤪", "👻", "👽", "🤖", "💩", "🎃",
];

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
  catch (e) { alert(t("no_space")); return false; }
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
      coverFaces(c).finally(() => resolve(c.toDataURL("image/jpeg", 0.75)));
    };
    img.onerror = () => resolve("");
    img.src = URL.createObjectURL(file);
  });
}
// Face stickers: finds faces in the photo (on this phone, nothing is sent anywhere)
// and puts a fun emoji on each one. Uses Google's free MediaPipe face detector.
const FACE_EMOJIS = ["🥴", "😝", "☺️", "🥰", "😀", "😃", "😄", "😁", "😆", "😎", "🤓", "🤩", "😇", "🤪", "😜", "😛", "🥳", "😺", "🐶", "🐱", "🐼", "🐸", "🐵", "🦄", "👽", "🤖", "👻", "🤡", "🙃", "😋"];
const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
let detectorPromise = null;
function getFaceDetector() {
  if (!detectorPromise) detectorPromise = (async () => {
    const v = await import(`${MP}/vision_bundle.mjs`);
    const files = await v.FilesetResolver.forVisionTasks(`${MP}/wasm`);
    return v.FaceDetector.createFromOptions(files, {
      baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite" },
      runningMode: "IMAGE", minDetectionConfidence: 0.7,
    });
  })().catch(() => null);
  return detectorPromise;
}
async function coverFaces(c) {
  const boxes = [];
  try {
    const det = await getFaceDetector();
    if (det) det.detect(c).detections.forEach(d => boxes.push(d.boundingBox && { x: d.boundingBox.originX, y: d.boundingBox.originY, w: d.boundingBox.width, h: d.boundingBox.height }));
  } catch (e) { /* ignore */ }
  try {
    if (!boxes.length && "FaceDetector" in window) {
      (await new window.FaceDetector().detect(c)).forEach(f => boxes.push({ x: f.boundingBox.x, y: f.boundingBox.y, w: f.boundingBox.width, h: f.boundingBox.height }));
    }
  } catch (e) { /* ignore */ }
  const ctx = c.getContext("2d");
  // A painted face on a rock can look like a face to the detector.
  // Real faces have skin colour, painted rocks usually don't, so we check the middle of each box first.
  const real = boxes.filter(Boolean).filter(b => skinRatio(ctx, b) >= 0.25);
  real.forEach(b => {
    const size = Math.max(b.w, b.h) * 1.5;
    ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)], b.x + b.w / 2, b.y + b.h / 2);
  });
  return real.length;
}
function skinRatio(ctx, b) {
  const x = Math.max(0, Math.round(b.x + b.w * 0.25)), y = Math.max(0, Math.round(b.y + b.h * 0.25));
  const w = Math.max(1, Math.round(b.w * 0.5)), h = Math.max(1, Math.round(b.h * 0.5));
  let px; try { px = ctx.getImageData(x, y, w, h).data; } catch (e) { return 1; }
  let skin = 0, n = 0;
  for (let i = 0; i < px.length; i += 16) {
    const r = px[i], g = px[i + 1], bl = px[i + 2];
    const cb = 128 - 0.169 * r - 0.331 * g + 0.5 * bl, cr = 128 + 0.5 * r - 0.419 * g - 0.081 * bl;
    if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && r > g) skin++;
    n++;
  }
  return n ? skin / n : 0;
}
document.addEventListener("change", e => { if (e.target.name === "photo") getFaceDetector(); });

const photoInput = () => `<label>${t("photo_label")}</label>
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
// Kilometres the rock travelled: adds up the straight-line distance between every place it was found.
function kmBetween([a1, o1], [a2, o2]) {
  const R = 6371, rad = x => x * Math.PI / 180;
  const h = Math.sin(rad(a2 - a1) / 2) ** 2 + Math.cos(rad(a1)) * Math.cos(rad(a2)) * Math.sin(rad(o2 - o1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const rockKm = r => {
  let km = 0, prev = null;
  r.journey.forEach(j => { const c = coord(j.found, j.foundArea); if (c) { if (prev) km += kmBetween(prev, c); prev = c; } });
  return Math.round(km);
};
const kmText = r => `${rockKm(r).toLocaleString(lang === "ie" ? "en-IE" : lang)} ${t("km")}`;
// Medals a rock has earned on its journey.
const medals = r => {
  const km = rockKm(r), parks = new Set(r.journey.map(j => (j.foundArea || "").toLowerCase()).filter(Boolean)).size;
  return [
    ["✈️", "m_abroad", r.journey.some(j => !j.found.endsWith("Ireland"))],
    ["💯", "m_100", km >= 100],
    ["🚀", "m_1000", km >= 1000],
    ["🌳", "m_parks", parks >= 5],
    ["🗺️", "m_countries", countries(r) >= 3],
    ["🔎", "m_finds", r.journey.length >= 10],
  ].filter(m => m[2]);
};
const countries = r => new Set(r.journey.map(j => j.found.split(", ")[1])).size;

// Bright wall-map colours. Natural Earth gives each country a colour number so neighbours never match.
const FLAGS = "🇮🇪 🇮🇱 🇫🇷 🇪🇸 🇮🇹 🇩🇪 🇵🇹 🇬🇧 🇺🇸 🇨🇦 🇲🇽 🇧🇷 🇦🇷 🇯🇵 🇰🇷 🇨🇳 🇮🇳 🇦🇺 🇳🇿 🇿🇦 🇪🇬 🇬🇷 🇳🇱 🇧🇪 🇨🇭 🇦🇹 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇵🇱 🇨🇿 🇭🇷 🇹🇷 🇲🇦 🇰🇪 🇳🇬 🇹🇭 🇻🇳 🇵🇭 🇮🇩 🇸🇬 🇵🇪 🇨🇱 🇨🇴 🇯🇲 🇮🇸 🇺🇦".split(" ");
const MAP_COLORS = ["#f9a8d4", "#fde047", "#86efac", "#fdba74", "#c4b5fd", "#f87171", "#67e8f9", "#fca5a5"];
const prop = (f, k) => f.properties[k] ?? f.properties[k.toUpperCase()];
// Country name in the language the site is set to (the phone's browser knows every country's name in every language).
function countryName(f) {
  const code = ["iso_a2", "wb_a2", "iso_a2_eh", "postal"].map(k => String(prop(f, k) || "")).find(c => /^[A-Z]{2}$/.test(c));
  const locale = lang === "ie" ? "en-IE" : lang;
  try { if (code) return new Intl.DisplayNames([locale, "en"], { type: "region" }).of(code); } catch (e) { /* fall back */ }
  return String(prop(f, "name") || "");
}
let countriesPromise = null;
function getCountries() {
  if (!countriesPromise) countriesPromise = (async () => {
    for (const url of [
      "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson",
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
    ]) {
      try { const r = await fetch(url); if (r.ok) return await r.json(); } catch (e) { /* try next */ }
    }
    return null;
  })();
  return countriesPromise;
}

function makeMap(el, rockList) {
  if (activeMap) { activeMap.remove(); activeMap = null; }
  if (typeof L === "undefined") { el.innerHTML = `<p class='notice'>${t("map_fail")}</p>`; return; }
  activeMap = L.map(el, { scrollWheelZoom: false, minZoom: 1 }).setView([50, 5], 3);
  el.classList.add("ocean");
  // Colourful country map (like a school wall map). Zoom in close and the real street map appears to show the park.
  const map = activeMap;
  const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 13 });
  map.createPane("countries"); map.getPane("countries").style.zIndex = 250;
  let countries = null;
  const update = () => {
    const close = map.getZoom() >= 9;
    if (close && !map.hasLayer(streets)) streets.addTo(map);
    if (!close && map.hasLayer(streets)) map.removeLayer(streets);
    if (countries) countries.setStyle({ fillOpacity: close ? 0 : 1, opacity: close ? 0 : 1 });
  };
  map.on("zoomend", update);
  getCountries().then(data => {
    if (activeMap !== map) return;
    if (!data) { streets.addTo(map); el.classList.remove("ocean"); return; }
    countries = L.geoJSON(data, {
      pane: "countries",
      style: f => ({ fillColor: MAP_COLORS[(prop(f, "mapcolor7") || 1) % MAP_COLORS.length], fillOpacity: 1, color: "#4a4a4a", weight: 0.7 }),
      onEachFeature: (f, layer) => layer.bindTooltip(() => countryName(f), { sticky: true }),
    }).addTo(map);
    update();
  });
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
      L.marker(now).addTo(activeMap).bindPopup(`${esc(r.emoji)} <b>#${r.id} ${esc(r.name)}</b><br>${esc(lastPlace(r))}<br><a href="#rock/${r.id}">${t("see_journey")}</a>`);
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
      <p>${t("hero_sub")}</p>
      <a class="btn" href="#found">${t("btn_found")}</a>
      <a class="btn secondary" href="#rocks">${t("btn_find")}</a>
    </section>
    <div class="steps">
      <div class="card step"><div class="num">🎨</div><b>${t("s1_t")}</b><br>${t("s1")}</div>
      <div class="card step"><div class="num">🌳</div><b>${t("s2_t")}</b><br>${t("s2")}</div>
      <div class="card step"><div class="num">🔎</div><b>${t("s3_t")}</b><br>${t("s3")}</div>
      <div class="card step"><div class="num">✈️</div><b>${t("s4_t")}</b><br>${t("s4")}</div>
    </div>
    <div class="card">
      <h2>${t("map_title")}</h2>
      <p>${t("stats", { n: rocks.length, m: totalMoves })}</p>
      <div class="map-flags">${FLAGS.slice(0, 24).join("")}</div>
      <div id="map"></div>
      <div class="map-flags">${FLAGS.slice(24).join("")}</div>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>${t("top_title")}</h2>
      ${(() => {
        const top = rocks.map(r => [r, rockKm(r)]).filter(([, km]) => km > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return top.length ? `<ol class="top">${top.map(([r], i) => `<li><span>${["🥇", "🥈", "🥉", "4", "5"][i]}</span> <a href="#rock/${r.id}">${esc(r.emoji)} #${r.id} ${esc(r.name)}</a> <b>${kmText(r)}</b></li>`).join("")}</ol>` : `<p>${t("top_empty")}</p>`;
      })()}
    </div>`;
  makeMap(document.getElementById("map"), rocks);
}

// Forgiving search: finds "Lily" even if you type "loly" or "lilly" (small typos are OK).
function typos(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]; d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}
function similar(name, q) {
  if (!name) return false;
  if (name.includes(q)) return true;
  const allowed = q.length <= 3 ? 0 : q.length <= 6 ? 1 : 2;
  return name.split(/\s+/).concat(name).some(w => typos(w, q) <= allowed || typos(w.slice(0, q.length), q) <= allowed);
}

function rockList(q = "") {
  app.innerHTML = `
    <h1>${t("find_title")}</h1>
    <input class="search" id="q" placeholder="${t("search_ph")}" value="${esc(q)}">
    <div class="rock-grid" id="grid"></div>`;
  const grid = document.getElementById("grid");
  const draw = text => {
    const q = text.trim().toLowerCase().replace("#", "");
    const list = rocks.filter(r => !q || String(r.id) === q || [r.name, r.painter].some(s => similar(String(s || "").toLowerCase(), q)));
    grid.innerHTML = list.length ? list.map(r => `
      <a class="card rock-card" href="#rock/${r.id}">
        ${rockBadge(r)}
        <b>#${r.id} ${esc(r.name)}</b><br>
        📍 ${esc(lastPlace(r))}<br>
        📏 ${kmText(r)} ${medals(r).map(m => m[0]).join("")}<br>
        <span class="status ${r.journey.length > 1 ? "" : "home"}">${r.journey.length > 1 ? t("travelling") : t("at_home")}</span>
      </a>`).join("") : `<p>${t("no_match")}</p>`;
  };
  const input = document.getElementById("q");
  input.addEventListener("input", () => draw(input.value));
  draw(q);
}

function rockPage(id) {
  const r = rocks.find(x => x.id === Number(id));
  if (!r) { app.innerHTML = `<h1>${t("not_found")}</h1><a class='btn' href='#rocks'>${t("back_all")}</a>`; return; }
  app.innerHTML = `
    <div class="card">
      ${rockBadge(r)}
      <h1>#${r.id} ${esc(r.name)}</h1>
      <p>🎨 ${t("painted_by")}: ${esc(r.painter || t("artist"))}<br>
      📍 ${t("last_found")}: <b>${esc(lastPlace(r))}</b> (${t("hiding_new")})<br>
      📏 ${t("km_label")}: <b class="km">${kmText(r)}</b><br>
      🌍 ${t("countries")}: ${countries(r)} · ${t("updates")}: ${r.journey.length}</p>
      <h2>${t("medals_title")}</h2>
      ${medals(r).length ? `<div class="medals">${medals(r).map(([e, k]) => `<div class="medal"><span>${e}</span>${t(k)}</div>`).join("")}</div>` : `<p>${t("medals_none")}</p>`}
      <a class="btn" href="#found/${r.id}">${t("found_this")}</a>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>${t("journey_map")}</h2>
      <div id="map"></div>
      <h2>${t("journey")}</h2>
      <ul class="timeline">
        ${r.journey.map(j => `<li><b>${esc(j.date)}</b>: ${t("found_in")} <b>${esc(label(j.found, j.foundArea))}</b>${j.note ? `<br><i>${esc(j.note)}</i>` : ""}${safeSrc(j.photo) ? `<br><img class="journey-photo" src="${safeSrc(j.photo)}" alt="Rock photo">` : ""}</li>`).join("")}
      </ul>
      <form id="pic" class="no-print">
        ${photoInput()}
        <button class="btn secondary" type="submit">${safeSrc(r.photo) ? t("change_photo") : t("add_photo")}</button>
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
    <h1>${t("found_title")}</h1>
    <div class="card">
      <p>${t("found_intro")}</p>
      ${areaOptions}
      <form id="f">
        <label>${t("rock_num")}</label>
        <input name="rock" required value="${esc(id)}" placeholder="${t("rock_num_ph")}">
        ${photoInput()}
        <h2>${t("where_found")}</h2>
        <label>${t("park")}</label>
        <input name="foundArea" list="areas" maxlength="40" placeholder="${t("park_ph")}">
        <label>${t("city")}</label>
        <select name="found">${placeOptions("Dublin, Ireland")}</select>
        <label>${t("date_found")}</label>
        <input type="date" name="date" value="${today}" required>
        <div class="notice">${t("secret")}</div>
        <label>${t("msg_label")}</label>
        <input name="note" maxlength="120" placeholder="${t("msg_ph")}">
        <button class="btn" type="submit">${t("update_btn")}</button>
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
    if (!r) { msg.innerHTML = `<p class="notice">${t("no_rock_called", { x: esc(d.rock) })}</p>`; return; }
    const foundArea = (d.foundArea || "").trim().slice(0, 40);
    if (/\d/.test(foundArea)) { msg.innerHTML = `<p class="notice">${t("no_numbers")}</p>`; return; }
    r.journey.push({ date: d.date, found: d.found, foundArea, note: d.note.slice(0, 120), photo });
    if (photo && !r.photo) r.photo = photo;
    if (!save()) { r.journey.pop(); return; }
    location.hash = `#rock/${r.id}`;
  });
}

function rules() {
  app.innerHTML = `
    <h1>${t("rules_title")}</h1>
    <div class="card">
      <ul class="rules">
        <li>${t("r1")}</li>
        <li>${t("r2")}</li>
        <li>${t("r3")}</li>
        <li>${t("r4")}</li>
      </ul>
    </div>`;
}

function classPage() {
  app.innerHTML = `
    <h1>${t("add_title")}</h1>
    <div class="card no-print">
      <h2>${t("add_new")}</h2>
      <form id="add">
        <label>${t("rock_name")}</label>
        <input name="name" required maxlength="30" placeholder="${t("rock_name_ph")}">
        <label>${t("painter")}</label>
        <input name="painter" maxlength="30" placeholder="${t("painter_ph")}">
        ${photoInput()}
        <label>${t("emoji_label")}</label>
        <select name="emoji">${EMOJIS.map(e => `<option>${e}</option>`).join("")}</select>
        <button class="btn" type="submit">${t("add_btn")}</button>
      </form>
    </div>
    <div class="card" style="margin-top:12px">
      <h2>${t("labels_title")}</h2>
      <p class="no-print">${t("labels_help")}</p>
      <button class="btn secondary no-print" onclick="window.print()">${t("print_btn")}</button>
      <div class="labels" style="margin-top:12px">
        ${rocks.map(r => `<div class="label"><b>🪨 Travelling Rocks</b><span>${t("label_rock")} #${r.id}: ${esc(r.name)}</span><small>${t("label_found")}</small><small><b dir="ltr">${SITE_URL}</b></small><small>${t("label_hide")}</small></div>`).join("")}
      </div>
    </div>`;
  document.getElementById("add").addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const photo = await readPhoto(d.photo);
    const id = rocks.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    rocks.push({ id, name: d.name.trim(), painter: d.painter.trim() || t("artist"), emoji: d.emoji, color: COLORS[id % COLORS.length], photo,
      journey: [{ date: new Date().toISOString().slice(0, 10), found: "Dublin, Ireland", note: t("just_painted") }] });
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
applyChrome();
route();
