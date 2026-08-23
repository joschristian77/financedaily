# Duit — daily money tracker

A phone-first expense tracker for people spending in **RMB and Rupiah**. Type an entry
the way you'd say it — `dinner food 20rmb` — and it works out the amount, currency,
category and date on its own.

No build step, no framework, no npm. Static files you can drop on any host.

---

## What's here

| File | What it does |
|---|---|
| `index.html` | Page shell |
| `app.css` | All styling, light + dark |
| `app.js` | The whole app — parser, views, charts, storage |
| `sync.js` | Firestore sync. Only downloaded if you switch sync on |
| `sw.js` | Service worker, so the app opens offline |
| `manifest.webmanifest`, `icon*.png`, `icon.svg` | Home-screen install |

---

## Running it

**Locally** — it needs to be served, not opened from the filesystem:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

**On GitHub Pages** — push these files to a repo, then Settings → Pages → deploy from
branch `main`, folder `/ (root)`. Your app lands at
`https://<username>.github.io/<repo>/`.

On your phone, open that URL and **Add to Home Screen**. It then runs full-screen and
opens offline like a real app.

---

## How typing works

One line, then Enter.

| You type | It records |
|---|---|
| `dinner food 20rmb` | ¥20 · Food · "dinner" |
| `kopi 18rb` | Rp18.000 · Food · "kopi" |
| `grab 25k` | Rp25.000 · Transport |
| `kemarin nasi goreng 15000` | Rp15.000 · Food · yesterday |
| `hotel 1.2jt 12/8` | Rp1.200.000 · Travel · 12 August |
| `1.2wan fangzu` | ¥12,000 · Rent |
| `+gaji 8000rmb` | ¥8,000 **income** · Salary |

**Currency.** `rmb` `¥` `元` `kuai` → RMB. `rb` `ribu` `jt` `juta` `rp` → Rupiah.
`wan` / `万` → ten-thousand RMB. A bare number is guessed by size: under 1,000 is RMB,
1,000 and up is Rupiah. Turn that off in Settings if you'd rather fix one default.

**Dates.** `kemarin`, `yesterday`, `zuotian`, `3 hari lalu`, `12/8`, `2026-08-12`.
Or tap the date chip next to the input.

**Income.** Start with `+`, or use a word like `gaji`, `salary`, `bonus`, `refund`,
`invoice`.

**Catching up.** History → **Paste many** takes a whole block, one entry per line,
and shows you exactly what it parsed before anything is saved. Lines it can't read are
flagged and skipped rather than guessed at.

Keywords cover English, Indonesian and Chinese — including `waimai`, `taobao`, `ditie`,
`malatang`, `fangzu`, `alfamart`, `ojek`, `gofood`, `indomaret`.

---

## Sync across devices (optional)

Sync is **off** by default and the app is fully usable without it — everything is stored
on the device in `localStorage`.

> **If you're in mainland China:** Firebase (`firestore.googleapis.com`) and the
> `gstatic.com` CDN are blocked without a VPN, and GitHub Pages is intermittent. This is
> why the app is local-first: entries save instantly to the device and never wait on the
> network. Sync catches up whenever it can get through. Nothing is lost in the meantime —
> but do keep an eye on **Export backup**.

### 1. Create the Firebase project

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. **Build → Firestore Database → Create database** → production mode
3. **Build → Authentication → Sign-in method → Google → Enable**
4. **Authentication → Settings → Authorized domains** → add `<username>.github.io`
5. **Project settings → Your apps → Web (`</>`)** → register → copy the `firebaseConfig` object

### 2. Lock it down

Firestore → **Rules**, paste this, **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

This is the part that actually protects your data — it means only you, signed in, can
read or write your own documents.

### 3. Turn it on

In the app: **More → Firebase settings**, paste the config object, Save. Then flip
**Sync across devices** on and sign in with Google. Repeat on your other device with the
same Google account.

The `apiKey` in that config is **not a secret** — it's a public project identifier, safe
to commit to a public repo. The rules above are what enforce access.

### How sync resolves conflicts

Each transaction carries an `up` (updated-at) timestamp; the newest write wins. Deletes
leave a tombstone in `users/{uid}/tomb` so a deletion on your phone also removes the entry
on your laptop instead of the laptop resurrecting it.

---

## Your data

- **Export backup** — full JSON, everything including settings
- **Import backup** — merge or replace
- **Export CSV** — for Excel or Sheets, with an `amount_in_<currency>` column already converted

The exchange rate is set by hand in Settings and never fetched — the app makes no network
requests of its own unless you turn on sync.

---

## Changing things

**Add a category** — append to `CATS` in `app.js`. Give it an `id`, `label`, `icon` (a key
in `ICON`), `color`, `kind` (`expense` or `income`), and `kw`, a space-separated keyword
list the parser matches against. Keywords are matched whole-word first, then as a
substring fallback, so put distinctive words in.

**Add a currency** — add to `CUR` plus the relevant entries in `CUR_WORDS` / `MULT`.
Conversion runs through `toBase()`, which currently assumes a single RMB↔Rupiah rate.

**After editing any file**, bump `CACHE` in `sw.js` (e.g. `duit-v2` → `duit-v3`), or
returning visitors keep the cached old version.
