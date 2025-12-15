import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    const { container } = render(<App />);
    const navElements = container.querySelectorAll('nav, header');
    expect(navElements.length).toBeGreaterThan(0);
  });
});
