import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsPanel from '../components/statsPanel';

describe('StatsPanel Component', () => {
  test('renders StatsPanel component without crashing', () => {
    render(<StatsPanel employees={0} managers={0} groups={0} />);
    expect(screen.getByText(/Employees Analysis/i)).toBeInTheDocument();
  });

  test('displays correct stats data', () => {
    render(<StatsPanel employees={10} managers={5} groups={3} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});