import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

export default function QuickStats({ stats }) {
  const items = [
    { label: "Total Records", value: stats.totalRecords },
    { label: "Unique Users", value: stats.uniqueUsers },
    { label: "Active Investigations", value: stats.activeInvestigations },
    { label: "Suspicious Patterns", value: stats.suspiciousPatterns },
  ];

  return (
    <Grid container spacing={3}>
      {items.map(({ label, value }) => (
        <Grid item xs={6} md={3} key={label}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h5" color="primary">
              {value}
            </Typography>
            <Typography>{label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
