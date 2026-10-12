# OpenCanvas

An independent, subscription-free, browser-local design editor with original and credited community templates; not affiliated with Canva.

Open `dist/index.html` in a modern browser, or run `node server.mjs` and visit the printed URL. No dependencies or build step are required.

Features: editable original templates; drag, resize, rotate, reorder and duplicate text, shapes and uploaded images; font, color and opacity controls; undo/redo; custom canvas sizes; local project storage; editable project import/export; PNG/JPG export including transparent PNG and 2x resolution.

Projects and images stay in browser storage. Export `.opencanvas` files for durable backups. Local storage is not cloud synchronization. Uploaded images are limited to 10 MB and resized to a maximum of 2400 pixels on the long edge (1600 in Photo studio). PNG/JPG exports are limited to 24 megapixels. Multipage documents, standard system fonts, and static images are supported. Team collaboration, accounts, commercial stock media, video editing, AI generation and cloud backup are not included.

## Studio tools

- Brand kits: save named palettes and heading/body fonts, capture colors from a design, apply a kit in one undoable step, paint individual elements, and import/export brand JSON backups. Includes three original starter palettes and a contrast readout for ink against paper.
- Alignment: drag elements near canvas or element edges/centers to snap; hold Alt to bypass. Pink guides appear while dragging. The properties panel also offers six exact canvas alignment commands, including for rotated elements.
- Bulk create: load or paste CSV, link text with `{{column}}` placeholders, preview rows, and download a ZIP of PNGs plus optional editable project files. Includes an original certificate template and sample CSV. Long entries shrink to fit their original text box; impossible fits report an error. The template is preserved, and a single merged version can be opened as a separate project.

Bulk limits: 50 records, 20 columns, 500 KB of CSV, 2,000 characters per field, and 80 MB of exported files per batch. CSV supports quoted commas, doubled quotes and multiline fields. CSV data stays in memory and is not sent to a server. Brand kits persist in this browser; download backups to move them between devices.

## Source layout

`dist/index.html` contains the standalone interface, rendering engine and editor logic. Studio additions are maintained in `studio-features.js` and `studio-features.css`; community additions in `community-templates.js`; Create and discovery in `catalog-data.js`, `create-hub.js`, and `create-hub.css`. Run `node build-studio.cjs`, then `node build-community.cjs`, then `node build-create.cjs` after editing them to update the self-contained HTML. The scripts use only Node built-ins. `server.mjs` provides an optional local preview. Hosting settings for the original deployment are intentionally excluded from this repository.

Run `node --test tests/studio.test.cjs` for CSV parsing, placeholder substitution, snapping, contrast and ZIP checksum checks.

## Create and discover

Click **Create** in the left rail (or press `/`) for 44 formats across presentations, social media, photo editing, video planning, print, documents, whiteboards, visual sheets, code illustrations, website mockups, and email graphics. Custom sizes accept pixels, inches, or millimeters, with conversion to pixels. Photo upload opens a new design sized to the photo. Every new design preserves the previous project in browser storage.

**Explore all templates** opens a large gallery with topic navigation, style filters, and search across names and tags. The library contains 42 templates: eight original general templates, two credited community adaptations, and 32 new original niche designs. Niches include DJs and live music, podcasts, fitness, wellness, beauty, food, gaming, education, real estate, weddings, faith and community, nonprofit work, pets, crafts, books, travel, photography, small business, technology, sports, gardening, and celebrations. Unknown topics can start from a customizable topic starter. New niche layouts use editable text and vector shapes, with no downloaded fonts or artwork. The gallery structure takes inspiration from the supplied Canva screenshots; the new artwork and implementation are original.

Output scope is static visual designs with up to 30 pages, PNG/JPG for the current page, flattened PDF export, and editable OpenCanvas projects. Presentation entries start a deck; add slides in Pages. Video entries are covers/storyboards, Sheets entries are visual planners without formulas, Code entries are illustrations without execution, Websites entries are mockups without website publishing, and Emails entries are images/mockups without email sending or HTML email export. Print presets use pixel conversions. PDF pages use 96 pixels per inch and contain raster images; there is no CMYK, automatic bleed, or selectable PDF text.

Run `node --test tests/catalog.test.cjs tests/studio.test.cjs` for the catalog, search, custom-size conversion, project portability, and existing Studio checks.

## Pages and presentations

Open **Pages** in the rail or click the page count below the canvas. Add blank pages or three original slide layouts (opening, content, closing), rename, duplicate, reorder, or remove pages. Page removal and structural edits support undo/redo. Each page retains its own dimensions, background, elements and community source credit. Resize and brand changes apply to the current page. Existing single-page projects upgrade automatically; editable project downloads include every page and restore the selected page.

**Present** opens a distraction-free slide view with previous/next controls and Left/Right/Home/End/Escape keyboard navigation. **PDF** exports all pages or only the current page; the same PDF option appears in Export design. PDF preserves each page's aspect ratio with JPEG artwork at original resolution. Limits are 30 pages, 80 million total exported pixels, and 80 MB of JPEG data. Import validates every page and limits projects to 3,000 total elements. Browser storage limits still apply; download project backups for large decks. Bulk creation uses the current page only and exports independent single-page variants.

Page helpers live in `pages-core.js`, UI in `pages-features.js` and `pages-features.css`. Run `node build-pages.cjs` **last**, after the Studio, Community, and Create builders. Run all checks with `node --test tests/catalog.test.cjs tests/studio.test.cjs tests/pages.test.cjs`.

Reference review on October 12, 2026: https://www.canva.com/presentations/ documents multipage templates, browser presentation, and PDF sharing. These gaps informed this original implementation. OpenCanvas does not yet provide Canva's live collaboration, AI generation, animations, presenter recording, polls, PowerPoint export, or video editing. No Canva source code or template artwork is included.

## Creative library and photo tools

Elements now includes 24 original graphics spanning music/DJ, botanical, nature, celebrations, business, and lifestyle themes. Search by name or keyword, choose main/accent colors before insertion, and return to the six most recently used graphics. These locally defined SVG drawings are rendered to 800 × 800 transparent PNGs at insertion for compatibility with every existing export. They are single image layers, not independently editable vector parts. They were created for this project; they are not Canva stock assets or the human-authored community templates described below.

Frames opens Photo studio with circle, rounded-square or arch cropping. Select an existing image or choose a local PNG/JPG/WebP file. Photo studio supports brightness, contrast, saturation, horizontal flip, centered frame crops, and edge-connected background-color removal with a tolerance control. Background removal is a deterministic flood fill, not AI subject segmentation; it is best for simple solid backdrops and preserves enclosed regions matching the removed color. The preview shows transparency. Applying changes writes one PNG layer; undo restores the prior source and dimensions. Processing is limited to 1600 pixels on the longest edge. No images leave the browser.

Charts accepts 1–12 label/value rows with nonnegative values and creates a horizontal bar chart. The resulting labels and bars are native editable text/shape layers, not a live data-linked chart. Tools → Make more sizes creates up to six separate single-page projects from the current page, using proportional contain scaling and centering. The original multipage project is preserved. Copies appear in Projects, and browser-storage warnings still apply. There is no semantic AI reflow.

Source: `creative-core.js`, `creative-tools.js`, `creative-tools.css`. Run `node build-creative.cjs` **after every other builder**, including `build-pages.cjs`. Tests: `node --test tests/*.test.cjs` (or name the four test files explicitly). Pixel tests verify preserved interior detail, transparent edges, adjustment behavior, chart validation, original asset IDs, and independent resize copies.

Canva Pro reference reviewed October 12, 2026: https://www.canva.com/pro/. OpenCanvas implements a subset of comparable workflows using original code. It does not include Canva's licensed stock library, AI generation or semantic image editing, animated/video export, social scheduling, or cloud collaboration/storage.

## Canvas drawing tools

Tools includes a floating canvas toolbar and sidebar controls for Select, Pen, Highlighter, Line, Arrow, Shapes, Sticky note, Text, and Table. Set ink color and stroke width in the sidebar. Highlighter strokes use 30% opacity and a wider nib. Hold Shift while drawing a line/arrow to snap its angle to 45-degree increments. With Tools open, V/P/H/L/A select the corresponding drawing mode; Escape returns to Select. The floating toolbar can be hidden and reopened. It switches to a horizontal strip on mobile.

Mouse, pen, and touch pointer events draw on a dedicated overlay. Completed strokes are cropped transparent PNG image layers at page resolution, so they remain movable, resizable, rotatable, undoable, and portable through project/PNG/PDF exports. They are not editable vector paths or pressure-sensitive brushes. Each stroke is limited to 5,000 sampled points. Page changes and canceled gestures discard unfinished strokes. Selection mode passes pointer input through to the existing editor.

Sticky notes create separate editable background and text layers. Tables create 2–8 rows and 2–6 columns of editable text/shape layers; they do not calculate formulas or keep a spreadsheet data model. Both insertions respect the 500-layer page limit and can be undone as a single action.

Source: `drawing-core.js`, `drawing-tools.js`, and `drawing-tools.css`. Run `node build-drawing.cjs` last, after `build-creative.cjs`. Full build order: Studio → Community → Create → Pages → Creative → Drawing. Run the five `tests/*.test.cjs` suites for 26 checks. Browser QA additionally covers drawing pen/marker/arrow strokes, saved alpha and opacity, note undo/redo, table insertion, Escape to selection, and the mobile toolbar.

## Community template attribution

Templates → Community contains two adapted, human-authored Openclipart designs published in 2014 and 2016. See `community-sources/PROVENANCE.json` for creator names, dates, original links, CC0 license evidence, and adaptation details. The original SVGs are retained alongside static, cleaned artwork and PNGs. No community SVG is executed by the app: the editor embeds PNG artwork and adds native editable text layers. This also works offline.

- Colorwave business card: adapted from **Card** by **istana** (July 13, 2014). Original curved artwork retained; text replaced with editable contact and business details.
- Golden award: adapted from **Certificate Of Award** by **Arvin61r58**, with border/background credited upstream to **Raker Tooth** (December 3, 2016). Original title, border, and ribbon remain grouped; recipient, role, date, and organization are editable. Works with the sample CSV in Bulk create.

Artwork license: **CC0 1.0**, https://creativecommons.org/publicdomain/zero/1.0/. Source licensing policy: https://openclipart.org/share. Attribution is displayed voluntarily in template cards and the Creator & license dialog; the community source ID survives editable project export/import and reload. Artistic authorship is based on the named creators and publication history, not an independent authorship audit. Decorative artwork is a single raster layer at the template's native canvas resolution. Individual ornamental shapes/colors cannot be edited, and enlarging it may soften detail; original SVGs remain available in the source package.

## Import from Canva and other design apps

Choose **Import** in the rail or **Create → Import from Canva**. Download a PDF Standard/Print, PNG, or JPG from Canva, then choose or drop the file here. WebP is also supported. One PDF or up to 30 images becomes a new project; prior work stays in Projects. PDF ranges accept `1, 3-5`; use Update preview after changing them. Review page thumbnails, then open the design. A project backup downloads by default because browser storage has limited capacity.

Each imported page is a single raster image layer. Appearance is preserved at a maximum 2400-pixel edge (1600 in compact mode), with PDF rendering capped at 2× points. Original Canva text/images/shapes are not separately editable; add editable OpenCanvas elements over the imported artwork. This is file import, not a Canva account connection, share-link importer, or submissions inbox. Animation, video, hyperlinks, editable PDF form controls, CMYK/bleed metadata and original physical print dimensions do not transfer. Encrypted or damaged PDFs produce a recoverable error. Import limits: 30 MB of source files, 30 pages, 50 million rendered pixels, 12 MB of encoded PNG layer data. Reduce page count or quality when needed. Files stay on-device.

Mozilla PDF.js `pdfjs-dist` 6.4.299 is pinned and bundled from the official npm registry. Main module, worker, fonts, CMaps, and WASM decoders are embedded in the standalone HTML; no CDN or import server is required. PDF scripting/XFA are not enabled. Third-party license notices are retained in `vendor/pdfjs/` and embedded in HTML. Upstream: https://github.com/mozilla/pdf.js; rendering API: https://mozilla.github.io/pdf.js/examples/index.html.

Importer source: `import-core.js`, `import-tools.js`, `import-tools.css`. Build with `node build-import.cjs` last. Full build order: Studio → Community → Create → Pages → Creative → Drawing → Import. Run `node --test tests/*.test.cjs` for all 29 checks. Browser QA covers multipage/rotated PDF rendering, selected-page ranges, corrupted/encrypted input, image sets, backups, and editable overlays.

## Curated community library

Templates → Explore community art & templates now offers 9 community templates (7 newly added), alongside 40 original designs: 49 templates total. Switch between Templates and Artwork, search, or filter the discovery trail by GitHub, Reddit, Pinterest, and Openclipart. Artwork includes six individually insertable Kenney icons and Hokusai's Great Wave; template text remains independently editable.

- GitHub: two adaptations of MIT BE Communication Lab's CC0 PowerPoint poster templates. Native OpenCanvas panels preserve the four-column and summary/four-figure layout structures; new copy and colors replace placeholders. Repository credits and template-only license are retained. Other repository documentation/gallery content is not relicensed as CC0.
- Reddit: three original OpenCanvas gaming flyers reuse Kenney's human-created Board Game Icons. Discovery post is linked; primary license evidence is the creator's site and creator-uploaded OpenGameArt package. SVG icons are centered, recolored, and rendered to PNG; the source files and license are retained.
- Pinterest: two original OpenCanvas art layouts use Katsushika Hokusai's public-domain Great Wave. Pinterest is a discovery link, not the licensed asset host. The actual image is downloaded from The Met Open Access API, object 36491, with `isPublicDomain: true`; its record and original image are retained.

This is a bundled curated collection, not an automatic scraper or a live Pinterest/Reddit/GitHub account connection. No third-party assets are fetched when a visitor browses or uses the library. Credits distinguish adapted human-authored layouts from original OpenCanvas layouts incorporating credited artwork. Every item records source, creator, license evidence, discovery link when relevant, and changes in `community-sources/PROVENANCE.json`.

Build the expanded gallery with `build-community-gallery.cjs` LAST, after the existing Studio → Community → Create → Pages → Creative → Drawing → Import order. `curate-community.cjs` maintains the collection definitions; `prepare-community-art.cjs` performs asset preparation and expects the installed sharp module. The new community checks validate all 9 templates, element bounds, unique layer IDs, portable image data, and source-credit retention. Browser checks cover source filtering, credit dialogs, template opening and artwork insertion.
# Business workspace

The Business rail button opens a local workspace with up to 200 campaigns, launch dates, channel and owner/reviewer notes, saved-design links, brand links, and manual Draft / In review / Approved / Published stages. Stages do not enforce approvals or notify anyone. Campaigns persist in browser storage. Missing designs remain visibly unavailable until their project files are opened on the same device.

Brand kits now support up to 100 palettes/font combinations with stable identifiers, management, and existing single-kit import/export. Business JSON backups include campaign records and kits (not design files). Import adds records with new identifiers and remaps imported kit references; it does not overwrite existing work. Storage failures are reported.

Insights imports a CSV with `campaign,impressions,clicks,spend,conversions,revenue`, up to 50 rows / 500 KB. It computes weighted combined CTR, CPC, and ROAS, rejects invalid numeric data, and uses a dash for zero denominators. Use one currency per report. Reports stay in memory until reload. Campaign links build HTTP(S) URLs with UTM tags, preserve other query parameters and fragments, and support copying.

This is not Canva Business service parity: no cloud-storage allowance, live collaboration, account permissions, connected ad accounts, automatic publishing, hosted short URLs, AI credits, proprietary media library, print discounts, or bundled Flourish subscription. Existing editor, licensed community assets, resizing, bulk creation, and static exports remain available.

Build `build-business.cjs` after all existing builders, including `build-community-gallery.cjs`. Run `node --test tests/*.test.cjs`. Business tests cover dates, campaign identifiers, unsafe URLs, weighted metrics, invalid reports, and stable kit identifiers. Browser checks cover campaign persistence, stage filtering, links, CSV imports, and backup import/export.

# Text studio and font combinations

Text now includes 12 original two-layer font combinations, searchable by name, wording, category, and font. Categories are Bold, Spooky, Playful, Handwritten, and Classic. Optional headline/subheading inputs personalize a combination before insertion; both layers remain separately editable and one Undo removes the insertion.

Bangers (Vernon Adams), Creepster (Sideshow / Font Diner), and Kalam (Indian Type Foundry) are bundled, unmodified, from Google Fonts under SIL OFL 1.1. Original files, metadata and licenses are in `vendor/fonts`; font data and license text are embedded in the downloadable HTML, with a license download in Text. Other font families use installed system fonts.

Text styling adds italics, line spacing, letter spacing, offset shadow, outline, hollow text, glow, effect color, and proportional effect strength. These properties survive project import/export and page changes and are painted into image/PDF exports. Save text style stores up to 30 single-layer styles in the browser’s Saved collection; it saves wording, font, colors and effects, not position or size. Existing design backups retain these properties independently of the Saved collection.

Build `build-type.cjs` last, after `build-business.cjs`. It embeds text validation before project loading, fonts before display, and text tools after the existing editor modules. Tests cover legacy defaults, unsafe styles, multipage round trips, spacing and personalized combinations. Browser QA covers search, customization, style saving, undo, persistence and PNG export.

# Marketing and entertainment niches

Added 24 original collections (12 per industry), each with an editable portrait flyer and a reusable two-layer title preset. Entertainment includes EDM, underground rave, house, hip hop, Latin dance, club nights, comedy, film, live bands, podcasts, theatre, and Halloween. Marketing includes product launches, retail promotions, grand openings, webinars, agencies, creators, newsletters, rebrands, pop-ups, ticket releases, portfolios, and community events.

The catalog now has 73 templates and 36 original text combinations, plus any browser-saved text styles. Templates and Text both search genre/use-case tags. Template discovery includes niche shortcuts, Marketing/Entertainment searches, and up to six recent searches stored locally; Enter or choosing a template records a search. Recent searches can be cleared. Templates use editable prompts for lineup, venue, dates, offer terms, disclosures, or links, rather than making claims about real events or offers.

Build `build-industry.cjs` last, after `build-type.cjs`. It adds the collections to both catalogs and specializes their four poster layouts. The industry tests verify all designs are editable, validate their geometry, test niche queries, and confirm custom titles do not mutate preset data. Browser checks cover search in both catalogs, recent searches after reload, title insertion/undo, and the full template gallery.


# Home and recent projects

The default landing page is now Home. The editor's Home button saves the current design before showing recent work. Cards display first-page thumbnails, dimensions, last-edited dates and page counts, and reopen the full editable project. Search matches project names and the template catalog; favorites persist locally, with recent/name sorting and pagination. Browser back/forward moves between Home and the editor. The #editor route opens the editor directly.

Quick creation supports social posts, presentations, flyers, posters, stories, custom sizes and imports. The Create and Templates dialogs remain accessible from Home, with six original featured templates as starting points. Home uses the existing local project store, including previous saved designs; it does not connect Canva accounts or add cloud synchronization.

Build `build-home.cjs` last, after `build-industry.cjs`. All 46 tests pass, including project sorting/filtering, stale favorites, and multipage thumbnail selection. Browser QA checks recent-design opening, editing and reload persistence, stars, search, quick creation, custom-size and import dialogs, and visible thumbnails.

# Right-click element actions

Right-click an element on the canvas or its Layers row, use the toolbar's three-dot button, or press Shift+F10 to open Element actions. The menu supports internal copy/paste across pages and projects in the same tab, copy/paste style, duplicate, delete, four stacking actions, six page alignments, lock/unlock, web/email links, alternative text, local comments with resolve/reopen, and up to 30 reusable single-element components. Menu arrow keys navigate; Escape closes it. On Mac use Command in place of Ctrl.

Copied elements receive fresh IDs, unlocked state and no copied comments. Style paste preserves the target's wording and geometry except text height, which adjusts to its typography. Locked elements resist canvas movement/resizing, inline text editing, arrow-key movement, deletion, layer reordering and inspector edits; page-wide transformations still apply. Unlock from the menu or inspector. All design edits support Undo. Components insert independent copies, not linked instances, and are browser-local.

Links, alternative text, locks and local comments persist through project saves and multipage import/export. Alternative text names layers for assistive tools. Links can be opened from their dialog but are not clickable in current raster/PDF exports. Comments do not notify other people. AI writing, automatic translation and timeline timing are explicitly unavailable, not simulated. Clipboard contents last only for this tab session.

Build `build-context.cjs` last, after `build-home.cjs`. It embeds metadata validation before initial project loading and adds guards to existing edit paths. All 51 tests pass. Browser QA covers canvas/layer right-click, Shift+F10, copy/paste/undo, style transfer, alignment, stacking, lock persistence and keyboard protection, links, alternative text, comments, component insertion and menu layout.
