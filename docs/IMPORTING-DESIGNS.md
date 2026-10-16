# Bring an exported design into OpenCanvas

Choose **Import** in the editor or **Import from Canva** in the Create a design window. Select a file, review the page previews and import notes, then choose **Open in OpenCanvas**. The current project is saved before switching. A downloadable `.opencanvas` backup is enabled by default.

## Choose an export format

In Canva, open the design and choose **Share → Download**. [Canva’s file-format guide](https://www.canva.com/help/download-file-types/) explains which exports are available for each design type and plan.

| Export | What can be edited after import |
| --- | --- |
| PowerPoint (`.pptx`) | Supported text boxes, simple shapes, and embedded photos become independent OpenCanvas layers. Canva offers PowerPoint export for presentations. |
| SVG (`.svg`) | Supported simple text and shapes become native layers. Detailed artwork is preserved as movable image layers when possible; complex compositions may stay as one image. Lettering exported as outlines remains artwork, not editable text. |
| PDF (`.pdf`) | Each selected page becomes one image layer. Add new text, shapes, images, or drawings over it. Original objects are not individually editable. |
| PNG, JPG, WebP | Each image becomes one page. The image can be moved, resized, replaced, or edited with photo tools. |
| OpenCanvas (`.opencanvas`) | Use **Open project** to restore the editor’s own editable document and portable metadata. |

Canva share/template links and native Canva project data cannot be imported directly. OpenCanvas does not access your Canva account. The file must first be downloaded using an export available to you.

## Review the result

The importer reports editable text, shape, and image layer counts. Compare the preview with the original before opening it. Import notes identify conversions and unsupported content.

- PowerPoint and SVG conversion is approximate. Fonts may be substituted, and text spacing or wrapping can differ. Choose or upload an appropriate font in the editor after import.
- Complicated effects, charts, custom vector shapes, grouped artwork, and unusual positioning may be simplified, flattened, or omitted as explained in the import notes. For an appearance-preserving copy, export PDF or PNG instead.
- Animation, audio, video, external images, and active content are not imported. These formats do not transfer Canva’s editing history or app integrations.
- Importing an export does not make every visible word editable. The source must contain supported text objects rather than outlines or text baked into a picture.

After opening, select a layer on the canvas or in **Layers**. Double-click a text layer to change its wording. Save a `.opencanvas` file to keep editing later. To reuse part of a design, open **Studio Plus → Layouts**, select the layers, give the layout a name, and choose **Save selected layers**. Reusable layouts stay in this browser and are included in workspace backups.

## Local processing and limits

Files are parsed on this device without sending them to Canva, a conversion service, or the workspace server. Saving a cloud copy remains a separate explicit action. Import files you own or have permission to use.

Choose one PPTX, SVG, or PDF at a time, or up to 30 images. The source limit is 30 MB total; up to 30 pages can be imported into one project. For PDFs and PowerPoint files, use the page/slide selection field, such as `1, 3-5`. The high setting uses a maximum 2400-pixel side; compact uses 1600. Additional limits on expanded archives, pixels, image data, and layers protect the browser from excessively complex files. SVG is one page.

The importer rejects unsafe or malformed content and does not load linked resources. A recent desktop browser with native decompression support is required for compressed PowerPoint files. If an import is too large, choose fewer pages or the compact setting. Keep the source file and a downloaded project backup.
