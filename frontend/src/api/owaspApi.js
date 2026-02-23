const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001/api';

export async function fetchQuestions() {
    const res = await fetch(`${API_BASE}/questions`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
}

export async function fetchKnowledgeBase() {
    const res = await fetch(`${API_BASE}/knowledge-base`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
}

export async function analyzeAnswers(answers) {
    const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
}

export async function checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
}
