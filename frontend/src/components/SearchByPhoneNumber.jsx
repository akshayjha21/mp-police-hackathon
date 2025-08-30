import React, { useState } from "react";
import { getIPDRRecordsgivenNumber } from "../api/ipdrApi";

const SearchByPhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setMessage("Please enter a phone number.");
      setRecords([]);
      return;
    }

    const data = await getIPDRRecordsgivenNumber(phoneNumber);

    if (data && data.code === 200 && Array.isArray(data.message) && data.message.length > 0) {
      setRecords(data.message);
      setMessage("");
    } else {
      setRecords([]);
      setMessage("No records found.");
    }
  };

  return (
    <div>
      <h2>Search IPDR by Phone Number</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
        Search
      </button>
      {message && <p>{message}</p>}
      {records.length > 0 && (
        <ul>
          {records.map((rec, idx) => (
            <li key={rec._id || idx}>
              Phone: {rec.phoneNumber}, Start: {new Date(rec.startTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchByPhoneNumber;
