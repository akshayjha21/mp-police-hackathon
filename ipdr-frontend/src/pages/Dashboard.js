import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  getIPDRStatistics,
  getAllIPDRRecords,
  uploadIPDRFile,
} from "../api/ipdrApi";

const CARD_BG = "#181c2f";
const DASH_BG = "#222642";
const ACCENT_BLUE = "#24d3fe";
const ACCENT_PURPLE = "#a334fa";
const TEXT_MAIN = "#d8ebfb";
const BAR_COLORS = [
  "#24d3fe",
  "#a334fa",
  "#f38ba8",
  "#fab387",
  "#a6e3a1",
  "#89b4fa",
  "#f0c800",
  "#cba6f7",
  "#74c7ec",
  "#cdd6f4",
];
const PIE_COLORS = [
  "#24d3fe",
  "#a334fa",
  "#f0c800",
  "#a6e3a1",
  "#89b4fa",
  "#fab387",
  "#f38ba8",
  "#cdd6f4",
];

// Customize possible accessTypes for vertical legend
const ACCESS_TYPES_LEGEND = ["2G", "3G", "4G", "5G"];

export default function Dashboard() {
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const [ipdrStats, setIpdrStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const [totalRecords, setTotalRecords] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [suspiciousPatterns, setSuspiciousPatterns] = useState(0);

  // Charts data
  const [appUsageData, setAppUsageData] = useState([]);
  const [maxCallDurations, setMaxCallDurations] = useState([]);
  const [criminalRecordsWave, setCriminalRecordsWave] = useState([]);

  const ITEMS_PER_PAGE = 5;
  const [barPage, setBarPage] = React.useState(0);
  const maxBarPage = Math.max(
    0,
    Math.ceil(maxCallDurations.length / ITEMS_PER_PAGE) - 1
  );
  const curBarData = maxCallDurations.slice(
    barPage * ITEMS_PER_PAGE,
    (barPage + 1) * ITEMS_PER_PAGE
  );
  const remainingLeft =
    maxCallDurations.length - (barPage + 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    fetchStats();
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  async function fetchStats() {
    setLoadingStats(true);
    try {
      const res = await getIPDRStatistics();
      if (res && res.ipdrCounts) {
        setIpdrStats(
          res.ipdrCounts.map((c, i) => ({
            month: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][i],
            records: c,
          }))
        );
  
        setTotalRecords(
          res.totalRecords || res.ipdrCounts.reduce((a, b) => a + b, 0)
        );
        setUniqueUsers(res.uniqueUsers || 50);
        setSuspiciousPatterns(res.suspiciousPatterns || 64);
  
        // Set criminalRecordsWave from suspiciousCounts if it exists, else fallback to ipdrCounts
        if (res.suspiciousCounts) {
          setCriminalRecordsWave(
            res.suspiciousCounts.map((count, index) => ({
              month: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][index],
              records: count,
            }))
          );
        } else {
          setCriminalRecordsWave(
            res.ipdrCounts.map((count, index) => ({
              month: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][index],
              records: count,
            }))
          );
        }
      }
    } catch {
      // ignore
    }
    setLoadingStats(false);
  }
  

  async function fetchRecords() {
    setLoadingRecords(true);
    try {
      const res = await getAllIPDRRecords();
      setRecords(res || []);
      const counts = (res || []).reduce((acc, cur) => {
        acc[cur.accessType] = (acc[cur.accessType] || 0) + 1;
        return acc;
      }, {});
      setAppUsageData(
        Object.entries(counts).map(([name, value]) => ({ name, value }))
      );

      const maxDurationMap = {};
      (res || []).forEach((rec) => {
        if (rec.startTime && rec.endTime && rec.phoneNumber) {
          const duration =
            (new Date(rec.endTime) - new Date(rec.startTime)) / 60000;
          if (
            !maxDurationMap[rec.phoneNumber] ||
            maxDurationMap[rec.phoneNumber] < duration
          ) {
            maxDurationMap[rec.phoneNumber] = duration;
          }
        }
      });
      const maxDurationArr = Object.entries(maxDurationMap)
        .map(([phone, duration]) => ({
          phone,
          duration: Math.round(duration),
        }))
        .sort((a, b) => b.duration - a.duration);
      setMaxCallDurations(maxDurationArr);
    } catch {
      // ignore
    }
    setLoadingRecords(false);
  }

  async function handleFileUpload() {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await uploadIPDRFile(uploadFile);
      // Slight delay before reload for smooth UX
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
  }

  return (
    <Box sx={{ bgcolor: DASH_BG, minHeight: "100vh", p: 3 }}>
      {/* Upload Section */}
      <Paper
        sx={{
          mb: 3,
          p: 3,
          bgcolor: CARD_BG,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          borderRadius: 3,
        }}
        elevation={8}
      >
        <Typography variant="h6" sx={{ color: ACCENT_BLUE, flexGrow: 1 }}>
          Upload IPDR File
        </Typography>
        <Button
          variant="contained"
          component="label"
          sx={{
            bgcolor: ACCENT_BLUE,
            color: TEXT_MAIN,
            "&:hover": { bgcolor: "#1aadff" },
          }}
        >
          Choose File
          <input
            hidden
            type="file"
            accept=".csv,.json"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
          />
        </Button>
        <Typography
          sx={{ color: TEXT_MAIN, minWidth: "150px", fontSize: 14 }}
          noWrap
        >
          {uploadFile ? uploadFile.name : "No file selected"}
        </Typography>
        <Button
          variant="contained"
          disabled={!uploadFile || uploading}
          onClick={handleFileUpload}
          sx={{ bgcolor: ACCENT_PURPLE, color: TEXT_MAIN }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Paper>

      {/* Records Info Section */}
      <Stack
        direction="row"
        spacing={3}
        sx={{
          mb: 4,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            bgcolor: CARD_BG,
            p: 2,
            borderRadius: 3,
            minWidth: 150,
          }}
        >
          <Typography sx={{ color: ACCENT_BLUE, fontWeight: 700 }}>
            Total Records
          </Typography>
          <Typography sx={{ color: TEXT_MAIN, fontSize: 24 }}>
            {loadingStats ? <CircularProgress size={24} /> : totalRecords}
          </Typography>
        </Paper>
        <Paper
          elevation={6}
          sx={{
            bgcolor: CARD_BG,
            p: 2,
            borderRadius: 3,
            minWidth: 150,
          }}
        >
          <Typography sx={{ color: ACCENT_BLUE, fontWeight: 700 }}>
            Unique Users
          </Typography>
          <Typography sx={{ color: TEXT_MAIN, fontSize: 24 }}>
            {loadingStats ? <CircularProgress size={24} /> : uniqueUsers}
          </Typography>
        </Paper>
        <Paper
          elevation={6}
          sx={{
            bgcolor: CARD_BG,
            p: 2,
            borderRadius: 3,
            minWidth: 150,
          }}
        >
          <Typography sx={{ color: ACCENT_BLUE, fontWeight: 700 }}>
            Suspicious Patterns
          </Typography>
          <Typography sx={{ color: TEXT_MAIN, fontSize: 24 }}>
            {loadingStats ? <CircularProgress size={24} /> : suspiciousPatterns}
          </Typography>
        </Paper>
      </Stack>

      {/* Waveform Total IPDR Logs */}
      <Box
        sx={{ mb: 4, p: 3, bgcolor: CARD_BG, borderRadius: 2, height: 220 }}
      >
        <Typography
          variant="h6"
          sx={{ color: ACCENT_BLUE, fontWeight: 700, mb: 1 }}
        >
           IPDR Records
        </Typography>
        {loadingStats ? (
          <CircularProgress />
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={ipdrStats}>
              <CartesianGrid stroke="#23294d" strokeDasharray="4 4" />
              <XAxis dataKey="month" stroke={TEXT_MAIN} />
              <YAxis stroke={TEXT_MAIN} />
              <Tooltip
                contentStyle={{
                  background: CARD_BG,
                  color: TEXT_MAIN,
                  border: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="records"
                stroke={ACCENT_BLUE}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: ACCENT_BLUE }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Pie & Bar side by side */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4 }}
      >
        {/* Pie with vertical legend */}
        <Box
          flex={1}
          sx={{
            bgcolor: CARD_BG,
            borderRadius: 2,
            p: 3,
            height: 350,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: TEXT_MAIN, mb: 2, fontWeight: 600 }}
            >
              Applications Used
            </Typography>
            {loadingRecords ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appUsageData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    label
                  >
                    {appUsageData.map((entry, idx) => (
                      <Cell
                        key={`cell-pie-${idx}`}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
          {/* Vertical legend box */}
          <Box
            sx={{
              ml: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 1.5,
              minWidth: 80,
            }}
          >
            {ACCESS_TYPES_LEGEND.map((type, idx) => {
              // Find matching segment for this type in appUsageData (case-insensitive)
              const foundIndex = appUsageData.findIndex(
                (seg) => seg.name.toLowerCase() === type.toLowerCase()
              );
              if (foundIndex === -1) return null;
              return (
                <Stack key={type} direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: PIE_COLORS[foundIndex % PIE_COLORS.length],
                      borderRadius: 1,
                    }}
                  />
                  <Typography sx={{ color: TEXT_MAIN, fontWeight: "medium" }}>
                    {type}
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        </Box>

        {/* Bar chart (5 bars per page) */}
        <Box
          flex={1}
          sx={{
            bgcolor: CARD_BG,
            borderRadius: 2,
            p: 3,
            height: 350,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: TEXT_MAIN, mb: 2, fontWeight: 600 }}
          >
            Maximum Call Durations
          </Typography>
          {loadingRecords ? (
            <CircularProgress />
          ) : (
            <>
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={curBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#23294d" />
                    <XAxis
                      dataKey="phone"
                      stroke={TEXT_MAIN}
                      fontSize={14}
                      angle={-30}
                      height={60}
                      tick={{ fill: TEXT_MAIN }}
                    />
                    <YAxis stroke={TEXT_MAIN} fontSize={14} tick={{ fill: TEXT_MAIN }} />
                    <Tooltip
                      contentStyle={{
                        background: CARD_BG,
                        color: TEXT_MAIN,
                        border: "none",
                      }}
                    />
                    <Bar
                      dataKey="duration"
                      radius={[8, 8, 0, 0]}
                      isAnimationActive
                      animationDuration={1000}
                    >
                      {curBarData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={BAR_COLORS[idx % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Buttons with numbers left */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  disabled={barPage === 0}
                  sx={{ color: ACCENT_PURPLE, borderColor: ACCENT_PURPLE }}
                  onClick={() => setBarPage(barPage - 1)}
                >
                  Previous 5
                </Button>
                <Typography sx={{ color: TEXT_MAIN }}>
                  {remainingLeft > 0
                    ? `${remainingLeft} more phone number${remainingLeft > 1 ? "s" : ""} left`
                    : "No more phone numbers"}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={barPage === maxBarPage}
                  sx={{ color: ACCENT_PURPLE, borderColor: ACCENT_PURPLE }}
                  onClick={() => setBarPage(barPage + 1)}
                >
                  Next 5
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Stack>

      {/* Criminal Records Waveform with buttons inside */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: CARD_BG,
          borderRadius: 2,
          height: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: ACCENT_PURPLE, fontWeight: 700, mb: 1 }}
        >
          People With Criminal History
        </Typography>
        {loadingStats ? (
          <CircularProgress />
        ) : (
          <Box sx={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="95%">
              <LineChart data={criminalRecordsWave}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23294d" />
                <XAxis dataKey="month" stroke={TEXT_MAIN} fontSize={14} />
                <YAxis stroke={TEXT_MAIN} fontSize={14} />
                <Tooltip
                  contentStyle={{
                    background: CARD_BG,
                    color: TEXT_MAIN,
                    border: "none",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="records"
                  stroke={ACCENT_PURPLE}
                  strokeWidth={4}
                  dot={{ r: 6, fill: ACCENT_PURPLE }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}
