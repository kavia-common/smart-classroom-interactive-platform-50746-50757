import React, { useEffect, useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";

function makeDeck() {
  const pairs = ["🐶", "🐱", "🦊", "🐼", "🐸", "🦁", "🐵", "🐙"];
  const cards = [...pairs, ...pairs].map((value, i) => ({
    id: `c${i}`,
    value,
    revealed: false,
    matched: false,
  }));
  // shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// PUBLIC_INTERFACE
export function MemoryGameScreen() {
  /** Simple matching memory game optimized for TV D-pad navigation. */
  const [cards, setCards] = useState(makeDeck());
  const [firstPick, setFirstPick] = useState(null);
  const [secondPick, setSecondPick] = useState(null);
  const [moves, setMoves] = useState(0);

  const cols = 4;

  const allMatched = useMemo(() => cards.every((c) => c.matched), [cards]);

  useEffect(() => {
    if (!firstPick || !secondPick) return;

    const a = cards.find((c) => c.id === firstPick);
    const b = cards.find((c) => c.id === secondPick);
    if (!a || !b) return;

    if (a.value === b.value) {
      setCards((prev) =>
        prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c))
      );
      setFirstPick(null);
      setSecondPick(null);
      return;
    }

    const t = setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, revealed: false } : c
        )
      );
      setFirstPick(null);
      setSecondPick(null);
    }, 700);

    return () => clearTimeout(t);
  }, [firstPick, secondPick, cards]);

  const flip = (id) => {
    const c = cards.find((x) => x.id === id);
    if (!c || c.matched || c.revealed) return;
    if (secondPick) return; // wait

    setCards((prev) => prev.map((x) => (x.id === id ? { ...x, revealed: true } : x)));

    if (!firstPick) {
      setFirstPick(id);
      return;
    }
    setSecondPick(id);
    setMoves((m) => m + 1);
  };

  const reset = () => {
    setCards(makeDeck());
    setFirstPick(null);
    setSecondPick(null);
    setMoves(0);
  };

  return (
    <AppLayout
      title="Memory Game"
      subtitle="Match pairs. Use arrows to move, Enter to flip. Back/Escape returns."
    >
      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="tv-pill">
          <span className="badge">Moves: {moves}</span>
          <span className="badge badge-warn">Pairs: {cards.filter((c) => c.matched).length / 2} / 8</span>
          {allMatched ? <span className="badge">All matched!</span> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <FocusButton tvnavGroup="main" tvnavCols={cols} variant="secondary" onClick={reset}>
            Reset
          </FocusButton>
        </div>
      </div>

      <div className="grid grid-4">
        {cards.map((c) => (
          <div key={c.id}>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={cols}
              variant={c.matched ? "primary" : c.revealed ? "secondary" : "ghost"}
              onClick={() => flip(c.id)}
              full
              disabled={c.matched}
              ariaLabel="Memory card"
            >
              <span style={{ fontSize: "38px", lineHeight: 1 }}>
                {c.revealed || c.matched ? c.value : "❓"}
              </span>
            </FocusButton>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <Card
          title="How to play"
          description="Find matching pairs. If two flipped cards don't match, they flip back."
        />
      </div>
    </AppLayout>
  );
}
