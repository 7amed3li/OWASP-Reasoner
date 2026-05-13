/**
 * OWASP Reasoner - Express REST API Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const OWASPInferenceEngine = require('./engine');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: CORS_ORIGINS env var'dan whitelist oku (yoksa dev için her şeye izin ver)
const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : null;

const corsOptions = corsOrigins
    ? { origin: (origin, cb) => cb(null, !origin || corsOrigins.includes(origin)) }
    : {};

app.use(cors(corsOptions));
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
        const status = err instanceof TypeError ? 400 : 500;
        res.status(status).json({ success: false, error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0.0', engine: 'Forward Chaining' });
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
    });
}

// Sunucuyu sadece doğrudan çalıştırıldığında başlat (import edilince başlatma)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`OWASP Reasoner API → http://localhost:${PORT}`);
        console.log(`Çıkarım Motoru: İleri Zincirleme (Forward Chaining)`);
    });
}

module.exports = app;
