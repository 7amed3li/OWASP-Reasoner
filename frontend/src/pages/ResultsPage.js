import React, { useEffect, useState } from 'react';
import './ResultsPage.css';

const SEVERITY_MAP = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#EAB308',
    low: '#60A5FA',
    safe: '#10B981',
};

const SEVERITY_TR = {
    critical: 'Kritik',
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük',
    safe: 'Güvenli',
};

function RuleTypeCard({ type, severityColor }) {
    return (
        <div className="v-card">
            <div className="v-card-top">
                <div className="v-card-ids">
                    <div className="v-rule-id">{type.typeId}</div>
                    <div className="v-cwe-id">{type.cwe}</div>
                </div>
                <div className="v-card-name">{type.typeName}</div>
            </div>
            
            <div className="v-card-section">
                <div className="v-section-label">SYMPTOMS</div>
                {type.triggeredIndicators.map(ind => (
                    <div className="v-symptom-row" key={ind.id}>
                        <span className="v-symptom-text">{ind.symptom}</span>
                        <span className="v-weight-badge">+{ind.weight}</span>
                    </div>
                ))}
            </div>

            <div className="v-card-section">
                <div className="v-section-label">RECOMMENDATIONS</div>
                {type.remediation.map((r, i) => (
                    <div className="v-rec-row" key={i}>
                        <div className="v-rec-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="v-rec-text">{r}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FindingCard({ finding }) {
    const severityColor = SEVERITY_MAP[finding.severity] || '#EAB308';
    return (
        <div className="finding-group">
            <div className="finding-header">
                <div className="finding-header-top">
                    <span className="finding-owasp-id">{finding.categoryId}</span>
                    <span className={`severity-badge badge-${finding.severity}`}>
                        {finding.severity.toUpperCase()}
                    </span>
                </div>
                <h3 className="finding-cat-name">{finding.categoryName}</h3>
            </div>
            <div className="vulnerabilities-grid">
                {finding.detectedTypes.map(type => (
                    <RuleTypeCard key={type.typeId} type={type} severityColor={severityColor} />
                ))}
            </div>
        </div>
    );
}

export default function ResultsPage({ result, onRestart }) {
    const riskLevel = result.riskLevel || 'low';
    const isSafe = riskLevel === 'low' || riskLevel === 'safe';
    const severityColor = SEVERITY_MAP[riskLevel];
    const score = result.findings.length > 0 ? 85 : 0; 
    const [offset, setOffset] = useState(264);

    useEffect(() => {
        const finalOffset = 264 * (1 - (score / 100));
        setTimeout(() => setOffset(finalOffset), 100);
    }, [score]);

    const hasFindings = result.findings.length > 0;

    return (
        <div className="results-page fade-in">
            <div className="result-hero" style={{ '--severity-color': severityColor }}>
                <div className="hero-left">
                    <div className="score-ring">
                        <svg className="score-svg" viewBox="0 0 100 100">
                            <circle className="ring-bg" cx="50" cy="50" r="42"></circle>
                            <circle 
                                className="ring-progress" 
                                cx="50" 
                                cy="50" 
                                r="42" 
                                style={{ strokeDashoffset: offset }}
                            ></circle>
                        </svg>
                        <div className="score-content">
                            <span className="score-num">{score}</span>
                            <span className="score-label">RİSK</span>
                        </div>
                    </div>
                </div>

                <div className="hero-middle">
                    <div className="res-eyebrow">ZAFİYET ANALİZİ</div>
                    <h2 className="res-severity" style={{ color: isSafe ? 'white' : severityColor }}>
                        {SEVERITY_TR[riskLevel] || riskLevel.toUpperCase()}
                    </h2>
                    <p className="res-summary">{result.summary}</p>
                </div>

                <div className="hero-right">
                    <div className="hero-stat">
                        <span className="hero-stat-val">{result.findings.length}</span>
                        <span className="hero-stat-label">BULGU</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-val">{result.findings.length + result.safeCategories.length}</span>
                        <span className="hero-stat-label">KATEGORİ</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-val">{result.totalAnswered}</span>
                        <span className="hero-stat-label">KURAL</span>
                    </div>
                </div>
            </div>

            {hasFindings ? (
                <div className="vulnerabilities-section">
                    <div className="section-label">TESPİT EDİLEN ZAFİYETLER</div>
                    <div className="findings-list">
                        {result.findings.map(f => <FindingCard key={f.categoryId} finding={f} />)}
                    </div>
                </div>
            ) : (
                <div className="safe-celebration">
                    <div className="safe-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 className="safe-title">Her Şey Yolunda</h2>
                    <p className="safe-subtitle">
                        Herhangi bir zafiyet tespit edilmedi. Uygulamanız analiz edilen güvenlik standartlarına uygundur.
                    </p>
                </div>
            )}

            {result.safeCategories.length > 0 && (
                <div className="passed-categories">
                    <div className="section-label">GEÇİLEN KATEGORİLER</div>
                    <div className="passed-grid">
                        {result.safeCategories.map(c => (
                            <div className="passed-card" key={c.categoryId}>
                                <div className="passed-checkmark">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="passed-card-info">
                                    <div className="passed-name">{c.categoryName}</div>
                                    <div className="passed-owasp-id">{c.categoryId}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="results-footer">
                <button className="btn-restart" onClick={onRestart}>
                    Yeni Analiz Başlat
                </button>
                <div className="footer-meta">
                    {new Date(result.timestamp).toLocaleString('en-US', { 
                        month: 'numeric', day: 'numeric', year: 'numeric', 
                        hour: 'numeric', minute: 'numeric', hour12: true 
                    })} · İleri Zincirleme Çıkarım Motoru
                </div>
            </div>
        </div>
    );
}
