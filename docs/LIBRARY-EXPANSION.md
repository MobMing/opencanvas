# Open Library expansion

This release adds **2,764 editable template entries**:

- 104 in each of the 25 creative topic categories: 26 distinct subject briefs with four different composition families per brief (2,600 entries).
- 104 Community compositions using the same editable layout system and credited outside artwork.
- 60 [Signal Lab](LIQUID-SIGNAL.md) designs inspired by the existing Liquid Signal composition, using 15 structural directions and four editions each.

The complete catalog now contains **4,211 entries**. Default browsing shows **3,261 cards** because older palette and size variants are grouped. All 104 new entries in each topic remain individually discoverable. The original Community artwork browser is still available from the Community category.

These are combinations of original layout systems, authored subject briefs, type, palettes and appropriate imagery. The count does not mean 2,764 unrelated, individually hand-drawn layouts or new photographs. Open Library has 26 composition families; Signal Lab has 15 additional direction families.

## Coverage and editing

Pets includes adoption, lost-pet notices, grooming, walking, sitting, training, small animals and care. Crafts includes pottery, weaving, embroidery, leather, paper, wood, jewelry, printmaking and other maker activities. Photography includes portrait services, landscapes, architecture, macro, street, products, studio lighting, portfolios and exhibitions. Technology covers security, AI, programming, cloud, hardware, robots, data, product releases and workshops. Every other category receives 26 useful subjects as listed in [Library briefs](LIBRARY-BRIEFS.md).

All Open Library designs are 1080 × 1350 portrait flyers. Their text, shapes and information fields are editable; photography is a separate replaceable layer. Every brief's three detail fields are retained, including names, dates, locations or service information where relevant. Signal Lab additionally supplies square, landscape and story formats.

The **Open Library** collection filter selects the 2,704 cross-category combinations. **Explore Signal Lab** opens the 60 chrome designs. Category navigation clears incompatible filters. Search, People imagery filtering, saved bookmarks, large previews and the stable Show more order remain available.

## Artwork

The expansion includes **106 outside photos and artworks** (69 CC0, 19 public domain, 18 CC BY) and **four newly generated transparent chrome/glass sculptures**. Signal Lab also reuses the original Liquid Signal sculpture. Sources, creators and licenses are recorded per asset; see [Open sources](OPEN-SOURCES.md), [the outside-image manifest](../assets/open-library/manifest.json), and [generated sculpture prompts](../assets/signal/PROVENANCE.json).

Matching uses deliberate subject choices: an animal notice keeps one identity, portraits use people, and craft scenes correspond to the materials. Where the included imagery cannot represent a subject accurately, the design uses native editable illustration. The image library is optimized for web use; original-resolution links are included for large-print needs.

CC BY designs keep an editable attribution line in the artwork and full provenance in the image layer. Flat exports therefore retain a link to the included [credits page](https://mobming.github.io/opencanvas/credits.html). Keep supplied-image attribution when using that image. Existing project-wide rights remain in [RIGHTS.md](../RIGHTS.md).

Artwork is shipped in small, versioned `dist/artwork-*.js` bundles loaded before the template collection. Host the complete `dist/` folder. Chosen images remain embedded in saved project files, so exported projects stay portable.

## Validation and rebuilding

The tests check category and brief counts, four different composition families per brief, unique IDs, correct animal identities, source records, portable projects, bounded layers and the presence of all brief details. Independent native rendering checks all 2,704 Open Library designs and all 60 Signal designs for text fit. Contact sheets sample every layout family and the priority categories.

The browser check visits all 26 category sections, verifies counts and previews, and checks attribution and People filtering. Existing user projects are preserved.

Run `node scripts/build-library.cjs` to rebuild this expansion and subsequent editor layers in order. It stops on the first failed build. Run `node --test tests/*.test.cjs` and `node scripts/check-source.cjs` before publishing.
