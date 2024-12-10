import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeesList from '../components/EmployeesList';
import * as api from '../services/api'; // Mocking API calls

jest.mock('../services/api', () => ({
  fetchEmployees: jest.fn(),
  updateEmployeeBudget: jest.fn(),
}));

describe('EmployeesList Component', () => {
  const mockEmployees = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', budget: 1000 },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', budget: 2000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders EmployeesList component without crashing', async () => {
    api.fetchEmployees.mockResolvedValueOnce(mockEmployees);
    render(<EmployeesList />);
    await waitFor(() => expect(screen.getByText(/Name/i)).toBeInTheDocument());
  });

  test('displays employee data correctly', async () => {
    api.fetchEmployees.mockResolvedValueOnce(mockEmployees);
    render(<EmployeesList />);
    await waitFor(() =>
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  test('opens dialog on employee row click', async () => {
    api.fetchEmployees.mockResolvedValueOnce(mockEmployees);
    render(<EmployeesList />);
    await waitFor(() =>
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText(/John Doe/i));
    expect(screen.getByText(/Employee budget update/i)).toBeInTheDocument();
  });
});