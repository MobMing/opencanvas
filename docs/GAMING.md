# Gaming collection

Twenty-four original compositions for gaming communities, creators, clubs, and events. These are individually arranged layouts, not repeated palette variations. Twenty use entirely editable native shapes; four use new, credited generated illustrations with separate editable titles and details. There are no downloaded game characters, platform logos, or missing-image placeholders.

| Design | Purpose and visual direction | Format |
| --- | --- | --- |
| Night Mode | Neon controller and expressive channel lettering | Landscape banner |
| Ranked Rivals | Opposing team crests and tournament registration | Portrait |
| Insert Coin | Original arcade cabinet and pixel invader | Square |
| The Final Four | Four-team bracket with a central final | Landscape |
| Stream Starting Soon | Circuit traces and an editable start time | Landscape |
| WASD Weekend | Oversized keyboard keys for a LAN meetup | Portrait |
| Neon Nights | Glowing controller and ring composition | Story |
| Checkmate Club | Chessboard and editable pawn pieces | Portrait |
| Roll for Adventure | Dice, map details, and tabletop invitation | Square |
| Respawn Collective | Original team crest and graphic wings | Square |
| Patch Notes | Numbered game-development update bulletin | Portrait |
| Pixel Picnic | Pixel characters and a playful landscape | Square |
| Boss Rush | Comic starburst, pixel opponent, and health bar | Portrait |
| Beat Your Best | Speedrun timer and personal-best graphic | Landscape |
| Squad Wanted | Recruitment roles and tryout details | Story |
| Cozy Quest | Warm illustrated window and controller | Square |
| This Week Live | Three-session stream timetable | Portrait |
| How Well Do You Game? | Gaming trivia with three player identities | Landscape |
| Board Game Social | Winding board path, dice, and player token | Portrait |
| Daily Challenge | Retro terminal and pixel maze | Square |
| After Dark / Game On | Large illuminated controller with headline in the image's dark space | Square |
| Arctic Squad | Original lynx mascot and team tryout invitation | Portrait |
| Next World | Cinematic portal and pilot beside a channel-premiere title | Landscape |
| Another Little Adventure | Cozy floating pixel arcade world and stream invitation | Story |

## Make a design yours

Preview a template before using it. Replace the sample channel name, event date, times, venue, team names, and links. All titles and useful event details are separate editable text layers. Native motifs such as controllers, crests, dice, and pixel characters are grouped so they can move together while remaining editable. You can ungroup them for individual color or shape changes.

The collection uses the font families already available in OpenCanvas. Font licenses remain in `vendor/fonts/`. Templates use portrait 1080 × 1350, square 1080 × 1080, landscape 1600 × 900, and story 1080 × 1920 formats. A landscape design is a starting point, not a guarantee of any platform's current upload size or safe area. Adapt it to the intended destination before publishing.

Stream screens, timers, game boards, health bars, schedules, and brackets are editable graphics. They do not run a game, count down automatically, connect to streaming software, or calculate live tournament results. The bracket provides four named starting teams and a final, ready for your own labels and scores.

## Implementation and validation

`gaming-collection.js` exposes `gamingTemplates` and `makeGamingDesign(template, assets = {})`. The asset map supplies `neon-controller`, `arctic-lynx`, `portal-pilot`, and `cozy-arcade` for the four illustration-led designs. Each square asset keeps its original aspect ratio. The source manifest and generation prompts are in `assets/gaming/PROVENANCE.json`. These are AI-generated illustrations, not documentary photographs, official game art, or licensed team identities.

The factory also supplies complete native fallback compositions if an asset is unavailable. Four additional optional illustration slots in the native collection accept validated embedded PNG, JPEG, WebP, or GIF data but have no shipped asset assigned. External URLs and SVG image data are not accepted. Any future asset assignment needs an accurate source record and updated imagery metadata.

`tests/gaming.test.cjs` checks twenty-four distinct geometries, four formats, broad gaming topics, real project validation and portable round trips, editable motif grouping, page bounds, useful copy, known fonts, safe optional-asset fallback, illustration provenance, and preserved image aspect ratios. Every shipped layout stays under 300 layers, leaving room for personal artwork and copy. Titles and supplied details are also reviewed with native font measurements and a rendered contact sheet.

Original OpenCanvas compositions by Mathew Minguel with development and layout assistance from OpenAI Codex. These designs contain no Canva template files, proprietary game artwork, or third-party team logos.

## Public gallery reference

Canva’s [Gaming posters](https://www.canva.com/posters/templates/gaming/) and [Gaming banners](https://www.canva.com/banners/templates/gaming/?continuation=100) informed the range of use cases: neon/controller designs, tournaments, retro arcade, channel art and chess. All compositions in this collection were independently made for OpenCanvas. See the [category audit](CATEGORY-AUDIT.md) for the wider comparison.
