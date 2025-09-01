import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Dashboard as DashboardIcon, LocationOn, Assignment, Security, Gavel, Login as LoginIcon } from "@mui/icons-material";

import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import SuspiciousActivity from "./pages/SuspiciousActivity";
import CaseManagement from "./pages/CaseManagement";
import MapPage from "./pages/MapLocation";
import Login from "./pages/Login";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const ACCENT_BLUE = "#24d3fe";
const TEXT_MAIN = "#d8ebfb";

export default function App() {
  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: CARD_BG,
          boxShadow: 'none',
          borderBottom: `2px solid ${ACCENT_BLUE}`,
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: 1, minHeight: '64px !important' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: { xs: 1, md: 1 }, 
              color: ACCENT_BLUE, 
              fontWeight: 700,
              minWidth: 'fit-content',
              mb: { xs: 1, sm: 0 },
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            IPDR Investigation Dashboard
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/dashboard"
              size="small"
              startIcon={<DashboardIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Dashboard
            </Button>
            
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/records"
              size="small"
              startIcon={<Assignment sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Records
            </Button>
            
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/map"
              size="small"
              startIcon={<LocationOn sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Map
            </Button>
            
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/suspicious-activity"
              size="small"
              startIcon={<Security sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Suspicious
            </Button>
            
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/case-management"
              size="small"
              startIcon={<Gavel sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Cases
            </Button>
            
            <Button 
              color="inherit" 
              component={NavLink} 
              to="/login"
              size="small"
              startIcon={<LoginIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: TEXT_MAIN,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&.active': { 
                  color: ACCENT_BLUE,
                  bgcolor: 'rgba(36, 211, 254, 0.1)',
                  fontWeight: 600
                },
                '&:hover': { 
                  bgcolor: 'rgba(36, 211, 254, 0.2)' 
                },
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ 
        bgcolor: DASH_BG, 
        minHeight: 'calc(100vh - 64px)',
        overflow: 'auto'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/suspicious-activity" element={<SuspiciousActivity />} />
          <Route path="/case-management" element={<CaseManagement />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="*" 
            element={
              <Box sx={{ 
                p: 3, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '50vh'
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: TEXT_MAIN,
                    textAlign: 'center'
                  }}
                >
                  404 - Page Not Found
                </Typography>
              </Box>
            } 
          />
        </Routes>
      </Box>
    </>
  );
}
