import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Box,
} from '@mui/material';
const UserList = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of users per page

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <Typography variant='h6' gutterBottom>
        Recent Added Employees
      </Typography>
      <Grid container spacing={2}>
        {currentUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <CardContent>
                <Avatar sx={{ mx: 'auto', mb: 1 }} />
                <Typography variant='subtitle1'>{user.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {user.role}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {user.email}
                </Typography>

                {/* Password Section */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant='contained'
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Previous
        </Button>
        <Typography variant='body2' sx={{ alignSelf: 'center', mx: 2 }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant='contained'
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default UserList;
