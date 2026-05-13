import React, { useEffect, useState, useCallback } from 'react';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestions, analyzeAnswers } from '../api/owaspApi';
import './QuizPage.css';

export default function QuizPage({ categoryId, onComplete }) {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions()
            .then(qs => {
                setAllQuestions(qs);
                if (categoryId && typeof categoryId === 'string') {
                    setQuestions(qs.filter(q => q.categoryId === categoryId));
                } else {
                    setQuestions(qs);
                }
                setLoading(false);
            })
            .catch(() => { setError('Sorular yüklenemedi (Failed to load questions).'); setLoading(false); });
    }, [categoryId]);

    const handleAnswer = useCallback((id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    }, []);

    const handleNext = () => setCurrentIdx(i => Math.min(i + 1, questions.length - 1));
    const handlePrev = () => setCurrentIdx(i => Math.max(i - 1, 0));

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = Object.fromEntries(
                Object.entries(answers).filter(([, v]) => v !== null)
            );
            const result = await analyzeAnswers(payload);
            onComplete(result);
        } catch {
            setError('Analiz başarısız oldu (Analysis failed).');
            setSubmitting(false);
        }
    };

    const answered = Object.values(answers).filter(v => v !== null && v !== undefined).length;
    const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="loading-spinner" /></div>;
    if (error) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--critical)' }}>{error}</div>;

    const current = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;

    const categories = [...new Set(allQuestions.map(q => q.categoryName))];
    const nextQ = questions[currentIdx + 1];
    const isLastOfType = !nextQ || nextQ.typeName !== current.typeName;

    return (
        <div className="quiz-page fade-in">
            <div className="analysis-progress">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-labels">
                <span>PROGRESS (ANALİZ İLERLEMESİ)</span>
                <span>{Math.round(progress)}%</span>
            </div>

            <div className="analysis-layout">
                <aside className="sidebar">
                    <div className="section-label">KATEGORİLER (CATEGORIES)</div>
                    <ul className="sidebar-list">
                        {categories.map((cat) => {
                            const catQuestions = allQuestions.filter(q => q.categoryName === cat);
                            const catAnswered = catQuestions.filter(q => answers[q.id] !== undefined).length;
                            const isActive = current.categoryName === cat;
                            const isComplete = catAnswered === catQuestions.length;

                            return (
                                <li 
                                    key={cat} 
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        if (!categoryId) {
                                            const firstIdx = questions.findIndex(q => q.categoryName === cat);
                                            if (firstIdx !== -1) setCurrentIdx(firstIdx);
                                        }
                                    }}
                                >
                                    <div className="sidebar-item-left">
                                        <div className={`status-dot ${isActive ? 'active' : ''} ${isComplete ? 'safe' : ''}`}></div>
                                        {cat}
                                    </div>
                                    <span className="sidebar-count">{catAnswered}/{catQuestions.length}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="sidebar-divider"></div>
                    <div className="sidebar-stats">
                        <div>
                            <span className="stat-val">{answered}</span>
                            <span className="section-label">ANSWERED (CEVAPLANAN)</span>
                        </div>
                        <div>
                            <span className="stat-val">{questions.length - answered}</span>
                            <span className="section-label">REMAINING (KALAN)</span>
                        </div>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="breadcrumb">
                        {current.categoryName} › {current.typeName}
                    </div>

                    <QuestionCard
                        key={current.id}
                        question={current}
                        value={answers[current.id]}
                        onChange={handleAnswer}
                        index={currentIdx}
                        total={questions.length}
                    />

                    <div className="nav-row">
                        <button className="btn-prev" onClick={handlePrev} disabled={currentIdx === 0}>
                            PREVIOUS (ÖNCEKİ) ←
                        </button>
                        <div className="nav-center">
                            <div className="status-dot"></div>
                            <span>{answers[current.id] === undefined ? 'Henüz cevap verilmedi' : 'Cevap kaydedildi'}</span>
                        </div>
                        <div className="nav-actions">
                            {!isLast && answered > 0 && (
                                <button 
                                    className={`btn ${isLastOfType ? 'btn-secondary-highlight' : 'btn-secondary'}`} 
                                    onClick={handleSubmit} 
                                    disabled={submitting} 
                                    style={{ marginRight: '8px' }}
                                >
                                    {submitting ? '...' : 'Analizi Tamamla'}
                                </button>
                            )}
                            {!isLast ? (
                                <button className="btn btn-primary" onClick={handleNext}>
                                    NEXT (SONRAKİ) →
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                                    🎯 SHOW RESULTS (SONUÇLARI GÖR)
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
