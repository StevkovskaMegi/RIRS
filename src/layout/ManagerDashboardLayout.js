import {Box, Container, Grid,  Tab, Tabs, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import EmployeesList from "../components/EmployeesList";
import UserRequests from "../components/UserRequests";
import GroupRequests from "../components/GroupRequests";
import RecentRequests from "../components/RecentRequests";
import {fetchUsersRequests} from "../services/api";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ManagerDashboardLayout = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [usersRequests, setUsersRequests] = useState([]);

    useEffect(() => {
        fetchUsersRequests().then((response) => {
            setUsersRequests(response)
        });
    }, []);

    return (
        <Container maxWidth='lg' sx={{ mt: 4 }}>
            <Typography variant='h4' gutterBottom>
                Manager Dashboard
            </Typography>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Requests" {...a11yProps(0)} />
                        <Tab label="Employees" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel sx={{ flexGrow: 1 }} value={value} index={0}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <UserRequests usersRequests={usersRequests}/>
                        </Grid>
                        <Grid item xs={6}>
                            <GroupRequests/>
                        </Grid>
                        <Grid item xs={12}>
                            <RecentRequests/>
                        </Grid>
                    </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <EmployeesList/>
                </CustomTabPanel>
            </Box>
        </Container>
    )
}

export default ManagerDashboardLayout;