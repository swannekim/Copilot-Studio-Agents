/* AI Style Gallery — 90 trending photo styles
   Each entry: { n, en, ko, desc, cat } */

const STYLES = [
  // ---------- Viral AI transformation trends ----------
  { n: 1, en: "Italian Brainrot", ko: "이탈리안 브레인롯", cat: "Viral AI Trends", desc: "Surreal Italian baroque/Renaissance portrait with uncanny dramatic lighting and exaggerated features — absurdist meme energy." },
  { n: 2, en: "Action Figure Box", ko: "액션 피규어 박스", cat: "Viral AI Trends", desc: "You as a boxed collectible toy, complete with plastic mould, blister packaging and themed accessories." },
  { n: 3, en: "Bandai / Gunpla Model Kit", ko: "반다이 건프라 모델킷", cat: "Viral AI Trends", desc: "Rendered as an unassembled plastic model kit on a runner sprue frame, with parts laid out for assembly." },
  { n: 4, en: "Plush Toy", ko: "봉제 인형", cat: "Viral AI Trends", desc: "Turned into a soft stuffed-animal version with visible stitching, fabric texture and rounded forms." },
  { n: 5, en: "Chibi Figurine", ko: "치비 피규어", cat: "Viral AI Trends", desc: "A tiny, cute character with an oversized head and simplified features — hugely popular across East Asian social media." },
  { n: 6, en: "Funko Pop", ko: "펀코 팝", cat: "Viral AI Trends", desc: "Stylised as a vinyl collectible figure with big black eyes, square head and a boxed-display look." },
  { n: 7, en: "Crochet / Amigurumi", ko: "코바늘 인형 (아미구루미)", cat: "Viral AI Trends", desc: "A handmade yarn-knitted doll version with visible crochet stitches and a soft, cozy craft feel." },
  { n: 8, en: "Claymation", ko: "클레이메이션", cat: "Viral AI Trends", desc: "Chunky stop-motion clay figure à la Wallace & Gromit or Coraline — fingerprints, seams and all." },
  { n: 9, en: "Pixar 3D Avatar", ko: "픽사 3D 아바타", cat: "Viral AI Trends", desc: "Rounded CGI animated-character look with expressive eyes and that signature Pixar quality of light." },
  { n: 10, en: "Memoji / 3D Emoji", ko: "미모지 (3D 이모지)", cat: "Viral AI Trends", desc: "A clean, minimal, geometric cartoon avatar in the style of Apple Memoji — soft and tech-forward." },
  { n: 11, en: "Lego Minifigure", ko: "레고 미니피규어", cat: "Viral AI Trends", desc: "Reimagined as a blocky brick minifigure with cylindrical hands and a studded plastic world." },
  { n: 12, en: "Sticker Sheet / Die-cut", ko: "스티커 시트 (다이컷)", cat: "Viral AI Trends", desc: "A glossy peel-off sticker with a bold white die-cut border, ready for a laptop or phone case." },
  { n: 13, en: "Keychain Charm / Acrylic Standee", ko: "아크릴 키링 / 스탠드", cat: "Viral AI Trends", desc: "Cute translucent acrylic merch — a keyring charm or standee with a printed character and clear edges." },
  { n: 14, en: "Gachapon Capsule Toy", ko: "가챠 캡슐토이", cat: "Viral AI Trends", desc: "A miniature blind-box collectible inside a clear gachapon capsule, glossy and palm-sized." },

  // ---------- Analog / retro tech nostalgia ----------
  { n: 15, en: "VHS Camcorder", ko: "VHS 캠코더", cat: "Analog & Retro Tech", desc: "80s/90s home-video look with tape grain, scanlines, a date stamp and slightly warped color." },
  { n: 16, en: "Y2K Digicam", ko: "Y2K 디지카메라", cat: "Analog & Retro Tech", desc: "Early-2000s point-and-shoot vibe: harsh flash, soft blur, low resolution and that authentic digicam crunch." },
  { n: 17, en: "Disposable Film Camera", ko: "일회용 필름카메라", cat: "Analog & Retro Tech", desc: "Cheap single-use camera aesthetic with a bright flash, light leaks and candid imperfection." },
  { n: 18, en: "Polaroid / Instax", ko: "폴라로이드 (인스탁스)", cat: "Analog & Retro Tech", desc: "Instant-print look inside the classic white frame, with a faded, slightly washed-out wash." },
  { n: 19, en: "Webcam 2007 / MySpace Era", ko: "2000년대 웹캠", cat: "Analog & Retro Tech", desc: "Grainy low-res selfie shot on an old laptop webcam — the unmistakable mid-2000s internet look." },
  { n: 20, en: "Old Game Boy / GBA Screen", ko: "게임보이 화면", cat: "Analog & Retro Tech", desc: "Rendered on a tiny green-tint or color handheld LCD with chunky pixels and a screen-grid texture." },
  { n: 21, en: "Vaporwave", ko: "베이퍼웨이브", cat: "Analog & Retro Tech", desc: "Pastel neon, Roman statues, glitch grids and a dreamy 90s-mall internet-surreal mood." },
  { n: 22, en: "Frutiger Aero", ko: "프루티거 에어로", cat: "Analog & Retro Tech", desc: "Glossy 2000s skeuomorphic optimism — water droplets, bubbles, bright skies and clean tech sheen." },
  { n: 23, en: "Risograph Print", ko: "리소그래프 프린트", cat: "Analog & Retro Tech", desc: "Grainy duotone ink print with visible misregistration and flat, punchy spot colors." },
  { n: 24, en: "Photocopy / Xerox Zine", ko: "복사기 진 (Zine)", cat: "Analog & Retro Tech", desc: "High-contrast black-and-white photocopy look — degraded, gritty and DIY punk-zine flavored." },

  // ---------- Aesthetic 'cores' ----------
  { n: 25, en: "Vamp Romantic", ko: "뱀프 로맨틱", cat: "Aesthetic Cores", desc: "Dark gothic romance with plum-noir tones, smudged kohl and after-dark vampire-beauty drama (Pinterest 2026)." },
  { n: 26, en: "Poetcore", ko: "포엣코어", cat: "Aesthetic Cores", desc: "Moody literary mood — fountain pens, capes and ultra-vintage layers; 2026's dark-academia successor." },
  { n: 27, en: "Neodeco", ko: "네오데코", cat: "Aesthetic Cores", desc: "Futuristic Art Deco: chevrons, fan arches and geometric forms in copper and bronze." },
  { n: 28, en: "Glamoratti", ko: "글래모라티", cat: "Aesthetic Cores", desc: "Sharp 80s power-glam — padded shoulders, tailored suits, bold color and oversized earrings." },
  { n: 29, en: "Mermaidcore", ko: "머메이드코어", cat: "Aesthetic Cores", desc: "Iridescent oceanic fantasy with pearlescent skin, scales, sea-glass tones and watery shimmer." },
  { n: 30, en: "Fairycore", ko: "페어리코어", cat: "Aesthetic Cores", desc: "Whimsical woodland magic — soft glow, wildflowers, gossamer wings and a dreamy storybook haze." },
  { n: 31, en: "Goblincore", ko: "고블린코어", cat: "Aesthetic Cores", desc: "Earthy, mossy, cozy-chaotic nature aesthetic that celebrates mushrooms, frogs and forest clutter." },
  { n: 32, en: "Weirdcore / Dreamcore", ko: "위어드코어 / 드림코어", cat: "Aesthetic Cores", desc: "Liminal, uncanny nostalgia — off-kilter spaces and a half-remembered-dream unease." },
  { n: 33, en: "Cluttercore / Maximalism", ko: "클러터코어 (맥시멀리즘)", cat: "Aesthetic Cores", desc: "The anti-minimalist look: saturated clashing colors, layered patterns and curated visual overload." },
  { n: 34, en: "Coquette", ko: "코케트", cat: "Aesthetic Cores", desc: "Ultra-feminine romanticised girlhood — bows, lace, soft pink and dreamy delicate lighting." },
  { n: 35, en: "Blokecore", ko: "블로크코어", cat: "Aesthetic Cores", desc: "Retro football-jersey casual — terrace-culture sportswear with a nostalgic lad-next-door vibe." },
  { n: 36, en: "Cottagecore", ko: "코티지코어", cat: "Aesthetic Cores", desc: "Romanticised rural life: linen, wildflowers, fresh bread and endless golden-hour warmth." },
  { n: 37, en: "Office Siren", ko: "오피스 사이렌", cat: "Aesthetic Cores", desc: "Sleek 90s corporate-glam — thin frames, pencil skirts and a sharp, sultry boardroom edge." },

  // ---------- Editorial / fashion / photography ----------
  { n: 38, en: "90s Magazine Cover", ko: "90년대 잡지 커버", cat: "Editorial & Photography", desc: "Glossy retro magazine front with bold cover lines, a masthead and high-fashion studio polish." },
  { n: 39, en: "Vogue Editorial Spread", ko: "보그 에디토리얼", cat: "Editorial & Photography", desc: "High-fashion editorial styling with dramatic studio lighting and a luxe, polished composition." },
  { n: 40, en: "Streetwear Lookbook", ko: "스트릿웨어 룩북", cat: "Editorial & Photography", desc: "Candid urban-fashion grid energy — natural light, city backdrops and effortless street styling." },
  { n: 41, en: "Golden-Hour Film", ko: "골든아워 필름", cat: "Editorial & Photography", desc: "Warm 35mm portrait glow with soft sun flare, creamy grain and nostalgic honeyed light." },
  { n: 42, en: "High-Flash Party / Indie Sleaze", ko: "인디 슬리즈 (플래시)", cat: "Editorial & Photography", desc: "Harsh direct flash, messy hair, red-eye and an 'I don't care' 2010s Tumblr-revival cool." },
  { n: 43, en: "Tintype / Wet Plate", ko: "틴타입 (습판 사진)", cat: "Editorial & Photography", desc: "Antique silver-plate portrait with ghostly tones, soft vignetting and 19th-century gravitas." },
  { n: 44, en: "Infrared / Aerochrome", ko: "적외선 (에어로크롬)", cat: "Editorial & Photography", desc: "Surreal infrared film where green foliage turns hot pink and red — dreamlike and otherworldly." },
  { n: 45, en: "Cross-Process Film", ko: "크로스 프로세스 필름", cat: "Editorial & Photography", desc: "Wrongly-developed film look: shifted green/teal casts, blown highlights and punchy contrast." },
  { n: 46, en: "Double Exposure", ko: "이중 노출", cat: "Editorial & Photography", desc: "A silhouette layered with a second scene — landscapes or city lights blended into the subject." },
  { n: 47, en: "Lomography", ko: "로모그래피", cat: "Editorial & Photography", desc: "Oversaturated toy-camera look with heavy vignette, color shifts and joyful imperfection." },

  // ---------- Illustration / paint / craft ----------
  { n: 48, en: "Ukiyo-e Woodblock", ko: "우키요에 목판화", cat: "Illustration & Craft", desc: "Japanese woodblock print with flat color, bold outlines and classic Edo-era composition." },
  { n: 49, en: "Gouache Storybook", ko: "과슈 동화책", cat: "Illustration & Craft", desc: "Soft matte children's-book illustration with warm, painterly gouache textures." },
  { n: 50, en: "Ballpoint Pen Sketch", ko: "볼펜 스케치", cat: "Illustration & Craft", desc: "Blue-ink biro crosshatching on paper — casual, handmade and surprisingly detailed." },
  { n: 51, en: "Charcoal Smudge", ko: "목탄 드로잉", cat: "Illustration & Craft", desc: "Dramatic monochrome charcoal drawing with bold smudges and rich, velvety blacks." },
  { n: 52, en: "Stained Glass", ko: "스테인드글라스", cat: "Illustration & Craft", desc: "Leaded color-panel mosaic with glowing translucent segments and bold black outlines." },
  { n: 53, en: "Papercut / Layered Paper", ko: "페이퍼컷 (종이 공예)", cat: "Illustration & Craft", desc: "Dimensional cut-paper craft with stacked layers, soft shadows and clean silhouettes." },
  { n: 54, en: "Embroidery / Cross-stitch", ko: "자수 (십자수)", cat: "Illustration & Craft", desc: "Thread-textured needlework look — visible stitches, fabric weave and cozy handmade charm." },
  { n: 55, en: "Linocut / Block Print", ko: "리노컷 판화", cat: "Illustration & Craft", desc: "Bold carved relief print with chunky lines, high contrast and hand-pressed ink texture." },
  { n: 56, en: "Art Nouveau (Mucha)", ko: "아르누보 (무하)", cat: "Illustration & Craft", desc: "Ornate flowing linework, floral borders and decorative halos in the style of Alphonse Mucha." },
  { n: 57, en: "Pop Art", ko: "팝아트", cat: "Illustration & Craft", desc: "Bold Ben-Day halftone dots, flat primary colors and graphic Warhol/Lichtenstein energy." },
  { n: 58, en: "Ukiyo + Neon Fusion", ko: "우키요에 네온 퓨전", cat: "Illustration & Craft", desc: "Classic Japanese woodblock waves remixed with electric neon and a cyber glow." },

  // ---------- Film / genre / cinematic ----------
  { n: 59, en: "Wes Anderson", ko: "웨스 앤더슨", cat: "Film & Genre", desc: "Perfectly symmetrical framing, pastel palettes and a quirky, deadpan storybook mood." },
  { n: 60, en: "A24 Horror", ko: "A24 호러", cat: "Film & Genre", desc: "Moody, grainy arthouse-horror atmosphere — slow dread, muted color and unsettling stillness." },
  { n: 61, en: "Film Noir", ko: "필름 누아르", cat: "Film & Genre", desc: "High-contrast black-and-white with hard shadows, venetian-blind light and 1940s mystery." },
  { n: 62, en: "Spaghetti Western", ko: "스파게티 웨스턴", cat: "Film & Genre", desc: "Dusty, sun-bleached frontier look with wide squints, sepia warmth and gritty grain." },
  { n: 63, en: "Studio Ghibli", ko: "스튜디오 지브리", cat: "Film & Genre", desc: "Soft painterly anime with lush impressionistic backgrounds and warm, magical Miyazaki light." },
  { n: 64, en: "Solarpunk", ko: "솔라펑크", cat: "Film & Genre", desc: "Lush green futurism — plants woven into clean architecture, sunlight and hopeful optimism." },
  { n: 65, en: "Cyberpunk Neon", ko: "사이버펑크 네온", cat: "Film & Genre", desc: "Rainy dystopian streets drenched in electric blue, purple and pink holographic neon." },
  { n: 66, en: "Dieselpunk", ko: "디젤펑크", cat: "Film & Genre", desc: "Gritty industrial retro-future — riveted metal, machine-age grime and 1940s wartime tech." },
  { n: 67, en: "Dark Fantasy / Soulslike", ko: "다크 판타지 (소울라이크)", cat: "Film & Genre", desc: "Grim painterly epic with ornate armor, fog, ruins and a brooding cathedral atmosphere." },
  { n: 68, en: "Cottage Fairytale Diorama", ko: "동화 디오라마", cat: "Film & Genre", desc: "A miniature tilt-shift storybook scene that looks like a tiny handcrafted model world." },

  // ---------- Internet-native / surreal / graphic ----------
  { n: 69, en: "Glitchcore / Datamosh", ko: "글리치코어 (데이터모쉬)", cat: "Digital & Graphic", desc: "Corrupted digital artifacts — pixel sorting, RGB splits and datamoshed smears." },
  { n: 70, en: "3D Inflatable / Balloon", ko: "3D 풍선 오브제", cat: "Digital & Graphic", desc: "Puffy blow-up object look with glossy latex sheen and rounded, air-filled forms." },
  { n: 71, en: "Chrome / Liquid Metal", ko: "크롬 (리퀴드 메탈)", cat: "Digital & Graphic", desc: "Reflective mercury surface — molten, mirror-finish chrome with warped reflections." },
  { n: 72, en: "Claymorphism", ko: "클레이모피즘", cat: "Digital & Graphic", desc: "Soft pastel 3D-blob shapes with gentle shadows — a squishy, friendly modern UI feel." },
  { n: 73, en: "Holographic / Iridescent Foil", ko: "홀로그램 포일", cat: "Digital & Graphic", desc: "Rainbow-sheen foil surface that shifts color across the spectrum like a holo sticker." },
  { n: 74, en: "Blueprint / Technical Schematic", ko: "블루프린트 도면", cat: "Digital & Graphic", desc: "White-line technical draft on blueprint blue, with measurement marks and annotations." },
  { n: 75, en: "X-ray / Thermal Cam", ko: "엑스레이 (열화상)", cat: "Digital & Graphic", desc: "See-through x-ray skeleton or a heatmap thermal-camera glow of warm and cool zones." },
  { n: 76, en: "ASCII / Matrix Code", ko: "아스키 코드 아트", cat: "Digital & Graphic", desc: "Image rebuilt from text characters or cascading green Matrix-style code." },
  { n: 77, en: "8-bit Pixel Art", ko: "8비트 픽셀 아트", cat: "Digital & Graphic", desc: "Retro game-sprite rendering with chunky pixels and a limited console color palette." },
  { n: 78, en: "Comic / Manga Panel", ko: "만화 패널", cat: "Digital & Graphic", desc: "Inked comic panel with screentone shading, speech bubbles and dynamic action lines." },
  { n: 79, en: "Trading Card / Holo-foil", ko: "홀로 트레이딩 카드", cat: "Digital & Graphic", desc: "Framed as a collectible trading card with stats, a rarity border and a holographic shimmer." },
  { n: 80, en: "Brutalist Poster", ko: "브루탈리스트 포스터", cat: "Digital & Graphic", desc: "Raw oversized typography, harsh grids and stark high-contrast graphic-design tension." },
  { n: 81, en: "Bauhaus Geometric", ko: "바우하우스 기하학", cat: "Digital & Graphic", desc: "Primary colors and clean geometric shapes in a balanced, modernist composition." },
  { n: 82, en: "Surrealist Dalí", ko: "초현실주의 (달리)", cat: "Digital & Graphic", desc: "Melting, dreamlike impossibility — warped objects and a vast uncanny dream landscape." },

  // ---------- Bonus playful / meme-y ----------
  { n: 83, en: "Yearbook 90s Portrait", ko: "90년대 졸업앨범", cat: "Playful & Meme", desc: "Cheesy 90s school-photo look with a laser backdrop, awkward pose and crimped hair." },
  { n: 84, en: "Renaissance Oil Portrait", ko: "르네상스 유화 초상", cat: "Playful & Meme", desc: "You as a classical oil painting — chiaroscuro light, rich varnish and museum gravitas." },
  { n: 85, en: "Wanted Poster / Old West", ko: "현상수배 포스터", cat: "Playful & Meme", desc: "Sepia aged-parchment 'WANTED' poster with worn edges and bold frontier lettering." },
  { n: 86, en: "Saint / Religious Icon", ko: "성화 (종교 이콘)", cat: "Playful & Meme", desc: "Gold-leaf halo iconography in the flat, reverent style of orthodox religious icons." },
  { n: 87, en: "Sims Character", ko: "심즈 캐릭터", cat: "Playful & Meme", desc: "Rendered as a video-game Sim with a floating green plumbob and game-UI overlay." },
  { n: 88, en: "GTA Loading Screen", ko: "GTA 로딩 화면", cat: "Playful & Meme", desc: "Bold cel-shaded illustrated art-style with heavy outlines, like a GTA cover or loading screen." },
  { n: 89, en: "90s Retro Anime", ko: "90년대 레트로 애니메", cat: "Playful & Meme", desc: "VHS-era cel-anime look with grainy film, muted color and a nostalgic eyecatch frame." },
  { n: 90, en: "Cereal Box Mascot", ko: "시리얼 박스 마스코트", cat: "Playful & Meme", desc: "A bright, bouncy packaging-cartoon mascot on a colorful cereal-box design." }
];

const CATEGORY_ORDER = [
  "Viral AI Trends",
  "Analog & Retro Tech",
  "Aesthetic Cores",
  "Editorial & Photography",
  "Illustration & Craft",
  "Film & Genre",
  "Digital & Graphic",
  "Playful & Meme"
];

const gallery = document.getElementById("gallery");
const filtersEl = document.getElementById("filters");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");

let activeCat = "All";
let query = "";

/* Build filter chips */
["All", ...CATEGORY_ORDER].forEach((cat) => {
  const btn = document.createElement("button");
  btn.className = "chip" + (cat === "All" ? " active" : "");
  btn.textContent = cat;
  btn.addEventListener("click", () => {
    activeCat = cat;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
  filtersEl.appendChild(btn);
});

searchEl.addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  render();
});

function matches(s) {
  const catOk = activeCat === "All" || s.cat === activeCat;
  if (!catOk) return false;
  if (!query) return true;
  return (
    s.en.toLowerCase().includes(query) ||
    s.ko.toLowerCase().includes(query) ||
    s.desc.toLowerCase().includes(query) ||
    s.cat.toLowerCase().includes(query)
  );
}

function makeCard(s) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");
  card.innerHTML = `
    <div class="card-head">
      <span class="num">${String(s.n).padStart(2, "0")}</span>
      <div class="names">
        <div class="name-en">${s.en}</div>
        <div class="name-ko ko">${s.ko}</div>
      </div>
      <span class="toggle" aria-hidden="true">+</span>
    </div>
    <div class="card-desc">
      <p class="desc-text">${s.desc}</p>
      <button class="copy-btn" type="button" aria-label="Copy ${s.en} name and description">
        <span class="copy-icon" aria-hidden="true">⧉</span>
        <span class="copy-label">Copy name + description</span>
      </button>
    </div>
  `;
  const toggle = () => {
    const open = card.classList.toggle("open");
    card.setAttribute("aria-expanded", open ? "true" : "false");
  };
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  // Copy button — copies "English name — description" without toggling the card
  const copyBtn = card.querySelector(".copy-btn");
  copyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    copyToClipboard(`${s.en} — ${s.desc}`, copyBtn);
  });
  copyBtn.addEventListener("keydown", (e) => e.stopPropagation());

  return card;
}

/* ---------- Clipboard helpers ---------- */
function copyToClipboard(text, btn) {
  const done = () => flashCopied(btn);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand("copy"); } catch (err) { /* no-op */ }
  document.body.removeChild(ta);
  cb();
}

function flashCopied(btn) {
  const label = btn.querySelector(".copy-label");
  if (!label || btn.classList.contains("copied")) return;
  const prev = label.textContent;
  btn.classList.add("copied");
  label.textContent = "Copied!";
  setTimeout(() => {
    btn.classList.remove("copied");
    label.textContent = prev;
  }, 1400);
}

function render() {
  gallery.innerHTML = "";
  const list = STYLES.filter(matches);
  countEl.textContent = `${list.length} of ${STYLES.length} styles`;

  if (list.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No styles match your search. Try another keyword.";
    gallery.appendChild(p);
    return;
  }

  CATEGORY_ORDER.forEach((cat) => {
    const inCat = list.filter((s) => s.cat === cat);
    if (inCat.length === 0) return;
    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = cat;
    gallery.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid";
    inCat.forEach((s) => grid.appendChild(makeCard(s)));
    gallery.appendChild(grid);
  });
}

render();
