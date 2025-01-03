import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserRequests from '../components/UserRequests';
import { approveRequest, declineRequest } from '../services/api';

jest.mock('../services/api', () => ({
    approveRequest: jest.fn(),
    declineRequest: jest.fn(),
}));

describe('UserRequests Component', () => {
    const mockUsersRequests = [
        {
            _id: '1',
            user: { name: 'John Doe' },
            date: '2024-12-17T00:00:00Z',
            amount: 150,
            description: 'Business lunch expenses',
        },
        {
            _id: '2',
            user: { name: 'Jane Smith' },
            date: '2024-12-16T00:00:00Z',
            amount: 200,
            description: 'Hotel booking',
        },
    ];

    test('renders user requests correctly', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);

        // Check if the rows are rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('150€')).toBeInTheDocument();
        expect(screen.getByText('200€')).toBeInTheDocument();
    });

    test('handles approve button click', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        
        const approveButton = screen.getAllByText('Approve')[0];
        fireEvent.click(approveButton);

        expect(approveRequest).toHaveBeenCalledWith('1');
    });

    test('handles decline button click', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        
        const declineButton = screen.getAllByText('Decline')[0];
        fireEvent.click(declineButton);

        expect(declineRequest).toHaveBeenCalledWith('1');
    });
});
