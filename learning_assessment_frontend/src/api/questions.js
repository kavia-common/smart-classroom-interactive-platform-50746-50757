import { apiRequest, shouldUseStubs, stubbed } from "./client";

let stubQuestions = [
  { id: "q1", prompt: "2 + 2 = ?", answers: ["3", "4", "5", "6"], correctIndex: 1 },
  { id: "q2", prompt: "Capital of France?", answers: ["Rome", "Paris", "Berlin", "Madrid"], correctIndex: 1 },
  { id: "q3", prompt: "Largest planet?", answers: ["Mars", "Earth", "Jupiter", "Venus"], correctIndex: 2 },
];

// PUBLIC_INTERFACE
export async function listQuestions() {
  /** List questions (stubbed by default). */
  if (shouldUseStubs()) {
    return stubbed({ results: stubQuestions });
  }
  return apiRequest("/api/questions", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function upsertQuestion(question) {
  /** Create or update a question (stubbed by default). */
  if (shouldUseStubs()) {
    const isUpdate = Boolean(question.id);
    if (isUpdate) {
      stubQuestions = stubQuestions.map((q) => (q.id === question.id ? { ...q, ...question } : q));
      return stubbed({ result: stubQuestions.find((q) => q.id === question.id) });
    }
    const newQ = { ...question, id: `q${Date.now()}` };
    stubQuestions = [newQ, ...stubQuestions];
    return stubbed({ result: newQ });
  }

  const method = question.id ? "PUT" : "POST";
  const path = question.id ? `/api/questions/${question.id}` : "/api/questions";
  return apiRequest(path, { method, body: JSON.stringify(question) });
}

// PUBLIC_INTERFACE
export async function deleteQuestion(questionId) {
  /** Delete a question (stubbed by default). */
  if (shouldUseStubs()) {
    stubQuestions = stubQuestions.filter((q) => q.id !== questionId);
    return stubbed({ ok: true });
  }
  return apiRequest(`/api/questions/${questionId}`, { method: "DELETE" });
}
