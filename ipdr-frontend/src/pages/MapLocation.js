import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Paper,
  Alert,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { Search, Clear, LocationOn, Phone, Public, Language } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getIPDRLatLong } from '../api/ipdrApi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CARD_BG = "#181c2f";
const DASH_BG = "#0a0e1a";
const ACCENT_BLUE = "#24d3fe";
const ACCENT_PURPLE = "#a334fa";
const ACCENT_GREEN = "#00ffc2";
const TEXT_MAIN = "#d8ebfb";

// Fix Leaflet's default icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Changed to default OpenStreetMap tiles (light/white theme)
const lightTileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Helper component to change map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Default center: Delhi
  const defaultCenter = [28.6139, 77.209];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await getIPDRLatLong(phoneNumber);

      if (result && result.latitude && result.longitude) {
        const lat = parseFloat(result.latitude);
        const lng = parseFloat(result.longitude);
        setSearchResult(result);
        setMapCenter([lat, lng]);
        setMapZoom(15);
        setSuccess(`Location found for ${phoneNumber}`);
      } else {
        setError('No location data found for this phone number');
        setSearchResult(null);
      }
    } catch (err) {
      setError('Error fetching location data. Please try again.');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setPhoneNumber('');
    setSearchResult(null);
    setError('');
    setSuccess('');
    setMapCenter(defaultCenter);
    setMapZoom(10);
  };

  return (
    <Box sx={{ bgcolor: DASH_BG, minHeight: "100vh", p: 3 }}>
      {/* Hero Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: ACCENT_GREEN, 
            fontWeight: 700, 
            mb: 1,
            textShadow: `0 0 20px ${ACCENT_GREEN}40`,
            background: `linear-gradient(45deg, ${ACCENT_GREEN}, ${ACCENT_BLUE})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          🌍 IPDR Location Tracker
        </Typography>
        <Typography sx={{ color: TEXT_MAIN, opacity: 0.8, fontSize: 18 }}>
          Advanced geolocation tracking for telecommunications data
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper
        sx={{
          mb: 4,
          p: 4,
          bgcolor: CARD_BG,
          borderRadius: 4,
          maxWidth: 800,
          mx: 'auto',
          boxShadow: `0 8px 32px ${ACCENT_GREEN}20`,
          border: `1px solid ${ACCENT_GREEN}30`,
        }}
        elevation={12}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Phone sx={{ color: ACCENT_GREEN, fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              color: ACCENT_GREEN, 
              fontWeight: 600,
              flexGrow: 1
            }}
          >
            Search by Phone Number
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter phone number (e.g., +1234567890)..."
            disabled={loading}
            variant="filled"
            sx={{
              '& .MuiFilledInput-root': {
                bgcolor: DASH_BG,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: DASH_BG,
                },
                '&.Mui-focused': {
                  bgcolor: DASH_BG,
                },
              },
              '& .MuiInputBase-input': { 
                color: TEXT_MAIN,
                fontSize: 16,
                py: 2,
              },
              '& .MuiInputBase-input::placeholder': { 
                color: TEXT_MAIN, 
                opacity: 0.7 
              },
              '& .MuiFilledInput-underline:before': {
                borderBottomColor: ACCENT_GREEN,
              },
              '& .MuiFilledInput-underline:after': {
                borderBottomColor: ACCENT_BLUE,
              },
            }}
          />
          
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !phoneNumber.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
            sx={{
              bgcolor: ACCENT_GREEN,
              color: '#000',
              px: 3,
              py: 2,
              minWidth: 140,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': { 
                bgcolor: ACCENT_BLUE,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 20px ${ACCENT_GREEN}40`,
              },
              '&:disabled': { 
                bgcolor: '#444',
                color: '#888',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Searching...' : 'Locate'}
          </Button>
          
          <IconButton
            onClick={clearSearch}
            sx={{
              bgcolor: ACCENT_PURPLE,
              color: TEXT_MAIN,
              '&:hover': { 
                bgcolor: '#8a2bd6',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Clear />
          </IconButton>
        </Stack>

        {/* Status Messages */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              bgcolor: '#ff544420',
              color: '#ff5444',
              border: '1px solid #ff544440',
              '& .MuiAlert-icon': {
                color: '#ff5444',
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              bgcolor: ACCENT_GREEN + '20',
              color: ACCENT_GREEN,
              border: `1px solid ${ACCENT_GREEN}40`,
              '& .MuiAlert-icon': {
                color: ACCENT_GREEN,
              }
            }}
          >
            {success}
          </Alert>
        )}
      </Paper>

      {/* Location Details */}
      {searchResult && (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
          <Grid container spacing={3}>
            {/* Main Info Card */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: CARD_BG,
                  border: `2px solid ${ACCENT_GREEN}40`,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${ACCENT_GREEN}20`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <LocationOn sx={{ color: ACCENT_GREEN, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ color: ACCENT_GREEN, fontWeight: 600 }}>
                      Location Details
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600, mb: 0.5 }}>
                        📱 Phone Number
                      </Typography>
                      <Typography sx={{ color: TEXT_MAIN, fontSize: 18 }}>
                        {searchResult.phoneNumber}
                      </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: ACCENT_GREEN + '30' }} />

                    <Box>
                      <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600, mb: 0.5 }}>
                        🌐 Coordinates
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Chip 
                          label={`Lat: ${searchResult.latitude}`} 
                          sx={{ bgcolor: ACCENT_GREEN + '20', color: ACCENT_GREEN }} 
                        />
                        <Chip 
                          label={`Lng: ${searchResult.longitude}`} 
                          sx={{ bgcolor: ACCENT_BLUE + '20', color: ACCENT_BLUE }} 
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Network Info Card */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: CARD_BG,
                  border: `2px solid ${ACCENT_PURPLE}40`,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${ACCENT_PURPLE}20`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Public sx={{ color: ACCENT_PURPLE, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ color: ACCENT_PURPLE, fontWeight: 600 }}>
                      Network Info
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600, mb: 0.5 }}>
                        🌐 Original IP Address
                      </Typography>
                      <Typography sx={{ color: TEXT_MAIN, fontSize: 16, fontFamily: 'monospace' }}>
                        {searchResult.originalIP || 'Unknown'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600, mb: 0.5 }}>
                        🔗 Completed IP Address
                      </Typography>
                      <Typography sx={{ color: TEXT_MAIN, fontSize: 16, fontFamily: 'monospace' }}>
                        {searchResult.completedIP || 'Unknown'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Location Info Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  bgcolor: CARD_BG,
                  border: `2px solid ${ACCENT_BLUE}40`,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${ACCENT_BLUE}20`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Language sx={{ color: ACCENT_BLUE, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ color: ACCENT_BLUE, fontWeight: 600 }}>
                      Geographic Information
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography sx={{ color: ACCENT_GREEN, fontWeight: 600, mb: 1 }}>
                          🏙️ City
                        </Typography>
                        <Typography sx={{ color: TEXT_MAIN, fontSize: 18 }}>
                          {searchResult.locationInfo?.city || 'Unknown'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography sx={{ color: ACCENT_PURPLE, fontWeight: 600, mb: 1 }}>
                          🗺️ Region
                        </Typography>
                        <Typography sx={{ color: TEXT_MAIN, fontSize: 18 }}>
                          {searchResult.locationInfo?.region || 'Unknown'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600, mb: 1 }}>
                          🏴 Country
                        </Typography>
                        <Typography sx={{ color: TEXT_MAIN, fontSize: 18 }}>
                          {searchResult.locationInfo?.country || 'Unknown'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Light Mode Map (Default) */}
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: CARD_BG, 
          borderRadius: 3, 
          maxWidth: 1200,
          mx: 'auto',
          border: `2px solid ${ACCENT_GREEN}30`,
          boxShadow: `0 8px 32px ${ACCENT_GREEN}15`,
        }} 
        elevation={12}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: ACCENT_GREEN, 
            fontWeight: 600, 
            mb: 2,
            textAlign: 'center'
          }}
        >
          🗺️ Interactive Map
        </Typography>
        
        <Box 
          sx={{ 
            height: 600, 
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            border: `3px solid ${ACCENT_GREEN}40`,
            boxShadow: `inset 0 0 20px ${ACCENT_GREEN}20`,
          }}
        >
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ 
              height: '100%', 
              width: '100%',
            }}
            scrollWheelZoom={true}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url={lightTileURL}
              attribution={attribution}
            />
            {searchResult && (
              <Marker position={[parseFloat(searchResult.latitude), parseFloat(searchResult.longitude)]}>
                <Popup>
                  <Box sx={{ color: '#333', p: 1, minWidth: 200 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      📍 Location Found
                    </Typography>
                    <Typography><strong>Phone:</strong> {searchResult.phoneNumber}</Typography>
                    <Typography><strong>City:</strong> {searchResult.locationInfo?.city || 'Unknown'}</Typography>
                    <Typography><strong>Coordinates:</strong></Typography>
                    <Typography>Lat: {searchResult.latitude}</Typography>
                    <Typography>Lng: {searchResult.longitude}</Typography>
                    <Typography><strong>IP:</strong> {searchResult.originalIP}</Typography>
                  </Box>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default MapPage;
