import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ResponsiveContainer } from "recharts";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Table,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  FormControl,
  InputLabel,Select,MenuItem,TableContainer
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { getGroups, getUserById, requestExpense, getExpensesByUserId } from "../services/api";

const EmployeeExpensePage = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [userLogged, setUserLogged] = useState(null);
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]); // For storing available groups
  const [selectedGroup, setSelectedGroup] = useState(""); // For selected group ID
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Filtered expenses to display

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = jwtDecode(token);
        setUserLogged(decodedUser);

        try {
          const user = await getUserById(decodedUser.userId);
          setUser(user);

          const expenses = await getExpensesByUserId(decodedUser.userId);
          setExpenses(expenses);
          setFilteredExpenses(expenses); // Set all expenses initially
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    loadGroups();
  }, []);

  // Handle expense form submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    const expenseData = {
      user: userLogged.userId,
      description,
      amount: parseFloat(amount),
      date,
      group: isGroupExpense ? selectedGroup : null,
      status: "pending",
    };

    try {
      await requestExpense(expenseData);
      setDescription("");
      setAmount("");
      setDate("");
      setIsGroupExpense(false);
      // Re-fetch expenses to update the list
      const expenses = await getExpensesByUserId(userLogged.userId);
      setExpenses(expenses);
      setFilteredExpenses(expenses); // Reset filtered expenses
    } catch (err) {
      console.error("Error submitting expense:", err);
    }
  };

  const handleFilter = () => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
  
      // Normalize the dates to avoid time-related issues
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
  
      console.log("Filtering expenses:", expenseDate, start, end); // Debug log
  
      return (
        (!start || expenseDate >= start) && (!end || expenseDate <= end)
      );
    });
    setFilteredExpenses(filtered);
  };
  
  

  const budgetChartData =
    user && user.budget ? [{ name: "Budget", value: user.budget }] : [];

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Request Expense
        </Typography>
        <form onSubmit={handleExpenseSubmit}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Is this a Group Expense?</InputLabel>
            <Select
              value={isGroupExpense}
              onChange={(e) => {
                setIsGroupExpense(e.target.value);
                if (!e.target.value) setSelectedGroup("");
              }}
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </Select>
          </FormControl>

          {isGroupExpense && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Group</InputLabel>
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
              >
                {groups.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit Expense
          </Button>
        </form>
      </Box>

      {/* Date Filter Section */}
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Filter Expenses by Date
        </Typography>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button onClick={handleFilter} variant="contained" color="primary">
          Filter
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <h2>Budget Overview</h2>
          {budgetChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetChartData}
                  dataKey="value"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {budgetChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography>No budget data available</Typography>
          )}
        </Grid>
      </Grid>

      <div>
        <h2>Your Expenses</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredExpenses.length > 0 ? (
    filteredExpenses.map((expense) => {
      const formattedDate = new Date(expense.date).toLocaleDateString();

      return (
        <TableRow key={expense._id}>
          <TableCell>{expense.description}</TableCell>
          <TableCell>{expense.amount}</TableCell>
          <TableCell>{formattedDate}</TableCell>
          <TableCell>{expense.status}</TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={4} align="center">
        No expenses found
      </TableCell>
    </TableRow>
  )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default EmployeeExpensePage;
