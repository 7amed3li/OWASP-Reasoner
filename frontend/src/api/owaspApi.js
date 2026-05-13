const API_BASE = process.env.REACT_APP_API_BASE || '/api';
const TIMEOUT_MS = 10000;

/** Belirli süre sonra isteği iptal eden AbortSignal üretir */
function timeoutSignal() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), TIMEOUT_MS);
    return controller.signal;
}

/** Fetch wrapper: ağ hatası ve HTTP hata ayrımı yapar */
async function apiFetch(url, options = {}) {
    try {
        const res = await fetch(url, { signal: timeoutSignal(), ...options });
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.error || `Sunucu hatası: ${res.status} ${res.statusText}`);
        }
        if (json.success === false) {
            throw new Error(json.error || 'Bilinmeyen API hatası.');
        }
        return json;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.');
        }
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            throw new Error('Sunucuya bağlanılamıyor. Backend çalışıyor mu? (npm start)');
        }
        throw err;
    }
}

export async function fetchQuestions() {
    const json = await apiFetch(`${API_BASE}/questions`);
    return json.data;
}

export async function fetchKnowledgeBase() {
    const json = await apiFetch(`${API_BASE}/knowledge-base`);
    return json.data;
}

export async function analyzeAnswers(answers) {
    const json = await apiFetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
    });
    return json.data;
}

export async function checkHealth() {
    try {
        const json = await apiFetch(`${API_BASE}/health`);
        return json;
    } catch {
        return { status: 'error' };
    }
}
