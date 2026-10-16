# Workspace recovery and backups

Open **Studio Plus → Recovery** to download or restore a workspace, recover a local version, or connect a backup folder.

## Downloaded backups

Version 3 workspace files include current projects, folders, Trash, saved layouts, installed custom fonts, brand kits, campaign planning records, text styles, starred projects and saved-template bookmarks. Project font files are embedded in each project so they remain portable. The file also includes a SHA-256 check that detects accidental changes or incomplete files before restore; this is an integrity check, not proof of who created the backup.

Backups do not contain account connection tokens, local version history, or session-only audio/video files. The workspace limit is 100 MB, 500 current projects, 500 projects in Trash and 500 saved layouts. Export oversized projects individually. If browser storage is unavailable, an emergency download can still preserve in-memory projects, with a warning that saved layouts or installed fonts may be unavailable.

Restore adds copies with new identifiers and remaps folder, campaign, brand and star references. Existing projects and settings are not replaced. Uncheck **Also add fonts, brands, campaign plans, text styles and saved items** to restore projects, folders and layouts only. Older version 1 and 2 workspace files remain supported.

Projects and layouts are committed together to local storage. Fonts and other settings use separate browser stores, so an unavailable font store or full settings store can produce a partial restore: the projects remain safely imported, existing settings stay intact, and the recovery panel reports what was not added. Projects retain their embedded fonts even if the separate font library cannot be saved. Keep the original backup file until the restored workspace has been checked.

## Optional folder backups

In a browser with the File System Access API, choose a folder with **Choose backup folder**. The first backup runs immediately. While the page remains open, subsequent design saves schedule one backup five minutes later, including edits made during that interval. **Back up now** writes another independent copy. Every file gets a date and unique suffix; existing files are never deliberately overwritten or deleted.

Each write is closed and read back before it is reported as verified. Access may need renewal after restarting the browser. A denied permission or disk error pauses that attempt and is shown in Recovery. Browsers without folder access retain manual download and restore. **Stop folder backups** forgets the connection and keeps existing files.

Folder backups run only while OpenCanvas is open. Selecting a folder managed by the user's own drive-sync software can provide an off-device copy, but OpenCanvas does not create or verify that external synchronization. A folder on the same disk alone does not protect against device loss. Review folder size and remove old backups manually when appropriate.

## Local save safeguards

The editor checks the full migrated workspace before removing legacy local-storage copies, flushes on page visibility changes, and warns before closing when a local save is pending or has failed. Browsers do not guarantee a warning during a crash or forced shutdown. Keep independent backups even when the save indicator says the project is saved.
