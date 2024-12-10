import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddUser from '../components/addUser';
import { addUser } from '../services/api';

jest.mock('../services/api', () => ({
  addUser: jest.fn(),
}));

describe('AddUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddUser component without crashing', () => {
    render(<AddUser onUserAdded={jest.fn()} />);
    expect(screen.getByText(/Add New User/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    const mockOnUserAdded = jest.fn();
    const mockPlainPassword = 'temporaryPassword123';
    addUser.mockResolvedValueOnce({ plainPassword: mockPlainPassword });

    render(<AddUser onUserAdded={mockOnUserAdded} />);

    // Fill in the name field
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });

    // Open the dropdown and select a role
    const roleSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(roleSelect);
    const managerOption = await screen.findByText('Manager');
    fireEvent.click(managerOption);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    // Wait for the API response
    await screen.findByText(/Temporary Password:/i);

    // Verify the input fields are cleared
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(roleSelect).toHaveTextContent('Employee');

    // Verify the temporary password is displayed
    expect(screen.getByText(mockPlainPassword)).toBeInTheDocument();

    // Verify the API was called with the correct data
    expect(addUser).toHaveBeenCalledWith({ name: 'John Doe', role: 'manager' });

    // Verify the onUserAdded callback was called
    expect(mockOnUserAdded).toHaveBeenCalledTimes(1);
  });

  test('handles API error gracefully', async () => {
    const mockOnUserAdded = jest.fn();
    addUser.mockRejectedValueOnce(new Error('API Error'));

    render(<AddUser onUserAdded={mockOnUserAdded} />);

    // Fill in the name field
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Jane Doe' },
    });

    // Open the dropdown and select a role
    const roleSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(roleSelect);
    const adminOption = await screen.findByText('Admin');
    fireEvent.click(adminOption);

    // Mock the alert function
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error adding user');
    });

    // Verify the onUserAdded callback was not called
    expect(mockOnUserAdded).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});