import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupRequests from '../components/GroupRequests';
import { approveRequest, declineRequest, fetchGroupsRequests } from '../services/api';

jest.mock('../services/api', () => ({
    approveRequest: jest.fn(),
    declineRequest: jest.fn(),
    fetchGroupsRequests: jest.fn(),
}));

describe('GroupRequests Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Ensure no mocks interfere across tests
    });

    test('renders group requests correctly', async () => {
        // Mock the resolved value of fetchGroupsRequests
        fetchGroupsRequests.mockResolvedValue([
            {
                _id: '1',
                user: { name: 'Group Admin' },
                date: '2024-12-15T00:00:00Z',
                amount: 500,
                description: 'Team outing',
            },
        ]);

        render(<GroupRequests />);

        // Wait for the data to load
        const userCell = await screen.findByText('Group Admin');
        expect(userCell).toBeInTheDocument();
        expect(screen.getByText('500€')).toBeInTheDocument();
    });

    test('handles approve button click', async () => {
        fetchGroupsRequests.mockResolvedValue([
            {
                _id: '1',
                user: { name: 'Group Admin' },
                date: '2024-12-15T00:00:00Z',
                amount: 500,
                description: 'Team outing',
            },
        ]);

        render(<GroupRequests />);

        // Wait for the data to load
        const approveButton = await screen.findByText('Approve');
        fireEvent.click(approveButton);

        expect(approveRequest).toHaveBeenCalledWith('1');
    });

    test('handles decline button click', async () => {
        fetchGroupsRequests.mockResolvedValue([
            {
                _id: '1',
                user: { name: 'Group Admin' },
                date: '2024-12-15T00:00:00Z',
                amount: 500,
                description: 'Team outing',
            },
        ]);

        render(<GroupRequests />);

        // Wait for the data to load
        const declineButton = await screen.findByText('Decline');
        fireEvent.click(declineButton);

        expect(declineRequest).toHaveBeenCalledWith('1');
    });
});
