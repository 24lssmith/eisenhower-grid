# Eisenhower Grid

An installable task board that sorts work into four quadrants: **Do**, **Schedule**, **Delegate** and **Drop**. It's styled in Brackett & Ellis navy, gold and steel.

## What it does

- **Quick add with shorthand.** Type `Draft MSJ outline #Lindsay /2 fri !` and press Enter.
  - `/1`–`/4` quadrant (`/0` Inbox) · `#matter` or `#"Two words"` · `@person` (implies Delegate)
  - `fri`, `next fri`, `tomorrow`, `12/14`, `Dec 14`, `in 3 days`, `due fri` · `!` hard deadline · `every week`, `every weekday`, `every month`
  - `Matter: task` also sets the matter. Paste several lines to add them all at once.
- **Inbox** for tasks you haven't sorted yet.
- **Matters**: filter the grid to one client or case.
- **Next 14 days**: a docket strip of upcoming due dates. Diamonds mark hard deadlines.
- **Task details**: checklist, notes, delegate, repeat, and hard deadline flag.
- **Weekly review**: what got done, what's overdue, hard deadlines ahead, what's waiting on someone, and what's gone stale.
- **Command palette** (`Ctrl K` or `/`), full keyboard control (`?` lists shortcuts), and undo/redo for every change (`Ctrl Z`, `Ctrl Shift Z`).
- **Drag and drop** with a mouse or touch. On a touchscreen, press and hold a task first, or drag its grip handle.
- **Data**: Back up and Restore (.json), Export to Excel (.csv), and Paste a list.

## Where tasks are saved

The app at this address saves tasks only in the browser on the device you use. Nothing is sent to a server, and no tasks are stored in this repository. Use **Back up** regularly.

`tools/build-artifact.py` builds a Claude version of the same app. It saves tasks to the user's Claude account so they sync across devices.

## Install

**Windows (Edge):** open the site, then choose **… → Apps → Install this site as an app**. Right-click its taskbar icon and choose **Pin to taskbar**.

**iPhone (Safari):** open the site, tap **Share**, then **Add to Home Screen**.

## Updating

Change the files, then bump `VERSION` in `sw.js` (and in `index.html`). Installed copies show "A new version is ready" with a **Reload** button.

Fonts: Libre Caslon Text and Public Sans, both under the SIL Open Font License (see `fonts/`).
