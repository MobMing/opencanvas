# Optional connected workspace

The public editor at https://mobming.github.io/opencanvas/ continues to work locally without an account. GitHub Pages cannot run the workspace server. No cloud account or paid service has been provisioned by this update.

## Recommended hosting

Use a Render Node web service with a persistent disk for a small private workspace. The repository includes `render.yaml`. Render's free web services do not preserve local SQLite files, so **use a paid service with a persistent disk**, or host this Node service yourself on a machine with durable storage. Check current charges in Render before creating anything.

Official guides: [Node services](https://render.com/docs/deploy-node-express-app), [persistent disks](https://render.com/docs/disks), [free-service limits](https://render.com/docs/free).

1. In your Render account, create a Blueprint from `MobMing/opencanvas` using `render.yaml`. Review the service and disk charges before confirming.
2. Set `ADMIN_USER` to a lowercase username with 3–40 letters, digits, underscores or hyphens. Set `ADMIN_PASSWORD` to a unique password of at least 12 characters. The server uses it only to create the first owner account; later environment changes do not reset an existing password.
3. Keep `OPENCANVAS_DB=/var/data/opencanvas.db`, the disk mounted at `/var/data`, and `ALLOWED_ORIGIN=https://mobming.github.io`. If you move the public app to another domain, update the exact origin (scheme and hostname, no trailing slash or path).
4. Keep the generated `INVITE_CODE` private. Invited people register through Studio Plus → Connect → New invited member. Give them the workspace URL and invitation code yourself. Registration does not grant access to existing designs.
5. Deploy and check `/health`. In OpenCanvas, open Studio Plus → Connect, enter the workspace URL, and sign in. Passwords travel directly to that server; the browser keeps the returned login token only in memory and sign-out revokes it. Sessions expire after 24 hours.
6. Choose Save current project to cloud. The owner can grant editor or reviewer access to existing workspace usernames. Open a cloud project as a local copy, edit it, then explicitly save it back to cloud. Refresh/open again after signing in on another device.

## Collaboration behavior

Projects are private to the owner and explicitly added members. Editors can save revisions and comment; reviewers can comment and approve or request changes for the version they reviewed. Owners manage access. Review status includes its version, so approval of an older version is not approval of a newer edit.

The Connect panel checks for updates and new comments every 15 seconds while open. A stale save receives a conflict instead of overwriting a teammate's newer version. Open the cloud copy and merge manually; this is shared-project editing with conflict protection, **not simultaneous character-by-character editing, live cursors, email notifications, or automatic merging**. Local recovery history is independent of cloud storage.

## Scheduled publishing: Bluesky

The first supported provider is Bluesky. Instagram, Facebook, TikTok and other providers are not wired up by this release.

1. Create a Bluesky app password in your own Bluesky account. Keep it in Render's secret environment settings as `BSKY_APP_PASSWORD`; set `BSKY_HANDLE` to the account handle. Do not put either credential in the repository or client HTML. If you do not want publishing, leave these values unset/blank.
2. Sign in as the publishing owner. Preview the current page and enter the post text, image description and local date/time. Check the explicit publishing approval box, then choose Schedule post.
3. The server stores a snapshot of the text and rendered JPEG at scheduling time. Later editor changes do not alter the scheduled post. The server must remain running; overdue jobs are processed when it next runs. Jobs are checked every 15 seconds. Cancel a pending job from Connect before its scheduled time.
4. Check the status: pending, sending, sent, failed or cancelled. Failed jobs are not automatically retried. Provider writes use a stable record key to prevent duplicate records when an interrupted job resumes. A provider outage or an invalid app password can prevent publication.

Only the workspace owner may publish to the configured Bluesky account. Posts support up to 300 code points and one JPEG under 950 KB. Video posting, ad insights, multiple connected social accounts and cross-platform analytics are not included. Publishing was tested with a mock provider, not by sending a real public post.

[Official Bluesky posting documentation](https://docs.bsky.app/docs/tutorials/creating-a-post)

## Running a private development server

Use Node.js 24. Set `ADMIN_PASSWORD`, `INVITE_CODE` and `ALLOWED_ORIGIN` in your shell or hosting secret settings, then run `node cloud/server.mjs`. The default port is 8787; `PORT` can override it. `OPENCANVAS_DB` controls the database path. Never commit the database, environment file or passwords. Use HTTPS for remote access. The frontend permits HTTP only for localhost testing.

Back up the SQLite database using a consistent SQLite backup or a stopped-service filesystem snapshot, including any WAL state. The basic service is intended for a small trusted team. It has password hashing, expiring/revocable sessions, invitation-only registration, role checks, CORS origin restrictions, request limits and login throttling. Email verification, password-reset email, MFA, enterprise SSO, real-time presence, antivirus scanning and enterprise audit logs are not included. Establish an operator recovery procedure and backups before storing important team work.

## Local tools remain independent

Studio Plus Recovery, Photo, Layouts, Campaign, Design check and Motion run in the browser. None automatically upload a project, photo or backup. AI subject segmentation is not part of this release; cutout refinement uses editable brush strokes and edge-connected color removal. Media files selected for Motion remain session-only and must be selected again after a reload.
