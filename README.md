# OpenCanvas

**An independent, subscription-free design editor. Actively being built.**

Created and directed by **Mathew Minguel**, with development assistance from **OpenAI Codex**. OpenCanvas is an ongoing project, not a finished replacement for every commercial design tool. It is independently implemented and is not affiliated with Canva.

![OpenCanvas Home with recent project previews](docs/images/home.png)

## Open the app

**[Launch OpenCanvas in your browser](https://mobming.github.io/opencanvas/)** — no installation or local server required.

Projects are saved in the browser where you create them. To move an existing design from another OpenCanvas address, export its `.opencanvas` project file there, then import it at the new address.

## Run on your own computer (optional)

The `127.0.0.1` address below means **your own computer**, not the public website. It only works while the local server is running. For a normal online visit, use the **Launch OpenCanvas** link above.

Install Node.js 24 or later, download or clone this repository, open a terminal in its folder, and run:

```sh
node server.mjs
```

Keep that terminal open, then open **http://127.0.0.1:4173/**. On Windows, you can instead double-click `Start-OpenCanvas.cmd` in the downloaded project folder. If you see "connection refused," start the server first and reload the page. Closing the server or restarting your computer stops the local app; run it again to reopen it.

The application ships ready to run in `dist/`, including `index.html`, individual artwork files and the optional cutout runtime; no dependency installation or build step is needed. Keep the complete `dist/` folder together when hosting. A recent desktop browser is recommended.

The [original hosted preview](https://opencanvas-studio.cocoa-lotus-4165.chatgpt.site/) may require access from its owner. The custom `www.opencanvas.com` address is not an active project address yet.

## Art-directed templates and editing

The [Open Library expansion](docs/LIBRARY-EXPANSION.md) adds **104 templates in every creative category**, another 104 Community compositions, and **60 Liquid Signal combinations**. It includes 106 credited outside photos and artworks, four new chrome/glass illustrations, and editable subject-specific information. Pets, Crafts, Photography and Technology now have more than 100 choices each. Open Templates, select a category, or choose **Explore Signal Lab**.

The new [Signature collection](docs/SIGNATURE.md) adds 20 individually composed designs for music, nightlife, markets, beauty, exhibitions, and social promotions. Every layer is editable text or native shapes; this collection adds no generated imagery. It joins 24 Art directed designs and 36 rebuilt Flyer Lab designs, with large previews, saved template bookmarks, and reversible duotone photo editing. See the [Art directed guide](docs/ART-DIRECTED.md) and [Canva feature comparison](docs/CANVA-COMPARISON.md).

## Organize, align, and export

Home now has project folders and recoverable Trash. The editor restores your last saved project after loading the local workspace. **Tools** includes rulers, draggable guides, and editable page/shape gradients. **Export → SVG** keeps supported text and shapes as vectors, with embedded images and optional fonts. Read the [workspace and layout guide](docs/WORKSPACE-AND-LAYOUT.md) for controls and limits.

## Import designs from Canva and other tools

**Import** now opens exported PowerPoint (`.pptx`) and SVG files with supported text, shapes, and photos as separate editable layers. Review previews, layer counts, and conversion notes before opening. PDF and PNG/JPG/WebP imports preserve each page as flat artwork. Canva share links and native projects are not imported directly; download an available export from Canva first. [Formats, workflow, and limits](docs/IMPORTING-DESIGNS.md).

## More tools for your own designs

Curved editable text, your own uploaded fonts, print PDFs with physical sizes and crop marks, locally generated QR codes, and photo color palettes are now part of the editor. Open **Text**, **Tools**, **Brand**, or **Export** to use them. Read the [tool guide](docs/PRODUCTIVITY.md) for controls, portable font files, and print limits.

## Template discovery

The gallery, editor sidebar and Home recommendations mix collections while spacing out repeated imagery, layouts and topics. Search and filters retain their scope, and loading more cards keeps the existing order stable. Creative Crossovers adds 32 editable designs in eight layout families using the existing credited AI artwork and original shapes.

Template artwork now loads as individual first-party image files when cards approach the screen, replacing roughly 30 MB of upfront artwork scripts. Opening a template verifies and embeds its images so saved projects remain portable. The retained application HTML is still approximately 14 MB; further loading and build improvements remain on the roadmap.

## Studio Plus

Open **Studio Plus** on Home or in the editor for verified workspace backups, optional automatic folder backups, grouped layers, reusable layouts, campaign creation, adaptive resizing and design checks. Photo adds local person cutouts, click-selected pets/products, sampled-pixel retouching and background replacement. Motion adds a scrub timeline, scene splitting/reordering, eight audio clips with waveforms and fades, editable SRT/VTT captions, and a saved local media library. [Tool details and limits](docs/STUDIO-PLUS.md).

The optional workspace backend supports explicit cloud project copies, shared access, comments, version-specific approvals and scheduled Bluesky posts. **Edit together** adds live shared editing, presence and cursors after joining a workspace project. Independent field changes merge; overlapping changes pause for conflict review. The managed Render hosting and encrypted Cloudflare R2 backup plan is prepared, **not activated**. Hosting, billing and account setup still require the owner’s cost review. GitHub Pages alone cannot run these connected services. [Managed setup and estimated costs](docs/MANAGED-HOSTING.md), [live collaboration](docs/LIVE-COLLABORATION.md).

## What works today

- Home with recent projects, previews, favorites, folders, recoverable Trash, sorting, and search.
- Text, shapes, uploaded images, editable layers, undo/redo, snapping, and alignment.
- 4,211 template entries, including 2,704 Open Library compositions, 60 Signal Lab designs, 24 Gaming Studio designs and the earlier collections. Default browsing shows 3,261 cards, grouping older style and size variations; enable Show all variations to see every entry. Counts represent editable combinations, not unique source photos. [Coverage and artwork details](docs/LIBRARY-EXPANSION.md).
- People-focused campaign layouts with documented artwork origins, format/style filters, and replaceable photo layers. See [template sources and research](docs/TEMPLATE-SOURCES.md).
- 46 font combinations, eight bundled open font families, custom font uploads, curved text, text effects, and saved styles.
- Multipage designs, local presentations, and PNG, JPG, SVG, raster PDF with supported clickable links, and editable project exports.
- Page rulers, manual guides with snapping, and two- or three-color linear/radial gradients for pages and supported shapes.
- Local PPTX/SVG import with supported editable layers, plus PDF/image imports preserved as flat artwork with editable overlays.
- Drawing tools, charts, image adjustments, local person and click-selected subject cutouts, clone-and-blend retouching, background replacement, resizing, and CSV bulk creation.
- Motion timeline with scene trims/splits, mixed source audio and up to eight soundtrack clips, editable captions, locally saved media, WebM and browser-supported MP4 export.
- Brand kits and a local business workspace for campaigns, review stages, and imported ad reports.
- QR codes with editable content and colors, plus photo-derived palettes that can be saved as Brand Kits.
- Right-click copy/paste, style transfer, layer order, page alignment, locking, links, descriptions, local comments, and reusable single-element components.

![Right-click element actions](docs/images/context-menu.png)

## Important limits

Your designs are saved **in your browser on this device**. Download `.opencanvas` files or a verified workspace backup from Studio Plus → Recovery. Optional folder backups create independent dated files while the editor is open; choosing a folder does not create or verify an external cloud-sync service. Different browsers, devices, ports, and website addresses have separate storage; moving to another address does not automatically move your projects. [Recovery guide](docs/RECOVERY.md).

The public website is a static browser application. Connected accounts, live shared projects, online comments and scheduled Bluesky publishing require the separately configured workspace server. Live projects are limited to 10 MiB of canonical JSON, with default limits of 16 live streams overall, eight per project and four per account. Same-field concurrent typing is conflict-checked rather than character-by-character merged. Connected ad accounts, AI writing and automatic translation are not included. [Live collaboration limits](docs/LIVE-COLLABORATION.md).

Motion supports 1–30 second scenes, up to eight audio clips, imported SRT/VTT or manually entered captions, and real-time exports up to three minutes. MP4 appears only when the browser reports a supported encoder. Saved video/audio files survive reloads in the same browser and website address, but their original bytes are **not included in project exports, workspace backups, cloud copies or live sharing**. Keep originals separately and relink on another device. Automatic transcription is not included. [Motion guide](docs/MOTION.md).

Person cutout downloads approximately 30 MB on demand; click-selected subject cutout downloads approximately 44 MB, sharing part of the runtime. Both run locally without uploading photos. Pets/products are supported through a selected point, but fine details, transparent objects and difficult lighting may need manual cleanup. Clone & blend copies nearby pixels; it does not generate hidden detail. Backgrounds are flattened when applied. Browser support and a 1600-pixel working-size limit apply. [Photo Lab guide](docs/PHOTO-LAB.md).

SVG export includes supported layer links and descriptions; text and shape editing depends on the receiving application, and photos, drawings, and library artwork remain embedded images. PDF exports now include supported clickable layer links, but the artwork remains raster RGB: selectable/vector text, CMYK output and tagged accessibility are not included. PNG/JPG exports have no clickable links. Imported PDF/image artwork remains flat, with editable overlays. PPTX/SVG imports reconstruct supported layers; fonts and complex layouts may change, and outlined text stays artwork. Keep `.opencanvas` files for full editing and portable project metadata. Saved components insert independent copies, not synchronized instances.

Folders and Trash are local to this browser. Trashed projects remain stored and can be restored; there is no automatic deletion. Workspace backups include their folder assignments, Trash, reusable layouts, custom fonts, brands, campaign plans, text styles and saved-template bookmarks. Restore adds copies and checks new backup files for accidental damage before importing. Local recovery history and the original video/audio files in the separate media library are excluded. Clearing browser data can remove both projects and local media.

## Development

```sh
npm test
npm run check
```

These commands need no third-party packages. The suite covers document validation, template artwork loading, recovery, photo processing, media storage, motion, live merge/stream behavior, exports and the optional server. Browser tests are also needed for real media encoders, file permissions, model inference and collaboration rendering. See [development notes](docs/DEVELOPMENT.md) for source layout and the order for rebuilding feature modules.

The standalone HTML currently also contains the original editor core. Separating that core from the generated bundle is on the [roadmap](ROADMAP.md).

## Credits and reuse

See [CREDITS.md](CREDITS.md) for project credits and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for asset and dependency notices. Original third-party licenses and source records are included.

**A project-wide reuse license has not yet been selected.** This publication does not replace the licenses of included third-party material. See [RIGHTS.md](RIGHTS.md). Contributions are welcome as discussion and proposals while the maintainer chooses a contribution and licensing policy.

## Still in progress

This repository is the starting point for continued development, not a final release. Use [ROADMAP.md](ROADMAP.md) to see the next areas of work and [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes. Please use made-up sample content in public issue reports rather than uploading private designs or client information.

The Design Combinations pack adds 120 theme/style combinations and 24 original editable symbols. Browse with the Collection and Layout filters; find the symbols under Elements. These are original compositions inspired by broad design directions, with references documented in [design research](docs/DESIGN-COMBINATIONS.md). Existing photo assets are reused; no new photo shoots or downloaded Pinterest graphics are claimed.


### Nightlife & Culture

48 new editable designs, 12 layout families, eight fresh AI-generated images and six credited Lucide graphics. Browse the new collection or discover it mixed into the full library. [Artwork, research and source notes](docs/NEW-WAVE.md).

### Flyer Lab

36 new layouts use 34 different existing artwork assets across 27 photo-led designs and nine graphic-only designs. Template cards omit repeated imagery badges, with origins recorded in [artwork credits](docs/ARTWORK.md). Discovery now spaces repeated photos across the full library. [Collection details](docs/FLYER-LAB.md).


## Gaming and category discovery

[Gaming Studio](docs/GAMING.md) adds 24 distinct compositions, from neon controllers and esports crests to stream schedules and tournament brackets. [Everyday Stories](docs/CATEGORY-COLLECTION.md) adds 26 editable designs across all 25 topics. The Gaming tab now has poster, banner/stream-screen and social sections; every category has relevant search shortcuts. Repeated Reference Remix palettes are grouped by default, with **Show all variations** and specific searches preserving access to them. See the [full category audit](docs/CATEGORY-AUDIT.md) for coverage and remaining gaps.
