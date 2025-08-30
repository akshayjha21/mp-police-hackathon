import React, { useState } from "react";
import { getIPDRLocationsList } from "../api/ipdrApi";

const LocationsList = () => {
  const [searchString, setSearchString] = useState("");
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!searchString.trim()) {
      setMessage("Please enter a location search string.");
      setLocations([]);
      return;
    }

    const results = await getIPDRLocationsList(searchString.trim());

    if (results && results.code === 200 && Array.isArray(results.message) && results.message.length > 0) {
      setLocations(results.message);
      setMessage("");
    } else {
      setLocations([]);
      setMessage("No locations found.");
    }
  };

  return (
    <div>
      <h2>Search Locations List</h2>
      <input
        type="text"
        placeholder="Enter location search string"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
        Search
      </button>

      {message && <p>{message}</p>}

      {locations.length > 0 && (
        <ul>
          {locations.map((loc, idx) => (
            <li key={idx}>{loc}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationsList;
