import React from 'react';
import './QuestionCard.css';

export default function QuestionCard({ question, value, onChange, index, total }) {
    return (
        <div className="q-card">
            <div className="q-header">
                <div className="v-tag">{question.typeName}</div>
                <div className="q-counter">{index + 1} / {total}</div>
            </div>
            
            <p className="q-text">{question.question}</p>
            
            <div className="evidence-box">
                <div>
                    <div className="ev-label">BELİRTİ</div>
                    <div className="ev-name">{question.symptom}</div>
                </div>
                <div className="weight-pill">Ağırlık: {question.weight}</div>
            </div>

            <div className="answers-grid">
                <button
                    className={`answer-btn evet ${value === true ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, true)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Evet</span>
                </button>
                <button
                    className={`answer-btn hayir ${value === false ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, false)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span>Hayır</span>
                </button>
                <button
                    className={`answer-btn atla ${value === null ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, null)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Atla</span>
                </button>
            </div>
        </div>
    );
}
