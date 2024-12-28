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
  api.getExpensesByUserId.mockResolvedValue({});
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
  test("filters expenses by a date range and shows no results when no expenses match", async () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Set filter dates with no matching expenses
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.click(screen.getByText("Filter"));

    // Assert that "No expenses found" is displayed
    expect(await screen.findByText("No expenses found")).toBeInTheDocument();
  });
  // test("filters expenses by a date range and displays only matching expenses", async () => {
  //   // Initial expenses set up in the mock
  //   api.getExpensesByUserId.mockResolvedValueOnce([
  //     { _id: "1", description: "Expense 1", amount: 50, date: "2024-12-01", status: "pending" },
  //     { _id: "2", description: "Expense 2", amount: 30, date: "2024-12-10", status: "pending" },
  //     { _id: "3", description: "Expense 3", amount: 100, date: "2024-12-15", status: "approved" },
  //     { _id: "4", description: "Expense 4", amount: 70, date: "2024-12-20", status: "approved" },
  //   ]);
  
  //   // Render the page with a router
  //   render(
  //     <MemoryRouter>
  //       <EmployeeExpensePage />
  //     </MemoryRouter>
  //   );
  
  //   // Simulate changing the filter dates
  //   fireEvent.change(screen.getByLabelText("Start Date"), {
  //     target: { value: "2024-12-05" }, // Set start date to December 5
  //   });
  //   fireEvent.change(screen.getByLabelText("End Date"), {
  //     target: { value: "2024-12-15" }, // Set end date to December 15
  //   });
  
  //   // Simulate clicking the filter button
  //   fireEvent.click(screen.getByText("Filter"));
  
  //   // Wait for the expenses to be filtered and displayed
  //   await waitFor(() => {
  //     const expenseItems = screen.queryAllByText(/Expense/);
  //     expect(expenseItems.length).toBe(2); // Expecting only two expenses
  //     expect(expenseItems[0].textContent).toContain("Expense 1");
  //     expect(expenseItems[1].textContent).toContain("Expense 2");
  //   });
    
  // });
  
});
