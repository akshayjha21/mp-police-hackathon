import React, { useEffect, useState } from "react";
import { getAllIPDRRecords } from "../api/ipdrApi";

const AllIPDRRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await getAllIPDRRecords();
      if (data) setRecords(data);
      else setError("Failed to load records.");
    };
    fetchRecords();
  }, []);

  return (
    <div>
      <h2>All IPDR Records</h2>
      {error && <p>{error}</p>}
      <ul>
        {records.map((rec, idx) => (
          <li key={idx}>{JSON.stringify(rec)}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllIPDRRecords;
