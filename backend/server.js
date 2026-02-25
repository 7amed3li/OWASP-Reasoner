const express = require('express');
const cors = require('cors');
const OWASPInferenceEngine = require('./src/engine');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false, credentials: true }));
app.use(express.json({ limit: '100kb' }));

// Initialize Inference Engine
const engine = new OWASPInferenceEngine();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'OWASP Expert System API is running.' });
});

// GET /api/questions 
// Returns all diagnostic questions from the knowledge base
app.get('/api/questions', (req, res) => {
    try {
        const questions = engine.getAllQuestions();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: 'Failed to fetch diagnostic questions.' });
    }
});

// POST /api/evaluate
// Takes user answers and returns the expert system's diagnosis
app.post('/api/evaluate', (req, res) => {
    try {
        const answers = req.body;
        
        // Basic validation
        if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
            return res.status(400).json({ error: 'Girdi geçersiz. Lütfen cevapları bir JSON objesi olarak (örn: { "IDOR-S1": true }) gönderin.' });
        }

        // Run the inference engine
        const report = engine.reason(answers);
        
        res.status(200).json(report);
    } catch (error) {
        console.error("Error evaluating answers:", error);
        res.status(500).json({ error: 'Değerlendirme sırasında sunucu hatası oluştu.' });
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`- GET  /api/questions : To fetch all diagnostic questions`);
    console.log(`- POST /api/evaluate  : To submit answers and get a diagnosis report`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use.`);
    } else {
        console.error(`Server failed to start:`, err);
    }
    process.exit(1);
});
