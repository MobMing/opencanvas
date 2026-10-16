# Managed hosting and recovery

Prepared October 16, 2026. **No hosting, billing, bucket, domain, or social account has been activated.** Mathew requested managed hosting and a cost review before activation. The public editor stays at [OpenCanvas](https://mobming.github.io/opencanvas/), and its local tools remain free to use.

## Proposed setup and cost

Keep the editor on GitHub Pages. Run the existing optional workspace server on Render with one persistent disk. This avoids a database migration and gives a small invited team cloud project copies, access roles, comments and approvals.

| Item | Prepared choice | Estimated monthly charge, USD |
| --- | --- | ---: |
| Render workspace | Hobby | $0 |
| Always-on Node service | `0.5c-512mb` (formerly Starter) | $7.00 |
| Persistent disk | 5 GB, including room for backups | $1.25 |
| Base total | One service and one disk | **$8.25** |
| Optional offsite backups | Cloudflare R2 Standard, within unused free allowance | $0 at small usage |

The smallest 1 GB disk would bring the base to $7.25/month, but leaves less room for photos, SQLite working files and backup copies. The prepared `render.yaml` uses 5 GB. Render currently lists disk storage at $0.25/GB/month and this compute plan at $7/month. Its Hobby workspace includes 5 GB monthly outbound bandwidth, then $0.15/GB. Taxes, extra bandwidth/build usage, account-level charges and future growth are additional; these estimates are not a spending cap. Check the actual checkout total before activation. [Render pricing](https://render.com/pricing), [plan names](https://render.com/docs/compute-plans).

R2 Standard currently includes 10 GB-month storage, one million Class A requests and ten million Class B requests monthly across the account. Beyond the allowance, storage is $0.015/GB-month, Class A requests $4.50/million and Class B $0.36/million; R2 egress is free. Thirty daily 100 MB encrypted backups use about 3 GB after retention fills, within an otherwise unused allowance. Render outbound bandwidth also counts the upload. Set a 30-day lifecycle rule so retained files do not grow indefinitely. Review billing in both accounts. [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [lifecycle rules](https://developers.cloudflare.com/r2/buckets/object-lifecycles/).

This is a single-instance starter setup, not a fully managed database or a high-availability public SaaS. The application still operates SQLite. A disk-backed Render service cannot scale to multiple instances and deploys can briefly interrupt it. Review larger compute, managed PostgreSQL and object storage if the team or image library grows. [Persistent disk limitations](https://render.com/docs/disks).

## What this release prepares

- SQLite's online backup API creates consistent snapshots, including committed WAL changes, while the server remains available. Every snapshot passes an integrity and workspace-schema check.
- With `BACKUP_DIR` set, the server checks after startup and hourly thereafter. It creates a snapshot when the most recent one is at least 24 hours old, and retains three local snapshots by default. No separate paid cron service is needed.
- Optional R2 uploads compress and encrypt each snapshot using AES-256-GCM before sending it over HTTPS to a private bucket. Uploads stream from disk. A failed upload leaves the local snapshot intact and retries at the next hourly check.
- The owner can inspect backup status or run a snapshot from Connect. Other members cannot invoke server backup controls. Raw database files are never exposed through an HTTP download route.
- Recovery writes a **new** database file, verifies it, revokes saved login sessions and cancels pending/sending social posts so old scheduled work cannot unexpectedly publish again.

A local snapshot protects against accidental database edits; it does not protect against deletion of the whole Render service or loss of the same disk. Enable offsite storage and complete a restore drill before relying on the server for important work. Server backups include only projects explicitly saved to cloud, not browser-only projects or session-only video files. The daily schedule has an approximately 24-hour recovery-point window while the service runs. Backup failure status and private logs need operator attention; automated email alerts are not included.

## Activation checklist, after cost approval

1. In the owner's Render account, create a Blueprint from `MobMing/opencanvas`. Review the single service, 5 GB disk, workspace plan, estimated charges and region before confirming the paid deployment. Keep one instance. No Render database or worker is required.
2. Set a unique `ADMIN_PASSWORD` of 12–200 characters and keep the generated invitation code private. `ADMIN_USER` defaults to `owner`; changing the password environment variable later does not reset an existing account.
3. Keep `OPENCANVAS_DB=/var/data/opencanvas.db`, `BACKUP_DIR=/var/data/backups`, `BACKUP_KEEP=3` and `ALLOWED_ORIGIN=https://mobming.github.io`. These folders are on the persistent disk. Do not put backups in `dist/` or the repository. The allowed origin has no path or trailing slash.
4. Leave social publishing credentials unset. They are unrelated to cloud saving. The frontend requires HTTPS for remote workspace connections.
5. Open the deployed service's `/health`, then sign in through OpenCanvas → Studio Plus → Connect with the service's HTTPS address. Save a disposable project, open it on a second browser/device and confirm its contents. Local and cloud saving are separate; existing browser projects do not upload automatically.
6. Run an owner backup and check the reported timestamp. If offsite settings are configured, verify that **both** local and offsite timestamps are current. Configure provider billing notifications and check disk usage regularly.
7. Complete the restore drill below using a new database path before inviting the team. Keep the encryption key in a password manager and an independent recovery copy.

## Optional private R2 setup

Create a private **Standard** R2 bucket after reviewing the account's billing terms. Do not enable a public `r2.dev` address or public custom domain. Add a lifecycle rule to delete objects under `opencanvas/` after 30 days. Create an R2 API credential with object read/write access scoped only to this bucket; keep it out of the browser, repository and logs. [R2 S3 credentials](https://developers.cloudflare.com/r2/api/tokens/).

Set all five settings in the Render service's private environment configuration:

| Setting | Value |
| --- | --- |
| `BACKUP_R2_ACCOUNT_ID` | Cloudflare account's 32-character ID |
| `BACKUP_R2_BUCKET` | The private bucket name |
| `BACKUP_R2_ACCESS_KEY_ID` | Bucket-scoped access key |
| `BACKUP_R2_SECRET_ACCESS_KEY` | Bucket-scoped secret key |
| `BACKUP_ENCRYPTION_KEY` | A random 32-byte key encoded as 64 hexadecimal characters |

Generate the encryption key with a password manager capable of 32 random bytes, or locally with Node's cryptographic random generator. Store the key separately from the hosting provider and retain old keys when rotating; earlier backups need the key that encrypted them. Losing the key makes an encrypted backup unrecoverable. Partial R2 configuration prevents the server from starting rather than silently disabling offsite protection.

R2 uses the `auto` region and the account's S3 endpoint. The prepared upload path is `opencanvas/<snapshot-name>.db.ocbackup`. Upload/signing and encrypted recovery are tested with a mock provider; **a real R2 upload/download restore drill still needs to be performed after activation**. No paid account or live provider write was used in development.

## Backup operations

Use Node.js 24 or newer. Run these from the repository directory in the Render service's private shell, which inherits its environment. They do not print passwords or encryption keys.

```sh
# Consistent local snapshot only.
node cloud/backup-cli.mjs snapshot

# Local snapshot plus optional configured encrypted R2 copy.
node cloud/backup-cli.mjs backup

# Last successful local/offsite timestamps and failure status.
node cloud/backup-cli.mjs status

# Check a specific local snapshot; output contains counts, not project contents.
node cloud/backup-cli.mjs verify /var/data/backups/EXACT-SNAPSHOT-NAME.db
```

Run one operator command at a time, outside the automatic backup run. Owner status is also available through authenticated `GET /backups/status`; `POST /backups` starts a backup. Do not treat the `/health` response as proof that backups succeeded. Investigate an error or a timestamp older than 26 hours. The manager checks free space before a snapshot and does not delete older copies to force a backup onto a full disk. With the prepared 5 GB disk, review capacity well before the live database approaches 500 MB: retained snapshots, temporary encrypted files and WAL also use space. Daily cloud project copies contain embedded images and can grow quickly.

## Restore drill and incident recovery

1. Choose a known-good local `.db` snapshot or download an encrypted `.ocbackup` object from the **private** R2 bucket. Transfer it securely using the provider dashboard or SSH/SFTP. Never attach a team database to a public issue. Keep a copy of the current database before any production switch.
2. Verify or restore to a new path. The command deliberately refuses to overwrite an existing database. For encrypted files, provide the corresponding `BACKUP_ENCRYPTION_KEY` through the private environment first.

```sh
node cloud/backup-cli.mjs restore /var/data/backups/EXACT-SNAPSHOT-NAME.db /var/data/recovered-drill.db
# Or, after downloading an offsite object:
node cloud/backup-cli.mjs restore /var/data/downloaded-backup.db.ocbackup /var/data/recovered-drill.db
node cloud/backup-cli.mjs verify /var/data/recovered-drill.db
```

3. For a drill, inspect the returned project/user counts and test the restored database with a separate local test server and a different port, with social credentials unset. Sign in with an existing restored account and inspect several designs. Test recovery at least monthly and after schema changes; record the snapshot time, verified counts and result privately.
4. For an actual recovery, announce downtime and stop incoming edits. Preserve the current database and its WAL/SHM state using a consistent backup. Set the service's `OPENCANVAS_DB` to the new verified file and redeploy/restart the single service. Keep the prior database for rollback. Do not copy a snapshot over a live database.
5. Confirm project content and access roles, then create a fresh backup. All users must sign in again. Review cancelled scheduled posts individually before rescheduling anything. Do not automatically resume publishing from a restored snapshot.

Render disk snapshots are separate from these application backups. Render cautions against using a disk snapshot to restore a custom database; prefer the verified SQLite backup above. A code rollback also does not roll back the persistent database. [Render database recovery guidance](https://render.com/docs/disks), [Node SQLite backup API](https://nodejs.org/api/sqlite.html#sqlitebackupsourceDb-path-options).

## Remaining service work

The editor does not automatically synchronize local projects, merge simultaneous edits, or show live teammate cursors. This backend remains invitation-only and does not provide password-reset email, email verification, MFA or enterprise SSO. Those are separate production hardening and collaboration tasks; the hosting preparation does not claim to add them.
