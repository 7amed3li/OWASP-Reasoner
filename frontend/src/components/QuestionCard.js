import React from 'react';
import './QuestionCard.css';

export default function QuestionCard({ question, value, onChange, index, total }) {
    return (
        <div className="qcard fade-in-up">
            <div className="qcard-meta">
                <span className="qcard-type-badge">{question.typeName}</span>
                <span className="qcard-counter">{index + 1} / {total}</span>
            </div>

            <p className="qcard-question">{question.question}</p>

            <div className="qcard-symptom">
                <span className="symptom-label">Belirti:</span>
                <span className="symptom-value">{question.symptom}</span>
                <span className="symptom-weight" title="Etki ağırlığı">Ağırlık: {question.weight}</span>
            </div>

            <div className="qcard-answers">
                <button
                    id={`q-${question.id}-yes`}
                    className={`answer-btn answer-yes ${value === true ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, true)}
                >
                    <span className="answer-icon">✓</span>
                    <span>Evet</span>
                </button>
                <button
                    id={`q-${question.id}-no`}
                    className={`answer-btn answer-no ${value === false ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, false)}
                >
                    <span className="answer-icon">✗</span>
                    <span>Hayır</span>
                </button>
                <button
                    id={`q-${question.id}-skip`}
                    className={`answer-btn answer-skip ${value === null ? 'selected' : ''}`}
                    onClick={() => onChange(question.id, null)}
                >
                    <span>Atla</span>
                </button>
            </div>
        </div>
    );
}
