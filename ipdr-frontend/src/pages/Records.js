import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { getAllIPDRRecords } from "../api/ipdrApi";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const TEXT_MAIN = "#d8ebfb";
const ACCENT_RED = "#f44336";
const ACCENT_GREEN = "#4caf50";

const ACCENT_BLUE = "#24d3fe";  // Add this line along with existing color constants


export default function Records() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      try {
        const allRecords = await getAllIPDRRecords();
        setRecords(allRecords || []);
        setFilteredRecords(allRecords || []);
      } catch (e) {
        setError("Failed to fetch records.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  // Filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = records.filter(
        (rec) =>
          (rec.phoneNumber && rec.phoneNumber.includes(lowerTerm)) ||
          (rec.imei && rec.imei.toLowerCase().includes(lowerTerm)) ||
          (rec.publicIP && rec.publicIP.includes(lowerTerm))
      );
      setFilteredRecords(filtered);
      setPage(0);
    }
  }, [searchTerm, records]);

  // Page slicing
  const pagedRecords = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, page]);

  const pageCount = Math.ceil(filteredRecords.length / rowsPerPage);

  // Handlers
  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(pageCount - 1, p + 1));
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: DASH_BG, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: TEXT_MAIN, fontWeight: 700, letterSpacing: 1 }}
      >
        All Records
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search by Phone Number, IMEI, or Public IP"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{
          mb: 3,
          bgcolor: "#2c3142",
          borderRadius: 1,
          input: { color: TEXT_MAIN },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444a6b" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: ACCENT_BLUE },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: ACCENT_BLUE },
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          sx={{
            overflowX: "auto",
            bgcolor: CARD_BG,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            borderRadius: 3,
            "& table": { borderCollapse: "separate", borderSpacing: "0 10px" },
            "& tbody tr": {
              transition: "background-color 0.3s",
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#2c3142" },
            },
            "& tbody td": {
              borderBottom: "none",
            },
            "& thead th": {
              borderBottom: "none",
              color: ACCENT_BLUE,
              fontWeight: 700,
              fontSize: 14,
              paddingBottom: 1,
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
              {pagedRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{ color: TEXT_MAIN, textAlign: "center", py: 5 }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                pagedRecords.map((row) => (
                  <TableRow key={row._id} tabIndex={-1}>
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
                          label="Non-Suspicious"
                          size="small"
                          sx={{
                            bgcolor: ACCENT_GREEN,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.phoneNumber}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>{row.imei}</TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>{row.imsi}</TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>{row.publicIP}</TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.accessType}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {new Date(row.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {new Date(row.endTime).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.uplinkVolume}
                    </TableCell>
                    <TableCell sx={{ color: TEXT_MAIN }}>
                      {row.downlinkVolume}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Pagination Controls */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        sx={{ color: TEXT_MAIN }}
      >
        <Button variant="outlined" disabled={page === 0} onClick={handlePrevPage}>
          Previous 10
        </Button>
        <Typography>
          Page {page + 1} of {pageCount || 1}
        </Typography>
        <Button
          variant="outlined"
          disabled={page + 1 === pageCount || pageCount === 0}
          onClick={handleNextPage}
        >
          Next 10
        </Button>
      </Stack>
    </Box>
  );
}
