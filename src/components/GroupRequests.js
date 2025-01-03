import {useEffect, useState} from "react";
import {approveRequest, declineRequest, fetchGroupsRequests} from "../services/api";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const GroupRequests = () => {
    const [groupRequests, setGroupRequests] = useState([]);

    useEffect(() => {
        fetchGroupsRequests().then((response) => {
            setGroupRequests(response)
        });
    }, []);
    const approveRequestApi = async (id) => {
        await approveRequest(id)
    }

    const declineRequestApi = async (id) => {
        await declineRequest(id)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Group request</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groupRequests.map((row) => (
                        <TableRow
                            key={row}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.user.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {new Date(row.date).toLocaleDateString('sl-SL')}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.amount}€
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.description}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button onClick={() => approveRequestApi(row._id)}>Approve</Button>
                                <Button onClick={() => declineRequestApi(row._id)}>Decline</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default GroupRequests;