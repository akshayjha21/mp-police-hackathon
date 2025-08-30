import React, { useEffect, useState } from "react";
import { getIPDRStatistics, getAllIPDRRecords } from "../api/ipdrApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colors for Pie chart
  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

  useEffect(() => {
    async function fetchData() {
      const [statisticsData, recordsData] = await Promise.all([getIPDRStatistics(), getAllIPDRRecords()]);
      setStats(statisticsData);
      setAllRecords(recordsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Format stats object into array for recharts
  const statsData = stats
    ? Object.entries(stats).map(([month, count]) => ({
        month,
        count,
      }))
    : [];

  // Example pie chart data: Top 5 phone numbers by record count from allRecords
  // Aggregate counts by phone number
  const phoneCounts = {};
  if (allRecords && allRecords.length) {
    allRecords.forEach((rec) => {
      if (rec.phoneNumber) {
        phoneCounts[rec.phoneNumber] = (phoneCounts[rec.phoneNumber] || 0) + 1;
      }
    });
  }
  const topPhones = Object.entries(phoneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phoneNumber, count]) => ({ name: phoneNumber, value: count }));

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>IPDR Dashboard</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Monthly IPDR Record Counts</h2>
        {statsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Records Count" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No statistics data available.</p>
        )}
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Top 5 Phone Numbers by Record Count</h2>
        {topPhones.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topPhones}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topPhones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No phone number data available.</p>
        )}
      </section>

      <section>
        <h2>Quick Links</h2>
        <ul>
          <li><Link to="/">Upload IPDR File</Link></li>
          <li><Link to="/all-records">View All Records</Link></li>
          <li><Link to="/add-record">Add New Record</Link></li>
          <li><Link to="/search-phone">Search by Phone Number</Link></li>
          <li><Link to="/search-time-location">Search by Time & Location</Link></li>
          <li><Link to="/locations-list">Locations List</Link></li>
          <li><Link to="/latlong-info">Latitude/Longitude Info</Link></li>
          <li><Link to="/statistics">Statistics</Link></li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
