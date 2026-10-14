# Personalize, promote, and print

Released October 14, 2026. These are independent OpenCanvas implementations of five useful workflows identified in the focused Canva comparison. They run in the browser without a paid account or a connected cloud service.

## Curved text

Select a text layer and open its properties. Adjust **Curve** from −180° to +180°, or choose **Straight** to reset it. Text remains editable, works with the existing effects, and survives project export/import and style copying. **Text → Curved** also includes two ready-made pairings.

Each wrapped line follows its own arc. Widen the text box if you want a single arc. This is circular bending, not text along an arbitrary drawn path or a full circular text tool. Connected scripts are kept together within words to preserve shaping; review multilingual layouts before exporting.

## Your own fonts

Use the font library to upload TTF, OTF, WOFF, or WOFF2 files, name them, and apply them to text. The library is saved on this browser/device. Portable project files include the custom font assets used by their pages, so opening those files can restore their typography.

Use fonts whose terms permit embedding and sharing in your design files. A font being installed on your computer does not automatically make it available to the browser editor. Damaged or unsupported font files are rejected rather than silently accepted as a different font. Large fonts increase project and backup sizes.

## Print PDF

Choose PDF from Export to set the printed page size, resolution, page selection, and Fit or Fill placement. Choose a standard paper size or enter custom dimensions. Optional 3 mm bleed and crop marks give the print shop a visible trim reference. A preview shows the trim, bleed, and safe-margin guides before export.

PDF pages use physical measurements and include PDF trim and bleed boxes. Artwork is flattened to RGB raster images; crop marks are vector lines. Bleed repeats the edge pixels beyond the trim. It does not recover artwork outside the page or create a new background. Check the preview and ask your printer which size and bleed they need. This is not a CMYK conversion, vector-text PDF, or print-order service. Resolution and page limits protect browser memory; upscaling cannot add detail to a low-resolution photo.

## QR codes for flyers

Open **Tools → QR code for a flyer**. Enter a website address or plain text, choose ink and paper colors, and add the result to your page. Select the resulting image to **Edit QR content & colors** later. Undo, project saving, and multipage project imports preserve the editable QR settings.

The generator runs locally and creates static codes. There is no redirect subscription, tracking server, or built-in expiration. A link still depends on its destination remaining available. Keep the code square, keep its clear border, and scan an exported or printed test copy. Low-contrast colors and unsupported URL schemes are rejected. Up to 1,000 UTF-8 bytes are supported; longer codes need more physical space to scan reliably.

QR editing metadata is tied to the generated image. Replacing or editing its pixels removes the special editing option if the stored metadata no longer matches. The image can still be used as ordinary artwork.

## Find a palette in a photo

Open **Tools → Find colors in a photo**, select an image and use its **Find colors in this image** action, or open the palette action in **Brand**. Upload a PNG, JPG, or WebP up to 12 MB. The tool samples it locally and offers up to six representative colors.

Choose a swatch, apply it to the page background or an unlocked text/shape layer, or save the palette as a new Brand Kit. The kit chooses a dark ink and light paper from the sampled colors. Review those roles and contrast for your particular design. A monochrome image may produce fewer than six colors, and transparent pixels are excluded.

## What still needs separate work

The static website does not activate cloud accounts, live collaboration, social publishing integrations, semantic AI image editing, licensed commercial-stock catalogs, or print fulfillment. Existing optional server features still require the [connected setup](CONNECTED-SETUP.md). These five additions do not claim parity with all Canva products.

## References and credits

The feature research used Canva's official [curved-text overview](https://www.canva.com/features/curved-text/), [font upload guide](https://www.canva.com/help/upload-fonts/), [print guides](https://www.canva.com/help/margins-bleed-crop-marks/), [QR generator](https://www.canva.com/qr-code-generator/), and [photo palette generator](https://www.canva.com/colors/color-palette-generator/). The implementation does not include Canva's code, templates, fonts, or paid assets.

QR encoding uses Kazuhiko Arase's MIT-licensed QR Code Generator. Independent decoding tests use jsQR under Apache-2.0. Full upstream license files and pinned sources are included in the repository; see [third-party notices](../THIRD_PARTY_NOTICES.md).
