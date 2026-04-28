import { render, screen } from '@testing-library/react';
import App from './App';

// API çağrılarını mock'la — testler backend'e bağlı olmamalı
jest.mock('./api/owaspApi', () => ({
  fetchKnowledgeBase: () => Promise.resolve({
    version: '2.0.0',
    totalCategories: 3,
    totalRuleTypes: 9,
    totalIndicators: 27,
    categories: [
      { id: 'A01', name: 'Broken Access Control', severity: 'critical', description: 'Test', typeCount: 3 },
    ],
  }),
  fetchQuestions: () => Promise.resolve([
    {
      id: 'AC-T1-S1',
      question: 'Test sorusu?',
      symptom: 'Test belirtisi',
      categoryId: 'A01',
      categoryName: 'Broken Access Control',
      typeId: 'IDOR',
      typeName: 'IDOR',
      weight: 3,
      inverse: false,
    },
  ]),
  analyzeAnswers: () => Promise.resolve({
    timestamp: new Date().toISOString(),
    summary: 'Test özeti.',
    findings: [],
    safeCategories: [],
    riskLevel: 'low',
    totalAnswered: 1,
  }),
  checkHealth: () => Promise.resolve({ status: 'ok' }),
}));

test('renders OWASP Reasoner hero title', async () => {
  render(<App />);
  const heading = await screen.findByText(/OWASP/i);
  expect(heading).toBeInTheDocument();
});

test('renders start button', async () => {
  render(<App />);
  const btn = await screen.findByRole('button', { name: /analizi başlat/i });
  expect(btn).toBeInTheDocument();
});
