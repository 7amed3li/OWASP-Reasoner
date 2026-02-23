import React, { useEffect, useState, useCallback } from 'react';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestions, analyzeAnswers } from '../api/owaspApi';
import './QuizPage.css';

export default function QuizPage({ onComplete }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions()
            .then(qs => { setQuestions(qs); setLoading(false); })
            .catch(() => { setError('Sorular yüklenemedi.'); setLoading(false); });
    }, []);

    const handleAnswer = useCallback((id, value) => {
        setAnswers(prev => {
            const next = { ...prev };
            if (value === undefined) delete next[id];
            else next[id] = value;
            return next;
        });
    }, []);

    const handleNext = () => setCurrentIdx(i => Math.min(i + 1, questions.length - 1));
    const handlePrev = () => setCurrentIdx(i => Math.max(i - 1, 0));

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const result = await analyzeAnswers(answers);
            onComplete(result);
        } catch {
            setError('Analiz sırasında hata oluştu.');
            setSubmitting(false);
        }
    };

    const answered = Object.keys(answers).length;
    const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

    if (loading) return <div className="quiz-loading"><div className="loading-spinner" /><p>Sorular yükleniyor...</p></div>;
    if (error) return <div className="quiz-error">⚠️ {error}</div>;
    if (questions.length === 0) return null;

    const current = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;

    // Group navigation by category
    const categories = [...new Set(questions.map(q => q.categoryName))];

    return (
        <div className="quiz-page">
            {/* Sidebar */}
            <aside className="quiz-sidebar glass">
                <div className="sidebar-title">Kategoriler</div>
                {categories.map((cat, i) => {
                    const catQuestions = questions.filter(q => q.categoryName === cat);
                    const catAnswered = catQuestions.filter(q => answers[q.id] !== undefined).length;
                    return (
                        <div
                            key={cat}
                            className={`sidebar-cat ${questions[currentIdx].categoryName === cat ? 'active' : ''}`}
                            onClick={() => setCurrentIdx(questions.findIndex(q => q.categoryName === cat))}
                        >
                            <span className="sidebar-cat-name">{cat}</span>
                            <span className="sidebar-cat-progress">{catAnswered}/{catQuestions.length}</span>
                        </div>
                    );
                })}
                <div className="sidebar-stats">
                    <div className="sidebar-stat">
                        <span className="s-num">{answered}</span>
                        <span className="s-label">Cevaplanan</span>
                    </div>
                    <div className="sidebar-stat">
                        <span className="s-num">{questions.length - answered}</span>
                        <span className="s-label">Kalan</span>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="quiz-main">
                {/* Progress */}
                <div className="quiz-progress-wrap">
                    <div className="quiz-progress-info">
                        <span className="progress-label">İlerleme</span>
                        <span className="progress-pct">{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Current category label */}
                <div className="quiz-cat-label">{current.categoryName} › {current.typeName}</div>

                {/* Question */}
                <QuestionCard
                    key={current.id}
                    question={current}
                    value={answers[current.id]}
                    onChange={handleAnswer}
                    index={currentIdx}
                    total={questions.length}
                />

                {/* Navigation */}
                <div className="quiz-nav">
                    <button id="prev-btn" className="btn btn-secondary" onClick={handlePrev} disabled={currentIdx === 0}>
                        ← Önceki
                    </button>
                    <div className="quiz-nav-center">
                        <span className="nav-hint">
                            {answers[current.id] === undefined ? '⬡ Henüz cevap verilmedi' : '✓ Cevap kaydedildi'}
                        </span>
                    </div>
                    {!isLast ? (
                        <button id="next-btn" className="btn btn-primary" onClick={handleNext}>
                            Sonraki →
                        </button>
                    ) : (
                        <button
                            id="submit-btn"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={submitting || answered === 0}
                        >
                            {submitting ? '⏳ Analiz ediliyor...' : '🎯 Analizi Tamamla'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
