# Peak Builders — Instant Quote Flow Copy (editable)

Edit any value to the right of each label. Keep the [IDs] so I can map your changes back.

Flow is 7 steps: 1 Intro · 2 Address · 3 Roof pitch · 4 Roof type · 5 Financing · 6 Estimate reveal · 7 Contact.

---

## STEP 1 — Intro / Get started
- [1.1] Headline: **Get a free instant estimate**   (the words "free instant" are highlighted green)
- [1.2] Subtext: **We use satellite imagery to measure your roof and provide an instant estimate for your roof replacement.**
- [1.3] Button: **Get Started**

### Trust badges (shown under the button)
- [1.4] Badge 1 title: **2,100+ Roofs Completed in San Diego**
- [1.5] Badge 1 subtitle: **Local roofing experience homeowners can trust.**
- [1.6] Badge 2 title: **$0 Down & 0% Interest Financing Options**
- [1.7] Badge 2 subtitle: **Get started without paying upfront.**
- [1.8] Badge 3 title: **The Longest Roofing Warranty in San Diego**
- [1.9] Badge 3 subtitle: **Lifetime shingles warranty + 30-year labor warranty.**

---

## STEP 2 — Address
- [2.1] Heading: **What's your home address?**
- [2.2] Subtext: **We'll measure your roof from satellite imagery to build your estimate.**
- [2.3] Field placeholder: **Start typing your home address…**

(Roof measurement starts in the background as soon as an address is picked.)

---

## STEP 3 — Roof pitch (how steep)
- [3.1] Question: **How steep is your roof?**   (each option has an icon/picture)
- [3.2] Option 1: **Flat**
- [3.3] Option 2 title: **Low**  · subtitle: **Easily walked on**
- [3.4] Option 3 title: **Moderate**  · subtitle: **Not easily walked on**
- [3.5] Option 4 title: **Steep**  · subtitle: **Can't be walked on**
- [3.6] Option 5: **I'm not sure**

Pricing map (pitch → complexity multiplier): Flat & Low → Simple, Moderate → Moderate, Steep → Complex, I'm not sure → Moderate.

---

## STEP 4 — Roof type (material)
- [4.1] Question: **What type of roof would you like?**   (each option has an icon/picture)
- [4.2] Option 1: **Asphalt Shingles**
- [4.3] Option 2: **Tiles**
- [4.4] Option 3: **Flat Roof**
- [4.5] Option 4: **Not Sure**

Pricing map (type → material): Asphalt Shingles → asphalt, Tiles → tile, Flat Roof → asphalt (fallback), Not Sure → asphalt.

---

## STEP 5 — Financing
- [5.1] Question: **Are you interested in financing?**
- [5.2] Option 1 title: **Yes**  · subtitle: **I am interested in financing**
- [5.3] Option 2 title: **No**  · subtitle: **I am not interested in financing**
- [5.4] Option 3 title: **Maybe**  · subtitle: **I would like to learn more about financing**

(Financing answer does not affect price; it's forwarded to GHL as `financing`.)

---

## STEP 6 — Instant estimate reveal (price blurred until they continue)
- [6.1] Heading: **Your instant estimate is ready**
- [6.2] Stat label 1: **Roof Area**   (value auto: e.g. "3,010 sqft")
- [6.3] Stat label 2: **Roofing Squares**   (value auto: e.g. "30.1")
- [6.4] Price label: **Estimated Project Cost**   (value auto: e.g. "$16,200 – $21,900")
- [6.5] Blur overlay text: **Enter your info to reveal your price**
- [6.6] Footnote (satellite): **Preliminary estimate based on satellite roof measurement. Final pricing confirmed after a free on-site inspection.**
- [6.7] Footnote (manual): **Preliminary estimate based on your selected home size. Final pricing confirmed after a free on-site inspection.**
- [6.8] Button: **Reveal My Price**

### STEP 6 — Measuring (shown briefly if measurement is still running)
- [6.9] Heading: **Measuring your roof…**
- [6.10] Subtext: **Pulling satellite imagery for {address}.**   ({address} is auto-filled)

### STEP 6-ALT — Manual size fallback (only if the address can't be auto-measured)
- [6.11] Heading: **About how big is your home?**
- [6.12] Subtext: **We couldn't auto-measure this address — pick the closest match and we'll refine it during your free inspection.**
- [6.13] Option 1: **Small home / single story (~1,200 sqft roof)**
- [6.14] Option 2: **Average home (~1,800 sqft roof)**
- [6.15] Option 3: **Large home / two story (~2,600 sqft roof)**
- [6.16] Option 4: **Very large home (~3,500+ sqft roof)**

---

## STEP 7 — Contact (final, submits) — name + email + phone on one screen
- [7.1] Heading: **Where should we send your estimate?**
- [7.2] Subtext: **A Peak Builders roofing specialist will confirm your estimate and schedule your free inspection.**
- [7.3] Field 1 label: **Full Name**  · placeholder: **Enter your full name**
- [7.4] Field 2 label: **Email Address**  · placeholder: **you@example.com**
- [7.5] Field 3 label: **Phone Number**  · placeholder: **(555) 555-5555**
- [7.6] Button (idle): **See My Estimate**
- [7.7] Button (submitting): **Submitting...**

---

## Validation / error messages
- [E.1] Name error: **Please enter your name**
- [E.2] Email error: **Please enter a valid email address**
- [E.3] Phone error: **Please enter a valid phone number**
- [E.4] Submit failed: **Something went wrong. Please try again or call (619) 330-8185.**

---

## Pricing constants (San Diego 2025 — edit if Peak Builders gives real numbers)
- [P.1] Asphalt $/square (100 sqft): **550**
- [P.2] Metal $/square: **1150**
- [P.3] Tile $/square: **1000**
- [P.4] Complexity multiplier — Simple: **1.0**, Moderate: **1.15**, Complex: **1.3**
- [P.5] Job type multiplier — Full replacement: **1.0**, Repair: **0.35**   (instant-quote always sends full replacement)
- [P.6] Range spread (±): **0.15**  (15% above/below = the displayed range)
- [P.7] Minimum estimate floor: **$2,500**

---

NOTE: Roof-pitch options and roof-type options currently use placeholder icons.
Send real images and I'll swap them in.

NOTE: The thank-you page after submit is a separate existing page (/peakbuilders/thank-you).
Tell me if you want its copy extracted too and I'll add it here.
