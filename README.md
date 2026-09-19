# CariPark

Find parking in Kuala Lumpur from local social insights — Reddit threads, forums, and tip guides distilled into filterable spot cards.

**Domain target:** [park.topekuno.my](https://park.topekuno.my)

## What’s in this repo

Static site (no build step):

| File | Role |
|------|------|
| `index.html` | Hero, filters, spots grid, about |
| `styles.css` | Warm / teal KL-inspired layout |
| `app.js` | Loads `data/spots.json`, filters, card render + embedded fallback |
| `data/spots.json` | Parking spots snapshot (from Notion) |

## Local preview

Any static server works. From the repo root:

```bash
# Python
python3 -m http.server 8080

# or Node
npx --yes serve -p 8080
```

Then open `http://localhost:8080`.

`app.js` also embeds a fallback copy of the spots array, so a plain `file://` open still shows cards if `fetch` of `data/spots.json` fails (browsers often block local fetches).

## Data

Spot records are **snapshotted from Notion** (not live-synced). Fields include area, sentiment, difficulty, type, near, social verdict, tips, price note, best time, confidence, and source links.

Prices and tips are social snapshots from roughly **2024–2026** — always confirm on site before you go. See `rateDisclaimer` in `data/spots.json`.

## Filters

- **Area** — All + unique areas from the data (e.g. KLCC, Bukit Bintang, Mid Valley, Bangsar, Other)
- **Sentiment** — All / Recommended / Mixed / Avoid

## License

Content for personal / project use by topekuno. Third-party source links remain owned by their publishers.
