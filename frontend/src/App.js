import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'quiz' | 'results'
  const [result, setResult] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleStart = (catId = null) => {
    setSelectedCategoryId(catId);
    setPage('quiz');
  };

  const handleComplete = (analysisResult) => {
    setResult(analysisResult);
    setPage('results');
  };

  const handleHome = () => { 
    setPage('home'); 
    setResult(null); 
    setSelectedCategoryId(null);
  };

  const pageLabels = { home: null, quiz: 'Analiz (Analysis)', results: 'Sonuçlar (Results)' };

  return (
    <>
      <Header page={pageLabels[page]} onHome={handleHome} />
      <div className="container">
        {page === 'home' && <HomePage onStart={handleStart} />}
        {page === 'quiz' && (
          <QuizPage 
            categoryId={selectedCategoryId} 
            onComplete={handleComplete} 
          />
        )}
        {page === 'results' && result && <ResultsPage result={result} onRestart={handleHome} />}
      </div>
    </>
  );
}
