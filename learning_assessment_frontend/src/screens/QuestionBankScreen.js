import React, { useEffect, useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { Modal } from "../components/Modal";
import * as questionsApi from "../api/questions";

function emptyDraft() {
  return { id: null, prompt: "", answers: ["", "", "", ""], correctIndex: 0 };
}

// PUBLIC_INTERFACE
export function QuestionBankScreen() {
  /** Question bank list/create/edit screen for teacher. */
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());

  const subtitle = useMemo(
    () => "Use arrows to move focus. Enter to edit. Back/Escape returns to previous screen.",
    []
  );

  const refresh = async () => {
    setLoading(true);
    const res = await questionsApi.listQuestions();
    setQuestions(res.results || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setDraft(emptyDraft());
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setDraft({ ...q, answers: q.answers?.length ? q.answers : ["", "", "", ""] });
    setModalOpen(true);
  };

  const save = async () => {
    await questionsApi.upsertQuestion(draft);
    setModalOpen(false);
    await refresh();
  };

  const remove = async (id) => {
    await questionsApi.deleteQuestion(id);
    await refresh();
  };

  return (
    <AppLayout title="Question Bank" subtitle={subtitle}>
      <div className="grid" style={{ marginBottom: 16 }}>
        <FocusButton tvnavGroup="main" tvnavCols={3} variant="primary" onClick={openCreate}>
          + Create Question
        </FocusButton>
      </div>

      {loading ? (
        <Card title="Loading questions..." description="Fetching from stubbed API (for now)." />
      ) : (
        <div className="grid grid-3">
          {questions.map((q) => (
            <Card key={q.id} title={q.prompt} description={`Correct answer: ${q.answers?.[q.correctIndex] || "—"}`}>
              <div className="grid" style={{ marginTop: 14 }}>
                <FocusButton
                  tvnavGroup="main"
                  tvnavCols={3}
                  variant="secondary"
                  onClick={() => openEdit(q)}
                  full
                >
                  Edit
                </FocusButton>
                <FocusButton
                  tvnavGroup="main"
                  tvnavCols={3}
                  variant="danger"
                  onClick={() => remove(q.id)}
                  full
                >
                  Delete
                </FocusButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title={draft.id ? "Edit Question" : "Create Question"} onClose={() => setModalOpen(false)}>
        <div className="field">
          <div className="label">Prompt</div>
          <input
            className="input"
            value={draft.prompt}
            onChange={(e) => setDraft((d) => ({ ...d, prompt: e.target.value }))}
            placeholder="Type the question prompt"
            aria-label="Question prompt"
            data-tvnav="true"
            data-tvnav-group="modal"
            data-tvnav-cols="1"
          />
        </div>

        <div className="hr" />

        <div className="grid grid-2">
          {draft.answers.map((ans, idx) => (
            <div className="field" key={idx}>
              <div className="label">{`Answer ${idx + 1}`}</div>
              <input
                className="input"
                value={ans}
                onChange={(e) =>
                  setDraft((d) => {
                    const next = [...d.answers];
                    next[idx] = e.target.value;
                    return { ...d, answers: next };
                  })
                }
                placeholder={`Option ${idx + 1}`}
                aria-label={`Answer ${idx + 1}`}
                data-tvnav="true"
                data-tvnav-group="modal"
                data-tvnav-cols="1"
              />
              <FocusButton
                tvnavGroup="modal"
                tvnavCols={1}
                variant={draft.correctIndex === idx ? "primary" : "ghost"}
                onClick={() => setDraft((d) => ({ ...d, correctIndex: idx }))}
                full
              >
                {draft.correctIndex === idx ? "Correct" : "Mark as correct"}
              </FocusButton>
            </div>
          ))}
        </div>

        <div className="hr" />

        <div className="grid grid-2">
          <FocusButton tvnavGroup="modal" tvnavCols={2} variant="primary" onClick={save} full>
            Save
          </FocusButton>
          <FocusButton tvnavGroup="modal" tvnavCols={2} variant="ghost" onClick={() => setModalOpen(false)} full>
            Cancel
          </FocusButton>
        </div>
      </Modal>
    </AppLayout>
  );
}
