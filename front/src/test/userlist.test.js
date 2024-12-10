import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../components/userlist';

describe('UserList Component', () => {
  const mockUsers = [
    {
      _id: '1',
      name: 'John Doe',
      role: 'Developer',
      email: 'john@example.com',
    },
    {
      _id: '2',
      name: 'Jane Smith',
      role: 'Designer',
      email: 'jane@example.com',
    },
  ];

  test('renders UserList component without crashing', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/Recent Added Employees/i)).toBeInTheDocument();
  });

  test('displays user details correctly', () => {
    render(<UserList users={mockUsers} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('disables previous button on the first page', () => {
    render(<UserList users={mockUsers} />);
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton).toBeDisabled();
  });
});