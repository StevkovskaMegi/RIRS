import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ResponsiveContainer } from "recharts";
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Table,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  TableBody
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  getGroups,
  getUserById,
  requestExpense,
  getExpensesByUserId,
} from "../services/api";

const EmployeeExpensePage = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [userLogged, setUserLogged] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]); // For storing available groups
  const [selectedGroup, setSelectedGroup] = useState(""); // For selected group ID

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

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("User not found. Please log in again.");
      navigate("/login");
      return;
    }

    const expenseData = {
      user: userLogged.userId,
      description,
      amount: parseFloat(amount),
      date,
      group: isGroupExpense ?  selectedGroup : null,
      status: "pending",
    };

    try {
      const response = await requestExpense(expenseData);
      setMessage("Expense request submitted successfully");
      setDescription("");
      setAmount("");
      setDate("");
      setIsGroupExpense(false);
    } catch (err) {
      setMessage("Failed to submit expense request");
    }
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <h2>
            Budget Overview
          </h2>
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
            {expenses.map((expense) => {
              // Format the expense date
              const formattedDate = new Date(expense.date).toLocaleDateString(); // Format as MM/DD/YYYY

              return (
                <TableRow key={expense._id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{expense.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </Container>
  );
};

export default EmployeeExpensePage;
