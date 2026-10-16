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
- [ ] Extend automatic cutouts to pets, products and other non-person subjects
- [x] Add grouped elements and reusable layout copies
- [ ] Add synchronized component instances
- [ ] Explore editable vector imports and accessible/vector PDF exports
- [x] Add timed page scenes, video overlays, soundtrack and WebM export
- [x] Add scene video trimming, soundtrack start/volume and MP4 when the browser supports it
- [ ] Add waveform editing, multiple audio tracks and automatic captions

## Connected services

A private workspace server and managed Render hosting plan with encrypted Cloudflare R2 database backups are prepared. Production services, billing, accounts and credentials have not been activated. The owner must review costs before activation. See the [managed hosting plan](docs/MANAGED-HOSTING.md) and [connection guide](docs/CONNECTED-SETUP.md). Cloud save/open is explicit; this is not continuous synchronization or live collaborative editing.

- [x] Optional workspace accounts and explicit cloud save/open
- [x] Prepare verified server database snapshots and optional encrypted off-site backup/restore tooling
- [ ] Approve costs, activate managed hosting/backups and complete a real provider restore drill
- [ ] Add production account recovery, email verification and stronger account controls
- [x] Shared project copies, permissions, comments and version-specific reviews
- [ ] Live collaborative editing and notifications outside the workspace panel
- [ ] Optional AI writing and translation with transparent provider and cost controls
- [x] Configurable Bluesky publishing queue
- [ ] Additional social networks and analytics
- [ ] Complete custom-domain ownership verification and project migration guidance

Keep unavailable features visibly distinct from working tools. Preserve existing projects and third-party notices while iterating.
