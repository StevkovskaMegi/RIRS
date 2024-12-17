import {
    
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";

import React, {useEffect, useState} from "react";
import {fetchEmployees, updateEmployeeBudget} from "../services/api";

export default function EmployeesList() {

    const [employees, setEmployees] = useState([]);

    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [budget, setBudget] = useState(0);

    const handleClickOpen = (employee) => {
        setSelectedEmployee(employee);
        setBudget(employee.budget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
        setBudget('');
    };

    useEffect(() => {
        fetchEmployees().then((response) => {
            console.log(response)
            setEmployees(response);
        });
    }, []);

    const handleSave = async () => {
        if (selectedEmployee) {
            await updateEmployeeBudget(selectedEmployee._id, budget);
            setEmployees(employees.map(emp => emp._id === selectedEmployee._id ? { ...emp, budget } : emp));
            handleClose();
        }
    };

    console.log(employees)

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        {/*<TableCell/>*/}
                        <TableCell>Name</TableCell>
                        <TableCell align="right">E-mail</TableCell>
                        <TableCell align="right">Budget</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((row) => (
                        <TableRow key={row._id} onClick={() => handleClickOpen(row)}>
                            <TableCell component="th" >
                                {row.name}
                            </TableCell>
                            <TableCell align="right" >{row.email}</TableCell>
                            <TableCell component="th" align="right">{row.budget}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Employee budget update</DialogTitle>
                <DialogContent>
                    {selectedEmployee && (
                        <div>
                            <p>Name: {selectedEmployee.name}</p>
                            <TextField
                                label="Budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                fullWidth
                                type="number"
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">
                        save
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}