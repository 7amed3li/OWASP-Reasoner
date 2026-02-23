/**
 * OWASP Reasoner - Express REST API Server
 */

const express = require('express');
const cors = require('cors');
const OWASPInferenceEngine = require('./engine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const engine = new OWASPInferenceEngine();

// GET /api/questions — Tüm soruları getir
app.get('/api/questions', (req, res) => {
    try {
        const questions = engine.getAllQuestions();
        res.json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/knowledge-base — Knowledge base bilgisi
app.get('/api/knowledge-base', (req, res) => {
    try {
        const info = engine.getKnowledgeBaseInfo();
        res.json({ success: true, data: info });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/analyze — Cevapları gönder, çıkarım yap
app.post('/api/analyze', (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ success: false, error: 'answers alanı gerekli ve obje olmalı.' });
        }
        const result = engine.reason(answers);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0.0', engine: 'Forward Chaining' });
});

app.listen(PORT, () => {
    console.log(`OWASP Reasoner API → http://localhost:${PORT}`);
    console.log(`Çıkarım Motoru: İleri Zincirleme (Forward Chaining)`);
});

module.exports = app;
