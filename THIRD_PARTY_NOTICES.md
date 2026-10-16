# Third-party notices

Keep this file, the source records, and the original license files when redistributing material under their applicable terms. This overview does not replace those terms.

| Material | Credit | Included source of terms and provenance |
| --- | --- | --- |
| QR Code Generator 2.0.4 | Kazuhiko Arase | `vendor/qrcode/LICENSE` (MIT) and `vendor/qrcode/SOURCES.json`; generator and UTF-8 encoder bundled unmodified |
| jsQR, independent QR decoder used by tests | Cosmo Wolfe and contributors | `vendor/testing/jsQR-LICENSE` (Apache-2.0) and `vendor/qrcode/SOURCES.json`; not included in the browser application |
| PDF.js and bundled rendering assets | Mozilla and upstream contributors | `vendor/pdfjs/LICENSE` and all other `vendor/pdfjs/*LICENSE*` files; notices are also embedded in `dist/index.html` |
| Bangers | Vernon Adams | `vendor/fonts/bangers-OFL.txt` and `bangers-METADATA.pb` |
| Creepster | Sideshow / Font Diner | `vendor/fonts/creepster-OFL.txt` and `creepster-METADATA.pb` |
| Kalam | Indian Type Foundry | `vendor/fonts/kalam-OFL.txt` and `kalam-METADATA.pb` |
| Anton | The Anton Project Authors | `vendor/fonts/anton-OFL.txt` |
| Bebas Neue | Dharma Type | `vendor/fonts/bebasneue-OFL.txt` |
| DM Sans | The DM Sans Project Authors | `vendor/fonts/dmsans-OFL.txt` |
| Cormorant Garamond | The Cormorant Project Authors | `vendor/fonts/cormorantgaramond-OFL.txt` |
| Caveat | The Caveat Project Authors | `vendor/fonts/caveat-OFL.txt` |
| Card / Colorwave business card | istana, via Openclipart | `community-sources/PROVENANCE.json`, record `community-card`; CC0 evidence and source link retained |
| Certificate of Award / Golden award | Arvin61r58; border/background by Raker Tooth | `community-sources/PROVENANCE.json`, record `community-award`; CC0 evidence and source link retained |
| Research poster layouts | MIT Biological Engineering Communication Lab | `community-sources/mit-template-license.txt`, source PPTX files and provenance records; template-specific CC0 terms |
| Board Game Icons | Kenney | `community-sources/kenney-license.txt`, original asset archive and provenance records |
| Under the Wave off Kanagawa (The Great Wave) | Katsushika Hokusai; image from The Metropolitan Museum of Art Open Access | `community-sources/met-wave-record.json` and provenance records documenting public-domain status |

Font files are bundled unmodified under SIL Open Font License 1.1. System fonts used by the editor are not redistributed. PDF.js is bundled with its upstream notices, including separate terms for supporting fonts and image decoders.

The five added display/text families are original, unmodified font files from the official Google Fonts repository. Exact source URLs and Git blob checksums are retained in [the font source manifest](vendor/fonts/ATELIER-SOURCES.json).

## Art Directed collection

Six additional visual assets in `assets/atelier/` were created with OpenAI's built-in image generation tool on October 14, 2026: three fictional adult portrait cutouts, a chrome sculpture, paper texture, and a warehouse crowd. The files are WebP encodings with transparency preserved where applicable. [Their manifest](assets/atelier/PROVENANCE.json) retains the prompts and processing notes. These assets are development-time artwork, not an in-app AI service or documentary photos. They are used in original editable compositions, alongside previously credited imagery.

The authoritative per-template records are in [community-sources/PROVENANCE.json](community-sources/PROVENANCE.json). Records describe the source, author, licensing evidence, modifications, discovery channel, and editing limits. Reddit and Pinterest references are discovery links, not blanket permission to reuse content from those services.
# Campaign Collection imagery

## Open Library artwork

The 106 optimized images in `assets/open-library/` have item-specific licenses: 69 CC0, 19 public domain and 18 CC BY. `manifest.json` records creators, original source pages, license URLs, modifications and source evidence; `source-evidence.json` preserves the retrieved source metadata. `docs/OPEN-SOURCES.md` explains selection and research. These licenses apply to the included artwork and do not replace the project's own rights statement. CC BY assets carry visible template attribution and an accompanying `dist/credits.html` source page. No Canva partnership rights are claimed.

Four new generated sculptures in `assets/signal/` are original OpenAI image-generation outputs. Their prompts and processing records are in `assets/signal/PROVENANCE.json`; the Signal Lab layouts also reuse the existing `atelier-chrome` asset.

The 54 imagery assets in `assets/people/` were generated with OpenAI's built-in image generation tool for this project on 12–14 October 2026. They include fictional adults and crowds, equipment, a product still life abstract artwork and illustrative city scenes; they do not document real models or customer endorsements. The original prompts and output provenance are recorded in `assets/people/PROVENANCE.json`. The app bundles JPEG encodings of these assets; no Canva, Getty, Pexels or Unsplash imagery was used in this collection. Project-wide reuse terms remain described in `RIGHTS.md`.


## Design Combinations

The 24 geometric symbol sets and 120 theme/style combinations are original OpenCanvas code-defined compositions. Canva and Pinterest were reviewed for broad category/style inspiration; their files and artwork are not bundled. Photo combinations reuse the documented AI imagery above. Research links and counting details are in `docs/DESIGN-COMBINATIONS.md`.

## Studio Mix

Twenty-four original OpenCanvas compositions use editable type and native geometric motifs, plus ten new generated photographs and illustrations. Artwork and prompts are recorded under the studio-prefixed entries in `assets/people/PROVENANCE.json`. The user supplied screenshots as broad visual references; Canva code, template files and artwork were not imported. These are static templates, including the glitch and presentation-cover designs.

## Lucide graphics

Six icons from https://github.com/lucide-icons/lucide are included under the ISC license, with the complete upstream LICENSE and included Feather MIT notices preserved in assets/lucide/LICENSE. Source URLs and checksums appear in assets/lucide/PROVENANCE.json. PNG renderings in rendered.json change stroke colors and preserve icon geometry for portable projects.

## Person cutout

MediaPipe Tasks Vision 1.1.1 and Google's Selfie Multiclass 256×256 model (version 1) are included under Apache License 2.0. The unmodified runtime and model are split into binary parts for distribution; their original bytes are reconstructed on demand. [License](assets/cutout/LICENSE), [notice](assets/cutout/NOTICE.txt), and [official source URLs and SHA-256 hashes](assets/cutout/manifest.json) are retained with both source and deployed files. Images are processed on the user's device. See [capabilities and limitations](docs/PERSON-CUTOUT.md).

## Click-selected subjects: Magic Touch

Google's MediaPipe Magic Touch v2 int8 model, version 1, is included under Apache License 2.0 for on-device selection of pets, products, people and other subjects. The unmodified 30,525,312-byte model is split into seven transport parts and shares the MediaPipe Tasks Vision 1.1.1 runtime above. [License](assets/photo-lab/LICENSE), [notice](assets/photo-lab/NOTICE.txt), and [official source URL and SHA-256 hashes](assets/photo-lab/manifest.json) accompany the source and deployed assets. The original OpenCanvas adapter downloads the model only on request and processes photos locally. Clone & blend and background compositing are original non-generative OpenCanvas code. See [Photo Lab](docs/PHOTO-LAB.md) for capabilities and limits.
