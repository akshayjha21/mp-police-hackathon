import React from "react";
import { Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#01eafe",
  "#ffaa2b",
  "#fc596f",
  "#33cc99",
  "#ff7f50",
  "#ba55d3",
  "#87cefa",
  "#ffa500",
];

export default function TopCommunicationPie({ data }) {
  return (
    <Paper sx={{ height: 350, p: 2 }}>
      <Typography variant="h6" mb={2}>
        Top Communication Applications
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
