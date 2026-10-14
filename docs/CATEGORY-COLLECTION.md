# Category stories collection

This collection adds 26 original editable designs covering all 25 named creative topics in the template browser, with a second design for Gardening. Community is a separate contributor collection, so original work is not mislabeled as a community contribution.

Every title, detail, diagram, and decorative mark is a native text or shape layer. There are no external photos, image-generation assets, downloaded Canva designs, or network dependencies. Designs use the existing bundled font families. Users can edit the sample names, dates, prices, addresses, and contact details before sharing.

## Coverage audit

The original source collections were counted before this addition and before the separate gaming expansion. Counts include variations in existing collections; they do not imply that every entry is a distinct composition. Community-contributed templates are excluded from these figures.

| Topic | Existing entries | New design | Practical use / composition |
|---|---:|---|---|
| Music & DJ | 402 | Room 003 | Warehouse music poster with speaker diagram and editable set times |
| Podcast | 36 | Between Chapters | Square cover with overlapping conversation bubbles and a waveform |
| Fitness | 51 | Your First 5K | Beginner run-club invitation with race bib and route diagram |
| Wellness | 44 | The Small Reset | Four-step pause reminder card; no treatment claims |
| Beauty | 44 | The Shade Lab | Nail-studio appointment promotion with four editable color swatches |
| Food & Drink | 55 | Night Market Bites | Noodle-bar menu with editable dishes, prices and service details |
| Gaming | 29 | Co-op Quest | Tabletop game-night invitation with a route map and die |
| Education | 54 | Science After School | Science-club announcement with a lab illustration and registration details |
| Real Estate | 2 | Open Doors | Open-house listing with an explicitly illustrative floor plan |
| Weddings | 1 | Mina & Leo | Botanical arch invitation with ceremony and reception details |
| Faith & Community | 13 | A Longer Table | Inclusive community-potluck invitation and shared-table diagram |
| Nonprofit | 26 | Keep the Pantry Full | Food-drive collection notice with an editable donation checklist |
| Pets | 2 | Help Milo Get Home | Lost-pet notice with photo replacement instruction, last-seen details and contact |
| Crafts | 1 | Mend & Make | Visible-mending workshop with stitched sampler and thread spool |
| Books | 1 | The Afterword | Reading-club poster using illustrated book spines |
| Travel | 51 | 48 Hours in Lisbon | Landscape city itinerary with a tram and numbered stops |
| Photography | 63 | Light Study | Portrait-session promotion with graphic contact-sheet frames |
| Small Business | 98 | Good Neighbors Club | Ten-stamp loyalty card with editable reward terms |
| Technology | 1 | Build Night | Developer meetup poster with terminal illustration and session agenda |
| Sports | 1 | Court Culture | Community basketball invitation with a half-court diagram |
| Gardening | 1 | Cuttings & Company | Propagation-swap poster with labeled cutting jars |
| Celebrations | 55 | Forty & Flourishing | Birthday invitation with an editable candle garden |
| Entertainment | 157 | Curtain Up | Theatre opening poster with stage, seats and box-office details |
| Marketing | 110 | Made to Launch | Landscape campaign brief with tease, reveal and invite phases |
| Fashion | 58 | The Rework Edit | Upcycled-clothing promotion with a garment construction illustration |
| Gardening | — | The Weekly Grow Note | Plant-care log with editable checks and writing space |

The most underserved topics were Weddings, Crafts, Books, Technology, Sports and Gardening, each with only one original catalog entry. Real Estate and Pets had two. This addition establishes broader usable coverage; it does not claim to match Canva's catalog volume.

## Reference research

Canva's public [volunteer flyer category](https://www.canva.com/flyers/templates/volunteer/) demonstrates the usefulness of specific recruitment and donation use cases, while its [garden category](https://www.canva.com/templates/s/garden/) includes both promotions and practical planning formats. These pages informed the category/use-case audit only. No listed composition or asset was copied.

## Integration

Load `category-collection.js` after the existing base shape and text factories. The file exposes `categoryTemplates` and `makeCategoryDesign(t)` without changing global navigation or rendering functions. The factory returns a fresh document and fresh layer IDs on every call. Register catalog metadata and route template IDs through this factory in the existing collection integration. Preserve the existing `fitCatalogText` pass for font-metric differences across browsers.

## Validation

`node --test tests/category-collection.test.cjs` checks all 25 topics, 26 unique geometries, three aspect-ratio formats, native editable layers, transformed layer bounds, complete project round trips, useful category-specific details, supported fonts and independent document state.

All 26 designs were also rendered through the current native canvas/text renderer with the bundled fonts. Text measurement found no overflowing text boxes after fitting explicit line breaks. The contact sheet was visually reviewed for hierarchy, illustration placement, contrast and distinct category content. Individual editable designs contain fewer than 180 layers, leaving room for users to customize them.
