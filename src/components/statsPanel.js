import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const StatsPanel = ({ employees, managers, groups }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h6' gutterBottom>
        Employees Analysis
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ backgroundColor: '#f9f9f9', borderRadius: 2, p: 2 }}
      >
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center', boxShadow: 1 }}>
            <CardContent>
              <Typography variant='subtitle1'>Employees</Typography>
              <Typography variant='h4' color='primary'>
                {employees}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                View detail &gt;
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center', boxShadow: 1 }}>
            <CardContent>
              <Typography variant='subtitle1'>Managers</Typography>
              <Typography variant='h4' color='primary'>
                {managers}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                View detail &gt;
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, textAlign: 'center', boxShadow: 1 }}>
            <CardContent>
              <Typography variant='subtitle1'>Groups</Typography>
              <Typography variant='h4' color='primary'>
                {groups}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                View detail &gt;
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPanel;
