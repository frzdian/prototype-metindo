# PT Metindo Perkasa website

Company website and online store for PT Metindo Perkasa (METINDO), "Doctors Up All Metals". It is a static HTML/CSS/JS site with no build step, in English and Bahasa Indonesia.

## Folder structure

```
metindo/
├── website/                 The deployable site. Everything served lives here.
│   ├── *.html               Pages (home, process, category, product, store, news, services…)
│   ├── assets/css/          style.css (design tokens at the top)
│   ├── assets/js/           app.js (logic) · data.js (content) · i18n.js (EN/ID text)
│   ├── assets/img/          Photos (stills from the company video), logo, icons
│   ├── assets/video/        Company profile, hero loop, sim/ (process simulations)
│   ├── 404.html             "Page not found" page
│   ├── _headers, _redirects Netlify caching + hides README.md
│   └── README.md            How to edit content (products, posts, text)
├── docs/
│   ├── STRUKTUR_MENU_METINDO.md   Site brief, menu structure and revision log
│   ├── content/                   Client-supplied copy (about us, vision, mission, goals)
│   └── design-references/         Theme (Alexium) and colour (MWDT) reference screenshots
├── source-assets/           Raw client files (logo, original videos). Not served.
├── netlify.toml             Tells Netlify to publish website/ (no build step)
└── .gitignore
```

## Run locally

From this folder:

```bash
python -m http.server 5173 --directory website
```

Then open http://localhost:5173.

## Deploy (Netlify)

- **Quick (no Git):** go to https://app.netlify.com/drop and drag the `website` folder onto the page.
- **From GitHub (auto-deploy on every push):** in Netlify choose *Add new site → Import an existing project → GitHub* and pick this repo. `netlify.toml` already sets the publish folder to `website`, with no build command.

When you change `style.css` or any file in `assets/js/`, bump the `?v=` number in the HTML `<link>`/`<script>` tags so browsers load the new files.

## Status

This is a prototype. Forms, cart, checkout and accounts only work in the visitor's browser until a backend and payment gateway are connected. Products other than *Hanson AK 392 AB*, plus prices, news posts and the process simulation video, are sample content. See `website/README.md` → "Prototype limits" and `docs/STRUKTUR_MENU_METINDO.md` → "Open Questions".
