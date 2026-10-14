# Canva comparison and design priorities

**Release update, October 14, 2026:** OpenCanvas now adds curved text, local custom-font management, print PDF sizes/bleed/crop marks, QR codes, and photo palette extraction. The [new tool guide](PRODUCTIVITY.md) records how these work and their limits. The table below remains the historical comparison; it does not represent the status after these additions. This release is not the result of a completed exhaustive audit of every Canva screen.

Reviewed October 14, 2026. This audit compares Canva's public galleries and product/help pages with OpenCanvas's implementation at commit `3d1aa91`. It records the baseline before the next redesign, so proposed work below is not a claim that it has shipped. New releases should report their changes separately.

The aim is a useful independent design editor with strong original templates. This is a focused audit, not an inspection of every Canva template, every account-specific menu, or Canva's private implementation. Public pages and the supplied screenshots were used as references; no Canva template files, proprietary code, or paid artwork were imported.

## What the visual comparison shows

The most visible gap is composition quality, not the number of template entries. The supplied OpenCanvas screenshot repeats a small inset photo, a heavy uppercase heading, a pale panel, and a bottom information line. Changing the subject, title, or palette often leaves that same visual structure intact.

The supplied Canva screenshot varies the relationship between the type, imagery, and page itself: a person overlaps large lettering, a title becomes nearly the whole page, a photograph fills the background, tiny editorial details balance a large visual, and other cards use expressive lettering without a photograph. These are observations from the screenshots, not claims about Canva's internal design system.

Canva's public [music gallery](https://www.canva.com/flyers/templates/music/), [party gallery](https://www.canva.com/flyers/templates/party/), and [event gallery](https://www.canva.com/flyers/templates/event/) also expose a much wider range of directions: neon/cosmic nightlife, monochrome photographic music posters, grunge, retro illustration, art exhibitions, market promotions, and seasonal invitations. A useful OpenCanvas redesign needs distinct compositions for these purposes, rather than a single formula with new labels.

| Design issue in the baseline | Direction for original OpenCanvas work | Visual check |
| --- | --- | --- |
| Many subjects sit inside the same rectangular photo window. | Use full-page photographs, isolated transparent subjects, edge crops, overlapping collages, and occasional small documentary images. | A contact sheet should contain clearly different image silhouettes. |
| Headlines use a narrow range of familiar type treatments. | Add genuinely condensed display type, expressive script pairings, oversized editorial titles, restrained serif work, and small technical labels. | The headline shapes should differ even when thumbnails are blurred. |
| Decorations often look like generic circles, borders, or repeated symbols. | Give each concept its own visual material: grain, tape, halftone, a record sleeve, botanical silhouettes, a receipt, or a modular event grid. | Remove any detail that does not reinforce the event or brand. |
| Photos and typography rarely interact. | Design deliberate foreground/background layers and image-safe title zones. | Faces remain readable; overlap is intentional rather than accidental. |
| Too many cards share the same density. | Mix spacious editorial work with dense festival lineups and bold single-message promotions. | Adjacent designs should not all have the same title/photo/footer proportions. |
| Many changes are just a new color scheme. | Vary hierarchy, alignment, scale, composition, texture, image treatment, and format before generating palette variants. | Count composition families separately from color/size variants. |
| Very small footer text fills space without helping the user. | Include useful editable event fields with realistic hierarchy: date, time, venue, lineup, access details, and call to action. | Check the exported design at phone size and at its intended print size. |
| Gallery cards require a commitment before closer inspection. | Provide a large preview with a clear Use template action, favorites, and related options. | Browsing should not replace the user's current canvas unexpectedly. |

## Functional comparison at the baseline

“Present” means an OpenCanvas implementation exists. It does not mean identical behavior, scale, visual quality, or reliability to Canva. Source files and local documentation describe the actual limits.

| Workflow | OpenCanvas baseline | Next gap or qualification | Canva reference |
| --- | --- | --- | --- |
| Create a design and find templates | Present: format presets, custom size, topic/search/style/format/collection filters, stable mixed recommendations. See `create-hub.js`, `catalog-data.js`, `promo-tools.js`. | Presets for websites, sheets, code, and some videos are visual mockups, not complete applications. Better preview and template favorites are still needed. | [Templates](https://www.canva.com/templates/) and the public flyer galleries above. |
| Editable text and layout | Present: text boxes, fonts, tracking, line height, italic, shadow, outline, hollow and glow effects; text/shape layers remain editable. See `type-core.js`, `type-tools.js`. | Curved/bent text is absent. Font variety and editorial typography need improvement. | [Curved text](https://www.canva.com/features/curved-text/). |
| Photo adjustment and framing | Present: brightness, contrast, saturation, flip, circle/rounded/arch frames; zoom, pan and replacement in a fixed frame. See `creative-core.js`, `creative-tools.js`, `studio-plus-core.js`. | True two-color duotone, perspective correction, selective foreground/background adjustments and semantic object editing are absent. Existing adjustments are applied to a raster layer. | [Image settings](https://www.canva.com/help/image-settings/) and [image color effects](https://www.canva.com/features/change-color-of-image/). |
| Subject cutouts | Present: erase/restore brush, edge-connected color removal, edge softening. | This is manual/color-based work. It does not understand hair, people, or objects automatically. | [Photo editor](https://www.canva.com/photo-editor/). |
| Layers and reuse | Present: ordering, locking, grouping, alignment, snapping, duplicate/delete, reusable independent layouts/components. | No linked component instances or full vector-path editing. Saved copies do not update one another. | [Page guides and layer-related tools](https://www.canva.com/help/margins-bleed-crop-marks/). |
| Brand consistency | Present: saved local palettes, heading/body fonts, apply-brand, import/export kits. See `studio-features.js`. | Uploaded corporate-font management, shared brand libraries, brand controls and organization policy are absent. | [Brand Kits](https://www.canva.com/en_gb/help/brand-kit/). |
| Bulk designs | Present: CSV text substitution, preview, PNG ZIP and editable-project output. See `studio-features.js`. | It is a bounded local CSV workflow, not connected spreadsheet/CRM data autofill. | [Bulk Create](https://www.canva.com/help/bulk-create/). |
| Resizing and campaigns | Present: proportional copies, group-aware adaptive resizing, event information reused across four formats. See `studio-plus-core.js`. | Layout adaptation is geometric, not semantic; review each result. | [Magic Resize](https://www.canva.com/features/magic-resize/). |
| Importing a Canva design | Present: exported PDF or image imports, with editable OpenCanvas overlays. See `import-core.js`, `import-tools.js`. | No native Canva account/share-link import, original editable layers, animations, or linked media transfer. The imported page is flat artwork. | [Canva PDF editor](https://www.canva.com/pdf-editor/). |
| Downloading static designs | Present: PNG/JPG, transparent PNG, rasterized multipage PDF, editable `.opencanvas` files. | Selectable/vector PDF text, CMYK print output, print bleed/crop marks and clickable PDF links are not included. | [Margins, bleed and crop marks](https://www.canva.com/help/margins-bleed-crop-marks/). |
| Presentations and motion | Present: multipage editor, local presentation mode, scene transitions, local video/soundtrack and WebM export. | No MP4 export, timeline trimming, audio mixing, captions, recording studio, polls or PowerPoint export. Uploaded motion media must be reselected after reload. See [Studio Plus](STUDIO-PLUS.md). | [Video editor](https://www.canva.com/video-editor/). |
| Projects and recovery | Present: browser-local projects, project favorites, recovery versions and workspace backup files. | Local browser storage is not an off-device backup or automatic account sync. | [Canva collaboration](https://www.canva.com/en_au/help/collaborate-with-anyone/). |
| Team review and shared work | Optional server implementation: permissions, shared copies, comments, version-bound approvals and stale-save conflict protection. | Not active on GitHub Pages by itself. No simultaneous live cursors or automatic merging. See [connected setup](CONNECTED-SETUP.md). | [Sharing and collaboration](https://www.canva.com/en_au/help/collaborate-with-anyone/). |
| Scheduled social publishing | Optional server implementation for one configured Bluesky account. | No configured production service, Instagram/Facebook/TikTok integrations, cross-platform analytics, or multi-account publishing. | [Content Planner](https://www.canva.com/help/content-planner/). |
| AI writing and semantic image/video tools | Not included in the app. Some bundled artwork was generated during development and is documented in [artwork credits](ARTWORK.md). | Writing, translation, automatic subject separation, object editing and generative video need separate models, runtime resources, service setup and operating costs. | [AI photo editing](https://www.canva.com/ai-photo-editor/) and [feature directory](https://www.canva.com/features/). |
| Apps, professional print, enterprise functions | Not implemented as a platform. | No third-party app marketplace, print fulfillment, enterprise SSO, billing system or licensed commercial-stock catalog. Adding menu labels would not implement these services. | [Feature directory](https://www.canva.com/features/) and [content partnerships](https://www.canva.com/partners/content/). |

The implementation evidence for this comparison is `README.md`, `type-core.js`, `creative-core.js`, `create-hub.js`, `promo-tools.js`, `studio-features.js`, `studio-plus-core.js`, [Studio Plus](STUDIO-PLUS.md), and [connected setup](CONNECTED-SETUP.md). Older sections of `FEATURES.md` describe historical releases and should not be treated as a current total feature count.

## Where Canva's variety comes from

Canva describes a [Creators program](https://www.canva.com/help/canva-creators-program/) with template designers, photographers, illustrators and other specialists, a submission-review process, and royalties tied to content use. This is evidence of a continuing contributor and curation process, not just a large permutation generator.

Its [content-partnership page](https://www.canva.com/partners/content/) identifies library relationships involving Monotype fonts, Getty imagery and Warner Music tracks, alongside educational and cultural collaborations such as NASA, Balarinji and Awesome Black. The page does not publish a complete current partner-by-partner template inventory or offer a reusable feed for another editor. These relationships should not be described as assets already available to OpenCanvas.

For OpenCanvas, a comparable supply process would accept original contributor layouts, record the creator and reuse permission for each asset, preserve those credits, review the finished composition, and maintain a small featured selection. An external inspiration link is not itself a reusable artwork file. Existing licensed community assets and original work can be expanded without claiming access to Canva's catalog.

## Priorities that directly address the screenshot gap

1. Rebuild selected lead concepts with distinct art direction before multiplying them. Include a full-bleed nightlife poster, cutout artist cover, grainy festival bill, elegant portrait editorial, chrome/gradient exhibition, retro script mark, illustrated seasonal invite, photographic market promotion, minimalist announcement, and mixed-media collage.
2. Improve the reusable design vocabulary: more appropriate display fonts, precise photo placement, transparent foreground assets, editable text treatments, and varied visual materials. A new font alone will not repair a weak hierarchy.
3. Make discovery safer and more useful: large preview, explicit Use template, saved templates, related designs, good mobile spacing, and stable ordering while loading more.
4. Add small complete editor workflows that make those designs easier to customize, starting with the most consequential local gaps. Curved type and duotone treatments can run locally; cloud collaboration and generative editing are separate projects.
5. Evaluate a contact sheet of genuinely different compositions and several actual exports. Include narrow-screen gallery review, long user text, image replacement, project export/import, and undo. Do not use the number of color permutations as evidence of design quality.

This comparison is a backlog and design brief. It does not claim that OpenCanvas has matched Canva's full product or that every existing template has been regenerated. Each release should state the specific collections, interactions and rendering capabilities that were actually changed and tested.

## Photo Studio work following this audit

The accompanying source update adds seven duotone looks, custom shadow and highlight colors, and a blend-intensity slider to the existing Photo Studio. Choose a photo, open Photo Studio, select a look, and Apply. Reopening the tool restores the original source and saved settings; Original / reset clears the adjustments. Transparency is preserved. The normal editor Undo restores the prior image.

The finished PNG remains the image used for rendering and export. An additional original source and validated settings are kept inside the editable project, so project files and browser storage can grow. Processing remains limited to 1600 pixels. Editing the same image through a different tool starts a new Photo Studio baseline when its pixels change; it does not reapply an obsolete recipe to a replacement image. This is local image processing, not AI image editing or automatic subject segmentation.

`tests/duotone.test.cjs` covers actual pixel mapping, partial intensity, alpha preservation, settings validation, original-source persistence through project import/export, selected-page metadata, replaced-image handling, and control reset. The creative builder places the validation helpers before the first local-project load so the retained original also survives storage fallback and reload.
