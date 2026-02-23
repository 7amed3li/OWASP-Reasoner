import { render, screen } from '@testing-library/react';
import App from './App';

test('renders OWASP Reasoner hero title', () => {
  render(<App />);
  const heading = screen.getByText(/OWASP/i);
  expect(heading).toBeInTheDocument();
});

test('renders start button', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /analizi başlat/i });
  expect(btn).toBeInTheDocument();
});
