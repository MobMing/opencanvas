# Optional connected workspace

The public editor at https://mobming.github.io/opencanvas/ continues to work locally without an account. GitHub Pages cannot run the workspace server. No cloud account or paid service has been provisioned by this update.

## Recommended hosting

The [managed hosting and recovery plan](MANAGED-HOSTING.md) now includes an estimated **$8.25/month** Render configuration, automatic local snapshots, optional encrypted offsite backups, tested restore commands and the activation checklist. The owner requested a cost review before activation; no paid service has been started.

Use a Render Node web service with a persistent disk for a small private workspace. The repository includes `render.yaml`. Render's free web services do not preserve local SQLite files, so **use a paid service with a persistent disk**, or host this Node service yourself on a machine with durable storage. Check current charges in Render before creating anything.

Official guides: [Node services](https://render.com/docs/deploy-node-express-app), [persistent disks](https://render.com/docs/disks), [free-service limits](https://render.com/docs/free).

1. In your Render account, create a Blueprint from `MobMing/opencanvas` using `render.yaml`. Review the service and disk charges before confirming.
2. Set `ADMIN_USER` to a lowercase username with 3–40 letters, digits, underscores or hyphens. Set `ADMIN_PASSWORD` to a unique password of at least 12 characters. The server uses it only to create the first owner account; later environment changes do not reset an existing password.
3. Keep `OPENCANVAS_DB=/var/data/opencanvas.db`, the disk mounted at `/var/data`, and `ALLOWED_ORIGIN=https://mobming.github.io`. If you move the public app to another domain, update the exact origin (scheme and hostname, no trailing slash or path).
4. Keep the generated `INVITE_CODE` private. Invited people register through Studio Plus → Connect → New invited member. Give them the workspace URL and invitation code yourself. Registration does not grant access to existing designs.
5. Deploy and check `/health`. In OpenCanvas, open Studio Plus → Connect, enter the workspace URL, and sign in. Passwords travel directly to that server; the browser keeps the returned login token only in memory and sign-out revokes it. Sessions expire after 24 hours.
6. Choose Save current project to cloud. The owner can grant editor or reviewer access to existing workspace usernames. Open a cloud project as a local copy, edit it, then explicitly save it back to cloud. Alternatively, choose **Edit together** to join live sharing on the updated server. Join explicitly from each participating tab; changes are shared automatically only while joined.

## Collaboration behavior

Projects are private to the owner and explicitly added members. Editors can save revisions and comment; reviewers can comment and approve or request changes for the version they reviewed. Owners manage access. Review status includes its version, so approval of an older version is not approval of a newer edit.

Ordinary cloud save/open remains explicit. The Connect panel checks updates and comments while open, and a stale explicit save receives a conflict rather than overwriting a teammate's revision. Local recovery history is independent of cloud storage.

**Edit together** enables live shared changes, teammate presence and cursors. Independent page/element/field changes merge. Overlapping edits to the same field, deletion-versus-edit and incompatible ordering changes pause with a conflict; the proposed update is rejected as a whole. Keep a local copy before reopening the shared version. Reviewers can watch changes and submit comments/reviews, but design writes remain blocked. Leaving stops live sharing and keeps a local copy. This is document merging, not a character-by-character text CRDT; email notifications are not included.

Live documents are limited to **10 MiB of canonical JSON**, including embedded images/fonts. The default server allows **16 live streams overall, eight per project and four per account**. Larger projects can use explicit cloud save/open subject to its 25 MiB limit. Local video/audio bytes are excluded from live sharing and cloud copies: collaborators need their own originals and must relink them. Read [Live collaboration](LIVE-COLLABORATION.md) for conflicts, reconnection, access revocation and detailed limits.

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

The prepared Render configuration sets `BACKUP_DIR` and retains three daily, verified SQLite snapshots. Optional R2 settings add an encrypted offsite copy. Follow the [backup and restore procedure](MANAGED-HOSTING.md) and complete a recovery drill before storing important team work. The basic service is intended for a small trusted team. It has password hashing, expiring/revocable sessions, invitation-only registration, role checks, CORS origin restrictions, request limits, login throttling and bounded live streams. Email verification, password-reset email, MFA, enterprise SSO, antivirus scanning and enterprise audit logs are not included. Verify live streaming and reconnection through the actual hosting proxy after activation.

## Local tools remain independent

Studio Plus Recovery, Photo, Layouts, Campaign, Design check and Motion run in the browser. None automatically upload a project, photo or backup. Person and click-selected pet/product cutouts use optional self-hosted models downloaded on request, with local processing; clone-and-blend retouch and background replacement use local pixels. Motion stores selected audio/video in a separate local library across reloads, mixes up to eight soundtrack clips and supports SRT/VTT or manual captions. Original media bytes are not included in project files, workspace backups, cloud copies or live sharing. These tools require no paid API. Managed hosting and billing remain unactivated pending the owner's cost review.
