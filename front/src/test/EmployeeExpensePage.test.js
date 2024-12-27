import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeExpensePage from "../pages/employeeExpensePage";
import { MemoryRouter } from "react-router-dom";
import * as api from "../services/api"; // Adjust the path to match your project structure
import { act, waitFor } from "@testing-library/react";

jest.mock("../services/api", () => ({
  getGroups: jest.fn(() => Promise.resolve([])),
  getUserById: jest.fn(() => Promise.resolve({ name: "Test User" })),
  getExpensesByUserId: jest.fn(() => Promise.resolve([])),
  requestExpense: jest.fn(() => Promise.resolve()),
}));
// Mock initial expense fetch
api.getExpensesByUserId.mockResolvedValueOnce([]);

// Mock after expense is added (when submitting the new expense)
api.getExpensesByUserId.mockResolvedValueOnce([
  {
    _id: "1",
    description: "New expense",
    amount: 50,
    date: "2024-12-01",
    status: "pending",
  },
]);

beforeEach(() => {
  jest.clearAllMocks();

  // Mock API methods
  api.getUserById.mockResolvedValue({ userId: "test-user", budget: 500 });
  api.getExpensesByUserId.mockResolvedValue([]);
  api.requestExpense.mockResolvedValue({});
});

describe("EmployeeExpensePage Component", () => {
  test("renders the component with default elements", () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Request Expense")).toBeInTheDocument();
    expect(screen.getByText("Filter Expenses by Date")).toBeInTheDocument();
    expect(screen.getByText("Your Expenses")).toBeInTheDocument();
  });

  test("filters expenses by date and shows no results if none match", async () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Simulate date filtering where no expenses match
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2024-12-31" },
    });
    fireEvent.click(screen.getByText("Filter"));

    // Assert that "No expenses found" is displayed
    expect(await screen.findByText("No expenses found")).toBeInTheDocument();
  });

  // test('filters expenses by date and shows the filtered result', async () => {
  //   // Render the component
  //   render(
  //     <MemoryRouter>
  //       <EmployeeExpensePage />
  //     </MemoryRouter>
  //   );
  
  //   // Mocked expenses for the test
  //   const mockedExpenses = [
  //     {
  //       _id: '1',
  //       description: 'Expense 1',
  //       amount: 50,
  //       date: '2024-12-01',
  //       status: 'pending',
  //     },
  //     {
  //       _id: '2',
  //       description: 'Expense 2',
  //       amount: 100,
  //       date: '2024-12-10',
  //       status: 'approved',
  //     },
  //     {
  //       _id: '3',
  //       description: 'Expense 3',
  //       amount: 200,
  //       date: '2024-12-20',
  //       status: 'pending',
  //     },
  //   ];
  
  //   // Set the mocked expenses in the component
  //   api.getExpensesByUserId.mockResolvedValueOnce(mockedExpenses);
  
  //   // Set filter dates with a range that includes only the second expense
  //   fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2024-12-01' } });
  //   fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2024-12-10' } });
  //   fireEvent.click(screen.getByRole('button', { name: /filter/i }));
  
  //   // Wait for the filtered table to be rendered
  //   await screen.findByRole('table');  // Ensures the table is rendered
  
  //   // Wait for the rows to be populated (if necessary)
  //   await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2));  // This ensures that rows are rendered
  
  //   // Find the row that contains the description "Expense 2"
  //   const rows = await screen.findAllByRole('row');
  
  //   // Check for the correct row by inspecting the description
  //   const expenseRow = rows.find(row => {
  //     const descriptionCell = row.querySelector('td:nth-child(1)'); // assuming description is in the first column
  //     return descriptionCell && descriptionCell.textContent === 'Expense 2';
  //   });
  
  //   // Ensure the expense row with "Expense 2" exists
  //   expect(expenseRow).toBeInTheDocument();
  
  //   // Ensure other expenses are not in the table
  //   expect(screen.queryByText('Expense 1')).toBeNull();
  //   expect(screen.queryByText('Expense 3')).toBeNull();
  // });
  
  

  test("displays no expenses when filter criteria do not match", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Set filter dates with no matching expenses
    fireEvent.change(getByLabelText("Start Date"), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(getByLabelText("End Date"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.click(getByText("Filter"));

    // Ensure no expenses are displayed
    expect(screen.getByText("No expenses found")).toBeInTheDocument();
  });
});
