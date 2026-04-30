import React from 'react';
import './Header.css';

export default function Header({ page, onHome }) {
    return (
        <header className="navbar">
            <div className="nav-inner">
                <button className="logo" onClick={onHome}>
                    <img src="/logo.png" alt="OWASP Logo" className="logo-img" />
                    OWASP <span>Reasoner</span>
                </button>
                <div className="nav-right">
                    <div className="engine-pill">İleri Zincirleme Motoru</div>
                    <a href="https://owasp.org/Top10/" target="_blank" rel="noreferrer" className="docs-link">Docs</a>
                </div>
            </div>
        </header>
    );
}
