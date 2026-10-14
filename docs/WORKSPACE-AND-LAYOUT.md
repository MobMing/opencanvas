# Workspace and layout tools

These tools run locally in OpenCanvas. They add project organization, precise layout controls, and a vector export option without requiring a connected account.

## Keep projects organized

On **Home**, choose **New folder**, enter a name, and use the **Folder** menu on each project card to move it. Use the folder filter above the cards to browse one folder, all projects, or unfiled projects. A project belongs to one folder at a time. Folder names support 1–80 characters; nested folders and folder renaming/deletion are not included yet.

Choose **Trash** on a project card, or **Move to Trash** in the editor's Projects panel. After confirmation, it leaves the normal project list. Open **Home → Trash → Restore project** to return it to its original folder. Trashed projects are kept on this device, with no automatic deletion or permanent-delete control in this release. They still consume browser storage.

The editor reopens the last saved active project after the workspace and fonts load. An untouched starter is not added to your saved projects just by visiting. If automatic opening fails, the project remains listed so you can try opening it directly; the editor reports the problem.

Use **Studio Plus** to download a workspace backup. It includes folders, folder assignments, and Trash. Restoring a backup adds copies with new identifiers and “restored” names, preserving existing work. Backup import accepts files under 100 MB with up to 500 active and 500 trashed projects. Browser storage is local to the current browser and website address; clearing it can remove projects and Trash together. A downloaded backup is the way to keep a separate copy or move devices.

## Rulers and guides

Open **Tools → A little precision** and turn on **Rulers**. Drag from the top ruler to create a vertical guide, or from the left ruler for a horizontal guide. The same panel can add a guide by direction and exact pixel position.

- Drag a guide to reposition it. Hold **Shift** while dragging to use 10-pixel steps.
- Focus a guide and use arrow keys for 1-pixel steps, or **Shift + arrow** for 10 pixels.
- Edit a guide's numeric position in Tools for precise placement.
- Drag it outside the page, press **Delete/Backspace** while it is focused, or use its remove button to delete it. **Escape** cancels an active drag.
- **Clear page guides** removes the current page's guides. Normal Undo can restore guide changes.

Each page supports up to 30 guides inside its bounds. **Guides** controls visibility, and **Snap to guides** aligns element edges and centers near visible guides. Ruler numbers use design pixels, not physical print measurements. Guides stay with editable projects and never appear in downloaded artwork.

## Page and shape gradients

Open **Tools → Page gradient**, or select an unlocked rectangle, rounded rectangle, ellipse, triangle, or star and choose **Selected shape gradient**. The inspector also offers a gradient action for these targets.

Choose **Linear** or **Radial**, set the start and end colors, and optionally add a middle color. Linear gradients offer an angle from 0–360°. Radial gradients let you place the center from 0–100% on each axis. Review the preview, then choose **Apply gradient**. **Use solid color** uses the selected start color instead. Undo restores the previous fill.

Gradients remain editable and are rendered in exports. They currently apply to page backgrounds and the five supported native shape types, not text, lines, or image layers. Changing the normal solid-fill color removes the old gradient; reopen the gradient editor to create another. Shape style copying preserves compatible gradient fills.

## Download scalable SVG

Open **Export → SVG · scalable text, shapes & links**. Choose the current page or every page, an optional transparent page background, and whether to embed available fonts. Every-page export downloads a ZIP containing one SVG per page.

Native text and shapes remain vectors. Photo crops, adjustments, drawings, and library artwork are embedded images; those pixels do not become editable paths. Supported layer links and descriptions are included. Available embedded fonts can travel with the file, but other editors may still require those fonts installed. Review curved text, effects, and typography after opening the SVG in another application.

Image preparation is limited to 4,096 pixels on the longest side and at most twice the layer's design dimensions. A page is limited to about 70 MB of embedded image data, and the complete SVG export to 80 MB. These limits protect browser memory; they do not add detail to a low-resolution image. Closing the export dialog cancels preparation.

Keep the `.opencanvas` project for full editor metadata, multipage work, and future edits. SVG export does not add editable SVG import, CMYK output, or vector/selectable-text PDF. Existing PDF exports remain flattened raster artwork.

## Try the Signature collection

Open **Templates → Explore Signature**, preview a design, and choose **Use this template**. Its 20 compositions use editable text and native shapes in portrait, square, cover, and story formats. Each has a distinct layout with useful event or promotion details. See the [collection guide](SIGNATURE.md).

OpenCanvas is still in development. Cloud sync, live team editing, automatic subject separation, and third-party publishing services are separate workflows; these local additions do not claim full Canva parity.
