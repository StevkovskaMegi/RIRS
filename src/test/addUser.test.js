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

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });

    const roleSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(roleSelect);
    const managerOption = await screen.findByText('Manager');
    fireEvent.click(managerOption);

    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    await screen.findByText(/Temporary Password:/i);

    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(roleSelect).toHaveTextContent('Employee');

    expect(screen.getByText(mockPlainPassword)).toBeInTheDocument();

    expect(addUser).toHaveBeenCalledWith({ name: 'John Doe', role: 'manager' });

    expect(mockOnUserAdded).toHaveBeenCalledTimes(1);
  });

  test('handles API error gracefully', async () => {
    const mockOnUserAdded = jest.fn();
    addUser.mockRejectedValueOnce(new Error('API Error'));

    render(<AddUser onUserAdded={mockOnUserAdded} />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Jane Doe' },
    });

    const roleSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(roleSelect);
    const adminOption = await screen.findByText('Admin');
    fireEvent.click(adminOption);

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error adding user');
    });

    expect(mockOnUserAdded).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});