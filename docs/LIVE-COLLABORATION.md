# Live collaboration

The optional workspace server now supports live shared editing, teammate presence and cursors. This is implemented in the repository; **managed hosting has not been activated**. The free local editor continues to work without an account. Deploy the updated server only after reviewing the [managed hosting costs](MANAGED-HOSTING.md).

## Editing together

Sign in through Studio Plus → Connect, save a design to the workspace, and grant another invited member Editor or Reviewer access. Choose **Edit together** on a workspace project. Joining is explicit: while joined, editor changes are sent automatically. Leaving keeps a local copy and stops live sharing. Reviewers can watch changes and leave comments/reviews, but the server rejects their design writes.

Independent changes merge by page, element and field. For example, one person can move the heading while another changes a photo's position; changes to different properties of the same element can also merge. Two people replacing the same text, deleting an element that another person edited, or making incompatible layer/page-order changes produce a conflict. The complete proposed update is rejected; unrelated parts of that conflicting proposal are not partially saved. Keep a local copy before reopening the shared version.

This is document-level collaboration with conflict detection, not a character-by-character text CRDT. Concurrent typing in the same text field can require a choice. Ordinary metadata arrays, including media-track arrays, are treated atomically. Safe additional document metadata is retained.

Selected page and cursor are personal to each tab. The shared document stores all pages canonically, with the first page mirrored at the top level; changing the page you are viewing does not change anyone else's selected page. A collaborator's display name comes from the authenticated account and cannot be supplied by a presence request.

Video/audio files kept on one device are not uploaded by live collaboration. Sharing their settings or media references does not give a teammate the underlying media. The prepared account system still needs the public-user recovery and verification work described in [Connected setup](CONNECTED-SETUP.md).

## Limits and recovery

- Live documents are limited to **10 MiB of canonical JSON**, including embedded images and fonts. Larger designs can use the existing explicit cloud-save workflow, subject to its 25 MiB request/document limit. An oversized manual cloud update closes existing live sessions with a clear reason.
- A document may contain 1–30 pages, up to 500 elements per page and 3,000 elements overall. Page and element identifiers must be unique within their collections.
- The default server permits 16 live streams overall, 8 per project and 4 per account. Separate tabs use separate client identifiers. A slow stream is disconnected instead of allowing unbounded queued data.
- Presence expires after 45 seconds without an update. The server checks sessions and membership on each broadcast and every 15-second heartbeat. Revoking project access or signing out closes affected streams immediately; account expiration is enforced no later than the next heartbeat.
- Sync is limited to 120 requests per minute per account/project; presence to 600. At most four request bodies are buffered simultaneously. Requests are size bounded, and unsafe object keys, duplicate identifiers and excessive nesting are rejected.
- The server remembers hashes for the last 256 revisions of each project, not historical copies of embedded images. A client must supply a base revision that matches its recorded hash. A forged, too-old or missing base is rejected rather than silently overwriting shared work. Rejoining retrieves a fresh snapshot.

Restoring an older database backup starts live history from the current revision when it is first opened. Clients based on revisions missing from that restored database must rejoin. These hashes verify a merge base; they are not a user-facing revision backup or an authenticity signature. Normal SQLite snapshots include the history table automatically.

## Server interface

`/health` and successful login/registration responses include `liveCollaboration: true`. Older servers omit it. Requests authenticate with `Authorization: Bearer …`; credentials are never placed in event-stream URLs.

- `GET /projects/:id/events?clientId=<UUID>` opens a fetch-readable SSE stream. Its first `snapshot` event contains `{project:{id,design,version,role,review},presence:[...]}`. Reconnecting obtains a new snapshot; there is no replay cursor.
- Subsequent `project` events contain only `{id,version,clientId}`. Clients fetch the current project and coalesce rapid notifications. Manual cloud PUTs use `clientId:null` and record revision hashes too.
- `POST /projects/:id/sync` accepts `{baseVersion,base,design,clientId}` and returns `{id,design,version,merged}`. The tab must have an active stream owned by the same authenticated session. HTTP 409 includes `currentVersion` and, when available, `conflicts:[{path,reason}]`. No-op merges do not create a revision.
- `POST /projects/:id/presence` accepts `{clientId,pageId,cursor:{x,y}|null,selection:[elementId]}`. Coordinates are bounded to the selected page; unknown selected elements are omitted. `DELETE` on the same route accepts `{clientId}` and leaves that tab's session.
- `presence` events contain `{members:[{clientId,name,role,pageId,cursor,selection,updated}]}`. `comments`, `review` and `access` events tell clients to refresh the corresponding state.
- `revoked` events contain `{reason}` and are followed by stream closure. Reasons include `access-revoked`, `session-expired`, `role-changed`, `project-too-large`, `slow-connection`, `reconnected`, `server-restarting` and `left`. Network/server/slow-stream reconnects should use backoff. Access changes require reauthorization; size errors require reducing the project. `heartbeat` events contain `{time}`.

SSE responses disable proxy buffering through standard cache/transform headers and `X-Accel-Buffering: no`. Verify streaming and reconnection through the actual hosting proxy before relying on it for team work.

## Verification

`tests/live-core.test.cjs` covers deterministic canonicalization, disjoint changes, independent insertions, conflicting fields and orders, deletion conflicts, safe metadata and malicious keys. `tests/cloud-live.test.cjs` uses real HTTP fetch streams with concurrent authenticated clients to exercise merge correctness, verified bases, reviewer restrictions, presence expiry, revocation, logout, updates, stream limits and large-document rejection. Existing workspace and backup tests continue to cover permissions and database snapshots. Tests use temporary in-memory servers and do not activate any hosted service.

Real multi-browser testing remains necessary for browser rendering, keyboard/touch interactions, background-tab behavior and the deployed proxy. Passing server and logic tests alone does not establish identical behavior on every browser or device.
