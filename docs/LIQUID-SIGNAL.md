# Signal Lab

Sixty original editable compositions expand the existing **Liquid Signal** direction: large condensed and hollow type, a sculptural chrome hero, high-contrast ink, and practical event information. The pack contains fifteen composition systems with four designed editions each. It adds portrait flyers, landscape banners, square promotions and tall stories across Music & DJ, Entertainment, Photography and Technology.

The fifteen directions are Signal takeover, Split transmission, Orbital specimen, Two-room dispatch, Frequency blueprint, Admission strip, Type pressure, Oblique current, Gallery specimen, Oscillator field, Night receipt, Wide transmission, Modular assembly, Release dossier and Vertical relay. Editions change image placement, information hierarchy, frames, ticket panels and headline arrangement; these are not simply sixty renamed color presets.

Every headline, rule, barcode, ticket panel and diagram uses editable native layers. Sculpture artwork remains a separate square image that can be replaced, moved or removed. Date, venue, lineup, gallery and workshop details are editable example copy. Static designs do not imply animation or a publishing service.

## Artwork provenance

This collection uses **five artwork assets**, not sixty new photographs. All are original generated sculpture illustrations, not photographs of existing objects or artwork copied from Canva:

- `atelier-chrome`: the original Liquid Signal sculpture, credited in `assets/atelier/PROVENANCE.json`.
- `signal-orbit`, `signal-ribbon`, `signal-spike`, `signal-glass`: four new sculpture directions, credited with their generation prompts in `assets/signal/PROVENANCE.json`.

Each design declares its image asset ID, generated-imagery status and source credit. Images are embedded for portable projects. Missing or invalid image data falls back to native editable orbital shapes, leaving a usable composition. Uploaded external URLs and SVG data do not silently enter these templates.

## Verification

`node --test tests/signal.test.cjs` checks sixty unique IDs, names and composition geometries, coverage of all fifteen directions, available type, editable example copy, image aspect ratios, safe image sources, bounded layers and project save/load round trips. Representative rendered designs are also checked for composition and text fit before publishing.
