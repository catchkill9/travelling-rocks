// Languages for Travelling Rocks. Add a new language by copying the "en" block.
const LANGS = {
  en: { name: "English", flag: "🇬🇧", dir: "ltr",
    nav_home: "Home", nav_rocks: "Find a Rock", nav_found: "I Found a Rock!", nav_rules: "Rules", nav_add: "Add a Rock",
    footer: "🪨 Painted rocks travelling the world, one hiding place at a time 🌍",
    hero_sub: "Painted rocks that travel the world, one hiding place at a time!",
    btn_found: "I found a rock! 🎉", btn_find: "Find a rock 🔎",
    s1_t: "1. Paint", s1: "Paint a rock and give it a special name.",
    s2_t: "2. Hide", s2: "Hide it in a park, anywhere in the world!",
    s3_t: "3. Find", s3: "Found a rock? Come here and tell us where!",
    s4_t: "4. Hide again", s4: "Hide it in a different park. Shh, don't tell anyone where! 🤫",
    map_title: "🗺️ Where are the rocks now?", stats: "{n} rocks · {m} journey updates",
    map_fail: "The map could not load right now 🗺️", see_journey: "See journey",
    find_title: "🔎 Find a Rock", search_ph: "Search by rock name or number...",
    travelling: "Travelling ✈️", at_home: "At home 🏠", no_match: "No rock found with that name or number 🤔",
    not_found: "Rock not found 🤔", back_all: "Back to all rocks",
    painted_by: "Painted by", artist: "a rock artist", last_found: "Last found in", hiding_new: "now hiding somewhere new 🤫",
    countries: "Countries visited", updates: "Updates", found_this: "I found this rock! 🎉",
    journey_map: "🗺️ Journey map", journey: "📜 Journey", found_in: "found in",
    photo_label: "📸 Take a photo of the rock (just the rock!)", add_photo: "Add photo 📸", change_photo: "Change photo 📸",
    found_title: "🎉 I Found a Rock!", found_intro: "Yay, you found a Travelling Rock! Tell us where 🌍",
    rock_num: "Rock number or name", rock_num_ph: "e.g. 2 or Rocky",
    where_found: "🔎 Where did you find it?", park: "Park or area name", park_ph: "e.g. Marlay Park", city: "City",
    date_found: "Date you found it", secret: "🤫 Now hide it in a new park. Shh, it's a secret!",
    msg_label: "A short message (optional)", msg_ph: "e.g. Found it near a big tree! 🌳", update_btn: "Update journey 🚀",
    no_rock_called: "Hmm, no rock called \"{x}\". Check the number on the rock 🔎", no_numbers: "Just the park name please, no numbers 😊",
    rules_title: "🌟 Rock Rules", r1: "🌳 Hide rocks in parks, somewhere safe and easy to reach.", r2: "🌿 Be kind to nature.",
    r3: "📝 Write only the park name, nothing about you.", r4: "🤫 Keep the new hiding place a secret!",
    add_title: "🎨 Add a Rock", add_new: "Add a new rock", rock_name: "Rock name", rock_name_ph: "e.g. Sparkle",
    painter: "Painted by (first name or nickname)", painter_ph: "e.g. Rock Star", emoji_label: "No photo? Pick an emoji instead",
    add_btn: "Add rock 🪨", labels_title: "🏷️ Labels for the back of the rocks",
    labels_help: "Print this page and stick a label on the back of each rock (or copy it with a marker).", print_btn: "Print labels 🖨️",
    label_rock: "Rock", label_found: "Found me? Tell us at", label_hide: "then hide me again! 🌍",
    just_painted: "Just painted! 🎨", no_space: "Not enough space to save more photos on this device 😕" },

  he: { name: "עברית", flag: "🇮🇱", dir: "rtl",
    nav_home: "בית", nav_rocks: "חפשו אבן", nav_found: "מצאתי אבן!", nav_rules: "חוקים", nav_add: "הוסיפו אבן",
    footer: "🪨 אבנים צבועות שמטיילות בעולם, מחבוא אחרי מחבוא 🌍",
    hero_sub: "אבנים צבועות שמטיילות בעולם, מחבוא אחרי מחבוא!",
    btn_found: "מצאתי אבן! 🎉", btn_find: "חפשו אבן 🔎",
    s1_t: "1. צובעים", s1: "צובעים אבן ונותנים לה שם מיוחד.",
    s2_t: "2. מחביאים", s2: "מחביאים אותה בפארק, בכל מקום בעולם!",
    s3_t: "3. מוצאים", s3: "מצאתם אבן? בואו לכאן וספרו לנו איפה!",
    s4_t: "4. מחביאים שוב", s4: "מחביאים אותה בפארק אחר. ששש, לא מספרים לאף אחד איפה! 🤫",
    map_title: "🗺️ איפה האבנים עכשיו?", stats: "{n} אבנים · {m} עדכוני מסע",
    map_fail: "המפה לא נטענה כרגע 🗺️", see_journey: "לראות את המסע",
    find_title: "🔎 חפשו אבן", search_ph: "חיפוש לפי שם או מספר של אבן...",
    travelling: "מטיילת ✈️", at_home: "בבית 🏠", no_match: "לא מצאנו אבן עם השם או המספר האלה 🤔",
    not_found: "האבן לא נמצאה 🤔", back_all: "חזרה לכל האבנים",
    painted_by: "צוירה על ידי", artist: "אמן אבנים", last_found: "נמצאה לאחרונה ב", hiding_new: "עכשיו מתחבאת במקום חדש 🤫",
    countries: "מדינות שביקרה בהן", updates: "עדכונים", found_this: "מצאתי את האבן הזאת! 🎉",
    journey_map: "🗺️ מפת המסע", journey: "📜 המסע", found_in: "נמצאה ב",
    photo_label: "📸 צלמו את האבן (רק את האבן!)", add_photo: "הוסיפו תמונה 📸", change_photo: "החליפו תמונה 📸",
    found_title: "🎉 מצאתי אבן!", found_intro: "יש! מצאתם אבן מטיילת! ספרו לנו איפה 🌍",
    rock_num: "מספר או שם האבן", rock_num_ph: "למשל 2 או Rocky",
    where_found: "🔎 איפה מצאתם אותה?", park: "שם הפארק או האזור", park_ph: "למשל Marlay Park", city: "עיר",
    date_found: "מתי מצאתם אותה", secret: "🤫 עכשיו מחביאים אותה בפארק חדש. ששש, זה סוד!",
    msg_label: "הודעה קצרה (לא חובה)", msg_ph: "למשל: מצאתי אותה ליד עץ גדול! 🌳", update_btn: "עדכון המסע 🚀",
    no_rock_called: "אין אבן בשם \"{x}\". בדקו את המספר על האבן 🔎", no_numbers: "רק שם הפארק בבקשה, בלי מספרים 😊",
    rules_title: "🌟 חוקי האבנים", r1: "🌳 מחביאים אבנים בפארקים, במקום בטוח שקל להגיע אליו.", r2: "🌿 שומרים על הטבע.",
    r3: "📝 כותבים רק את שם הפארק, שום דבר עליכם.", r4: "🤫 שומרים את המחבוא החדש בסוד!",
    add_title: "🎨 הוסיפו אבן", add_new: "אבן חדשה", rock_name: "שם האבן", rock_name_ph: "למשל Sparkle",
    painter: "צוירה על ידי (שם פרטי או כינוי)", painter_ph: "למשל Rock Star", emoji_label: "אין תמונה? בחרו אימוג'י",
    add_btn: "הוסיפו אבן 🪨", labels_title: "🏷️ מדבקות לגב האבנים",
    labels_help: "הדפיסו את העמוד והדביקו מדבקה על הגב של כל אבן (או העתיקו בטוש).", print_btn: "הדפסת מדבקות 🖨️",
    label_rock: "אבן", label_found: "מצאתם אותי? ספרו לנו ב", label_hide: "ואז החביאו אותי שוב! 🌍",
    just_painted: "רק נצבעה! 🎨", no_space: "אין מספיק מקום לשמור עוד תמונות במכשיר הזה 😕" },

  es: { name: "Español", flag: "🇪🇸", dir: "ltr",
    nav_home: "Inicio", nav_rocks: "Buscar piedra", nav_found: "¡Encontré una piedra!", nav_rules: "Reglas", nav_add: "Añadir piedra",
    footer: "🪨 Piedras pintadas que viajan por el mundo, un escondite tras otro 🌍",
    hero_sub: "¡Piedras pintadas que viajan por el mundo, un escondite tras otro!",
    btn_found: "¡Encontré una piedra! 🎉", btn_find: "Buscar una piedra 🔎",
    s1_t: "1. Pinta", s1: "Pinta una piedra y ponle un nombre especial.",
    s2_t: "2. Esconde", s2: "¡Escóndela en un parque, en cualquier lugar del mundo!",
    s3_t: "3. Encuentra", s3: "¿Encontraste una piedra? ¡Ven y dinos dónde!",
    s4_t: "4. Esconde otra vez", s4: "Escóndela en otro parque. ¡Shh, no le digas a nadie dónde! 🤫",
    map_title: "🗺️ ¿Dónde están las piedras ahora?", stats: "{n} piedras · {m} actualizaciones",
    map_fail: "El mapa no se pudo cargar ahora 🗺️", see_journey: "Ver el viaje",
    find_title: "🔎 Buscar una piedra", search_ph: "Busca por nombre o número...",
    travelling: "Viajando ✈️", at_home: "En casa 🏠", no_match: "No hay ninguna piedra con ese nombre o número 🤔",
    not_found: "Piedra no encontrada 🤔", back_all: "Volver a todas las piedras",
    painted_by: "Pintada por", artist: "un artista de piedras", last_found: "Encontrada por última vez en", hiding_new: "ahora escondida en un lugar nuevo 🤫",
    countries: "Países visitados", updates: "Actualizaciones", found_this: "¡Encontré esta piedra! 🎉",
    journey_map: "🗺️ Mapa del viaje", journey: "📜 Viaje", found_in: "encontrada en",
    photo_label: "📸 Haz una foto de la piedra (¡solo la piedra!)", add_photo: "Añadir foto 📸", change_photo: "Cambiar foto 📸",
    found_title: "🎉 ¡Encontré una piedra!", found_intro: "¡Bien, encontraste una piedra viajera! Dinos dónde 🌍",
    rock_num: "Número o nombre de la piedra", rock_num_ph: "p. ej. 2 o Rocky",
    where_found: "🔎 ¿Dónde la encontraste?", park: "Nombre del parque o zona", park_ph: "p. ej. Marlay Park", city: "Ciudad",
    date_found: "Fecha en que la encontraste", secret: "🤫 Ahora escóndela en otro parque. ¡Shh, es un secreto!",
    msg_label: "Un mensaje corto (opcional)", msg_ph: "p. ej. ¡La encontré junto a un árbol grande! 🌳", update_btn: "Actualizar viaje 🚀",
    no_rock_called: "No hay ninguna piedra llamada \"{x}\". Mira el número de la piedra 🔎", no_numbers: "Solo el nombre del parque, sin números 😊",
    rules_title: "🌟 Reglas de las piedras", r1: "🌳 Esconde las piedras en parques, en un lugar seguro y fácil de alcanzar.", r2: "🌿 Cuida la naturaleza.",
    r3: "📝 Escribe solo el nombre del parque, nada sobre ti.", r4: "🤫 ¡Guarda el nuevo escondite en secreto!",
    add_title: "🎨 Añadir una piedra", add_new: "Nueva piedra", rock_name: "Nombre de la piedra", rock_name_ph: "p. ej. Sparkle",
    painter: "Pintada por (nombre o apodo)", painter_ph: "p. ej. Rock Star", emoji_label: "¿Sin foto? Elige un emoji",
    add_btn: "Añadir piedra 🪨", labels_title: "🏷️ Etiquetas para la parte de atrás",
    labels_help: "Imprime esta página y pega una etiqueta detrás de cada piedra (o cópiala con un rotulador).", print_btn: "Imprimir etiquetas 🖨️",
    label_rock: "Piedra", label_found: "¿Me encontraste? Cuéntalo en", label_hide: "¡y vuelve a esconderme! 🌍",
    just_painted: "¡Recién pintada! 🎨", no_space: "No hay espacio para guardar más fotos en este dispositivo 😕" },

  fr: { name: "Français", flag: "🇫🇷", dir: "ltr",
    nav_home: "Accueil", nav_rocks: "Trouver un galet", nav_found: "J'ai trouvé un galet !", nav_rules: "Règles", nav_add: "Ajouter un galet",
    footer: "🪨 Des galets peints qui voyagent dans le monde, une cachette à la fois 🌍",
    hero_sub: "Des galets peints qui voyagent dans le monde, une cachette à la fois !",
    btn_found: "J'ai trouvé un galet ! 🎉", btn_find: "Trouver un galet 🔎",
    s1_t: "1. Peins", s1: "Peins un galet et donne-lui un nom spécial.",
    s2_t: "2. Cache", s2: "Cache-le dans un parc, n'importe où dans le monde !",
    s3_t: "3. Trouve", s3: "Tu as trouvé un galet ? Viens nous dire où !",
    s4_t: "4. Cache encore", s4: "Cache-le dans un autre parc. Chut, ne dis à personne où ! 🤫",
    map_title: "🗺️ Où sont les galets maintenant ?", stats: "{n} galets · {m} étapes",
    map_fail: "La carte ne peut pas se charger pour le moment 🗺️", see_journey: "Voir le voyage",
    find_title: "🔎 Trouver un galet", search_ph: "Cherche par nom ou numéro...",
    travelling: "En voyage ✈️", at_home: "À la maison 🏠", no_match: "Aucun galet avec ce nom ou ce numéro 🤔",
    not_found: "Galet introuvable 🤔", back_all: "Retour à tous les galets",
    painted_by: "Peint par", artist: "un artiste de galets", last_found: "Trouvé pour la dernière fois à", hiding_new: "caché maintenant dans un nouvel endroit 🤫",
    countries: "Pays visités", updates: "Étapes", found_this: "J'ai trouvé ce galet ! 🎉",
    journey_map: "🗺️ Carte du voyage", journey: "📜 Voyage", found_in: "trouvé à",
    photo_label: "📸 Prends le galet en photo (juste le galet !)", add_photo: "Ajouter une photo 📸", change_photo: "Changer la photo 📸",
    found_title: "🎉 J'ai trouvé un galet !", found_intro: "Bravo, tu as trouvé un galet voyageur ! Dis-nous où 🌍",
    rock_num: "Numéro ou nom du galet", rock_num_ph: "ex. 2 ou Rocky",
    where_found: "🔎 Où l'as-tu trouvé ?", park: "Nom du parc ou du quartier", park_ph: "ex. Marlay Park", city: "Ville",
    date_found: "Date où tu l'as trouvé", secret: "🤫 Maintenant cache-le dans un autre parc. Chut, c'est un secret !",
    msg_label: "Un petit message (facultatif)", msg_ph: "ex. Trouvé près d'un grand arbre ! 🌳", update_btn: "Mettre à jour le voyage 🚀",
    no_rock_called: "Aucun galet appelé « {x} ». Vérifie le numéro sur le galet 🔎", no_numbers: "Juste le nom du parc, sans chiffres 😊",
    rules_title: "🌟 Règles des galets", r1: "🌳 Cache les galets dans des parcs, dans un endroit sûr et facile d'accès.", r2: "🌿 Respecte la nature.",
    r3: "📝 Écris seulement le nom du parc, rien sur toi.", r4: "🤫 Garde la nouvelle cachette secrète !",
    add_title: "🎨 Ajouter un galet", add_new: "Nouveau galet", rock_name: "Nom du galet", rock_name_ph: "ex. Sparkle",
    painter: "Peint par (prénom ou surnom)", painter_ph: "ex. Rock Star", emoji_label: "Pas de photo ? Choisis un emoji",
    add_btn: "Ajouter le galet 🪨", labels_title: "🏷️ Étiquettes pour le dos des galets",
    labels_help: "Imprime cette page et colle une étiquette au dos de chaque galet (ou recopie-la au feutre).", print_btn: "Imprimer les étiquettes 🖨️",
    label_rock: "Galet", label_found: "Tu m'as trouvé ? Dis-le sur", label_hide: "puis cache-moi encore ! 🌍",
    just_painted: "Tout juste peint ! 🎨", no_space: "Plus assez de place pour enregistrer des photos sur cet appareil 😕" },
};

let lang = (() => {
  try { const s = localStorage.getItem("travelling-rocks-lang"); if (LANGS[s]) return s; } catch (e) { /* ignore */ }
  const b = (navigator.language || "en").slice(0, 2);
  return LANGS[b] ? b : "en";
})();
function t(key, vars = {}) {
  let s = (LANGS[lang] && LANGS[lang][key]) || LANGS.en[key] || key;
  Object.keys(vars).forEach(k => { s = s.replace(`{${k}}`, vars[k]); });
  return s;
}
function applyChrome() {
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGS[lang].dir;
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });
  const sel = document.getElementById("lang");
  if (sel) sel.value = lang;
}
function setLang(l) {
  if (!LANGS[l]) return;
  lang = l;
  try { localStorage.setItem("travelling-rocks-lang", l); } catch (e) { /* ignore */ }
  applyChrome();
  if (typeof route === "function") route();
}
