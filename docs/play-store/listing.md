# Store listing

What Google Play asks for, with the constraints that actually cause rejections.

## Text

| Field | Limit | Value |
|---|---|---|
| App name | 30 chars | Дурак Мастер |
| Short description | 80 chars | Классический дурак онлайн: подкидной и переводной, столы на 2–6 игроков |
| Full description | 4000 chars | See below |

The full description should cover: what the game is, the modes (подкидной / переводной), deck
sizes, table sizes, playing against bots or people, and that credits are in-game only and cannot
be bought or traded. That last point matters — it is what keeps the listing out of the gambling
category.

Do not promise features that are not in the build. A description mentioning tournaments before
tournaments exist is grounds for removal.

## Graphics

| Asset | Size | Notes |
|---|---|---|
| App icon | 512×512 PNG | No transparency, no rounded corners of your own |
| Feature graphic | 1024×500 PNG/JPG | Shown at the top of the listing; no small text |
| Phone screenshots | 2–8, min 320px, max 3840px | Ratio between 16:9 and 9:16 |
| Tablet screenshots | Optional | Only if the tablet layout is worth showing |

Take screenshots from a real build, not mockups. `bun run test:e2e:shots` walks every screen and
writes them to `e2e/.shots/` — a fast way to see what the store would show.

## Categorisation

- **Category:** Games → Card
- **Tags:** карточная игра, дурак, онлайн
- **Content rating:** complete the questionnaire honestly. The game has no violence, no
  suggestive content, and no real-money gambling.
- **Target audience:** 13+. The game is not designed for children, and saying otherwise pulls in
  the Families policy with its extra requirements.
- **Ads:** none.

## Localisation

The app ships Russian and English. List both in the console with translated copy — an untranslated
listing in a locale the app supports reads as abandoned.
