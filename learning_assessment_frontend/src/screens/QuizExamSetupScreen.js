import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { LargeToggle } from "../components/LargeToggle";
import * as questionsApi from "../api/questions";

// PUBLIC_INTERFACE
export function QuizExamSetupScreen() {
  /** Teacher selects questions, then starts a quiz/exam play session (placeholder). */
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [mode, setMode] = useState("quiz"); // quiz | exam
  const [locked, setLocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const subtitle = useMemo(
    () => "Teacher controls flow. This is a placeholder until backend session endpoints are ready.",
    []
  );

  useEffect(() => {
    (async () => {
      const res = await questionsApi.listQuestions();
      setQuestions(res.results || []);
      // preselect first few
      const initial = new Set((res.results || []).slice(0, 5).map((q) => q.id));
      setSelectedIds(initial);
    })();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const start = () => {
    const picked = questions.filter((q) => selectedIds.has(q.id));
    // Store a light local session (placeholder) to show teacher-controlled navigation in Play screen.
    const session = {
      mode,
      locked,
      currentIndex,
      questionIds: picked.map((q) => q.id),
      questionsById: Object.fromEntries(picked.map((q) => [q.id, q])),
      startedAt: Date.now(),
      durationSec: mode === "exam" ? 600 : 0, // exam has timer placeholder (10 min)
    };
    try {
      sessionStorage.setItem("tv_session_v1", JSON.stringify(session));
    } catch {
      // ignore
    }
    navigate("/play/quiz");
  };

  return (
    <AppLayout title="Quiz / Exam Setup" subtitle={subtitle}>
      <div className="grid grid-2">
        <Card title="Mode" description="Quiz is guided; Exam uses a timer and stricter flow.">
          <div className="grid" style={{ marginTop: 14 }}>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={2}
              variant={mode === "quiz" ? "primary" : "ghost"}
              onClick={() => setMode("quiz")}
              full
            >
              Quiz Mode
            </FocusButton>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={2}
              variant={mode === "exam" ? "secondary" : "ghost"}
              onClick={() => setMode("exam")}
              full
            >
              Exam Mode
            </FocusButton>
          </div>

          <div className="hr" />

          <LargeToggle
            tvnavGroup="main"
            tvnavCols={2}
            label="Lock student navigation"
            value={locked}
            onToggle={() => setLocked((v) => !v)}
            onLabel="Locked (teacher controls)"
            offLabel="Unlocked"
          />

          <div className="field">
            <div className="label">Starting question index</div>
            <input
              className="input"
              type="number"
              min={0}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(Math.max(0, Number(e.target.value || 0)))}
              aria-label="Starting question index"
              data-tvnav="true"
              data-tvnav-group="main"
              data-tvnav-cols="2"
            />
          </div>

          <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={start} full>
            Start Session
          </FocusButton>
        </Card>

        <Card title="Pick Questions" description="Select what to include in the session (stubbed list).">
          <div className="grid" style={{ marginTop: 14 }}>
            {questions.slice(0, 8).map((q) => {
              const selected = selectedIds.has(q.id);
              return (
                <FocusButton
                  key={q.id}
                  tvnavGroup="main"
                  tvnavCols={2}
                  variant={selected ? "primary" : "ghost"}
                  onClick={() => toggleSelect(q.id)}
                  full
                >
                  {selected ? "✓ " : ""}{q.prompt}
                </FocusButton>
              );
            })}
          </div>
          <p className="helper" style={{ marginTop: 12 }}>
            Selected: {selectedIds.size}. (More advanced filtering will come with backend integration.)
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
