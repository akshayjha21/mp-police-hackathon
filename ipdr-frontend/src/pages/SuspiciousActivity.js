import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { getAllIPDRRecords } from "../api/ipdrApi";

export default function SuspiciousActivity() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchSuspicious() {
      setLoading(true);
      try {
        const allRecords = await getAllIPDRRecords();
        if (allRecords) {
          const suspiciousRecords = allRecords.filter(
            (record) => record.is_suspicious === true
          );
          setRecords(suspiciousRecords);
          setFilteredRecords(suspiciousRecords);
        } else {
          setRecords([]);
          setFilteredRecords([]);
        }
      } catch (e) {
        setError("Failed to fetch suspicious records.");
        console.error(e);
      }
      setLoading(false);
    }
    fetchSuspicious();
  }, []);

  // Filter records by search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = records.filter(
        (rec) =>
          (rec.phoneNumber && rec.phoneNumber.toLowerCase().includes(lowerTerm)) ||
          (rec.imei && rec.imei.toLowerCase().includes(lowerTerm)) ||
          (rec.publicIP && rec.publicIP.toLowerCase().includes(lowerTerm))
      );
      setFilteredRecords(filtered);
      setPage(0); // Reset to first page on search change
    }
  }, [searchTerm, records]);

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Pagination calculations
  const pageCount = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = page * rowsPerPage;
  const pagedRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  // Handlers
  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(pageCount - 1, p + 1));
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Suspicious Activity
      </Typography>

      {/* Search Input */}
      <TextField
        variant="outlined"
        placeholder="Search by Phone Number, IMEI, or Public IP"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 2, bgcolor: "#262a3b", input: { color: "#d8ebfb" }, borderRadius: 1 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper elevation={4}>
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
                    <TableCell colSpan={10} sx={{ textAlign: "center", color: "#d8ebfb" }}>
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRecords.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            bgcolor: "#f44336",
                            color: "white",
                            fontWeight: 700,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: 12,
                            userSelect: "none",
                          }}
                        >
                          Suspicious
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.phoneNumber}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.imei}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.imsi}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.publicIP}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.accessType}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{new Date(row.startTime).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{new Date(row.endTime).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.uplinkVolume}</TableCell>
                      <TableCell sx={{ color: "#d8ebfb" }}>{row.downlinkVolume}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Pagination Controls */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            sx={{ color: "#d8ebfb" }}
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
        </>
      )}
    </Box>
  );
}
