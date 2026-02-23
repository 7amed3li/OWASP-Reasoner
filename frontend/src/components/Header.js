import React from 'react';
import './Header.css';

export default function Header({ page, onHome }) {
    return (
        <header className="header">
            <div className="container header-inner">
                <button className="logo" onClick={onHome}>
                    <span className="logo-icon">🛡️</span>
                    <span className="logo-text">OWASP <span className="accent">Reasoner</span></span>
                </button>
                <div className="header-meta">
                    <span className="engine-tag">⚡ İleri Zincirleme Motoru</span>
                    {page && <span className="page-tag">{page}</span>}
                </div>
            </div>
        </header>
    );
}
