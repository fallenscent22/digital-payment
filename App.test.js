import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders welcome message', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const welcomeElement = screen.getByText(/Welcome to the Digital Wallet App/i);
  expect(welcomeElement).toBeInTheDocument();
});