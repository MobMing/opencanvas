# OpenCanvas roadmap

Maintained by Mathew Minguel. These are proposed directions, not promises or release dates.

## Current baseline

- [x] Local design editor and editable project backups
- [x] Verified workspace backups with fonts/settings and optional local folder backups
- [x] Templates, community asset credits, and industry collections
- [x] Lazy loading of individual template images, embedded when opening a design
- [x] Home and recent project discovery
- [x] Local project folders, recoverable Trash, and last-project restoration
- [x] Multipage editing and PDF/image import
- [x] Text combinations and drawing tools
- [x] Curved editable text and portable custom fonts
- [x] Print PDF sizes, bleed, crop marks, preview guides and supported clickable links
- [x] Local QR generation and photo palette extraction
- [x] Rulers, manual guides, guide snapping, and page/shape gradients
- [x] SVG export with vector text/shapes and embedded image layers
- [x] Brand kits, CSV bulk creation, and local business tools
- [x] Right-click element actions

## Next foundations

- [ ] Choose the project-wide reuse license and contribution policy
- [ ] Extract the editor core from the standalone HTML into maintained source modules
- [ ] Reduce the remaining approximately 14 MB application HTML and expand loading performance checks
- [ ] Make a deterministic build from source and pinned assets
- [ ] Add browser regression coverage for saving, imports, locking, and exports
- [ ] Improve keyboard and screen-reader workflows across the editor
- [ ] Improve responsive layouts and touch interactions
- [x] Add project-storage usage and recovery tools

## Design and media

- [ ] Expand original templates and verified community collections
- [x] Add 20 distinct Signature compositions with editable type and native shapes
- [x] Add photo framing and manual cutout refinement
- [x] Add automatic on-device person cutouts with manual edge refinement
- [x] Add click-selected local cutouts for pets, products and other subjects
- [x] Add non-generative clone-and-blend retouching and previewable background replacement
- [ ] Add multi-point subject refinement and improve difficult transparent/fine-detail cutouts
- [x] Add grouped elements and reusable layout copies
- [ ] Add synchronized component instances
- [ ] Explore editable vector imports and accessible/vector PDF exports
- [x] Add timed page scenes, video overlays, soundtrack and WebM export
- [x] Add scene video trimming, soundtrack start/volume and MP4 when the browser supports it
- [x] Add a scrub timeline, scene splitting/reordering and timeline undo/redo
- [x] Add up to eight audio clips with real waveforms, placement, trims, volume and fades
- [x] Add imported SRT/VTT and manual editable captions, burned into video exports
- [x] Save original media locally across reloads with explicit relinking and download controls
- [ ] Add automatic speech transcription and portable media-inclusive backups/cloud storage

## Connected services

A private workspace server and managed Render hosting plan with encrypted Cloudflare R2 database backups are prepared. Production services, billing, accounts and credentials have not been activated. The owner must review costs before activation. See the [managed hosting plan](docs/MANAGED-HOSTING.md) and [connection guide](docs/CONNECTED-SETUP.md). Ordinary cloud save/open is explicit; changes are shared automatically only after joining an **Edit together** session. Live merge/presence/cursors are implemented for small invited teams, with 10 MiB documents and bounded connections. Original local video/audio files are excluded from cloud copies and live sharing.

- [x] Optional workspace accounts and explicit cloud save/open
- [x] Prepare verified server database snapshots and optional encrypted off-site backup/restore tooling
- [ ] Approve costs, activate managed hosting/backups and complete a real provider restore drill
- [ ] Add production account recovery, email verification and stronger account controls
- [x] Shared project copies, permissions, comments and version-specific reviews
- [x] Optional live shared editing, teammate presence/cursors and independent-field merging
- [ ] Character-by-character concurrent text merging and notifications outside the workspace
- [ ] Validate live streaming/reconnection through the activated hosting provider
- [ ] Optional AI writing and translation with transparent provider and cost controls
- [x] Configurable Bluesky publishing queue
- [ ] Additional social networks and analytics
- [ ] Complete custom-domain ownership verification and project migration guidance

Keep unavailable features visibly distinct from working tools. Preserve existing projects and third-party notices while iterating.
