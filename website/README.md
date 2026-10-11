# PT Metindo Perkasa — Website (prototype)

Static HTML/CSS/JS with no build step. Upload the whole `website/` folder to any host (cPanel, Netlify, Vercel static).

Run it locally (from the project root, one level up):

```bash
python -m http.server 5173 --directory website
```

Then open http://localhost:5173.

## Page flow

`index.html` (Home: hero + company intro + video + latest posts) → `process.html` (Our process + Consultation) → `category.html?c=…` → `sub.html?c=…&s=…` → `product.html?p=…` → `store-item.html?p=…`

News & articles: `news.html` (filter All / News / Articles) → `post.html?id=…`

Store: `store.html` → `cart.html` → `checkout.html` → `order.html` · `account.html`
Services: `services.html` · Consultation: `consultation.html` (accepts `?topic=<category-id>` to preselect the dropdown)

## Where to edit

| What | File |
|---|---|
| Categories, sub-categories, alkaline flow, products, news & articles (`posts`), contact info, social and marketplace links | `assets/js/data.js` |
| All UI text, English and Bahasa Indonesia | `assets/js/i18n.js` |
| Design tokens (colors, fonts, radius) | top of `assets/css/style.css` |
| Layout, cart, chatbot, page logic | `assets/js/app.js` |

To add a product, append an entry to `products` in `data.js` with `cat` (category id) and `sub` (sub-category id). Optional fields: `brochure`, `coa` (PDF URLs), `youtube`, `instagram`.

## Prototype limits (needs a backend before launch)

- **Sample data:** every product except *Hanson AK 392 AB*, plus all prices and pack sizes, is placeholder data (marked `sample: true`). All 6 news/article posts are sample content too.
- **Forms:** the consultation form, the "Request from Admin" form, and checkout only save to the visitor's browser (localStorage). Search `TODO` in `app.js` for where to connect a form backend or payment gateway (Midtrans/Xendit).
- **Accounts:** mock login only. No password is stored. Replace with real auth.
- **Brochure/COA:** the buttons show "Coming soon" until a product has `brochure`/`coa` URLs.
- **Social and marketplace links** are search-URL placeholders. Replace them with the real shop and channel URLs in `data.js`.
- **WhatsApp:** removed from the consultation page (form only, per Revision 4).
- **Mascot** is skipped, as decided.

## Media

- `assets/video/company-profile.mp4`: the client's intro video re-encoded to 720p (58 MB → 24 MB).
- `assets/video/hero-loop.mp4`: a 13-second silent clip from the same video, used in the Home hero.
- `assets/img/*.jpg`: stills taken from the company video.
- `assets/video/sim/`: process simulation videos shown at the top of each process page. `electroplating-simulation.mp4` is a sample used for all 13 processes. Give a category its own by adding `sim: '<name>'` in `data.js` (with `<name>.mp4` and a `<name>.jpg` poster).
- `assets/js/hairline/`: interactive line figures that replace the video on a page. `kernel.js` is the Hairline engine (MIT, see `LICENSE.txt`; do not edit it). `soak.js` is the degreasing soak tank (Cleaner pages, step A). The alkaline zinc line page uses `line.js` (the whole plant: hover a tank, click to open its step), `pickle.js` (steps B and E), `scrub.js` (C), `plate.js` (D) and `dip.js` (F and the black-finish step X). Figures load as module scripts so each keeps its own names. A category or sub-category gets a figure with `figure: '<name>'` in `data.js`. The source of each figure lives in `../figures/`: edit it there with the `hairline-create` skill, check it with its `look.mjs`, then copy the `.js` file here and bump `?v=`.

## Alkaline zinc line page

`sub.html?c=alkaline&s=alkaline-zinc` is the treatment line page (the sub-category has `line: 'zinc'`). Its steps live in `data.js` → `zincLine.steps`: name, description, figure, whether two rinses follow, and product ids (step F has blue and yellow `groups`; step X only shows when "Black finish" is Yes). The 32 products are added at the bottom of `data.js` from one table; they have `quote: true`, so the store shows "Price on request" and a request form instead of a cart. Links can open a step directly: `&step=d`, and `&black=1` for the black route.

The figures' soft colour comes from Hairline's theme properties on `.sim-figure` in `style.css` (`--hairline-plate`, `--hairline-edge`, `--hairline-mid`, `--hairline-lo`, `--hairline-hi`); change those to retint every figure. The step letters on the line figure are page buttons laid over it (`.ln-chip`), placed with the same camera as `figures/line.js` (see `chipsAt` in `app.js`); if the line figure's layout changes, update `chipsAt` to match.

## Open questions for the client

Copied from the brief:

- Real news and articles to replace the sample posts.
- What goes in Ferrous Metals Pre Treatment and Post Treatment (currently shown as "Coming soon")?
- Full product list per sub-category.
- Should the Store show prices while technical pages keep "Request from Admin"? The current build does this.
- Payment gateway and courier options.
- Iron/Copper Polishing appears under both Supporting Process and Chemical Polishing. Is that intentional?
