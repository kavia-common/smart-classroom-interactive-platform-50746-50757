import React, { useEffect, useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import * as questionsApi from "../api/questions";
import { useAuth } from "../contexts/AuthContext";

function loadSession() {
  try {
    const raw = sessionStorage.getItem("tv_session_v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function QuizExamPlayScreen() {
  /** TV play screen with big answers, progress, and exam timer placeholder. */
  const { isTeacher } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(loadSession());
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await questionsApi.listQuestions();
      const all = res.results || [];

      if (session?.questionIds?.length) {
        const picked = session.questionIds
          .map((id) => session.questionsById?.[id] || all.find((q) => q.id === id))
          .filter(Boolean);
        setQuestions(picked);
        setIdx(Math.min(session.currentIndex || 0, Math.max(picked.length - 1, 0)));
        if (session.mode === "exam" && session.durationSec) {
          const elapsed = Math.floor((Date.now() - (session.startedAt || Date.now())) / 1000);
          setSecondsLeft(Math.max(0, session.durationSec - elapsed));
        }
      } else {
        setQuestions(all.slice(0, 5));
      }
    })();
  }, [session]);

  useEffect(() => {
    if (secondsLeft == null) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s == null ? null : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const q = questions[idx];

  const progress = useMemo(() => {
    if (!questions.length) return "0 / 0";
    return `${idx + 1} / ${questions.length}`;
  }, [idx, questions.length]);

  const timerLabel = useMemo(() => {
    if (secondsLeft == null) return null;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  const next = () => {
    setSelected(null);
    setIdx((i) => Math.min(i + 1, questions.length - 1));
  };

  const prev = () => {
    setSelected(null);
    setIdx((i) => Math.max(i - 1, 0));
  };

  const lockInfo = session?.locked ? "Locked (teacher controls)" : "Unlocked";
  const modeInfo = session?.mode ? session.mode.toUpperCase() : "QUIZ";

  return (
    <AppLayout
      title="Quiz / Exam Play"
      subtitle="Big buttons for TV. Enter selects. Back/Escape returns."
    >
      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="tv-pill">
          <span className="badge">{modeInfo}</span>
          <span className="badge badge-warn">{lockInfo}</span>
          <span className="tv-kicker">Progress: {progress}</span>
          {timerLabel ? <span className="badge badge-danger">Timer: {timerLabel}</span> : null}
        </div>
      </div>

      {!q ? (
        <Card title="No questions loaded" description="Go to Setup and start a session first." />
      ) : (
        <div className="grid grid-2">
          <Card title={q.prompt} description="Select an answer. (Scoring is placeholder)">
            <div className="grid grid-2" style={{ marginTop: 14 }}>
              {q.answers.map((ans, aIdx) => {
                const isPicked = selected === aIdx;
                const variant = isPicked ? "primary" : "ghost";
                return (
                  <FocusButton
                    key={aIdx}
                    tvnavGroup="main"
                    tvnavCols={2}
                    variant={variant}
                    onClick={() => setSelected(aIdx)}
                    full
                  >
                    {ans}
                  </FocusButton>
                );
              })}
            </div>
            <div className="hr" />
            <div className="grid grid-2">
              <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={prev} full>
                ◀ Previous
              </FocusButton>
              <FocusButton tvnavGroup="main" tvnavCols={2} variant="secondary" onClick={next} full>
                Next ▶
              </FocusButton>
            </div>
          </Card>

          <Card
            title="Session Controls"
            description={isTeacher ? "Teacher controls are enabled (placeholder)." : "Student view (placeholder)."}
          >
            <div className="grid" style={{ marginTop: 14 }}>
              <FocusButton
                tvnavGroup="main"
                tvnavCols={2}
                variant={session?.locked ? "primary" : "ghost"}
                onClick={() => setSession((s) => ({ ...(s || {}), locked: !(s?.locked) }))}
                full
                disabled={!isTeacher}
              >
                {session?.locked ? "Unlock navigation" : "Lock navigation"}
              </FocusButton>

              <FocusButton
                tvnavGroup="main"
                tvnavCols={2}
                variant="ghost"
                onClick={() => {
                  try {
                    sessionStorage.removeItem("tv_session_v1");
                  } catch {
                    // ignore
                  }
                  setSession(null);
                }}
                full
              >
                Clear Session (local)
              </FocusButton>
            </div>

            <p className="helper" style={{ marginTop: 12 }}>
              Placeholder session state: current question index, lock/unlock, and timer.
            </p>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
