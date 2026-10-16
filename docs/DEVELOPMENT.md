# Development notes

## Run and check

Use Node.js 24. There are no npm dependencies required to preview the shipped application or run its existing tests.

```sh
npm start
npm test
npm run check
```

`npm start` serves the editor locally on port 4173. `npm test` runs the existing checks using Node's test runner. `npm run check` checks standalone script syntax and required repository files. Stop the local server with Ctrl+C.

## Current source structure

- `dist/index.html`: application entry point, including the original editor core, bundled fonts and appended feature modules. It is still approximately 14 MB and requires the other files in `dist/`. **It is currently part of the source baseline; do not delete it to do a clean build.**
- `dist/artwork/`: individually cacheable, content-addressed catalog images loaded as visible cards need them.
- `dist/cutout/`: optional person-cutout worker, runtime/model parts and notices, fetched only when the user requests a cutout.
- `*-core.js`: portable logic and validation helpers.
- `*-tools.js`, `*-features.js`, and other named feature files: editor UI and interactions.
- `build-*.cjs`: incremental feature assemblers that update the standalone HTML.
- `tests/`: Node-based checks for document validation, templates, imports, styling, and other logic.
- `vendor/`, `community-sources/`: bundled assets and original attribution/license records.
- `docs/FEATURES.md`: accumulated implementation notes. Earlier sections describe earlier milestones; the top-level README lists the current feature counts and scope.

## Incremental rebuilding

The editor is not yet a conventional source-only build. Feature assemblers patch the retained `dist/index.html`. After changing a module, run its assembler and every later assembler in the following order so script dependencies remain correctly ordered:

1. `build-studio.cjs`
2. `build-community.cjs`
3. `build-create.cjs`
4. `build-pages.cjs`
5. `build-creative.cjs`
6. `build-drawing.cjs`
7. `build-import.cjs`
8. `build-community-gallery.cjs`
9. `build-business.cjs`
10. `build-type.cjs`
11. `build-industry.cjs`
12. `build-home.cjs`
13. `build-context.cjs`
14. `build-promo.cjs`
15. `build-plus.cjs`
16. `build-font-library.cjs`
17. `build-print.cjs`
18. `build-productivity.cjs`
19. `build-layout.cjs`
20. `build-svg.cjs`
21. `build-projects.cjs`

Run a script as `node build-context.cjs`, for example. Run `node build-cutout.cjs` when preparing optional cutout assets or a complete release; it validates and copies runtime/model parts into `dist/cutout`. `node scripts/build-library.cjs` runs that asset build, Promo and every later assembler, then checks the result. Keep original core edits in the retained HTML until source extraction is complete. Run all checks and browser-test affected flows after rebuilding. Recreating raw community artwork is a separate asset-preparation process; some asset preparation utilities expect `sharp`, but it is not needed to use the bundled files.

## Data and deployment

The application uses browser-local storage. Keep the same origin during development to keep seeing saved projects. Export project files before switching browser, host, port, or domain. The repo contains no personal saved designs or uploads from browser storage.

The existing hosted Site's `.openai` settings and internal Git history are deliberately excluded. This repository can be hosted as a static site by serving `dist/`. Configure a separate hosting destination explicitly; pushing to this repository should not silently overwrite the original hosted Site.

Campaign Collection sources: `promo-scenes.js` holds asset descriptions, assignments and layout metadata; `promo-data.js` holds campaigns and discovery filters; `promo-layouts.js` draws editable compositions; `promo-tools.js` handles browsing and photo replacement. `build-promo.cjs` copies credited artwork into content-addressed first-party files in `dist/artwork` and embeds an allowlisted manifest of URLs, sizes, MIME types and hashes. Keep source image geometry square where a collection expects square art.

`remix-core.js` defines 24 editable symbols, 24 themes, five art directions and responsive composition geometry. `remix-tools.js` adds the symbol picker and limits sidebar previews to 24 while the main gallery loads 30 at a time. Both are bundled by `build-promo.cjs`; regenerate the bundle after changes.

`people-collection.js` defines 20 independently composed People & Culture designs and concept deduplication. It is bundled after remix-core and before promo-tools. The first eight scenes are newly generated; the next twelve use distinct existing assets. Each has one native format, without auto-generated size clones. Gallery filters run before concept grouping so alternate formats remain discoverable. `tests/people.test.cjs` covers persistence, layer bounds, unique geometry and filter/group behavior.

`studio-collection.js` adds the 24 Studio Mix compositions; bundle it after people-collection and before promo-tools. New regression checks are in `tests/studio-collection.test.cjs`; the existing `tests/studio.test.cjs` continues covering studio features. Studio Mix has native portrait, square and landscape formats rather than automatic format clones.

Reference Remix is defined in reference-collection.js, after studio-collection.js in build-promo.cjs. It composes 20 layout families with 12 independently editable variations each. tests/reference-collection.test.cjs validates all 240 designs, real calendar dates, imagery metadata, independent IDs and dark-panel contrast.

City Collection is defined in `city-collection.js`, bundled after Reference Remix. Eight destinations have three native layouts each. City images are AI illustrations, not verified documentary photographs. `catalog-data.js` normalizes city/cities, skyline/skylines and hyphens for home and gallery queries; `home.js` ranks matching city designs first. After catalog changes, rebuild from `build-create.cjs` through `build-promo.cjs` in the order above. `tests/cities.test.cjs` checks all 24 designs, aliases and filters.

Studio Plus appends after the original feature modules. `studio-plus-core.js` contains pure helpers; storage, tools, media and connection UI have separate modules. `recovery-core.js` loads before storage; `cutout-core.js` and `studio-plus-cutout.js` load before media; `motion-upgrade-core.js` and `motion-upgrade.js` load after media. Re-run `build-plus.cjs` and every later builder after rebuilding an earlier feature. `cloud/server.mjs` uses Node 24 built-ins and SQLite; server tests use temporary/in-memory databases and mock external publishing/storage. Never package `cloud-data/`, database backups, service secrets or private uploads.

`discovery-collection.js` defines the Creative Crossovers designs and stable discovery ordering. It loads before `promo-tools.js`. Rebuild promo and all later stages after edits.

The personalization/print release adds three assemblers. `font-library-core.js` must load before first project validation, while the runtime uses a separate IndexedDB font library. Exporters await `fontLibraryReadyFor(document)` before measuring text. `print-core.js` defines physical PDF geometry and bounded raster export; `print-tools.js` renders previews and artwork using the existing document renderer. `productivity-core.js` validates editable QR metadata and extracts photo palettes; its QR generator is bundled under its upstream MIT license. The jsQR decoder under `vendor/testing/` is only used in tests. See `docs/PRODUCTIVITY.md` for user-facing limits. Rebuild these stages and every later stage after any earlier change.

Nightlife & Culture: wave-collection.js adds 48 designs and loads before promo-tools.js. The promo build embeds assets/lucide/rendered.json and writes credited generated JPEGs to individual first-party artwork files. See docs/NEW-WAVE.md. Rebuild promo and all later stages.

Flyer Lab: flyer-collection.js defines 36 designs and loads before promo-tools.js. Rebuild promo and all later stages. docs/ARTWORK.md is the central gallery credit link. Discovery samples candidates across the full catalog and tracks photo reuse to keep initial pages varied.

Art Directed: atelier-collection.js is bundled after Flyer Lab and before promo-tools.js. build-promo reads assets/atelier/PROVENANCE.json and produces the atelierAssets URL map and individual WebP files, preserving alpha. build-type embeds the five additional font families listed in vendor/fonts/ATELIER-SOURCES.json. build-creative now places its pure core before initial project loading so reversible Photo Studio settings survive local recovery. Rebuild from Create through every later stage after changes to these dependencies. Tests cover template portability, metadata, layout bounds, saved-template behavior, masonry placement and duotone persistence.

## Workspace and layout release

`signature-collection.js` loads after the Art directed collection and before `promo-tools.js`. It contains 20 native text/shape compositions across four formats, with stable IDs and no added raster assets. `tests/signature.test.cjs` checks distinct geometry, real document validation, layer bounds, fonts, useful event details, and the curved listening-label design. The subsequent Open Library expansion brings the executable catalog to 4,211 entries and the default gallery to 3,261 cards. Recalculate both figures when adding collections rather than counting generated color/size variants as independently art-directed compositions.

`layout-core.js` must be available before the first project validation. Its sanitized `layoutGuides`, `layoutView`, `backgroundGradient`, and shape `fillGradient` metadata survives page switching, project import/export, and local recovery. `build-layout.cjs` installs the renderer and page-metadata hooks; `layout-tools.js` supplies editor controls. Gradient metadata is tied to its base color so changing a solid fill cannot leave an obsolete gradient active. Tests cover metadata limits, gradient geometry, guide snapping, and renderer integration.

`home-core.js` validates folder names and workspace organization and defines Trash/restore transformations. `home.js` provides Home controls. `studio-plus-storage.js` persists projects, folders, membership, and Trash together in IndexedDB, restores the active project after feature initialization, and waits for its custom fonts. `build-projects.cjs` removes the old immediate startup save, preventing an untouched starter from replacing the saved workspace. Re-run Home, Studio Plus, and every subsequent assembler after changing those modules. Workspace backup version 3 includes organization, Trash, layouts, custom fonts and an allowlist of business/saved-item settings, with SHA-256 integrity checking. Restoration creates new IDs and remaps references instead of overwriting existing projects; version 1/2 files remain supported. Folder backup connections are opt-in and never included in exported files. See [Recovery](RECOVERY.md) for cross-store partial-restore behavior and excluded session media.

`svg-core.js` serializes native text and shapes, escaped metadata, supported links, gradients, and embedded image references. `svg-tools.js` captures a document snapshot, waits for fonts, renders photo adjustments/crops into bounded PNG images, and downloads a page or ZIP. Only validated embedded font data is copied into the SVG; remote font URLs and arbitrary stylesheet rules are not exported. Closing the dialog cancels outstanding image preparation. `build-svg.cjs` installs the final runtime module; run `build-projects.cjs` afterward to check and remove the legacy startup saver. `tests/svg.test.cjs` checks output structure, escaping, links, curves/effects, font embedding, and cancellation. SVG does not replace `.opencanvas` for preserving all editor metadata. PDF artwork remains raster RGB, with supported layer links added as PDF annotations; it does not provide selectable text, CMYK or tagged accessibility.

See [Workspace and layout](WORKSPACE-AND-LAYOUT.md) for controls, export limits, and browser-storage behavior.

## Artwork, recovery and media release

`artwork-core.js` accepts only catalog-manifest URLs and checks the size and SHA-256 of images before embedding them into a selected design. `artwork-tools.js` defers gallery painting until cards approach the viewport and prepares the whole design before replacing the active project. A failed image fetch or a changed/unsaved current project must not leave a partially opened template. Approximately 30 MB of artwork scripts have been replaced with individual files; this does not remove the approximately 14 MB HTML entry point. Test both template browsing and offline portability of an exported design after opening it online.

`recovery-core.js` validates version 3 backups and plans non-overwriting restoration. `studio-plus-storage.js` handles durable workspace writes and optional File System Access folder backups. The latter close and read back each new file before success, require user-selected folder access, and run only while the page is open. Tests cover failure paths and permission adapters; verify the actual folder picker separately in a supporting browser. Do not describe a local folder backup as an activated cloud service.

`cutout-core.js` and `studio-plus-cutout.js` apply a person mask through the optional local worker. Keep runtime/model licensing, part hashes and provenance when rebuilding `dist/cutout`. The first request downloads approximately 30 MB; unsupported browsers retain manual brushes. Test inference and cancellation in a real browser as well as pure compositing checks. See [Person cutouts](PERSON-CUTOUT.md).

`motion-upgrade-core.js` validates source-bound trims and selects supported recording formats. `motion-upgrade.js` adds per-scene trim controls and a session-local soundtrack with persisted start/volume settings. Preserve `motionAudio` in the Home draft signature and preserve trim metadata through validation. Tests exercise media adapters and cancellation, but real WebM/MP4 encoding depends on the browser; only offer formats reported as supported. Keep the distinction between saved settings and session-only media files. See [Motion scenes](MOTION.md).

The managed backend and encrypted off-site backup plan is documented in [Managed hosting](MANAGED-HOSTING.md). No Render service, R2 bucket, paid billing or production account has been activated. Provider restore verification remains an activation task after the owner's cost approval. The public editor stays static and the prepared backend uses explicit cloud saves with version-conflict protection, not continuous synchronization or real-time co-editing. The package remains `UNLICENSED` while the owner chooses a project-wide reuse license; existing third-party licenses remain in force.
