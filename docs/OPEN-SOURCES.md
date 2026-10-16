# Open artwork and photography

Research and source checks: October 14, 2026.

The template expansion includes **106 outside image assets**: 69 CC0 items, 19 public-domain items, and 18 Creative Commons Attribution items. These are photographs, historical artworks, scientific imagery, and illustrations from credited creators. This collection contains no newly generated AI images and no downloaded Canva template assets.

The image files total approximately **7.07 MB** before embedding, with each file below 125 KB. Each is an optimized WebP, with its original composition preserved. A small number of dense images were reduced to 768 pixels on their longest edge; other images are at most 960 pixels. These files are intended for screen previews and smaller designs; users needing very large prints can follow the source record for the original-resolution image.

## What was added

| Area | Examples |
| --- | --- |
| Pets | Labrador and spaniel portraits, two cats, two Shiba photographs, rabbits, guinea pigs, a budgie, and a goldfish |
| Crafts | Yarn, embroidery floss, weaving, leatherwork, wood carving, paper workshops, origami, ceramics, pottery jugs, and a workshop |
| Photography | Eight modern portraits, studio lighting, still life, mountain lakes, seascapes, forest canopy, flowers, waterfalls, architecture, city night scenes, and cameras |
| Technology | Circuit boards, a keyboard, robots, nebulae, Earthrise, the International Space Station, and a shuttle launch |
| Music and entertainment | Vinyl, studio microphones, a drum kit, a festival stage, street musicians, and a live performance |
| Fitness and community | Running groups, basketball, volunteers, farmers’ markets, and community gardens |
| Other visual material | Bread, coffee, bouquets, botanical studies, books, textiles, and historical travel posters |

The Community collection can use these credited photographs and artworks within **original OpenCanvas layouts**. A photographer or historical artist is credited for the underlying image, not presented as the author of the new flyer. Suitable composition directions include a full-image headline, editorial diptych, contact sheet, archive card, framed exhibition notice, asymmetric photo story, film strip, poster wall, compact event ticket, patterned border, large date block, gallery caption, and exhibition inventory. Combining original layouts with these sources does not turn them into imported human-made Canva templates.

## Source records and attribution

- [The asset manifest](../assets/open-library/manifest.json) contains every local path, title, creator, canonical source page, license, license URL, source page ID, topic tags, and modification note.
- [The source evidence](../assets/open-library/source-evidence.json) preserves the Wikimedia Commons metadata retrieved for each selected file. Unselected search results are not shipped.
- [The download script](../scripts/fetch-open-library.cjs) downloads only manifest-listed files by default, processes requests sequentially, and respects rate-limit responses. Optional discovery modes collect candidates for human review; they do not add those candidates to the product automatically.

The asset maintenance script uses the optional `sharp` package for WebP encoding. Install it in the development environment, or set `OPENCANVAS_SHARP_PATH` to an existing installation. Neither Sharp nor an external image service is required to run the shipped editor.

Selection accepted only CC0, public-domain, or CC BY records. It excluded ShareAlike, noncommercial, nonderivative, editorial-only, and explicit restriction-flagged records. It also excluded files whose metadata identified AI generation. The selected images were reviewed in contact sheets before integration.

Some selected photographs were originally published on stock sites before their license changes. They were accepted only where their individual Commons records preserve a CC0 dedication; this is not a claim that current uploads to those services are CC0. Modern portrait files are tagged explicitly, so a portrait brief does not silently select a landscape or a camera product shot.

CC BY images need their attribution to remain with designs when exported: creator, license, and a route to the original source, plus a note when the image is changed. The library therefore records `attributionRequired`, `creditLine`, and `licenseEvidenceUrl`. A link only in this repository is insufficient for a standalone exported image that travels elsewhere. [Wikimedia’s reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) explains the file-by-file license approach.

All images also retain creator credits when attribution is not required. The images illustrate template concepts; actual people, organizations, locations, and performers in source photographs are not claimed to endorse a user’s event or business. Source image licensing does not supply a new model release or trademark permission.

## Where Canva’s variety comes from

Canva’s content partnership program describes distinct pipelines for brand collaborations, library content, and representation-focused collaborations. It identifies Monotype fonts, Getty images, Warner Music, NASA educational material, The Ocean Project, The New York Times, Balarinji, and Awesome Black among its examples. These are negotiated relationships, not a public directory of universally reusable assets. [Canva Content Partnerships](https://www.canva.com/partners/content/).

Canva also operates a reviewed Creators program for original templates and specialist content. Its emphasis on varied formats, useful content, spacing, typography, and original work is a useful design reference for OpenCanvas. It does not grant reuse of creators’ submissions. [Canva Creators](https://www.canva.com/creators/).

Canva acquired Pexels and Pixabay in 2019, adding another content pipeline. That history does not mean every image on those platforms has the same reusable-library permissions. This release uses individual Commons license records rather than bulk-copying their current stock catalogs. [Canva’s acquisition announcement](https://www.canva.com/newsroom/news/canva-acquires-pexels-pixabay/).

The current Canva content license distinguishes content categories and permitted uses. It restricts standalone distribution and use in competing services, while directing users to original terms for CC0/public-domain content. The practical route for OpenCanvas is to obtain suitable media directly under its own source license. [Canva Content License Agreement](https://www.canva.com/policies/content-license-agreement/).

## Further primary-source collections

For future art additions, [The Met’s Open Access program](https://www.metmuseum.org/hubs/open-access) supplies CC0 collection images and an API. [The Art Institute of Chicago API documentation](https://api.artic.edu/docs/) exposes a public-domain flag and explains image reuse and polite download practices. These are additional research sources; no Art Institute image is claimed as bundled in this release because its image endpoint declined the download request.

NASA images in this bundle were selected through their individual Commons public-domain records, including the original scientific credits. Modern photographers, archives, public-domain historical artists, and institutional collections remain individually credited in the manifest. No outside image is treated as OpenCanvas’s exclusive property.
