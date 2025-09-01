import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { Search, Warning } from "@mui/icons-material";
import { getAllIPDRRecords } from "../api/ipdrApi";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const TEXT_MAIN = "#d8ebfb";
const ACCENT_RED = "#f44336";
const ACCENT_BLUE = "#24d3fe";
const ACCENT_ORANGE = "#ff9800";

export default function SuspiciousActivity() {
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

  // Fetch suspicious records with proper pagination handling
  const fetchSuspiciousRecords = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      // Fetch multiple pages to ensure we get enough suspicious records
      const fetchSize = recordsPerPage * 5; // Fetch 5x more records to filter from
      const result = await getAllIPDRRecords(1, fetchSize * page); // Get more records to account for filtering
      
      // Ensure we have valid data structure
      let recordsData = [];
      
      if (result && typeof result === 'object') {
        if (Array.isArray(result)) {
          recordsData = result;
        } else if (Array.isArray(result.data)) {
          recordsData = result.data;
        }
      }

      // Filter for suspicious records only
      let suspiciousRecords = recordsData.filter(record => 
        record.is_suspicious === true || 
        record.suspicious === true ||
        record.status === 'suspicious' ||
        // Add more conditions to identify suspicious records
        (record.phoneNumber && record.phoneNumber.includes('suspicious')) ||
        (record.imei && record.imei.includes('suspicious'))
      );

      // Apply client-side search if there's a search term
      if (search.trim()) {
        const lowerTerm = search.toLowerCase();
        suspiciousRecords = suspiciousRecords.filter(
          (rec) =>
            (rec.phoneNumber && rec.phoneNumber.toLowerCase().includes(lowerTerm)) ||
            (rec.imei && rec.imei.toLowerCase().includes(lowerTerm)) ||
            (rec.publicIP && rec.publicIP.toLowerCase().includes(lowerTerm)) ||
            (rec.imsi && rec.imsi.toLowerCase().includes(lowerTerm)) ||
            (rec.accessType && rec.accessType.toLowerCase().includes(lowerTerm))
        );
      }

      // Calculate pagination for filtered results
      const totalSuspicious = suspiciousRecords.length;
      const calculatedTotalPages = Math.max(1, Math.ceil(totalSuspicious / recordsPerPage));
      
      // **KEY FIX**: If requested page is beyond available pages, reset to last valid page
      let validPage = page;
      if (page > calculatedTotalPages) {
        validPage = calculatedTotalPages;
        setCurrentPage(validPage); // Update the current page state
      }

      // Get records for the valid page
      const startIndex = (validPage - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      const paginatedRecords = suspiciousRecords.slice(startIndex, endIndex);

      setRecords(paginatedRecords);
      setTotalRecords(totalSuspicious);
      setTotalPages(calculatedTotalPages);
      
    } catch (e) {
      setError("Failed to fetch suspicious records.");
      console.error('Error fetching suspicious records:', e);
      setRecords([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSuspiciousRecords(1, searchTerm);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 on search
      fetchSuspiciousRecords(1, searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    // Validate the new page before setting
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchSuspiciousRecords(newPage, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => fetchSuspiciousRecords(currentPage, searchTerm)}
            sx={{ bgcolor: ACCENT_BLUE }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: DASH_BG, minHeight: "100vh" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Warning sx={{ color: ACCENT_RED, fontSize: 32 }} />
        <Typography
          variant="h4"
          sx={{ color: ACCENT_RED, fontWeight: 700, letterSpacing: 1 }}
        >
          Suspicious Activity
        </Typography>
      </Stack>

      {/* Alert Box */}
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 3, 
          bgcolor: ACCENT_ORANGE + '20',
          color: TEXT_MAIN,
          '& .MuiAlert-icon': { color: ACCENT_ORANGE }
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          🚨 Security Alert: {totalRecords} suspicious activities detected
        </Typography>
        These records require immediate attention and investigation.
      </Alert>

      {/* Search Section */}
      <Paper sx={{ p: 3, bgcolor: CARD_BG, borderRadius: 3, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search suspicious records by Phone, IMEI, IP..."
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
            '& .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_RED },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_BLUE },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_RED },
            '& .MuiInputBase-input::placeholder': { color: TEXT_MAIN, opacity: 0.7 },
          }}
        />

        {/* Stats Row */}
        <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: ACCENT_RED, fontWeight: 600 }}>
              Suspicious Records
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
          <CircularProgress sx={{ color: ACCENT_RED }} size={50} />
        </Box>
      ) : (
        <Paper
          sx={{
            overflowX: "auto",
            bgcolor: CARD_BG,
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.25)",
            borderRadius: 3,
            border: `2px solid ${ACCENT_RED}20`,
            "& table": { borderCollapse: "separate", borderSpacing: "0 8px" },
            "& tbody tr": {
              transition: "all 0.3s",
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": { 
                backgroundColor: ACCENT_RED + '10',
                transform: "translateX(4px)",
                boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)"
              },
            },
            "& tbody td": {
              borderBottom: "none",
              py: 1.5,
            },
            "& thead th": {
              borderBottom: "none",
              color: ACCENT_RED,
              fontWeight: 700,
              fontSize: 14,
              paddingBottom: 2,
              borderBottom: `2px solid ${ACCENT_RED}`,
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>🚨 Alert Level</TableCell>
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
                    {searchTerm ? 
                      `No suspicious records found for "${searchTerm}"` : 
                      "🎉 No suspicious activities detected!"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                safeRecords.map((row, index) => (
                  <TableRow key={row._id || `suspicious-${index}`} tabIndex={-1}>
                    <TableCell>
                      <Chip
                        label="HIGH RISK"
                        size="small"
                        icon={<Warning />}
                        sx={{
                          bgcolor: ACCENT_RED,
                          color: "white",
                          fontWeight: "bold",
                          animation: "pulse 2s infinite",
                          boxShadow: `0 0 10px ${ACCENT_RED}50`,
                        }}
                      />
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
                          bgcolor: ACCENT_ORANGE, 
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
          sx={{ mt: 4, p: 2, bgcolor: CARD_BG, borderRadius: 2, border: `1px solid ${ACCENT_RED}30` }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ color: TEXT_MAIN }}>
              Showing {((currentPage - 1) * recordsPerPage) + 1}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords.toLocaleString()} suspicious records
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
            boundaryCount={2}
            siblingCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                color: TEXT_MAIN,
                '&.Mui-selected': {
                  bgcolor: ACCENT_RED,
                  color: 'white',
                  fontWeight: 600,
                },
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
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
