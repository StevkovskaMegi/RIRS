import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

  test('updates budget when save button is clicked', async () => {
    api.fetchEmployees.mockResolvedValueOnce(mockEmployees);
    api.updateEmployeeBudget.mockResolvedValueOnce({});
    render(<EmployeesList />);
  
    // Wait for the employee data to load
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
  
    // Open the dialog for John Doe
    fireEvent.click(screen.getByText(/John Doe/i));
  
    // Scope the search to the dialog
    const dialog = screen.getByRole('dialog');
    const budgetInput = within(dialog).getByLabelText(/Budget/i);
    
    // Change the budget value
    fireEvent.change(budgetInput, { target: { value: '1500' } });
    expect(budgetInput.value).toBe('1500');
  
    // Save the updated budget
    fireEvent.click(within(dialog).getByText(/save/i));
  
    // Wait for the API call and the dialog to close
    await waitFor(() => {
      expect(api.updateEmployeeBudget).toHaveBeenCalledWith('1', '1500');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  
    // Verify the updated budget is displayed in the table
    expect(screen.getByText(/1500/i)).toBeInTheDocument();
  });
  


  test('displays updated budget in the table after saving', async () => {
    api.fetchEmployees.mockResolvedValueOnce(mockEmployees);
    api.updateEmployeeBudget.mockResolvedValueOnce({});
    render(<EmployeesList />);
  
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/John Doe/i));
  
    // Narrow the scope of the search by using a container within the dialog
    const dialog = screen.getByRole('dialog');
    const budgetInput = within(dialog).getByLabelText(/Budget/i);
    fireEvent.change(budgetInput, { target: { value: '1500' } });
    fireEvent.click(screen.getByText(/save/i));
  
    await waitFor(() => {
      expect(screen.getByText(/1500/i)).toBeInTheDocument();
    });
  });
  
});