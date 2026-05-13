import React, { useEffect, useState } from 'react';
import { fetchKnowledgeBase } from '../api/owaspApi';
import './HomePage.css';

const SEVERITY_MAP = {
    critical: 'var(--critical)',
    high: 'var(--high)',
    medium: 'var(--medium)',
    low: 'var(--low)',
};

const SEVERITY_BADGE_CLASS = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
};

const CATEGORY_SUBTITLES = {
    'A01:2021': 'Broken Access Control (Bozuk Erişim Kontrolü)',
    'A02:2021': 'Cryptographic Failures (Kriptografik Hatalar)',
    'A03:2021': 'Injection (Enjeksiyon)',
    'A04:2021': 'Insecure Design (Güvensiz Tasarım)',
    'A05:2021': 'Security Misconfiguration (Güvenlik Yapılandırma Hataları)',
    'A06:2021': 'Vulnerable and Outdated Components (Zafiyetli ve Güncel Olmayan Bileşenler)',
    'A07:2021': 'Identification and Authentication Failures (Kimlik Tanımlama ve Doğrulama Hataları)',
    'A08:2021': 'Software and Data Integrity Failures (Yazılım ve Veri Bütünlüğü Hataları)',
    'A09:2021': 'Security Logging and Monitoring Failures (Güvenlik Günlüğü ve İzleme Hataları)',
    'A10:2021': 'Server-Side Request Forgery (SSRF) (Sunucu Taraflı İstek Sahteciliği)',
};

const SEVERITY_TR = {
    critical: 'Kritik (Critical)',
    high: 'Yüksek (High)',
    medium: 'Orta (Medium)',
    low: 'Düşük (Low)',
};

export default function HomePage({ onStart }) {
    const [kb, setKb] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchKnowledgeBase()
            .then(setKb)
            .catch(() => setError('Backend bağlantısı başarısız oldu (Backend connection failed).'))
            .finally(() => setLoading(false));
    }, []);

    const totalCategories = kb?.categories?.length || 10;
    const totalRules = kb?.categories?.reduce((acc, cat) => acc + cat.typeCount, 0) || 61;

    return (
        <main className="home-page fade-in">
            <div className="container">
                {/* Hero */}
                <section className="hero">
                    <div className="hero-inner">
                        <div className="hero-left">
                            <div className="eyebrow">FORWARD CHAINING (İLERİ ZİNCİRLEME ÇIKARIM)</div>
                            <h1>Web Uygulama<br/><span>Güvenlik Analizi</span></h1>
                            <p className="hero-subtitle">
                                Uygulamanızı ileri zincirleme çıkarım yöntemiyle OWASP Top 10 standartlarına göre analiz edin.
                            </p>
                            <div className="cta-row">
                                <button className="btn btn-primary" onClick={() => onStart()} disabled={!!error}>
                                    Analizi Başlat
                                </button>
                                <a href="https://owasp.org/Top10/" target="_blank" rel="noreferrer" className="btn btn-secondary">
                                    OWASP DOCUMENTATION  
                                </a>
                            </div>
                            {error && (
                                <div style={{ marginTop: '16px', color: 'var(--critical)', fontSize: '13px' }}>
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="hero-right">
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <span className="metric-val">{totalCategories}</span>
                                    <span className="metric-label">CATEGORIES (KATEGORİLER)</span>
                                </div>
                                <div className="metric-card">
                                    <span className="metric-val">{totalRules}</span>
                                    <span className="metric-label">SECURITY CHECKS (GÜVENLİK KONTROLLERİ)</span>
                                </div>
                                <div className="metric-card">
                                    <span className="metric-val">20+</span>
                                    <span className="metric-label">VULNERABILITY TYPES (ZAFİYET TİPLERİ)</span>
                                </div>
                                <div className="metric-card">
                                    <span className="metric-val">2021</span>
                                    <span className="metric-label">OWASP STANDARD (STANDARDI)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="how-it-works">
                    <div className="section-label">NASIL ÇALIŞIR (HOW IT WORKS)</div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-num">01</div>
                            <h3 className="step-title">Kanıt Toplama</h3>
                            <p className="step-desc">Sistem, uygulamanızın davranışı ve mimarisi hakkında hedeflenmiş sorular sorar.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">02</div>
                            <h3 className="step-title">Kural Değerlendirme</h3>
                            <p className="step-desc">Her cevap, kanıt biriktirmek için çıkarım motorunun kural tabanıyla eşleştirilir.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">03</div>
                            <h3 className="step-title">Risk Sınıflandırması</h3>
                            <p className="step-desc">Zafiyetler, OWASP kategorisine ve ağırlıklı önem puanına göre sınıflandırılır.</p>
                        </div>
                    </div>
                </section>

                {/* Coverage */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px' }}><div className="loading-spinner" /></div>
                ) : kb ? (
                    <section className="coverage">
                        <div className="section-label">KAPSANAN ZAFİYET KATEGORİLERİ (COVERED CATEGORIES)</div>
                        <div className="coverage-grid">
                            {kb.categories.map(cat => (
                                <div 
                                    className="cat-card" 
                                    key={cat.id} 
                                    style={{ '--severity-color': SEVERITY_MAP[cat.severity] || 'var(--medium)' }}
                                    onClick={() => onStart(cat.id)}
                                >
                                    <div className="cat-info">
                                        <span className="cat-id">{cat.id}</span>
                                        <span className="cat-name">{cat.name}</span>
                                        <span className="cat-subtitle">{CATEGORY_SUBTITLES[cat.id] || 'Güvenlik Kategorisi'}</span>
                                    </div>
                                    <div className="cat-right">
                                        <span className={`badge ${SEVERITY_BADGE_CLASS[cat.severity] || 'badge-medium'}`}>
                                            {SEVERITY_TR[cat.severity] || cat.severity}
                                        </span>
                                        <span className="rule-count">{cat.typeCount} RULES (KURAL)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </main>
    );
}
