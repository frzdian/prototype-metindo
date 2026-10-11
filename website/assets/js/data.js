/* ==========================================================================
   METINDO — site data
   Categories follow the client's order (KONSEP_WEB_2026_1.xlsx).
   PRODUCTS: only "Hanson AK 392 AB" comes from the client. Every other
   product, price and pack size below is SAMPLE DATA for the prototype —
   replace with the client's real catalogue before launch.
   ========================================================================== */

window.METINDO = {
  company: {
    name: 'PT Metindo Perkasa',
    tagline: 'Doctors Up All Metals',
    since: 1969,
    phone: '(62-21) 421 3676',
    whatsapp: ['0818 839 333', '0815 9152 115'],
    email: 'metindoadm@gmail.com',
    offices: [
      { label: { en: 'Head Office', id: 'Kantor Pusat' }, addr: 'Jl. Gunung Sahari No. 92N, Gunung Sahari Selatan, Kemayoran, Jakarta Pusat 10610' },
      { label: { en: 'Surabaya Office', id: 'Kantor Surabaya' }, addr: 'Ruko ESTE Square Blok E No. 5, Jl. Dr. Ir. H. Soekarno, Mulyorejo, Surabaya 60115' },
      { label: { en: 'Bali Office', id: 'Kantor Bali' }, addr: 'Jl. Dewi Madri 3 No. 12, Sumerta Kelod, Denpasar Timur, Bali' },
      { label: { en: 'Warehouse', id: 'Gudang' }, addr: 'Jl. Gemalapik, Kp. Tegal Luhur, Ds. Cibatu, Cikarang Selatan' }
    ],
    // TODO: replace with the client's real channel / shop URLs
    social: {
      youtube: 'https://www.youtube.com/results?search_query=metindo+perkasa',
      instagram: 'https://www.instagram.com/'
    },
    marketplace: {
      tokopedia: 'https://www.tokopedia.com/search?q=metindo%20perkasa',
      shopee: 'https://shopee.co.id/search?keyword=metindo%20perkasa',
      blibli: 'https://www.blibli.com/cari/metindo%20perkasa'
    }
  },

  // Process simulation videos live in assets/video/sim/<name>.mp4 (+ <name>.jpg poster).
  // Every category uses defaultSim until it gets its own `sim: '<name>'`.
  // SAMPLE: electroplating-simulation is a placeholder for all 13 processes.
  defaultSim: 'electroplating-simulation',
  // Interactive line figures (assets/js/hairline/<name>.js) replace the video
  // where a category or sub-category sets `figure: '<name>'`.

  categories: [
    {
      id: 'alkaline', icon: 'flask', img: 'zinc',
      name: { en: 'Chemical Alkaline Type', id: 'Kimia Tipe Alkaline' },
      desc: { en: 'Cyanide-free alkaline plating chemistry for uniform zinc and copper deposits on complex parts.', id: 'Kimia plating alkaline bebas sianida untuk lapisan seng dan tembaga yang merata pada part kompleks.' },
      flow: true,
      subs: [
        { id: 'alkaline-zinc', line: 'zinc', name: { en: 'Alkaline Zinc', id: 'Alkaline Zinc' }, desc: { en: 'Bright, ductile zinc with excellent throwing power for fasteners and stamped parts.', id: 'Lapisan seng cerah dan ulet dengan daya sebar tinggi untuk baut dan part stamping.' } },
        { id: 'alkaline-copper', name: { en: 'Alkaline Copper', id: 'Alkaline Copper' }, desc: { en: 'Copper strike and build-up layers with strong adhesion on steel and zamac.', id: 'Lapisan strike dan build-up tembaga dengan daya lekat kuat pada baja dan zamac.' } }
      ]
    },
    {
      id: 'acid', icon: 'beaker', img: 'lab',
      name: { en: 'Chemical Acid Type', id: 'Kimia Tipe Asam' },
      desc: { en: 'High-efficiency acid baths for brilliant, levelled zinc and copper finishes.', id: 'Larutan asam berefisiensi tinggi untuk hasil seng dan tembaga yang cemerlang dan rata.' },
      subs: [
        { id: 'acid-zinc', name: { en: 'Acid Zinc', id: 'Acid Zinc' }, desc: { en: 'Fast-plating chloride zinc with mirror brightness.', id: 'Seng klorida cepat plating dengan kilap seperti cermin.' } },
        { id: 'acid-copper', name: { en: 'Acid Copper', id: 'Acid Copper' }, desc: { en: 'Bright levelling copper as the base for decorative nickel-chrome.', id: 'Tembaga cerah perata sebagai dasar nikel-krom dekoratif.' } }
      ]
    },
    {
      id: 'basic', icon: 'atom', img: 'chemstock',
      name: { en: 'Chemical Basic', id: 'Kimia Dasar' },
      desc: { en: 'Raw and technical-grade chemicals that keep every plating line running.', id: 'Bahan kimia mentah dan teknis yang menjaga setiap lini plating tetap berjalan.' },
      productList: true,
      subs: [
        { id: 'naoh', name: { en: 'NaOH', id: 'NaOH' }, desc: { en: 'Caustic soda for cleaners, alkaline baths and pH control.', id: 'Soda kaustik untuk cleaner, larutan alkaline dan kontrol pH.' } },
        { id: 'nickel-sulfate', name: { en: 'Nickel Sulfate', id: 'Nikel Sulfat' }, desc: { en: 'Plating-grade nickel salt for Watts and bright nickel baths.', id: 'Garam nikel grade plating untuk larutan Watts dan nikel cerah.' } }
      ]
    },
    {
      id: 'ferrous-pre', icon: 'shield', img: 'inspect', pending: true,
      name: { en: 'Ferrous Metals Pre Treatment', id: 'Pre Treatment Logam Ferro' },
      desc: { en: 'Surface preparation for iron and steel before plating or painting.', id: 'Persiapan permukaan besi dan baja sebelum plating atau pengecatan.' },
      subs: []
    },
    {
      id: 'ferrous-post', icon: 'layers', img: 'qc', pending: true,
      name: { en: 'Ferrous Metals Post Treatment', id: 'Post Treatment Logam Ferro' },
      desc: { en: 'Protective finishing for iron and steel after the main process.', id: 'Finishing pelindung untuk besi dan baja setelah proses utama.' },
      subs: []
    },
    {
      id: 'polishing', icon: 'sparkle', img: 'inspect',
      name: { en: 'Polishing Process', id: 'Proses Polishing' },
      desc: { en: 'Mechanical and chemical polishing to bring every metal to its best surface.', id: 'Polishing mekanis dan kimia untuk menghasilkan permukaan terbaik di setiap logam.' },
      subs: [
        {
          id: 'mechanical', name: { en: 'Mechanical Process', id: 'Proses Mekanis' },
          desc: { en: 'Abrasive and media-based finishing.', id: 'Finishing berbasis abrasif dan media.' },
          children: [
            { id: 'buffing', name: { en: 'Buffing Process', id: 'Proses Buffing' }, desc: { en: 'Compounds and wheels for high-gloss buffing.', id: 'Kompon dan roda untuk buffing kilap tinggi.' } },
            { id: 'vibration', name: { en: 'Vibration Process', id: 'Proses Vibrasi' }, desc: { en: 'Media and compounds for vibratory finishing.', id: 'Media dan kompon untuk vibratory finishing.' } }
          ]
        },
        {
          id: 'chemical', name: { en: 'Chemical Process', id: 'Proses Kimia' },
          desc: { en: 'Immersion polishing chemistry by base metal.', id: 'Kimia polishing celup sesuai logam dasar.' },
          children: [
            { id: 'iron-polish', name: { en: 'Iron Polishing', id: 'Polishing Besi' }, desc: { en: 'Brightening for iron and mild steel.', id: 'Pencerah untuk besi dan baja lunak.' } },
            { id: 'sus-polish', name: { en: 'SUS (Stainless) Polishing', id: 'Polishing SUS (Stainless)' }, desc: { en: 'Electro and chemical polishing for stainless steel.', id: 'Polishing elektro dan kimia untuk stainless steel.' } },
            { id: 'copper-brass-polish', name: { en: 'Copper & Brass Polishing', id: 'Polishing Tembaga & Kuningan' }, desc: { en: 'Bright dip for copper alloys.', id: 'Bright dip untuk paduan tembaga.' } },
            { id: 'alumina-polish', name: { en: 'Alumina Polishing', id: 'Polishing Aluminium' }, desc: { en: 'Chemical brightening for aluminium.', id: 'Pencerah kimia untuk aluminium.' } },
            { id: 'zamac-polish', name: { en: 'Zamac / Babbitt Polishing', id: 'Polishing Zamac / Babbitt' }, desc: { en: 'Gentle polishing for zinc die-cast and babbitt.', id: 'Polishing lembut untuk zinc die-cast dan babbitt.' } },
            { id: 'chrome-polish', name: { en: 'Chrome Polishing', id: 'Polishing Krom' }, desc: { en: 'Restores brilliance on chrome surfaces.', id: 'Mengembalikan kilau permukaan krom.' } }
          ]
        }
      ]
    },
    {
      id: 'supporting', icon: 'gear', img: 'qc',
      name: { en: 'Supporting Process', id: 'Proses Pendukung' },
      desc: { en: 'Auxiliary chemistry that supports the main finishing line.', id: 'Kimia tambahan yang mendukung lini finishing utama.' },
      subs: [
        { id: 'support-iron', name: { en: 'Iron Polishing', id: 'Polishing Besi' }, desc: { en: 'Brightening for iron and mild steel.', id: 'Pencerah untuk besi dan baja lunak.' } },
        { id: 'support-copper', name: { en: 'Copper Polishing', id: 'Polishing Tembaga' }, desc: { en: 'Bright dip for copper parts.', id: 'Bright dip untuk part tembaga.' } }
      ]
    },
    {
      id: 'wwtp', icon: 'droplet', img: 'skyline',
      name: { en: 'WWT / WWTP', id: 'WWT / WWTP' },
      desc: { en: 'Wastewater treatment so your plant stays compliant and water is reused.', id: 'Pengolahan air limbah agar pabrik tetap patuh regulasi dan air dapat digunakan ulang.' },
      subs: [
        { id: 'ro-machine', name: { en: 'RO Machine', id: 'Mesin RO' }, desc: { en: 'Reverse-osmosis systems for rinse water recovery.', id: 'Sistem reverse osmosis untuk daur ulang air bilas.' } }
      ]
    },
    {
      id: 'laboratory', icon: 'tube', img: 'lab',
      name: { en: 'Chemical Laboratory', id: 'Laboratorium Kimia' },
      desc: { en: 'Analytical reagents and bath analysis to keep solutions in spec.', id: 'Reagen analisis dan analisa larutan agar tetap sesuai spesifikasi.' },
      subs: [
        { id: 'edta', name: { en: 'EDTA Solution 1 M', id: 'Larutan EDTA 1 M' }, desc: { en: 'Standard titrant for metal content analysis.', id: 'Titran standar untuk analisa kadar logam.' } }
      ]
    },
    {
      id: 'anodizing', icon: 'hexagon', img: 'zinc',
      name: { en: 'Anodizing Process & Coloring', id: 'Proses Anodizing & Pewarnaan' },
      desc: { en: 'Anodizing and dye systems for durable, colourful aluminium.', id: 'Sistem anodizing dan pewarna untuk aluminium yang tahan lama dan berwarna.' },
      subs: [
        { id: 'hard-anodizing', name: { en: 'Hard Anodizing', id: 'Hard Anodizing' }, desc: { en: 'Thick, wear-resistant oxide layers for engineering parts.', id: 'Lapisan oksida tebal tahan aus untuk part teknik.' } }
      ]
    },
    {
      id: 'edp', icon: 'bolt', img: 'chemstock',
      name: { en: 'EDP / E-Coat', id: 'EDP / E-Coat' },
      desc: { en: 'Electrophoretic coating and nano pre-treatment before painting.', id: 'Pelapisan elektroforesis dan pre-treatment nano sebelum pengecatan.' },
      subs: [
        { id: 'nano-mono', name: { en: 'Nano Mono', id: 'Nano Mono' }, desc: { en: 'Single-step nano ceramic conversion coating.', id: 'Konversi nano keramik satu tahap.' } }
      ]
    },
    {
      id: 'cleaner', icon: 'bubbles', img: 'warehouse', figure: 'soak',
      name: { en: 'Cleaner (Acid / Alkaline Type)', id: 'Cleaner (Tipe Asam / Alkaline)' },
      desc: { en: 'Degreasers that remove oils, scale and soils before any finish.', id: 'Degreaser untuk menghilangkan minyak, kerak dan kotoran sebelum finishing.' },
      subs: [
        { id: 'alkaline-degreasing', figure: 'soak', name: { en: 'Alkaline Degreasing', id: 'Alkaline Degreasing' }, desc: { en: 'Soak and electro degreasers for heavy oils.', id: 'Degreaser rendam dan elektro untuk minyak berat.' } },
        { id: 'acid-degreasing', figure: 'soak', name: { en: 'Acid Degreasing', id: 'Acid Degreasing' }, desc: { en: 'Combined pickling and degreasing in one step.', id: 'Pickling dan degreasing dalam satu tahap.' } }
      ]
    },
    {
      id: 'equipment', icon: 'wrench', img: 'warehouse',
      name: { en: 'Equipment', id: 'Peralatan' },
      desc: { en: 'Plating machines, heaters and filters built for chemical service.', id: 'Mesin plating, pemanas dan filter untuk penggunaan kimia.' },
      subs: [
        { id: 'plating-machine', name: { en: 'Plating Machine', id: 'Mesin Plating' }, desc: { en: 'Barrel and rack plating lines.', id: 'Lini plating barrel dan rak.' } },
        { id: 'heater', name: { en: 'Heater', id: 'Pemanas' }, desc: { en: 'Titanium and PTFE immersion heaters.', id: 'Pemanas celup titanium dan PTFE.' } },
        { id: 'filter', name: { en: 'Filter', id: 'Filter' }, desc: { en: 'Filter pumps and cartridges for plating baths.', id: 'Pompa filter dan cartridge untuk larutan plating.' } }
      ]
    }
  ],

  // Our services (from the old website's "Our Service" section)
  services: [
    { id: 'technical', img: 'qc', icon: 'wrench',
      name: { en: 'Sales and technical support', id: 'Dukungan penjualan dan teknis' },
      alt: { en: 'METINDO technicians inspecting a plated part on site', id: 'Teknisi METINDO memeriksa part hasil plating di lokasi' },
      items: {
        en: ['Product knowledge', 'Product training', 'Problem solving', 'Technical support 1 x 24 hours', 'Analysis in line with qualified methods', 'Trial and make-up support', 'Discussions to increase profits'],
        id: ['Pengetahuan produk', 'Pelatihan produk', 'Penyelesaian masalah', 'Dukungan teknis 1 x 24 jam', 'Analisa sesuai metode yang terkualifikasi', 'Dukungan trial dan make-up', 'Diskusi untuk meningkatkan profit'] } },
    { id: 'laboratory', img: 'lab', icon: 'flask',
      name: { en: 'Laboratory support', id: 'Dukungan laboratorium' },
      alt: { en: 'Chemist running a test in the METINDO laboratory', id: 'Ahli kimia melakukan pengujian di laboratorium METINDO' },
      items: {
        en: ['Lab analysis', 'Salt spray test (SST)', 'Atomic absorption spectrophotometer (AAS)', 'Hull cell test', 'Analysis reports', 'Laboratory method sharing'],
        id: ['Analisa laboratorium', 'Salt spray test (SST)', 'Atomic absorption spectrophotometer (AAS)', 'Uji Hull cell', 'Laporan analisa', 'Berbagi metode laboratorium'] } },
    { id: 'delivery', img: 'warehouse', icon: 'store',
      name: { en: 'Delivery support', id: 'Dukungan pengiriman' },
      alt: { en: 'Forklift moving stock in the METINDO Cikarang warehouse', id: 'Forklift memindahkan stok di gudang METINDO Cikarang' },
      items: {
        en: ['Accurate delivery', 'Certificate of analysis (COA)', 'Large warehouse capacity', 'Stock control'],
        id: ['Pengiriman akurat', 'Certificate of analysis (COA)', 'Kapasitas gudang besar', 'Pengendalian stok'] } }
  ],

  // Alkaline Process Flow (Chemical Alkaline Type)
  // The alkaline zinc treatment line (client flow, docs/alkaline-zinc-flow.jpg).
  // Each step: its interactive figure (assets/js/hairline/<figure>.js), whether
  // two water rinses follow it, and the products used in it, by id (see lineProducts below).
  zincLine: {
    steps: [
      { id: 'a', figure: 'soak', rinse: true,
        name: { en: 'Degreasing', id: 'Degreasing' },
        desc: { en: 'Removes oil, grease and drawing compounds from the steel, so the baths that follow can wet the surface evenly.', id: 'Menghilangkan minyak, gemuk dan sisa pelumas dari baja, agar larutan berikutnya membasahi permukaan secara merata.' },
        products: ['epclen-62', 'epclen-541', 'hanson-sc-821', 'jasco-ca-135g', 'jasco-plus-clean-a', 'jasco-plus-clean-b', 'epclen-55rt', 'epclen-20ns'] },
      { id: 'b', figure: 'pickle', rinse: true,
        name: { en: 'Pickling', id: 'Pickling' },
        desc: { en: 'Acid dissolves rust and mill scale, leaving bare, active steel.', id: 'Asam melarutkan karat dan kerak, sehingga baja bersih dan aktif.' },
        products: ['epunion-208cl', 'jasco-2r059', 'hcl', 'jasco-2p056'] },
      { id: 'c', figure: 'scrub', rinse: true,
        name: { en: 'Electro cleaner', id: 'Electro cleaner' },
        desc: { en: 'Current through an alkaline cleaner releases gas at the surface of the part, lifting the last fine soil and smut.', id: 'Arus listrik dalam cleaner alkaline menghasilkan gas di permukaan benda kerja, mengangkat sisa kotoran halus dan smut.' },
        products: ['epclen-ex-4', 'jasco-cv-260g', 'jasco-plus-clean-d', 'jasco-hg-129'] },
      { id: 'd', figure: 'plate', rinse: true,
        name: { en: 'Alkaline zinc plating', id: 'Alkaline zinc plating' },
        desc: { en: 'Zinc from the anodes deposits on the part as a bright, even, cyanide-free layer. Time and current set the thickness.', id: 'Seng dari anoda mengendap di benda kerja sebagai lapisan cerah, merata dan bebas sianida. Waktu dan arus menentukan ketebalan.' },
        products: ['amazinc-ht45', 'jasco-hyperzinc-330-ag', 'jasco-hyperzinc-330-bg', 'hanson-ak-392-zinc-oxide', 'naoh'] },
      { id: 'e', figure: 'pickle', rinse: true,
        name: { en: 'Activation', id: 'Aktivasi' },
        desc: { en: 'A short dip in dilute nitric acid brightens the fresh zinc and readies it for passivation.', id: 'Celup singkat dalam asam nitrat encer mencerahkan seng baru dan menyiapkannya untuk passivasi.' },
        products: ['nitric-acid'] },
      { id: 'f', figure: 'dip', rinse: true,
        name: { en: 'Passivation (chromating)', id: 'Passivasi (chromating)' },
        desc: { en: 'A trivalent passivate builds a thin conversion film that guards the zinc against white rust, in blue or yellow.', id: 'Passivasi trivalent membentuk lapisan konversi tipis yang melindungi seng dari karat putih, dalam warna biru atau kuning.' },
        groups: [
          { name: { en: 'Trivalent blue', id: 'Trivalent biru' }, color: '#5b8fd6', products: ['u72i', 'u79', 'bs-70-m', 'tr-5t090a'] },
          { name: { en: 'Trivalent yellow', id: 'Trivalent kuning' }, color: '#e4c04a', products: ['u89hc', '551mr', 'tr-178ap'] }
        ] },
      { id: 'x', figure: 'dip', black: true,
        name: { en: 'Additional treatment', id: 'Perlakuan tambahan' },
        desc: { en: 'For a black finish only: a black passivate, then a sealer for an even colour and extra corrosion protection.', id: 'Khusus hasil hitam: passivasi hitam, lalu sealer agar warna merata dan proteksi korosi bertambah.' },
        products: ['trilux-188fp', 'jasco-ft190g', 'hanson-sealing-3918'] },
      { id: 'g', figure: null,
        name: { en: 'Drying / oven', id: 'Pengeringan / oven' },
        desc: { en: 'Parts are dried in the oven so no water marks are left before packing. No chemical is needed.', id: 'Benda kerja dikeringkan di oven agar tidak ada bekas air sebelum dikemas. Tidak memerlukan bahan kimia.' },
        products: [] }
    ]
  },

  // pack: { size, price (IDR) } — prices are SAMPLE values
  products: [
    { id: 'hanson-ak-392-ab', sample: false, brand: 'Hanson', cat: 'basic', sub: null, shape: 'can', color: '#c8281e',
      name: 'Hanson AK 392 AB',
      desc: { en: 'Two-part additive system (A + B) used in METINDO plating lines. Part A builds brightness and grain refinement; Part B maintains levelling across a wide current density range.', id: 'Sistem aditif dua komponen (A + B) untuk lini plating METINDO. Part A menambah kilap dan menghaluskan butiran; Part B menjaga leveling pada rentang rapat arus yang lebar.' },
      uses: { en: ['Bright plating additive', 'Two-component make-up (A + B)', 'Suitable for rack and barrel'], id: ['Aditif plating cerah', 'Make-up dua komponen (A + B)', 'Cocok untuk rak dan barrel'] },
      packs: [{ size: '5 L', price: 875000 }, { size: '20 L', price: 3250000 }] },
    { id: 'alk-copper-strike', sample: true, brand: 'Metindo', cat: 'alkaline', sub: 'alkaline-copper', shape: 'can', color: '#b8682f',
      name: 'Alkaline Copper Strike',
      desc: { en: 'Non-cyanide copper strike for strong adhesion on steel and zinc die-cast.', id: 'Copper strike non-sianida untuk daya lekat kuat pada baja dan zinc die-cast.' },
      uses: { en: ['Strike layer on steel', 'Zamac pre-plate'], id: ['Lapisan strike pada baja', 'Pre-plate zamac'] },
      packs: [{ size: '5 L', price: 720000 }, { size: '20 L', price: 2650000 }] },
    { id: 'acid-zinc-brightener', sample: true, brand: 'Metindo', cat: 'acid', sub: 'acid-zinc', shape: 'can', color: '#6b7a8c',
      name: 'Acid Zinc Brightener',
      desc: { en: 'Brightener for potassium chloride zinc baths with mirror-like results.', id: 'Brightener untuk larutan seng kalium klorida dengan hasil seperti cermin.' },
      uses: { en: ['High-speed plating', 'Mirror brightness'], id: ['Plating cepat', 'Kilap cermin'] },
      packs: [{ size: '5 L', price: 590000 }, { size: '20 L', price: 2150000 }] },
    { id: 'acid-copper-brightener', sample: true, brand: 'Metindo', cat: 'acid', sub: 'acid-copper', shape: 'can', color: '#a35a2a',
      name: 'Acid Copper Brightener',
      desc: { en: 'Levelling brightener for acid copper as a base for nickel-chrome.', id: 'Brightener perata untuk tembaga asam sebagai dasar nikel-krom.' },
      uses: { en: ['Decorative base layer', 'High levelling'], id: ['Lapisan dasar dekoratif', 'Leveling tinggi'] },
      packs: [{ size: '5 L', price: 690000 }, { size: '20 L', price: 2550000 }] },
    { id: 'naoh-flakes', sample: true, brand: 'Metindo', cat: 'basic', sub: 'naoh', shape: 'sack', color: '#f2f2f0',
      name: 'Caustic Soda (NaOH) Flakes 98%',
      desc: { en: 'Technical-grade caustic soda for cleaners and alkaline baths.', id: 'Soda kaustik grade teknis untuk cleaner dan larutan alkaline.' },
      uses: { en: ['Cleaner make-up', 'pH adjustment'], id: ['Make-up cleaner', 'Penyesuaian pH'] },
      packs: [{ size: '25 kg', price: 525000 }] },
    { id: 'nickel-sulfate', sample: true, brand: 'Metindo', cat: 'basic', sub: 'nickel-sulfate', shape: 'sack', color: '#3f9b6a',
      name: 'Nickel Sulfate Hexahydrate',
      desc: { en: 'Plating-grade nickel sulfate for Watts and bright nickel baths.', id: 'Nikel sulfat grade plating untuk larutan Watts dan nikel cerah.' },
      uses: { en: ['Bath make-up', 'Metal replenishment'], id: ['Make-up larutan', 'Penambahan logam'] },
      packs: [{ size: '25 kg', price: 2950000 }] },
    { id: 'sus-polish', sample: true, brand: 'Metindo', cat: 'polishing', sub: 'sus-polish', shape: 'can', color: '#8a96a3',
      name: 'SUS Chemical Polish',
      desc: { en: 'Immersion polish that brightens stainless steel without mechanical work.', id: 'Polish celup yang mencerahkan stainless steel tanpa proses mekanis.' },
      uses: { en: ['Stainless steel 304/316', 'Immersion process'], id: ['Stainless steel 304/316', 'Proses celup'] },
      packs: [{ size: '5 L', price: 540000 }, { size: '20 L', price: 1980000 }] },
    { id: 'copper-bright-dip', sample: true, brand: 'Metindo', cat: 'supporting', sub: 'support-copper', shape: 'can', color: '#c07a3a',
      name: 'Copper & Brass Bright Dip',
      desc: { en: 'Fast bright dip for copper and brass components.', id: 'Bright dip cepat untuk komponen tembaga dan kuningan.' },
      uses: { en: ['Copper, brass, bronze'], id: ['Tembaga, kuningan, perunggu'] },
      packs: [{ size: '5 L', price: 495000 }] },
    { id: 'buffing-compound', sample: true, brand: 'Metindo', cat: 'polishing', sub: 'buffing', shape: 'box', color: '#c8281e',
      name: 'Buffing Compound Bar',
      desc: { en: 'Solid compound for high-gloss buffing of steel and non-ferrous metals.', id: 'Kompon padat untuk buffing kilap tinggi baja dan logam non-ferro.' },
      uses: { en: ['Cut and colour buffing'], id: ['Buffing potong dan kilap'] },
      packs: [{ size: '1 kg', price: 85000 }, { size: '10 kg', price: 790000 }] },
    { id: 'edta-1m', sample: true, brand: 'Metindo', cat: 'laboratory', sub: 'edta', shape: 'bottle', color: '#3a7bd5',
      name: 'EDTA Solution 1 M',
      desc: { en: 'Standardised EDTA titrant for bath metal analysis.', id: 'Titran EDTA terstandar untuk analisa kadar logam larutan.' },
      uses: { en: ['Titration', 'Bath control'], id: ['Titrasi', 'Kontrol larutan'] },
      packs: [{ size: '1 L', price: 320000 }] },
    { id: 'hard-anodizing-additive', sample: true, brand: 'Metindo', cat: 'anodizing', sub: 'hard-anodizing', shape: 'can', color: '#5c6b7a',
      name: 'Hard Anodizing Additive',
      desc: { en: 'Additive for thick, hard anodic layers at higher temperatures.', id: 'Aditif untuk lapisan anodik tebal dan keras pada suhu lebih tinggi.' },
      uses: { en: ['Engineering aluminium', 'Wear resistance'], id: ['Aluminium teknik', 'Tahan aus'] },
      packs: [{ size: '5 L', price: 980000 }] },
    { id: 'nano-mono', sample: true, brand: 'Metindo', cat: 'edp', sub: 'nano-mono', shape: 'can', color: '#2e8b8b',
      name: 'Nano Mono',
      desc: { en: 'Single-step nano ceramic pre-treatment before painting or e-coat.', id: 'Pre-treatment nano keramik satu tahap sebelum pengecatan atau e-coat.' },
      uses: { en: ['Phosphate replacement', 'Paint adhesion'], id: ['Pengganti fosfat', 'Daya lekat cat'] },
      packs: [{ size: '20 L', price: 2850000 }] },
    { id: 'alkaline-degreaser', sample: true, brand: 'Metindo', cat: 'cleaner', sub: 'alkaline-degreasing', shape: 'can', color: '#3567a8',
      name: 'Alkaline Soak Degreaser',
      desc: { en: 'Heavy-duty soak degreaser for oils, grease and buffing residue.', id: 'Degreaser rendam untuk minyak, gemuk dan sisa buffing.' },
      uses: { en: ['Steel, copper, brass', 'Soak or ultrasonic'], id: ['Baja, tembaga, kuningan', 'Rendam atau ultrasonik'] },
      packs: [{ size: '25 kg', price: 875000 }] },
    { id: 'acid-degreaser', sample: true, brand: 'Metindo', cat: 'cleaner', sub: 'acid-degreasing', shape: 'can', color: '#a83a35',
      name: 'Acid Degreaser',
      desc: { en: 'Removes light oils and rust in a single pickling step.', id: 'Menghilangkan minyak ringan dan karat dalam satu tahap pickling.' },
      uses: { en: ['Pickling + degreasing'], id: ['Pickling + degreasing'] },
      packs: [{ size: '20 L', price: 760000 }] },
    { id: 'titanium-heater', sample: true, brand: 'Metindo', cat: 'equipment', sub: 'heater', shape: 'machine', color: '#8a96a3',
      name: 'Titanium Immersion Heater 3 kW',
      desc: { en: 'Corrosion-resistant immersion heater for acid and alkaline tanks.', id: 'Pemanas celup tahan korosi untuk tangki asam dan alkaline.' },
      uses: { en: ['Acid & alkaline baths'], id: ['Larutan asam & alkaline'] },
      packs: [{ size: '3 kW', price: 4750000 }] },
    { id: 'filter-pump', sample: true, brand: 'Metindo', cat: 'equipment', sub: 'filter', shape: 'machine', color: '#2f6fb3',
      name: 'Plating Filter Pump',
      desc: { en: 'Magnetic-drive filter pump with cartridge housing for clean plating baths.', id: 'Pompa filter magnetic-drive dengan housing cartridge untuk larutan plating yang bersih.' },
      uses: { en: ['Continuous bath filtration'], id: ['Filtrasi larutan kontinu'] },
      packs: [{ size: '1 unit', price: 8900000 }] },
    { id: 'ro-unit', sample: true, brand: 'Metindo', cat: 'wwtp', sub: 'ro-machine', shape: 'machine', color: '#3a7bd5',
      name: 'RO Machine 500 LPH',
      desc: { en: 'Reverse-osmosis unit for rinse-water recovery and DI make-up.', id: 'Unit reverse osmosis untuk daur ulang air bilas dan make-up air DI.' },
      uses: { en: ['Rinse water recovery'], id: ['Daur ulang air bilas'] },
      packs: [{ size: '1 unit', price: 38500000 }] }
  ],

  // News & articles: ALL SAMPLE CONTENT for the prototype. Replace with the
  // client's real posts. type: 'news' | 'article'. Body lines starting with
  // '## ' render as sub-headings.
  posts: [
    { id: 'alkaline-vs-acid-zinc', type: 'article', date: '2026-09-29', img: 'zinc', read: 5,
      title: { en: 'Alkaline zinc or acid zinc: which one fits your line?', id: 'Alkaline zinc atau acid zinc: mana yang cocok untuk lini Anda?' },
      excerpt: { en: 'Both deposit zinc, but they behave very differently on complex parts, cast iron and high-volume barrels.', id: 'Keduanya melapisi seng, tetapi perilakunya sangat berbeda pada part kompleks, besi tuang dan barrel volume tinggi.' },
      body: {
        en: ['Zinc plating is still the most cost-effective way to protect steel from corrosion. The real question is which bath chemistry suits your parts.',
          '## Alkaline (cyanide-free) zinc',
          'Alkaline zinc has excellent throwing power. Thickness stays uniform from the outside edges to deep recesses, which suits tubes, brackets and complex stampings. Deposits are ductile and take trivalent passivates well.',
          '## Acid (chloride) zinc',
          'Acid zinc plates faster at higher current efficiency and gives a very bright, levelled finish. It also plates directly onto cast iron and carbonitrided steel, where alkaline baths struggle. The trade-off is less even thickness on deep or complex shapes.',
          '## How to choose',
          'Start from the part: its geometry, base metal, and the salt-spray hours your customer requires. Our chemists can run a Hull cell test with your parts and recommend the right system.'],
        id: ['Pelapisan seng masih merupakan cara paling hemat untuk melindungi baja dari korosi. Pertanyaannya: kimia larutan mana yang cocok untuk part Anda?',
          '## Alkaline zinc (bebas sianida)',
          'Alkaline zinc memiliki daya sebar yang sangat baik. Ketebalan tetap merata dari tepi luar hingga ceruk dalam, cocok untuk pipa, bracket dan part stamping kompleks. Lapisannya ulet dan menerima passivasi trivalen dengan baik.',
          '## Acid zinc (klorida)',
          'Acid zinc melapisi lebih cepat dengan efisiensi arus lebih tinggi dan hasil sangat cerah serta rata. Larutan ini juga dapat melapisi langsung besi tuang dan baja karbonitriding, yang sulit untuk larutan alkaline. Kekurangannya: ketebalan kurang merata pada bentuk dalam atau kompleks.',
          '## Cara memilih',
          'Mulailah dari part: geometri, logam dasar, dan jam salt-spray yang diminta pelanggan Anda. Ahli kimia kami dapat melakukan uji Hull cell dengan part Anda dan merekomendasikan sistem yang tepat.'] } },
    { id: 'trivalent-passivation', type: 'article', date: '2026-09-15', img: 'inspect', read: 4,
      title: { en: 'Why the industry moved to trivalent passivation', id: 'Mengapa industri beralih ke passivasi trivalen' },
      excerpt: { en: 'Blue, yellow and black trivalent passivates replace hexavalent chromium without giving up corrosion protection.', id: 'Passivasi trivalen biru, kuning dan hitam menggantikan krom heksavalen tanpa mengorbankan perlindungan korosi.' },
      body: {
        en: ['Hexavalent chromium is restricted under regulations such as RoHS and ELV, so automotive and electronics customers now ask for Cr(VI)-free finishes.',
          '## Three common finishes',
          'Blue (clear) trivalent gives a bright, silvery look. Yellow iridescent adds colour and extra protection. Black trivalent gives a deep, uniform black and is usually paired with a sealer or topcoat to reach the required salt-spray hours.',
          '## Getting it right',
          'Trivalent passivates are more sensitive to pH, temperature and immersion time than the old chemistry. Good rinsing before passivation, and a stable zinc deposit underneath, make the biggest difference.'],
        id: ['Krom heksavalen dibatasi oleh regulasi seperti RoHS dan ELV, sehingga pelanggan otomotif dan elektronik kini meminta finishing bebas Cr(VI).',
          '## Tiga finishing umum',
          'Trivalen biru (bening) memberi tampilan cerah keperakan. Kuning iridescent menambah warna dan perlindungan ekstra. Trivalen hitam memberi warna hitam pekat yang merata dan biasanya dipadukan dengan sealer atau topcoat untuk mencapai jam salt-spray yang dibutuhkan.',
          '## Kunci keberhasilan',
          'Passivasi trivalen lebih sensitif terhadap pH, suhu dan waktu celup dibanding kimia lama. Pembilasan yang baik sebelum passivasi dan lapisan seng yang stabil di bawahnya adalah faktor paling menentukan.'] } },
    { id: 'bath-analysis-signs', type: 'article', date: '2026-08-27', img: 'lab', read: 4,
      title: { en: 'Five signs your plating bath needs analysis', id: 'Lima tanda larutan plating Anda perlu dianalisa' },
      excerpt: { en: 'Dull low-current areas, burning, pitting and rising rejects usually point to chemistry drifting out of range.', id: 'Area arus rendah yang kusam, gosong, pitting dan reject yang meningkat biasanya menandakan kimia larutan keluar dari rentang.' },
      body: {
        en: ['Most plating problems start slowly. Catching them early with regular analysis is far cheaper than stripping and replating.',
          '## Watch for these signs',
          '1. Dull or dark deposits in low-current-density areas. 2. Burning on edges at high current density. 3. Pitting or roughness. 4. Blistering or poor adhesion. 5. A steady rise in rejects with no change to the parts.',
          '## What to test',
          'Metal content (often by EDTA titration), brightener levels, pH and contamination. A Hull cell panel shows at a glance how the bath behaves across the whole current density range.',
          'METINDO supplies analytical reagents such as EDTA Solution 1 M and supports customers with bath analysis.'],
        id: ['Sebagian besar masalah plating muncul perlahan. Mendeteksinya lebih awal dengan analisa rutin jauh lebih murah daripada stripping dan plating ulang.',
          '## Perhatikan tanda-tanda ini',
          '1. Lapisan kusam atau gelap di area rapat arus rendah. 2. Gosong di tepi pada rapat arus tinggi. 3. Pitting atau permukaan kasar. 4. Melepuh atau daya lekat buruk. 5. Reject yang terus naik tanpa perubahan part.',
          '## Apa yang perlu diuji',
          'Kadar logam (sering dengan titrasi EDTA), kadar brightener, pH dan kontaminasi. Panel Hull cell menunjukkan sekilas perilaku larutan di seluruh rentang rapat arus.',
          'METINDO memasok reagen analisa seperti Larutan EDTA 1 M dan mendukung pelanggan dengan analisa larutan.'] } },
    { id: 'new-website-store', type: 'news', date: '2026-10-08', img: 'office', read: 2,
      title: { en: 'METINDO launches its new website and online store', id: 'METINDO meluncurkan website dan toko online baru' },
      excerpt: { en: 'Browse 13 process categories, request TDS documents and order process chemicals directly from our warehouse.', id: 'Jelajahi 13 kategori proses, minta dokumen TDS dan pesan bahan kimia proses langsung dari gudang kami.' },
      body: {
        en: ['Our new website brings our process knowledge and products into one place.',
          'Customers can explore all 13 process categories, see the step-by-step alkaline process flow, request TDS documents and prices from our admin, and order directly in the METINDO Store.',
          'Products remain available on Tokopedia, Shopee and Blibli.'],
        id: ['Website baru kami menghadirkan pengetahuan proses dan produk dalam satu tempat.',
          'Pelanggan dapat menjelajahi 13 kategori proses, melihat alur proses alkaline langkah demi langkah, meminta dokumen TDS dan harga kepada admin, serta memesan langsung di Toko METINDO.',
          'Produk tetap tersedia di Tokopedia, Shopee dan Blibli.'] } },
    { id: 'nano-mono-available', type: 'news', date: '2026-09-22', img: 'chemstock', read: 2,
      title: { en: 'Nano Mono: a phosphate-free pre-treatment before painting', id: 'Nano Mono: pre-treatment bebas fosfat sebelum pengecatan' },
      excerpt: { en: 'A single-step nano ceramic conversion coating for better paint and e-coat adhesion.', id: 'Konversi nano keramik satu tahap untuk daya lekat cat dan e-coat yang lebih baik.' },
      body: {
        en: ['Nano Mono is a single-step nano ceramic conversion coating used before painting and e-coat.',
          'Compared with traditional zinc phosphate lines, nano ceramic pre-treatment typically runs at lower temperatures and produces far less sludge, which simplifies wastewater treatment.',
          'Contact our team for a trial on your line.'],
        id: ['Nano Mono adalah konversi nano keramik satu tahap yang digunakan sebelum pengecatan dan e-coat.',
          'Dibandingkan lini zinc phosphate tradisional, pre-treatment nano keramik umumnya beroperasi pada suhu lebih rendah dan menghasilkan lumpur jauh lebih sedikit, sehingga pengolahan air limbah lebih sederhana.',
          'Hubungi tim kami untuk uji coba di lini Anda.'] } },
    { id: 'technical-support-network', type: 'news', date: '2026-09-02', img: 'handshake', read: 2,
      title: { en: 'Technical support from Jakarta, Surabaya and Bali', id: 'Dukungan teknis dari Jakarta, Surabaya dan Bali' },
      excerpt: { en: 'Our offices and Cikarang warehouse keep chemistry and expertise close to your plant.', id: 'Kantor dan gudang Cikarang kami menjaga kimia dan keahlian tetap dekat dengan pabrik Anda.' },
      body: {
        en: ['With offices in Jakarta, Surabaya and Bali and a warehouse in Cikarang, METINDO keeps stock and technical people close to customers.',
          'Our team helps with line set-up, bath make-up, troubleshooting and regular analysis.'],
        id: ['Dengan kantor di Jakarta, Surabaya dan Bali serta gudang di Cikarang, METINDO menjaga stok dan tenaga teknis tetap dekat dengan pelanggan.',
          'Tim kami membantu set-up lini, make-up larutan, troubleshooting dan analisa rutin.'] } }
  ]
};

// Products of the alkaline zinc line, from the client's flow. Real names; prices
// are on request (quote: true) until the price manager is connected.
(function () {
  const D = window.METINDO;
  const ROLE = {
    a: { en: 'Degreaser', id: 'Degreaser' },
    b: { en: 'Pickling chemical', id: 'Bahan pickling' },
    c: { en: 'Electro cleaner', id: 'Electro cleaner' },
    d: { en: 'Zinc plating chemical', id: 'Bahan plating seng' },
    e: { en: 'Activation acid', id: 'Asam aktivasi' },
    f: { en: 'Trivalent passivate', id: 'Passivasi trivalent' },
    x: { en: 'Black finish treatment', id: 'Perlakuan hasil hitam' }
  };
  const rows = [
    ['epclen-62', 'Epclen 62', 'Epclen', 'a', 'can', '#3567a8'], ['epclen-541', 'Epclen 541', 'Epclen', 'a', 'can', '#3567a8'],
    ['hanson-sc-821', 'Hanson SC 821', 'Hanson', 'a', 'can', '#c8281e'], ['jasco-ca-135g', 'Jasco CA 135G', 'Jasco', 'a', 'can', '#1f7a5a'],
    ['jasco-plus-clean-a', 'Jasco Plus Clean A', 'Jasco', 'a', 'can', '#1f7a5a'], ['jasco-plus-clean-b', 'Jasco Plus Clean B', 'Jasco', 'a', 'can', '#1f7a5a'],
    ['epclen-55rt', 'Epclen 55RT', 'Epclen', 'a', 'can', '#3567a8'], ['epclen-20ns', 'Epclen 20NS', 'Epclen', 'a', 'can', '#3567a8'],
    ['epunion-208cl', 'Epunion 208CL', 'Epunion', 'b', 'can', '#6b4fa0'], ['jasco-2r059', 'Jasco 2R059', 'Jasco', 'b', 'can', '#1f7a5a'],
    ['hcl', 'HCl (hydrochloric acid)', '', 'b', 'can', '#8a8f96'], ['jasco-2p056', 'Jasco 2P056', 'Jasco', 'b', 'can', '#1f7a5a'],
    ['epclen-ex-4', 'Epclen EX-4', 'Epclen', 'c', 'can', '#3567a8'], ['jasco-cv-260g', 'Jasco CV-260G', 'Jasco', 'c', 'can', '#1f7a5a'],
    ['jasco-plus-clean-d', 'Jasco Plus Clean D', 'Jasco', 'c', 'can', '#1f7a5a'], ['jasco-hg-129', 'Jasco HG-129', 'Jasco', 'c', 'can', '#1f7a5a'],
    ['amazinc-ht45', 'Amazinc HT45', 'Amazinc', 'd', 'can', '#2f6fb3'], ['jasco-hyperzinc-330-ag', 'Jasco Hyperzinc 330 AG', 'Jasco', 'd', 'can', '#1f7a5a'],
    ['jasco-hyperzinc-330-bg', 'Jasco Hyperzinc 330 BG', 'Jasco', 'd', 'can', '#1f7a5a'], ['hanson-ak-392-zinc-oxide', 'Hanson AK 392 basic zinc oxide', 'Hanson', 'd', 'sack', '#c8281e'],
    ['naoh', 'NaOH (caustic soda)', '', 'd', 'sack', '#8a8f96'],
    ['nitric-acid', 'Nitric acid', '', 'e', 'can', '#8a8f96'],
    ['u72i', 'U72i', '', 'f', 'bottle', '#5b8fd6', 0], ['u79', 'U79', '', 'f', 'bottle', '#5b8fd6', 0], ['bs-70-m', 'BS 70 M', '', 'f', 'bottle', '#5b8fd6', 0],
    ['tr-5t090a', 'TR-5T090A', '', 'f', 'bottle', '#5b8fd6', 0],
    ['u89hc', 'U89HC', '', 'f', 'bottle', '#d9b23a', 1], ['551mr', '551MR', '', 'f', 'bottle', '#d9b23a', 1], ['tr-178ap', 'TR-178AP', '', 'f', 'bottle', '#d9b23a', 1],
    ['trilux-188fp', 'Trilux 188FP', 'Trilux', 'x', 'bottle', '#222326'], ['jasco-ft190g', 'Jasco FT190G', 'Jasco', 'x', 'bottle', '#1f7a5a'],
    ['hanson-sealing-3918', 'Hanson Sealing 3918', 'Hanson', 'x', 'bottle', '#c8281e']
  ];
  rows.forEach(([id, name, brand, step, shape, color, group]) => {
    const st = D.zincLine.steps.find(x => x.id === step), role = ROLE[step];
    const what = group == null ? role : st.groups[group].name;
    D.products.push({
      id, name, brand, cat: 'alkaline', sub: 'alkaline-zinc', line: 'zinc', step, group, shape, color, quote: true, packs: [],
      desc: {
        en: `${what.en} used in step ${step.toUpperCase()}, ${st.name.en.toLowerCase()}, of the alkaline zinc line. Full product details are coming soon.`,
        id: `${what.id} untuk tahap ${step.toUpperCase()}, ${st.name.id.toLowerCase()}, pada lini alkaline zinc. Detail produk lengkap segera hadir.`
      },
      uses: { en: [`Step ${step.toUpperCase()} · ${st.name.en}`, 'Alkaline zinc line'], id: [`Tahap ${step.toUpperCase()} · ${st.name.id}`, 'Lini alkaline zinc'] }
    });
  });
})();
