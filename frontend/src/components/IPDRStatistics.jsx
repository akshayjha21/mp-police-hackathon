import React, { useEffect, useState } from "react";
import { getIPDRStatistics } from "../api/ipdrApi";

const IPDRStatistics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getIPDRStatistics();
      if (data) setStats(data);
      else setError("Failed to load statistics.");
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>IPDR Month-wise Statistics</h2>
      {error && <p>{error}</p>}
      {stats ? (
        <ul>
          {Object.entries(stats).map(([month, count]) => (
            <li key={month}>
              {month}: {count}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default IPDRStatistics;
