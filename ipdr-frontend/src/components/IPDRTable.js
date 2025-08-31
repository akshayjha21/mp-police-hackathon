import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Box
} from "@mui/material";

export default function IPDRTable({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter rows by search term on phoneNumber, imei, or publicIP
  const filteredData = data.filter(
    row =>
      (row.phoneNumber?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (row.imei?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (row.publicIP?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box p={2}>
        <TextField
          label="Search by Phone, IMEI, or Public IP"
          variant="outlined"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="ipdr table">
          <TableHead>
            <TableRow>
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
            {paginatedData.map((row, idx) => (
              <TableRow key={idx} hover role="checkbox" tabIndex={-1}>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.imei}</TableCell>
                <TableCell>{row.imsi}</TableCell>
                <TableCell>{row.publicIP}</TableCell>
                <TableCell>{row.accessType}</TableCell>
                <TableCell>{new Date(row.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(row.endTime).toLocaleString()}</TableCell>
                <TableCell>{row.uplinkVolume}</TableCell>
                <TableCell>{row.downlinkVolume}</TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
