import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography, Alert } from "@mui/material";
import { Dashboard as DashboardIcon, LocationOn, Assignment, Security, Gavel } from "@mui/icons-material";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton, useUser } from "@clerk/clerk-react";

import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import SuspiciousActivity from "./pages/SuspiciousActivity";
import CaseManagement from "./pages/CaseManagement";
import MapPage from "./pages/MapLocation";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const ACCENT_BLUE = "#24d3fe";
const TEXT_MAIN = "#d8ebfb";

// Environment Configuration Error Component
function ConfigurationError() {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      bgcolor: DASH_BG,
      p: 3
    }}>
      <Alert 
        severity="error" 
        sx={{ 
          maxWidth: 600,
          bgcolor: CARD_BG,
          color: TEXT_MAIN,
          '& .MuiAlert-icon': { color: '#ff5252' }
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: '#ff5252' }}>
          Environment Configuration Error
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable.
        </Typography>
        <Typography variant="body2">
          <strong>To fix this:</strong>
          <br />
          1. Create a <code>.env</code> file in your project root
          <br />
          2. Add: <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key</code>
          <br />
          3. Restart your development server
        </Typography>
      </Alert>
    </Box>
  );
}

function AppContent() {
  const { user } = useUser();

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
            width: { xs: '100%', sm: 'auto' },
            alignItems: 'center'
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

            {/* User Info & Profile Button */}
            <Typography 
              sx={{ 
                color: TEXT_MAIN, 
                fontSize: '0.7rem',
                px: 1,
                opacity: 0.8,
                display: { xs: 'none', md: 'block' }
              }}
            >
              Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
            </Typography>

            {/* Clerk User Button - handles profile and logout */}
            <Box sx={{ ml: 1 }}>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: '32px',
                      height: '32px',
                    }
                  }
                }}
              />
            </Box>
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

export default function App() {
 

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SignedIn>
        <AppContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
