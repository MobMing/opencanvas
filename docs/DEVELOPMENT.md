# Development notes

## Run and check

Use Node.js 24. There are no npm dependencies required to preview the shipped application or run its existing tests.

```sh
npm start
npm test
npm run check
```

`npm start` serves the editor locally on port 4173. `npm test` runs the existing checks using Node's test runner. `npm run check` checks standalone script syntax and required repository files. Stop the local server with Ctrl+C.

## Current source structure

- `dist/index.html`: working, self-contained application, including the original editor core, bundled assets, and appended feature modules. **It is currently part of the source baseline; do not delete it to do a clean build.**
- `*-core.js`: portable logic and validation helpers.
- `*-tools.js`, `*-features.js`, and other named feature files: editor UI and interactions.
- `build-*.cjs`: incremental feature assemblers that update the standalone HTML.
- `tests/`: Node-based checks for document validation, templates, imports, styling, and other logic.
- `vendor/`, `community-sources/`: bundled assets and original attribution/license records.
- `docs/FEATURES.md`: accumulated implementation notes. Earlier sections describe earlier milestones; the top-level README lists the current feature counts and scope.

## Incremental rebuilding

The editor is not yet a conventional source-only build. Feature assemblers patch the retained `dist/index.html`. After changing a module, run its assembler and every later assembler in the following order so script dependencies remain correctly ordered:

1. `build-studio.cjs`
2. `build-community.cjs`
3. `build-create.cjs`
4. `build-pages.cjs`
5. `build-creative.cjs`
6. `build-drawing.cjs`
7. `build-import.cjs`
8. `build-community-gallery.cjs`
9. `build-business.cjs`
10. `build-type.cjs`
11. `build-industry.cjs`
12. `build-home.cjs`
13. `build-context.cjs`
14. `build-promo.cjs`

Run a script as `node build-context.cjs`, for example. Keep original core edits in the standalone HTML until the planned source extraction is complete. Run all checks and browser-test affected flows after rebuilding. Recreating raw community artwork is a separate asset-preparation process; some asset preparation utilities expect `sharp`, but it is not needed to use the bundled files.

## Data and deployment

The application uses browser-local storage. Keep the same origin during development to keep seeing saved projects. Export project files before switching browser, host, port, or domain. The repo contains no personal saved designs or uploads from browser storage.

The existing hosted Site's `.openai` settings and internal Git history are deliberately excluded. This repository can be hosted as a static site by serving `dist/`. Configure a separate hosting destination explicitly; pushing to this repository should not silently overwrite the original hosted Site.
