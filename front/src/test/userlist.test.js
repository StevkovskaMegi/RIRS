import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../components/userlist';

describe('UserList Component', () => {
  const mockUsers = Array.from({ length: 15 }, (_, i) => ({
    _id: `${i + 1}`,
    name: `User ${i + 1}`,
    role: `Role ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));

  test('renders UserList component without crashing', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/Recent Added Employees/i)).toBeInTheDocument();
  });

  test('displays user details correctly for the first page', () => {
    render(<UserList users={mockUsers} />);
    const firstUser = mockUsers[0];
    expect(screen.getByText(firstUser.name)).toBeInTheDocument();
    expect(screen.getByText(firstUser.role)).toBeInTheDocument();
    expect(screen.getByText(firstUser.email)).toBeInTheDocument();
  });

  test('pagination displays correct number of users per page', () => {
    render(<UserList users={mockUsers} />);
    
    const displayedUserNames = screen
      .getAllByRole('heading', { level: 6 })
      .filter((element) => element.textContent !== 'Recent Added Employees');
    
    expect(displayedUserNames).toHaveLength(6); 
  });
  
  
  test('disables previous button on the first page', () => {
    render(<UserList users={mockUsers} />);
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton).toBeDisabled();
  });

  test('navigates to the next page and updates user list', () => {
    render(<UserList users={mockUsers} />);
    const nextButton = screen.getByText(/Next/i);

    fireEvent.click(nextButton);

    expect(screen.getByText(/Page 2 of 3/i)).toBeInTheDocument();

    const seventhUser = mockUsers[6];
    expect(screen.getByText(seventhUser.name)).toBeInTheDocument();
    expect(screen.getByText(seventhUser.role)).toBeInTheDocument();
    expect(screen.getByText(seventhUser.email)).toBeInTheDocument();
  });

  test('disables next button on the last page', () => {
    render(<UserList users={mockUsers} />);
    const nextButton = screen.getByText(/Next/i);

    // Navigate to the last page
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
    expect(screen.getByText(/Page 3 of 3/i)).toBeInTheDocument();
  });

  test('navigates back to the previous page correctly', () => {
    render(<UserList users={mockUsers} />);
    const nextButton = screen.getByText(/Next/i);
    const prevButton = screen.getByText(/Previous/i);

    fireEvent.click(nextButton); 
    fireEvent.click(prevButton); 

    expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
    const firstUser = mockUsers[0];
    expect(screen.getByText(firstUser.name)).toBeInTheDocument();
  });

  test('handles an empty user list gracefully', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/Recent Added Employees/i)).toBeInTheDocument();
    expect(screen.queryByText(/User/i)).not.toBeInTheDocument();
  });

  test('displays correct page numbers and navigation controls', () => {
    render(<UserList users={mockUsers} />);
    const prevButton = screen.getByText(/Previous/i);
    const nextButton = screen.getByText(/Next/i);
    const pageInfo = screen.getByText(/Page 1 of 3/i);

    expect(prevButton).toBeDisabled(); 
    expect(nextButton).not.toBeDisabled(); 
    expect(pageInfo).toBeInTheDocument(); 
  });
});
