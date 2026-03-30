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
        setError(null);
        fetchQuestions()
            .then(qs => { setQuestions(qs); setLoading(false); })
            .catch(err => { setError(err.message || 'Sorular yüklenemedi.'); setLoading(false); });
    }, []);

    const handleAnswer = useCallback((id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    }, []);

    const handleNext = useCallback(() =>
        setCurrentIdx(i => (questions.length === 0 ? i : Math.min(i + 1, questions.length - 1))), [questions.length]);

    const handlePrev = useCallback(() =>
        setCurrentIdx(i => Math.max(i - 1, 0)), []);

    // Klavye navigasyonu (← →)
    useEffect(() => {
        const onKey = (e) => {
            if (e.target.tagName === 'BUTTON') return; // buton odaklanmışsa çakışma olmasın
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleNext, handlePrev]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            // null = emin değil → motor görmeyecek, sadece true/false gönder
            const payload = Object.fromEntries(
                Object.entries(answers).filter(([, v]) => v !== null)
            );
            const result = await analyzeAnswers(payload);
            onComplete(result);
        } catch (err) {
            setError(err.message || 'Analiz sırasında hata oluştu.');
            setSubmitting(false);
        }
    };

    // null = emin değil, undefined = henüz dokunulmadı
    const answered = Object.values(answers).filter(v => v !== null && v !== undefined).length;
    const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

    if (loading) return (
        <div className="quiz-loading">
            <div className="loading-spinner" />
            <p>Sorular yükleniyor...</p>
        </div>
    );

    if (error && questions.length === 0) return (
        <div className="quiz-error">
            <span>⚠️ {error}</span>
            <button
                className="btn btn-secondary"
                style={{ marginTop: 16 }}
                onClick={() => { setLoading(true); setError(null); fetchQuestions().then(qs => { setQuestions(qs); setLoading(false); }).catch(err => { setError(err.message); setLoading(false); }); }}
            >
                🔄 Tekrar Dene
            </button>
        </div>
    );

    if (questions.length === 0) return null;

    const current = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;

    // Kategori gruplaması (sidebar navigasyonu)
    const categories = [...new Set(questions.map(q => q.categoryName))];

    return (
        <div className="quiz-page">
            {/* Sidebar */}
            <aside className="quiz-sidebar glass">
                <div className="sidebar-title">Kategoriler</div>
                {categories.map(cat => {
                    const catQuestions = questions.filter(q => q.categoryName === cat);
                    const catAnswered = catQuestions.filter(q => answers[q.id] === true || answers[q.id] === false).length;
                    const isActive = questions[currentIdx].categoryName === cat;
                    return (
                        <div
                            key={cat}
                            className={`sidebar-cat${isActive ? ' active' : ''}`}
                            onClick={() => setCurrentIdx(questions.findIndex(q => q.categoryName === cat))}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setCurrentIdx(questions.findIndex(q => q.categoryName === cat))}
                        >
                            <span className="sidebar-cat-name">{cat}</span>
                            <span className={`sidebar-cat-progress${catAnswered === catQuestions.length ? ' complete' : ''}`}>
                                {catAnswered}/{catQuestions.length}
                            </span>
                        </div>
                    );
                })}
                <div className="sidebar-stats">
                    <div className="sidebar-stat">
                        <span className="s-num" style={{ color: 'var(--accent-cyan)' }}>{answered}</span>
                        <span className="s-label">Cevaplanan</span>
                    </div>
                    <div className="sidebar-stat">
                        <span className="s-num">{questions.length - answered}</span>
                        <span className="s-label">Kalan</span>
                    </div>
                </div>
                <div className="sidebar-hint">
                    <span>💡 ← → tuşlarıyla gezin</span>
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

                {/* Breadcrumb */}
                <div className="quiz-cat-label">
                    <span>{current.categoryName}</span>
                    <span className="cat-sep">›</span>
                    <span>{current.typeName}</span>
                </div>

                {/* Question */}
                <QuestionCard
                    key={current.id}
                    question={current}
                    value={answers[current.id]}
                    onChange={handleAnswer}
                    index={currentIdx}
                    total={questions.length}
                />

                {/* Error (submit aşamasında) */}
                {error && questions.length > 0 && (
                    <div className="quiz-submit-error">⚠️ {error}</div>
                )}

                {/* Navigation */}
                <div className="quiz-nav">
                    <button
                        id="prev-btn"
                        className="btn btn-secondary"
                        onClick={handlePrev}
                        disabled={currentIdx === 0}
                    >
                        ← Önceki
                    </button>
                    <div className="quiz-nav-center">
                        <span className="nav-hint">
                            {answers[current.id] === undefined
                                ? '⬡ Henüz cevap verilmedi'
                                : answers[current.id] === null
                                    ? '❓ Emin değilim olarak işaretlendi'
                                    : '✓ Cevap kaydedildi'}
                        </span>
                    </div>
                    {!isLast ? (
                        <button id="next-btn" className="btn btn-primary" onClick={handleNext}>
                            Sonraki →
                        </button>
                    ) : (
                        <button
                            id="submit-btn"
                            className={`btn btn-primary${submitting ? ' submitting' : ''}`}
                            onClick={handleSubmit}
                            disabled={submitting || answered === 0}
                        >
                            {submitting ? (
                                <><span className="btn-spinner" />Analiz Ediliyor...</>
                            ) : (
                                <>🎯 Analizi Tamamla</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
