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

/* CSS mood swatches — a representative palette/texture per style number.
   Injected as the `background` of each card's swatch tile. */
const SWATCHES = {
  1: "linear-gradient(135deg,#2b1d0e,#7a5a1f 45%,#c9a227 70%,#3a2a12)",
  2: "linear-gradient(135deg,#ff3d57,#ffd23f 50%,#1fa2ff)",
  3: "linear-gradient(135deg,#9aa7b3,#cdd6df 40%,#2e7d32 75%,#b0bec5)",
  4: "linear-gradient(135deg,#ffc7d9,#ffe6c7 60%,#cfe8d5)",
  5: "linear-gradient(135deg,#ffd1e8,#c5b3ff 55%,#a8e6ff)",
  6: "linear-gradient(135deg,#1b1b1b,#3a3a3a 40%,#ff6b35 75%)",
  7: "repeating-linear-gradient(45deg,#e9b384 0 6px,#d98c5f 6px 12px)",
  8: "linear-gradient(135deg,#c96f4a,#e0a96d 50%,#7fa05a)",
  9: "linear-gradient(135deg,#1e3a8a,#3b82f6 50%,#fcd34d)",
  10: "linear-gradient(135deg,#a78bfa,#60a5fa 50%,#f472b6)",
  11: "linear-gradient(135deg,#d01012,#f6b40c 40%,#0d69b4 75%,#2a8a43)",
  12: "linear-gradient(135deg,#fef3c7,#fbcfe8 50%,#bae6fd)",
  13: "linear-gradient(135deg,rgba(255,182,193,.85),rgba(173,216,230,.85) 50%,rgba(221,160,221,.85))",
  14: "linear-gradient(135deg,#ff9a3d,#ffd23f 50%,#54d0ff)",
  15: "linear-gradient(0deg,rgba(0,0,0,.28) 0 2px,transparent 2px 4px), linear-gradient(135deg,#2a1a4a,#123a4a)",
  16: "linear-gradient(135deg,#dfe7ea,#9fb3bd 60%,#6b7d86)",
  17: "linear-gradient(135deg,#fff4d6,#ffd0a1 55%,#ff7a59)",
  18: "linear-gradient(135deg,#f3ead7,#d9cbb3 60%,#a9b7a0)",
  19: "linear-gradient(135deg,#2a2f3a,#465063 60%,#6b7785)",
  20: "linear-gradient(135deg,#9bbc0f,#8bac0f 40%,#306230 80%,#0f380f)",
  21: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px) 0 0/22px 22px, linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px) 0 0/22px 22px, linear-gradient(135deg,#ff6ad5,#8a5cff 55%,#26d0ff)",
  22: "linear-gradient(135deg,#7fd4ff,#bdeaff 45%,#9be8b0 85%)",
  23: "linear-gradient(135deg,#f15a5a 0 50%,#5b6dff 50% 100%)",
  24: "linear-gradient(135deg,#1c1c1c,#e8e8e8)",
  25: "linear-gradient(135deg,#1a0a14,#4a0e2e 55%,#7a1e3a)",
  26: "linear-gradient(135deg,#2e2418,#5a4326 50%,#3a4a2e)",
  27: "linear-gradient(135deg,#1e1a2e,#b87333 55%,#e6b566)",
  28: "linear-gradient(135deg,#0a0a0a,#d6005c 50%,#f2c14e)",
  29: "linear-gradient(135deg,#2bd3c6,#6fe3d2 40%,#bda9ff 80%)",
  30: "linear-gradient(135deg,#dff5d0,#f7d6ec 60%,#cdeaff)",
  31: "linear-gradient(135deg,#3a4a23,#6b7d3a 50%,#8a6a3a)",
  32: "linear-gradient(135deg,#ff3df2,#3dffce 50%,#3d6bff)",
  33: "linear-gradient(135deg,#ff4d4d,#ffd23f 30%,#4dd0e1 60%,#ab47bc)",
  34: "linear-gradient(135deg,#ffd9e6,#ffeef4 55%,#f7c5d9)",
  35: "linear-gradient(135deg,#1e6f3a,#2e8b57 50%,#e8e8e8)",
  36: "linear-gradient(135deg,#e7c98f,#d8a657 50%,#8aa15a)",
  37: "linear-gradient(135deg,#0f0f12,#3a3a44 55%,#b02a37)",
  38: "linear-gradient(135deg,#ff2e63,#ffd23f 50%,#08d9d6)",
  39: "linear-gradient(135deg,#111111,#555555 50%,#e9e2d0)",
  40: "linear-gradient(135deg,#2b2b2b,#5a5a5a 50%,#ff6a00)",
  41: "linear-gradient(135deg,#ffcaa0,#ff9e5e 55%,#c96a3a)",
  42: "linear-gradient(135deg,#0c0c0c,#2a2a2a 55%,#d62828)",
  43: "linear-gradient(135deg,#3a342b,#7a6f5a 55%,#cabfa3)",
  44: "linear-gradient(135deg,#ff5db1,#ff9ec7 45%,#6be0ff 85%)",
  45: "linear-gradient(135deg,#0e3b3b,#2e8b8b 50%,#d6e85a)",
  46: "linear-gradient(135deg,#1a2440,#3a5a8a 50%,#0a0e16)",
  47: "radial-gradient(circle at 50% 40%,#ffd23f,#ff5a3c 55%,#1a1a1a 100%)",
  48: "linear-gradient(135deg,#1b3a6b,#3a6ea5 45%,#e8dcc0 85%)",
  49: "linear-gradient(135deg,#f2c894,#e8a87c 50%,#a7c4a0)",
  50: "linear-gradient(135deg,#f4f1e8,#dfe6f2 55%,#2a4b9b)",
  51: "linear-gradient(135deg,#0d0d0d,#4a4a4a 55%,#9a9a9a)",
  52: "linear-gradient(135deg,#c1121f,#fcbf49 35%,#2a9d8f 65%,#3a0ca3)",
  53: "linear-gradient(135deg,#ffd6a5,#fdffb6 35%,#caffbf 65%,#9bf6ff)",
  54: "linear-gradient(135deg,#e7d3b3,#c98c6f 50%,#7a9a6a)",
  55: "linear-gradient(135deg,#1a1a1a 0 50%,#d1452f 50% 100%)",
  56: "linear-gradient(135deg,#3a5a40,#7a9a5a 45%,#e6c87a 85%)",
  57: "radial-gradient(#d6005c 25%,transparent 26%) 0 0/14px 14px, linear-gradient(135deg,#ffd23f,#08d9d6)",
  58: "linear-gradient(135deg,#0b1e3a,#1b6ca8 40%,#ff4dd2 80%)",
  59: "linear-gradient(135deg,#f4c7ab,#f6e0b5 45%,#a3c4bc 85%)",
  60: "linear-gradient(135deg,#0c1014,#26323a 55%,#5a3a3a)",
  61: "linear-gradient(135deg,#0a0a0a,#777777 55%,#ececec)",
  62: "linear-gradient(135deg,#9a6a3a,#c89b6a 50%,#e8cfa0)",
  63: "linear-gradient(135deg,#7ec8e3,#bfe3a8 55%,#f6e7b0)",
  64: "linear-gradient(135deg,#3fae6f,#8fd694 45%,#ffe08a 85%)",
  65: "linear-gradient(135deg,#0a0420,#7a1fd0 45%,#ff2ea6 75%,#00e5ff)",
  66: "linear-gradient(135deg,#1f1f24,#4a4a44 50%,#9a7b3a)",
  67: "linear-gradient(135deg,#14171c,#3a4250 55%,#6a5a3a)",
  68: "linear-gradient(135deg,#a8d5a2,#f3e2a9 50%,#7fb3d5)",
  69: "linear-gradient(135deg,#ff003c,#00e5ff 50%,#39ff14)",
  70: "linear-gradient(135deg,#ff7eb3,#ff65a3 40%,#ffd1e8 85%)",
  71: "linear-gradient(135deg,#8a909a,#e8edf2 35%,#5a6270 60%,#cfd6de)",
  72: "linear-gradient(135deg,#dfe3ff,#eef0ff 50%,#ffe3f0)",
  73: "linear-gradient(135deg,#a8ffce,#ffd1f7 30%,#c1c8ff 60%,#fff5b0)",
  74: "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px) 0 0/20px 20px, linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px) 0 0/20px 20px, #0d3b8a",
  75: "linear-gradient(135deg,#1a0a2e,#3a0ca3 30%,#f72585 60%,#ffd60a)",
  76: "linear-gradient(135deg,#001400,#0a3a0a 55%,#39ff14)",
  77: "repeating-conic-gradient(#5a3aff 0 25%,#ff4dd2 0 50%) 0 0/20px 20px",
  78: "radial-gradient(#1a1a1a 22%,transparent 23%) 0 0/10px 10px, linear-gradient(135deg,#ffffff,#e8e8e8)",
  79: "linear-gradient(135deg,#ffd700,#a8ffce 30%,#c1c8ff 60%,#ffb0e0)",
  80: "linear-gradient(135deg,#111111 0 60%,#e63946 60% 100%)",
  81: "linear-gradient(135deg,#e63946 0 33%,#f1c40f 33% 66%,#1d4ed8 66% 100%)",
  82: "linear-gradient(135deg,#d6a55a,#e8c98a 45%,#6a8caf 85%)",
  83: "linear-gradient(135deg,#1b1f6b,#5a3aa8 50%,#ec4899)",
  84: "linear-gradient(135deg,#1a120a,#5a3e1e 55%,#b8893a)",
  85: "linear-gradient(135deg,#e8d6a8,#cbb079 55%,#8a6a3a)",
  86: "linear-gradient(135deg,#7a1f1f,#c79a2e 50%,#f1d784)",
  87: "linear-gradient(135deg,#0aa64a,#3ad17a 45%,#bdf5cf 85%)",
  88: "linear-gradient(135deg,#0a0a0a,#ff7a00 55%,#ffd23f)",
  89: "linear-gradient(135deg,#3a2a6b,#ff6a8a 50%,#ffd06a)",
  90: "linear-gradient(135deg,#ff3d3d,#ffd23f 45%,#2ec4ff 85%)"
};

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
    <div class="swatch" style="background:${SWATCHES[s.n] || "var(--card-hover)"}" aria-hidden="true"></div>
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
