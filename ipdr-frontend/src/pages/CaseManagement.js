import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

// Color mappings
const statusColor = {
  Active: "#E65100",
  Pending: "#757575",
  Closed: "#00897B",
};
const priorityColor = {
  High: "#b71c1c",
  Medium: "#8d6e63",
  Low: "#616161",
};

// Sample initial data
const initialCases = [
  {
    id: "CASE_001",
    title: "Operation Digital Trail",
    status: "Active",
    priority: "High",
    investigator: "Agent Smith",
    created: "2025-08-20",
    evidence: 24,
    suspects: [{ id: "917280305443" }, { id: "918389720476" }],
  },
  {
    id: "CASE_002",
    title: "Network Analysis - Group Alpha",
    status: "Pending",
    priority: "Medium",
    investigator: "Agent Johnson",
    created: "2025-08-25",
    evidence: 8,
    suspects: [{ id: "919645196062" }],
  },
];

export default function CaseManagement() {
  const [cases, setCases] = useState(initialCases);
  const [openNewCaseDialog, setOpenNewCaseDialog] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [errorText, setErrorText] = useState("");
  const [manageOpen, setManageOpen] = useState(false);

  const openNewCase = () => {
    setNewIdentifier("");
    setNewPriority("Medium");
    setErrorText("");
    setOpenNewCaseDialog(true);
  };
  const closeNewCase = () => setOpenNewCaseDialog(false);
  const toggleManageCases = () => setManageOpen((prev) => !prev);

  const addCase = () => {
    if (!newIdentifier.trim()) {
      setErrorText("Please enter a Phone Number or IMEI");
      return;
    }
    const maxIdNum = cases.reduce((max, c) => {
      const num = parseInt(c.id.split("_")[1] || "0", 10);
      return Math.max(max, num);
    }, 0);

    const newId = `CASE_${String(maxIdNum + 1).padStart(3, "0")}`;

    const newCase = {
      id: newId,
      title: `New Case - ${newIdentifier}`,
      status: "Pending",
      priority: newPriority,
      investigator: "Unassigned",
      created: new Date().toISOString().split("T")[0],
      evidence: 0,
      suspects: [{ id: newIdentifier }],
    };

    setCases([newCase, ...cases]);
    closeNewCase();
  };

  const removeCase = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Box sx={{ bgcolor: "#181c2f", minHeight: "100vh", p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" sx={{ color: "#d8e3fb", fontWeight: "bold" }}>
          Case Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#24c3fe",
              color: "#121212",
              fontWeight: "bold",
              px: 3,
              borderRadius: 2,
              "&:hover": { bgcolor: "#1ba3ec" },
            }}
            onClick={openNewCase}
          >
            Create New Case
          </Button>
          <Button
            variant={manageOpen ? "outlined" : "contained"}
            sx={{
              bgcolor: manageOpen ? "transparent" : "#a434fb",
              color: manageOpen ? "#d8e3fb" : "#121212",
              fontWeight: "bold",
              borderColor: "#a434fb",
              "&:hover": {
                bgcolor: manageOpen ? "rgba(164,52,251,.1)" : "#911ef3",
              },
              borderRadius: 2,
            }}
            onClick={toggleManageCases}
          >
            {manageOpen ? "Close Management" : "Manage Cases"}
          </Button>
        </Stack>

      </Stack>

      {/* Show grid of cards when not in manage mode */}
      {!manageOpen && (
        <Grid container spacing={3}>
          {cases.map((c) => (
            <Grid key={c.id} item xs={12} sm={6} md={4}>
              <Paper
                elevation={6}
                sx={{
                  bgcolor: "#222842",
                  p: 3,
                  borderRadius: 3,
                  border: `3px solid ${priorityColor[c.priority]}`,
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <Chip
                  label={`${c.priority.toUpperCase()} PRIORITY`}
                  sx={{
                    bgcolor: priorityColor[c.priority],
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    position: "absolute",
                    right: 15,
                    top: 15,
                    borderRadius: "6px",
                    padding: "0 6px",
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#d8e3fb", fontWeight: "bold", mb: 1 }}
                  >
                    {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#9aabc1" }}>
                    <b>Case ID:</b> {c.id}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} mb={1}>
                    <Chip
                      label={c.status}
                      sx={{
                        bgcolor: statusColor[c.status],
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "#9aabc1" }}>
                      Investigator: {c.investigator}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#9aabc1" }}>
                    Created: {c.created}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, bgcolor: "#293249" }} />

                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#24c3fe",
                      color: "#121212",
                      fontWeight: "bold",
                      px: 3,
                      borderRadius: 2,
                    }}
                  >
                    {c.evidence} Evidence Items
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#24c3fe",
                      color: "#24c3fe",
                      fontWeight: "bold",
                      px: 3,
                      borderRadius: 2,
                    }}
                  >
                    View Case
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#24c3fe",
                      color: "#24c3fe",
                      fontWeight: "bold",
                      px: 3,
                      borderRadius: 2,
                    }}
                  >
                    Generate Report
                  </Button>
                </Stack>

                <Box mt={2}>
                  <Typography variant="subtitle1" sx={{ color: "#d8e3fb", fontWeight: "bold" }}>
                    Suspects:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {c.suspects.map((s) => (
                      <Chip
                        key={s.id}
                        label={s.id}
                        sx={{
                          bgcolor: "#184842",
                          color: "#a1d9b7",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          borderRadius: 2,
                          padding: "0 8px",
                          boxShadow: "0 2px 6px rgba(24,72,66,0.3)",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Manage mode: list with remove action */}
      {manageOpen && (
        <Box mt={3}>
          <Typography variant="h5" sx={{ color: "#d8e3fb", mb: 2, fontWeight: "bold" }}>
            Manage Cases
          </Typography>
          {cases.length === 0 ? (
            <Typography sx={{ color: "#d8e3fb", textAlign: "center", py: 5 }}>
              No cases available.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {cases.map((c) => (
                <Paper key={c.id} sx={{
                  bgcolor: "#222c4b",
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <Box>
                    <Typography sx={{ color: "#d8e3fb", fontWeight: "bold" }}>
                      {c.title} ({c.id})
                    </Typography>
                    <Typography sx={{ color: "#94a2ca" }}>
                      Priority: {c.priority} | Status: {c.status}
                    </Typography>
                  </Box>
                  <Button color="error" variant="outlined" onClick={() => removeCase(c.id)}>
                    Remove
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Create new case dialog */}
      <Dialog open={openNewCaseDialog} onClose={closeNewCase} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Phone Number or IMEI"
            variant="outlined"
            fullWidth
            value={newIdentifier}
            onChange={(e) => {
              setNewIdentifier(e.target.value);
              if(e.target.value.trim()) setErrorText("")
            }}
            error={Boolean(errorText)}
            helperText={errorText}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-label">Priority Level</InputLabel>
            <Select
              labelId="priority-label"
              label="Priority Level"
              value={newPriority}
              onChange={e => setNewPriority(e.target.value)}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewCase} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={addCase}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // function addCase() {
  //   if (!newIdentifier.trim()) {
  //     setErrorText("Please enter a Phone Number or IMEI");
  //     return;
  //   }
  //   const maxIdNum = cases.reduce((max, c) => {
  //     const num = parseInt(c.id.split("_")[1] || "0", 10);
  //     return Math.max(max, num);
  //   }, 0);

  //   const newId = `CASE_${String(maxIdNum + 1).padStart(3, "0")}`;

  //   const newCase = {
  //     id: newId,
  //     title: `New Case - ${newIdentifier}`,
  //     status: "Pending",
  //     priority: newPriority,
  //     investigator: "Unassigned",
  //     created: new Date().toISOString().split("T")[0],
  //     evidence: 0,
  //     suspects: [{ id: newIdentifier }],
  //   };

  //   setCases([newCase, ...cases]);
  //   closeNewCase();
  // }

//   function removeCase(id) {
//     setCases(prev => prev.filter(c => c.id !== id));
//   }
 }
