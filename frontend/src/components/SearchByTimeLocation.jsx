import React, { useState } from "react";
import { getIPDRRecords } from "../api/ipdrApi";

const SearchByTimeLocation = () => {
  const [refTime, setRefTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!refTime || !duration || !location || !radius) {
      setMessage("Please fill all fields.");
      return;
    }

    const data = await getIPDRRecords({ refTime, duration, location, radius });
    if (data && data.length > 0) {
      setRecords(data);
      setMessage("");
    } else {
      setRecords([]);
      setMessage("No records found.");
    }
  };

  return (
    <div>
      <h2>Search IPDR by Time, Duration, Location & Radius</h2>
      <div>
        <label>
          Reference Time (ISO):&nbsp;
          <input type="datetime-local" value={refTime} onChange={(e) => setRefTime(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Duration (minutes):&nbsp;
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Location (string):&nbsp;
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Radius (km):&nbsp;
          <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
      {message && <p>{message}</p>}
      <ul>
        {records.map((rec, idx) => (
          <li key={idx}>{JSON.stringify(rec)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByTimeLocation;
