import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";

import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import SuspiciousActivity from "./pages/SuspiciousActivity";
import CaseManagement from "./pages/CaseManagement";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IPDR Investigation Dashboard
          </Typography>
          <Button color="inherit" component={NavLink} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={NavLink} to="/records">
            Records
          </Button>
          <Button color="inherit" component={NavLink} to="/suspicious-activity">
            Suspicious Activity
          </Button>
          <Button color="inherit" component={NavLink} to="/case-management">
            Case Management
          </Button>
          <Button color="inherit" component={NavLink} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/suspicious-activity" element={<SuspiciousActivity />} />
          <Route path="/case-management" element={<CaseManagement />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Typography>Page Not Found</Typography>} />
        </Routes>
      </Box>
    </>
  );
}
