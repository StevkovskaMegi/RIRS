import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { approveRequest, declineRequest} from "../services/api";




const UserRequests = ({usersRequests}) => {

    async function approveRequestApi (id)  {
        await approveRequest(id)
    }

    async function declineRequestApi(id) {
        await declineRequest(id)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Expenses request</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usersRequests.map((row) => (
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
                                <Button type="submit" onClick={() => approveRequestApi(row._id)}>Approve</Button>
                                <Button type="submit" onClick={() => declineRequestApi(row._id)}>Decline</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UserRequests;