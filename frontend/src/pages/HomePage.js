import React, { useEffect, useState } from 'react';
import { fetchKnowledgeBase } from '../api/owaspApi';
import './HomePage.css';

const SEVERITY_COLORS = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
};

export default function HomePage({ onStart }) {
    const [kb, setKb] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchKnowledgeBase()
            .then(setKb)
            .catch(() => setError('Backend\u2019e bağlanamıyor. npm start ile çalıştırın.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="home-page">
            {/* Hero */}
            <section className="hero fade-in-up">
                <div className="hero-badge">🧠 İleri Zincirleme Uzman Sistemi</div>
                <h1 className="hero-title">
                    OWASP <span className="gradient-text">Güvenlik</span> Analizi
                </h1>
                <p className="hero-subtitle">
                    Forward Chaining çıkarım motoru ile uygulamanızın OWASP Top 10 zafiyetlerini
                    adım adım, human reasoning prensibiyle tespit edin.
                </p>
                <div className="hero-actions">
                    <button id="start-quiz-btn" className="btn btn-primary" onClick={onStart} disabled={!!error}>
                        <span>🔍</span> Analizi Başlat
                    </button>
                    <a href="https://owasp.org/Top10/" target="_blank" rel="noreferrer" className="btn btn-secondary">
                        <span>📖</span> OWASP Top 10
                    </a>
                </div>
                {error && (
                    <div className="hero-error">
                        ⚠️ {error}
                    </div>
                )}
            </section>

            {/* How It Works */}
            <section className="how-it-works fade-in-up">
                <h2 className="section-title">Nasıl Çalışır?</h2>
                <div className="steps-grid">
                    {[
                        { icon: '📋', step: '1', title: 'Gerçek Toplama', desc: 'Sistem sana hedef uygulama hakkında spesifik sorular sorar.' },
                        { icon: '⚙️', step: '2', title: 'Kural Değerlendirme', desc: 'İleri zincirleme motoru her cevabı kural tabanıyla eşleştirir.' },
                        { icon: '🎯', step: '3', title: 'OWASP Çıkarımı', desc: 'Belirti skoru threshold değerini aşarsa zafiyet sınıflandırılır.' },
                    ].map(s => (
                        <div className="step-card glass" key={s.step}>
                            <div className="step-icon">{s.icon}</div>
                            <div className="step-num">Adım {s.step}</div>
                            <h3 className="step-title">{s.title}</h3>
                            <p className="step-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Knowledge Base Stats */}
            {loading ? (
                <div className="kb-loading"><div className="loading-spinner" /></div>
            ) : kb ? (
                <section className="kb-section fade-in-up">
                    <h2 className="section-title">Bilgi Tabanı</h2>
                    <div className="kb-stats">
                        <div className="stat-card glass">
                            <span className="stat-num">{kb.totalCategories}</span>
                            <span className="stat-label">OWASP Kategori</span>
                        </div>
                        <div className="stat-card glass">
                            <span className="stat-num">{kb.totalRuleTypes}</span>
                            <span className="stat-label">Kural Tipi</span>
                        </div>
                        <div className="stat-card glass">
                            <span className="stat-num">{kb.totalIndicators}</span>
                            <span className="stat-label">Gösterge / Soru</span>
                        </div>
                    </div>
                    <div className="kb-categories">
                        {kb.categories.map(cat => (
                            <div className="cat-card glass" key={cat.id}>
                                <div className="cat-header">
                                    <span className="cat-id">{cat.id}</span>
                                    <span className={`badge ${SEVERITY_COLORS[cat.severity] || 'badge-medium'}`}>
                                        {cat.severity}
                                    </span>
                                </div>
                                <h3 className="cat-name">{cat.name}</h3>
                                <p className="cat-desc">{cat.description}</p>
                                <span className="cat-types">{cat.typeCount} kural tipi</span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </main>
    );
}
