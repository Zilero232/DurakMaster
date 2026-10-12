# `model/hooks` structure

Part of the [style guide](../README.md).

## 2.2. Structure of `model/hooks`

When `model/` holds several hooks with their own types, **a hook with its own types goes into its own folder**; a flat file only if there are no types.

```text
entities/game-table/model/hooks/
  index.ts                          ← barrel of the group
  use-turn-pulse/
    use-turn-pulse.ts               ← a hook without types — a folder is not required,
    index.ts                           but uniformity within the slice matters more
  use-card-size/
    use-card-size.ts
    use-card-size.types.ts          ← there is an Input/Output type → the folder is required
    index.ts
```

The hook's `index.ts` re-exports both the hook and the types:

```ts
export { useCardSize } from './use-card-size';

export type * from './use-card-size.types';
```

A hook folder may also carry its own `.config.ts` for constants only it reads
(`use-watch-ad/use-watch-ad.config.ts` — the reward polling delays).

**The one type that stays in the hook file** is a return type derived from the hook itself:
`export type OnlineGame = ReturnType<typeof useOnlineGame>;` (`entities/session/model/hooks/use-online-game`).
Moving it to `.types.ts` would make the two files import each other.

The hook's input type is named `Use<Name>Input` ([naming](../shared/naming.md) §5). If it repeats the component's props — do not duplicate, derive it: `Pick<GameTableProps, 'tableId' | 'onLeave'>`.

Every slice in the app follows this shape now — even a single hook sits in `model/hooks/<hook>/`
(`widgets/game/online-table/model/hooks/use-table-stage`). `shared/` has no slices, so its
segments apply only the types rule: `shared/model/time/use-now.ts` is a flat file,
`shared/model/time/use-count-to/` a folder.
