// PlacementTrend.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlacementTrend = ({ data }) => (
  <Grid item xs={12} md={6}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Placement Trend
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            height={50}
            tick={{dy: 10}}
            axisLine={true}
            tickLine={true}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Placed" fill="#8884d8" />
          <Bar dataKey="Total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>
);

export default PlacementTrend;