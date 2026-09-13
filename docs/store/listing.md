# Store listing

What Google Play asks for, with the constraints that actually cause rejections.

## Text

| Field | Limit | Value |
|---|---|---|
| App name | 30 chars | Дурак Мастер |
| Short description | 80 chars | Классический дурак онлайн: подкидной и переводной, столы на 2–6 игроков |
| Full description | 4000 chars | See below |

Do not promise features that are not in the build. A description mentioning tournaments before
tournaments exist is grounds for removal.

### Full description — Russian

    Классический русский дурак онлайн. Подкидной и переводной, колода на 24, 36 или 52 карты,
    столы от двух до шести игроков.

    ЧТО ЕСТЬ В ИГРЕ

    • Подкидной и переводной дурак — режим выбирается при создании стола
    • Колода 24, 36 или 52 карты
    • От 2 до 6 игроков за столом
    • Настройка, кто может подкидывать: только соседи или все
    • Ничья включается и выключается
    • Приватные столы с паролем — играйте только со своими
    • Пять тем оформления колоды

    ЧЕСТНАЯ ИГРА

    Колода тасуется на сервере криптографическим генератором. Карты соперников не хранятся
    в приложении — клиент просто не знает, что у них на руках.

    ВАЛЮТА

    Кредиты и монеты зарабатываются в игре. Их нельзя купить, продать или передать другому
    игроку, и они не имеют ценности за пределами приложения.

    Игра бесплатная, без рекламы.

### Full description — English

    Classic Russian Durak online. Throw-in and transfer variants, decks of 24, 36 or 52 cards,
    tables for two to six players.

    WHAT IS IN THE GAME

    • Throw-in and transfer Durak — chosen when the table is created
    • Decks of 24, 36 or 52 cards
    • 2 to 6 players per table
    • Choose who may throw in: neighbours only, or everyone
    • Draws can be turned on or off
    • Private tables with a password — play with your own circle
    • Five deck themes

    FAIR PLAY

    The deck is shuffled on the server with a cryptographic generator. Opponents' cards are
    never stored in the app — the client simply does not know what they hold.

    CURRENCY

    Credits and coins are earned by playing. They cannot be bought, sold or transferred
    between players, and they have no value outside the app.

    Free to play, no ads.

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
