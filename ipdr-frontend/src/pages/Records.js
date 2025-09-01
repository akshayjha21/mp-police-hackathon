import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
  Stack,
  Button,
  Chip,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getAllIPDRRecords } from "../api/ipdrApi";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const TEXT_MAIN = "#d8ebfb";
const ACCENT_RED = "#f44336";
const ACCENT_GREEN = "#4caf50";
const ACCENT_BLUE = "#24d3fe";

export default function Records() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 25;

  // Data states
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch records with pagination
  const fetchRecords = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllIPDRRecords(page, recordsPerPage);
      
      // Ensure we have valid data structure
      let recordsData = [];
      
      if (result && typeof result === 'object') {
        if (Array.isArray(result)) {
          // If result is directly an array
          recordsData = result;
        } else if (Array.isArray(result.data)) {
          // If result has data property that's an array
          recordsData = result.data;
        } else {
          console.warn('Unexpected data structure:', result);
        }
      }

      // Apply client-side search if there's a search term
      if (search.trim()) {
        const lowerTerm = search.toLowerCase();
        recordsData = recordsData.filter(
          (rec) =>
            (rec.phoneNumber && rec.phoneNumber.toLowerCase().includes(lowerTerm)) ||
            (rec.imei && rec.imei.toLowerCase().includes(lowerTerm)) ||
            (rec.publicIP && rec.publicIP.toLowerCase().includes(lowerTerm)) ||
            (rec.imsi && rec.imsi.toLowerCase().includes(lowerTerm)) ||
            (rec.accessType && rec.accessType.toLowerCase().includes(lowerTerm))
        );
      }

      setRecords(recordsData);
      
      // Handle pagination metadata
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        setTotalPages(result.totalPages || Math.ceil(recordsData.length / recordsPerPage));
        setTotalRecords(result.totalCount || recordsData.length);
      } else {
        // Fallback for simple array response
        setTotalPages(Math.ceil(recordsData.length / recordsPerPage));
        setTotalRecords(recordsData.length);
      }
      
    } catch (e) {
      setError("Failed to fetch records.");
      console.error('Error fetching records:', e);
      setRecords([]); // Ensure records is always an array
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRecords(1, searchTerm);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchRecords(1, searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchRecords(newPage, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Ensure records is always an array
  const safeRecords = Array.isArray(records) ? records : [];

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: DASH_BG, minHeight: "100vh" }}>
        <Paper sx={{ p: 4, bgcolor: CARD_BG, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => fetchRecords(currentPage, searchTerm)}
            sx={{ mt: 2, bgcolor: ACCENT_BLUE }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: DASH_BG, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: ACCENT_BLUE, fontWeight: 700, letterSpacing: 1 }}
      >
        IPDR Records
      </Typography>

      {/* Search Section */}
      <Paper sx={{ p: 3, bgcolor: CARD_BG, borderRadius: 3, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search by Phone Number, IMEI, IMSI, Public IP, or Access Type"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: ACCENT_BLUE }} />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: DASH_BG,
            borderRadius: 2,
            '& .MuiInputBase-input': { color: TEXT_MAIN },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444a6b' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_BLUE },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_BLUE },
            '& .MuiInputBase-input::placeholder': { color: TEXT_MAIN, opacity: 0.7 },
          }}
        />

        {/* Stats Row */}
        <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600 }}>
              Total Records
            </Typography>
            <Typography sx={{ color: TEXT_MAIN, fontSize: 18, fontWeight: 700 }}>
              {totalRecords.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600 }}>
              Current Page
            </Typography>
            <Typography sx={{ color: TEXT_MAIN, fontSize: 18, fontWeight: 700 }}>
              {currentPage} / {totalPages}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: ACCENT_BLUE, fontWeight: 600 }}>
              Showing
            </Typography>
            <Typography sx={{ color: TEXT_MAIN, fontSize: 18, fontWeight: 700 }}>
              {safeRecords.length} records
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Records Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: ACCENT_BLUE }} size={50} />
        </Box>
      ) : (
        <Paper
          sx={{
            overflowX: "auto",
            bgcolor: CARD_BG,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            borderRadius: 3,
            "& table": { borderCollapse: "separate", borderSpacing: "0 8px" },
            "& tbody tr": {
              transition: "all 0.3s",
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": { 
                backgroundColor: "#2c3142",
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(36, 211, 254, 0.2)"
              },
            },
            "& tbody td": {
              borderBottom: "none",
              py: 1.5,
            },
            "& thead th": {
              borderBottom: "none",
              color: ACCENT_BLUE,
              fontWeight: 700,
              fontSize: 14,
              paddingBottom: 2,
              borderBottom: `2px solid ${ACCENT_BLUE}`,
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>IMSI</TableCell>
                <TableCell>Public IP</TableCell>
                <TableCell>Access Type</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Uplink Volume</TableCell>
                <TableCell>Downlink Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{ color: TEXT_MAIN, textAlign: "center", py: 5 }}
                  >
                    {searchTerm ? `No records found for "${searchTerm}"` : "No records found."}
                  </TableCell>
                </TableRow>
              ) : (
                safeRecords.map((row, index) => (
                  <TableRow key={row._id || `record-${index}`} tabIndex={-1}>
                    <TableCell>
                      {row.is_suspicious ? (
                        <Chip
                          label="Suspicious"
                          size="small"
                          sx={{
                            bgcolor: ACCENT_RED,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      ) : (
                        <Chip
                          label="Normal"
                          size="small"
                          sx={{
                            bgcolor: ACCENT_GREEN,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN, fontWeight: 600 }}>
                      {row.phoneNumber || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.imei || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.imsi || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.publicIP || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.accessType || 'Unknown'} 
                        size="small"
                        sx={{ 
                          bgcolor: ACCENT_BLUE, 
                          color: '#000', 
                          fontWeight: 600 
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.startTime ? new Date(row.startTime).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.endTime ? new Date(row.endTime).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.uplinkVolume ? `${row.uplinkVolume} MB` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.downlinkVolume ? `${row.downlinkVolume} MB` : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 4, p: 2, bgcolor: CARD_BG, borderRadius: 2 }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ color: TEXT_MAIN }}>
              Showing {((currentPage - 1) * recordsPerPage) + 1}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords.toLocaleString()} records
            </Typography>
          </Box>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: TEXT_MAIN,
                '&.Mui-selected': {
                  bgcolor: ACCENT_BLUE,
                  color: '#000',
                  fontWeight: 600,
                },
                '&:hover': {
                  bgcolor: 'rgba(36, 211, 254, 0.2)',
                },
              },
            }}
          />

          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Typography sx={{ color: TEXT_MAIN, textAlign: 'center' }}>
              Page {currentPage} of {totalPages}
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
