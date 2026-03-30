import React, { useState } from 'react';
import './ResultsPage.css';

const RISK_CONFIG = {
    critical: { color: '#ef4444', icon: '🔴', label: 'KRİTİK' },
    high: { color: '#f59e0b', icon: '🟠', label: 'YÜKSEK' },
    medium: { color: '#3b82f6', icon: '🔵', label: 'ORTA' },
    low: { color: '#22c55e', icon: '🟢', label: 'DÜŞÜK' },
};

function RuleTypeCard({ type }) {
    return (
        <div className="rule-type-card">
            <div className="rt-header">
                <div className="rt-id-wrap">
                    <span className="rt-id">{type.typeId}</span>
                    <span className="rt-cwe">{type.cwe}</span>
                </div>
                <div className="rt-score-bar">
                    <div
                        className="rt-score-fill"
                        style={{ width: `${Math.min((type.score / type.threshold) * 100, 100)}%` }}
                    />
                </div>
                <span className="rt-score-text">{type.score}/{type.threshold}</span>
            </div>
            <h4 className="rt-name">{type.typeName}</h4>

            {type.triggeredIndicators.length > 0 && (
                <div className="indicators">
                    <span className="ind-label">🚨 Tespit Edilen Belirtiler</span>
                    {type.triggeredIndicators.map(ind => (
                        <div className="indicator triggered" key={ind.id}>
                            <span className="ind-symptom">{ind.symptom}</span>
                            <span className="ind-weight">+{ind.weight}</span>
                        </div>
                    ))}
                </div>
            )}

            {type.remediation.length > 0 && (
                <div className="remediation">
                    <span className="rem-label">✅ Çözüm Önerileri</span>
                    <ul>
                        {type.remediation.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            )}

            {type.references.length > 0 && (
                <div className="references">
                    {type.references.map((ref, i) => (
                        <a href={ref} target="_blank" rel="noreferrer" key={i} className="ref-link">
                            🔗 {(() => { try { return new URL(ref).hostname; } catch { return ref; } })()}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

function FindingCard({ finding, index }) {
    const [expanded, setExpanded] = useState(index === 0); // İlk bulgu açık gelir
    const cfg = RISK_CONFIG[finding.severity] || RISK_CONFIG.medium;

    return (
        <div
            className="finding-card glass fade-in-up"
            style={{
                borderColor: `${cfg.color}33`,
                animationDelay: `${index * 0.08}s`,
            }}
        >
            {/* Tıklanabilir başlık */}
            <div
                className="finding-header"
                onClick={() => setExpanded(e => !e)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
            >
                <div>
                    <span className="finding-id">{finding.categoryId}</span>
                    <h3 className="finding-name">{finding.categoryName}</h3>
                </div>
                <div className="finding-badges">
                    <span className={`badge badge-${finding.severity}`}>{finding.severity}</span>
                    <span className="finding-type-count">{finding.detectedTypes.length} zafiyet tipi</span>
                    <span className="finding-toggle">{expanded ? '▲' : '▼'}</span>
                </div>
            </div>

            {/* Detaylar (collapse) */}
            {expanded && (
                <div className="finding-types">
                    {finding.detectedTypes.map(type => (
                        <RuleTypeCard key={type.typeId} type={type} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ResultsPage({ result, onRestart }) {
    const riskCfg = RISK_CONFIG[result.riskLevel] || RISK_CONFIG.low;
    const hasFindings = result.findings.length > 0;

    const handlePrint = () => window.print();

    return (
        <div className="results-page">
            {/* Risk Özeti */}
            <section className="risk-summary glass fade-in-up" style={{ borderColor: `${riskCfg.color}33` }}>
                <div className="risk-left">
                    <div className="risk-icon">{riskCfg.icon}</div>
                    <div>
                        <div className="risk-label">Genel Risk Seviyesi</div>
                        <div className="risk-level" style={{ color: riskCfg.color }}>{riskCfg.label}</div>
                        <p className="risk-summary-text">{result.summary}</p>
                    </div>
                </div>
                <div className="risk-stats">
                    <div className="risk-stat">
                        <span className="rs-num" style={{ color: riskCfg.color }}>{result.findings.length}</span>
                        <span className="rs-label">Etkilenen Kategori</span>
                    </div>
                    <div className="risk-stat">
                        <span className="rs-num">{result.findings.reduce((a, f) => a + f.detectedTypes.length, 0)}</span>
                        <span className="rs-label">Zafiyet Tipi</span>
                    </div>
                    <div className="risk-stat">
                        <span className="rs-num">{result.totalAnswered}</span>
                        <span className="rs-label">Değerlendirilen Soru</span>
                    </div>
                    {result.safeCategories.length > 0 && (
                        <div className="risk-stat">
                            <span className="rs-num" style={{ color: '#22c55e' }}>{result.safeCategories.length}</span>
                            <span className="rs-label">Güvenli Kategori</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Bulgular */}
            {hasFindings ? (
                <section className="findings-section">
                    <h2 className="section-title">🔍 Tespit Edilen Zafiyetler</h2>
                    <p className="findings-hint">Detayları görmek için kart başlığına tıklayın.</p>
                    <div className="findings-list">
                        {result.findings.map((f, i) => (
                            <FindingCard key={f.categoryId} finding={f} index={i} />
                        ))}
                    </div>
                </section>
            ) : (
                <section className="no-findings glass fade-in-up">
                    <div className="no-findings-icon">🛡️</div>
                    <h2>Zafiyet Tespit Edilmedi</h2>
                    <p>Cevapladığınız sorulara göre belirgin bir zafiyet belirtisi bulunamadı. Kapsamlı bir güvenlik denetimi yaptırmanızı öneririz.</p>
                </section>
            )}

            {/* Güvenli Kategoriler */}
            {result.safeCategories.length > 0 && (
                <section className="safe-section fade-in-up">
                    <h2 className="section-title">✅ Sorunsuz Kategoriler</h2>
                    <div className="safe-grid">
                        {result.safeCategories.map(c => (
                            <div className="safe-card glass" key={c.categoryId}>
                                <span className="safe-id">{c.categoryId}</span>
                                <span className="safe-name">{c.categoryName}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <div className="results-footer fade-in-up">
                <div className="footer-actions">
                    <button id="restart-btn" className="btn btn-primary" onClick={onRestart}>
                        🔄 Yeniden Analiz Et
                    </button>
                    <button id="print-btn" className="btn btn-secondary" onClick={handlePrint}>
                        🖨️ Raporu Yazdır
                    </button>
                </div>
                <p className="footer-note">
                    Analiz: {new Date(result.timestamp).toLocaleString('tr-TR')} · Motor: İleri Zincirleme
                </p>
            </div>
        </div>
    );
}
