# Website Menu Structure — PT Metindo Perkasa

> Brief for Claude Design. The page flow and menu order below were set by the client (source: `KONSEP_WEB_2026_1.xlsx`). Later changes agreed during the build are listed in the **Revision log** at the end of this file.
>
> Built site: `website/` (static HTML/CSS/JS). See `website/README.md` for how to edit it.

## Brand Identity

- **Company:** PT Metindo Perkasa (METINDO)
- **Tagline:** "Doctors Up All Metals"
- **Also known as:** Metal Expert Indonesia
- **Business:** chemicals for electroplating, polishing, anodizing, e-coat, wastewater treatment (WWTP), laboratory, and plating equipment
- **Logo:** red line-art "MP" monogram with black wordmark (file: `source-assets/logo-perusahaan.jpg`)
- **Base colors (from logo):** red, black, white
- **Mascot:** ~~a "professor/scientist" character~~. **Skipped** (no file provided; decided to leave it out).

## Design Direction

- **Layout reference:** alexiuminternational.com: clean white card grid, small red eyebrow labels, rounded cards with an icon chip and a ↗ arrow, dark pill CTA.
- **Color reference:** mwdtinc.com (Oil & Gas page): white and near-black, heavy grotesk headings, metallic/steel imagery, rounded black panels.
- **Accent:** METINDO logo red `#d7261e`.
- **Type:** Archivo (headings, heavy) + Manrope (body). **Sentence case** everywhere, never ALL CAPS or Title Case in headings, titles or header labels. Client names (category names, "PT Metindo Perkasa") keep their own casing.
- **Imagery:** stills and a short loop taken from the client's company video (`source-assets/introduction.mp4`; web copy in `website/assets/video/`).
- **Languages:** English and Bahasa Indonesia, with an EN/ID toggle in the header.

---

## Page Flow

The splash and the company introduction are **merged into one Home page**. Visitors land directly on content, with no "Click to begin" gate. There is **no step indicator** (Start → Company → Process …) in the header.

```
Home (hero + company intro)  →  Our Process (+ Consultation)  →  Category  →  Sub-category  →  Product Detail  →  Store
```

### Home (`index.html`): hero + company introduction
- Hero: eyebrow "PT Metindo Perkasa · Est. 1969", headline **"Metal expert Indonesia"**, short description
- Hero buttons: **"Explore our process"** → Our Process, and **"Watch company profile"** → scrolls to the video
- Hero visual: a looping clip from the company video with a "55+ years · since 1969" badge
- **About us** section (`#about`): title "Doctors up all metals." with the client's About us text (`docs/content/about-us.txt`) placed **below** the title, the **company profile video**, and key numbers (1969 · 13 process categories · 4 offices + warehouse · 24/7 support)
- Our vision / Our mission / Our goals cards, using the client's text from `docs/content/our-vision.txt`, `our-mission.txt` and `our-goals.txt` (translated to Bahasa Indonesia for the ID version)
- Two entry tiles: **Our process** and **Consultation**
- Brands supplied (Hanson, Dipsol, Jasco, Ujiden, Epunion)
- **Latest news & articles** (3 newest posts) → News & articles

### Our Process (`process.html`)
- Two main entry points:
  1. **Our process** → grid of process categories (see below)
  2. **Consultation** → consultation page (see below)
- Each category is a **clickable box** that opens its sub-category page

---

## "Our Process" Menu — Categories (in the client's order)

| # | Category | Contents / Sub-menu |
|---|----------|---------------------|
| 1 | **Chemical Alkaline Type** | 1. Alkaline Zinc · 2. Alkaline Copper · + **Alkaline Process Flow** |
| 2 | **Chemical Acid Type** | 1. Acid Zinc · 2. Acid Copper |
| 3 | **Chemical Basic** | 1. NaOH · 2. Nickel Sulfate · + **Product List** |
| 4 | **Ferrous Metals Pre Treatment** | *(content not yet provided by client)* |
| 5 | **Ferrous Metals Post Treatment** | *(content not yet provided by client)* |
| 6 | **Polishing Process** | 1. Mechanical Process · 2. Chemical Process (details below) |
| 7 | **Supporting Process** | 1. Iron Polishing · 2. Copper Polishing |
| 8 | **WWT / WWTP** | 1. RO Machine |
| 9 | **Chemical Laboratory** | 1. EDTA Solution 1 M |
| 10 | **Anodizing Process & Coloring** | 1. Hard Anodizing |
| 11 | **EDP / E-Coat** | 1. Nano Mono |
| 12 | **Cleaner (Acid Type / Alkaline Type)** | 1. Alkaline Degreasing · 2. Acid Degreasing |
| 13 | **Equipment** | 1. Plating Machine · 2. Heater · 3. Filter |

> Note: the Excel shows 12 process boxes in one row, plus **Equipment** at the far right, for 13 items in total.

---

## Process Simulation Video (every process page)

Every one of the 13 process category pages opens with a **simulation video** right under the page title, before the sub-categories.

- Layout: text on the left ("Process simulation" label, "See the process in action.", a short line naming the process), video on the right. On mobile the text sits above the video.
- Behaviour: a silent, looping animation that plays automatically when it scrolls into view and pauses when it scrolls away. A round play/pause button sits in the corner. It doesn't autoplay for visitors who have reduced motion turned on.
- Current file: `source-assets/electroplatting-simulation.mp4` (served as `website/assets/video/sim/electroplating-simulation.mp4`) is a **sample** used for all 13 processes, marked with a "Sample simulation" tag.
- To give a process its own video: save `<name>.mp4` and a poster image `<name>.jpg` in `website/assets/video/sim/`, then add `sim: '<name>'` to that category in `website/assets/js/data.js`. The "Sample simulation" tag disappears automatically for that process.
- **Interactive figure (instead of the video):** a process can show an interactive line drawing instead of the video. The visitor moves the pointer over it, and the drawing answers. The first one is **Soak** for degreasing: a tank with a part hung from a flight bar. Moving up lifts the part, moving down soaks it, and the oil droplets on the bath lift off and break up around the part, spreading further the deeper it goes. A corner read-out shows how deep the part is ("soak 40%" / "rendam 40%"). When the figure scrolls into view it plays a short tour on its own until the visitor takes over, and the round button stops or restarts it. It is shown on the Cleaner category page and on the Alkaline Degreasing and Acid Degreasing pages.

---

## Sub-menu Details

### 1. Chemical Alkaline Type → Alkaline Process Flow
Show as a **step-by-step flow diagram (stepper / timeline)**:

1. Degreasing
2. Acid Pickling
3. Electro Cleaner
4. Activation before Plating
5. Alkaline Electroplating
6. Activation after Plating
7. Chromating, with 3 variants:
   - Blue
   - Yellow
   - Black & Sealer

### 3. Chemical Basic → Product List
- Sample product: **Hanson AK 392 AB**
- Each product opens a **Product Detail page** (template below)

### 6. Polishing Process
- **1. Mechanical Process**
  - 1.1 Buffing Process
  - 1.2 Vibration Process
- **2. Chemical Process**
  - 2.1 Iron Polishing
  - 2.2 SUS (Stainless) Polishing
  - 2.3 Copper & Brass Polishing
  - 2.4 Alumina Polishing
  - 2.5 Zamac / Babbitt Polishing
  - 2.6 Chrome Polishing

---

## Product Detail Page Template

Every product uses the same template:

- **Packaging photo**
- **Product use description**
- **Brochure** (view or download)
- **COA** (Certificate of Analysis)
- **Product video**, linked or embedded from **METINDO's YouTube & Instagram**
- **"Buy in Store" button** → opens this product in METINDO's own **Store** (see below)
- **Marketplace buttons:** Tokopedia · Shopee · Blibli
- **TDS** is not shown publicly: **"Request from Admin"** button
- **Price** is not shown publicly: **"Request from Admin"** button
- **Chatbot** for more info (floating widget)

---

## Store Menu (METINDO's own online store)

METINDO will have **its own e-commerce store** on this website. Visitors browse, add to cart, and check out here.

- **Entry points:**
  - **Store** in the navbar
  - **"Buy in Store"** button on every Product Detail page, which opens that product in the Store
- **Store pages:**
  1. **Catalog**: product grid (photo, name, price, "Add to Cart"), filter by the 13 process categories, search, sort
  2. **Store product page**: photos, description, variants / pack size, quantity, price, "Add to Cart", link back to the technical Product Detail page
  3. **Cart**: item list, quantity edit, subtotal
  4. **Checkout**: customer info, shipping address, shipping method, payment method, order summary
  5. **Order confirmation**
  6. **Account** (login / register, order history)
- **Header icons:** cart icon with item count, account icon
- **Marketplace links** (Tokopedia · Shopee · Blibli) stay as secondary "Also available on" links

---

## Consultation Page

- **Contact form** (active now). Suggested fields:
  - Name
  - Company
  - Email
  - Phone number
  - Process / product of interest (dropdown of the 13 categories)
  - Message
  - Submit button
- ~~**WhatsApp:** disabled placeholder button "WhatsApp — Coming soon"~~. **Removed in Revision 4**: the page now shows only the form.

---

## Services Menu (new)

Page `services.html`. Content comes from the old website's "Our Service" section. Three cards, each with a photo, an icon, a title and a numbered list:

| Sales and technical support | Laboratory support | Delivery support |
|---|---|---|
| 1. Product knowledge | 1. Lab analysis | 1. Accurate delivery |
| 2. Product training | 2. Salt spray test (SST) | 2. Certificate of analysis (COA) |
| 3. Problem solving | 3. Atomic absorption spectrophotometer (AAS) | 3. Large warehouse capacity |
| 4. Technical support 1 x 24 hours | 4. Hull cell test | 4. Stock control |
| 5. Analysis in line with qualified methods | 5. Analysis reports | |
| 6. Trial and make-up support | 6. Laboratory method sharing | |
| 7. Discussions to increase profits | | |

- Photos are stills from the company video (technicians, lab, forklift in the warehouse).
- No extra CTA panel below the cards ("Talk to an expert" is always available in the floating header).
- The wording was lightly cleaned up from the old site (e.g. "Laboratorium" → "Laboratory", "methode" → "method").

---

## News & Articles Menu (new)

One menu item, **"News & articles"**, that holds both company news and educational articles.

- **List page** (`news.html`):
  - Title "Insights from 55 years of plating."
  - Filter tabs: **All · News · Articles**
  - The newest post is shown as a large featured card; the rest go in a 3-column card grid
  - Each card: image, type tag (News = black, Article = red), date, reading time, title, excerpt, "Read more"
- **Detail page** (`post.html?id=…`):
  - Breadcrumb, type tag, date and reading time, title, intro, wide cover image
  - Article body with sub-headings
  - Side column: "Copy link" and "All news & articles"
  - Dark CTA panel "Have a finishing problem?" → Consultation
  - "More to read" (3 other posts)
- **Home** shows the 3 latest posts.
- Current posts are **sample content** (3 articles + 3 news items) until the client provides real ones. They are bilingual and live in `website/assets/js/data.js` → `posts`.

---

## Global Elements

- **Announcement bar** (top, scrolls away): "Since 1969 · Over 55 years supplying surface technology…" + link to Consultation
- **Floating header:** a **full-width** blurred-white bar, edge to edge, with **no border** (soft shadow only), pinned to the top of the screen. Its contents are **justified**: logo on the left, menu spread evenly across the middle, actions on the right. The active menu item shows as red text with a red underline (no outline box). It **stays pinned while scrolling** and its shadow deepens once the page scrolls.
- **Navbar:** Logo · About us · Our process (dropdown with 13 categories) · Services · Store · News & articles · Consultation · EN/ID toggle · Account icon · Cart icon (with count) · "Talk to an expert" button. On mobile everything except the cart moves into a slide-in menu.
- **Back-to-top button:** appears bottom-right after scrolling down, just above the chatbot button
- **Floating chatbot** on every page
- **Footer:** contact info and offices, METINDO YouTube & IG links, Tokopedia/Shopee/Blibli links
- Responsive for desktop and mobile

## Open Questions for the Client
- Real news and articles to replace the sample posts, and who will update them (a CMS may be needed later)
- Contents of **Ferrous Metals Pre Treatment** and **Post Treatment** (still empty in the Excel)
- Full product list per sub-category (only one sample so far: Hanson AK 392 AB)
- Store: which products are sold online, and should prices be shown in the Store while staying "Request from Admin" on the technical product page?
- Store: payment gateway and shipping/courier options
- Iron/Copper Polishing appears under both **Supporting Process** and Chemical Polishing. Confirm whether that duplication is intentional.

---

## Revision log

**Build 1 (2026-10-08):** Full site built in `website/` per this brief: linear flow, 13 categories, alkaline process flow, product detail template, Store (catalog → cart → checkout → order → account), consultation, chatbot, EN/ID.

**Revision 2 (2026-10-08):**
1. Splash (Page 1) merged with Company Introduction (Page 2) into one Home page; the "Click to begin" step was removed and `intro.html` deleted.
2. Step indicator (Start → Company → Process → …) removed from the header.
3. New **News & articles** menu (list and detail pages) in the same theme and colors.
4. Sentence case for all headings, titles and header labels (no ALL CAPS / Title Case).
5. Header is now floating and stays pinned; a back-to-top button was added.

**Revision 3 (2026-10-08):**
1. Removed the process keyword strip (Electroplating · Polishing · … · Equipment) under the Home hero.
2. About us, Our vision, Our mission and Our goals now use the client's text files word for word (EN), with Bahasa Indonesia translations. The "Company" menu item was renamed "About us".
3. Header: borderless, with justified contents; the active menu item is no longer boxed.

**Revision 4 (2026-10-08):**
1. About us text moved below the "Doctors up all metals." title (it used to sit on the right).
2. New **Services** menu and page (content from the old website's "Our Service" section).
3. Consultation page now shows only the form: the WhatsApp placeholder, the "Prefer to call?" contact panel and the office photo were removed.

**Revision 5 (2026-10-08):**
1. Services page: removed the "Need support on your line?" panel (it duplicated the footer's consultation CTA).
2. Header: still floating and pinned, but now full-width (edge to edge, no rounded corners).
3. Footer: removed the "Talk to a metal expert." band with the Talk to an expert / Store buttons, since both are already in the floating header.

**Revision 6 (2026-10-08):**
1. Every process category page now opens with a process simulation video (sample: `electroplatting-simulation.mp4` for all 13 processes until each gets its own).

**Revision 7 (2026-10-08): professional polish pass**
1. Browser tab icon and phone home-screen icon now use the real red MP logo mark instead of a placeholder.
2. Sharing previews: every page has Open Graph tags, so WhatsApp, LinkedIn and Facebook show the page title and description. An `og:image` can be added once the final domain is known.
3. Forms: a specific error message under each field (e.g. "Enter a valid email address"), a warning icon so errors don't rely on colour alone, the cursor jumps to the first problem, and errors are announced to screen readers. Submit buttons show a loading spinner before the success message.
4. Inputs use 16px text so iPhones don't zoom in when a field is tapped.
5. Accessibility: "Skip to content" link for keyboard users, clearer focus outlines (including on dark sections), cart icon reads "Cart (2 items)", the mobile menu and dialogs lock page scroll and handle focus properly, and the Home hero video stops autoplaying for visitors with reduced motion turned on.
6. Typography details: balanced heading line breaks, no single-word last lines in paragraphs, even-width numbers in prices and stats, red text-selection colour, and meta rows (date · read time) that never break mid-phrase.
7. Subtle press feedback on buttons, plus lazy loading for images further down the page.

**Revision 8 (2026-10-09): repository structure**
Project files reorganised for Git: the site stays in `website/`, the brief and client copy moved to `docs/`, design reference screenshots to `docs/design-references/`, and raw client files (logo, original videos) to `source-assets/`. A `.gitignore` and a root `README.md` were added. The 57 MB original company video is kept out of Git; the web copy lives in the site.

**Revision 9 (2026-10-09): hosting**
Hosting moved from Vercel to **Netlify**. `vercel.json`/`.vercelignore` were removed, and `netlify.toml`, `website/_headers` (media caching) and `website/_redirects` (hides README) were added, plus a bilingual `404.html` "Page not found" page.

**Revision 10 (2026-10-11): interactive degreasing figure**
Added the Hairline skill (`hairline-create`, MIT) and used it to build **Soak**, an interactive line drawing of a degreasing soak tank. It replaces the sample video on the Cleaner category page and appears on the Alkaline and Acid Degreasing pages. The highlight is the brand red. The figure's source is in `figures/soak.js`; the site copy is in `website/assets/js/hairline/`.

**Revision 11 (2026-10-11): alkaline zinc treatment line**
The Alkaline Zinc page is now an interactive treatment line built from the client's flow (`docs/alkaline-zinc-flow.jpg`): A degreasing → B pickling → C electro cleaner → D alkaline zinc plating → E activation → F passivation (blue or yellow) → X additional treatment (black finish only) → G drying/oven, with two water rinses after A–F. A line drawing of the whole plant answers the pointer (the hoist moves to the tank you point at) and a click opens that step. Each step shows its own interactive figure (Soak, Pickle, Scrub, Plate, Dip; drying has none), a short description and its products. A product opens in a side panel with brochure, COA, TDS/price request, video, **Buy** (store page) and **Full details**. The 32 product names are the client's; prices are on request until the price manager is built, and descriptions say "details coming soon". The old sample alkaline zinc products were removed, and the Alkaline category's flow now links each step into the line.
