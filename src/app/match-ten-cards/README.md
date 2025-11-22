# Match Ten Cards

This Next.js page hosts the free-play "Match Ten Cards" activity. The table deals nine-card ranks (1-9) across four suits and keeps replenishing the top of the discard stack while the two-minute timer runs.

## Gameplay basics

- The board always shows **10 face-up cards** laid out in randomized slots that never overlap.
- Tap two cards that add up to **exactly 10**. Only those pairs clear from the board.
- Whenever cards leave the table (after a match or the dealer’s drop), the board immediately refills so you always see 10 cards.
- If the visible cards ever lack a valid pair, the table swaps in a complementary card so there’s always at least one sum-to-ten option.
- A dealer also adds a new card every few seconds to keep the table lively until the timer expires.

## Implementation notes

- `reset()` seeds the queue, lays out the first 10 cards (and their styles), and begins the timer/dealer loops.
- `addCardsToBoard()` instantly replenishes any cleared cards (capped at 10 visible) and uses predefined slots so cards never overlap.
- A watchdog effect guarantees at least one playable pair by swapping in a complement from the queue whenever necessary.

## Local development

```bash
npm run dev
```

Then open `/match-ten-cards` in the browser. Use the Reset button to confirm the board always opens with 10 cards in view.
