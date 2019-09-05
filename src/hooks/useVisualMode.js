import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(transition, replace = false) {
    if (!replace) {
      setHistory([initial].concat(mode));
    }

    setMode(transition);
  }

  function back() {
    if (!history.length) {
      setMode(initial);
    } else {
      setMode(history[history.length - 1]);
      setHistory([initial].splice(-1, 1));
    }
  }

  return { mode, transition, back };
}
