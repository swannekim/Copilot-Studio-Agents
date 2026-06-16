# AI Style Gallery

A lightweight HTML/CSS/JS website that showcases **90 trending, creative AI photo-transformation styles** for the Image Style Transformer agent — built with a 20s audience in mind.

Each style card shows the **English name** and its **Korean translation** (한국어 번역). Click (or press Enter on) any card to reveal a short description of the style.

## Features

- 90 styles grouped into 8 categories
- Click-to-reveal descriptions (accordion cards)
- Korean name shown directly under each English name
- Live search (matches English, Korean, description, or category)
- Category filter chips
- Fully static — no build step, no dependencies

## Categories

1. Viral AI Trends
2. Analog & Retro Tech
3. Aesthetic Cores
4. Editorial & Photography
5. Illustration & Craft
6. Film & Genre
7. Digital & Graphic
8. Playful & Meme

## Run it

Just open `index.html` in any browser. No server required.

```
ai-style-gallery/
├── index.html   # markup + layout
├── style.css    # dark, trend-forward theme
├── app.js       # the 90 styles data + interactivity
└── README.md
```

## Editing the styles

All style data lives in the `STYLES` array at the top of `app.js`. Each entry is:

```js
{ n: 1, en: "Italian Brainrot", ko: "이탈리안 브레인롯", cat: "Viral AI Trends", desc: "..." }
```

Add, remove, or edit entries there — the page re-renders automatically.

> Trends cycle fast. Refresh this list periodically (Pinterest forecasts, TikTok/Instagram AI-filter culture) to keep the menu current.
