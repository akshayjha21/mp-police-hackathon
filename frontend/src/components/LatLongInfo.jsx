import React, { useState } from "react";
import { getIPDRLatLong } from "../api/ipdrApi";

const LatLongInfo = () => {
  const [locationString, setLocationString] = useState("");
  const [latLongData, setLatLongData] = useState(null);
  const [message, setMessage] = useState("");

  const handleLookup = async () => {
    if (!locationString.trim()) {
      setMessage("Please enter a location string.");
      setLatLongData(null);
      return;
    }

    const result = await getIPDRLatLong(locationString.trim());

    if (result && result.code === 200 && result.message) {
      setLatLongData(result.message);
      setMessage("");
    } else {
      setLatLongData(null);
      setMessage("Location info not found.");
    }
  };

  return (
    <div>
      <h2>Get Latitude, Longitude, and Country</h2>
      <input
        type="text"
        placeholder="Enter location string"
        value={locationString}
        onChange={(e) => setLocationString(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleLookup} style={{ padding: "8px 16px" }}>
        Lookup
      </button>

      {message && <p>{message}</p>}

      {latLongData && (
        <div>
          <p><strong>Latitude:</strong> {latLongData.latitude ?? "N/A"}</p>
          <p><strong>Longitude:</strong> {latLongData.longitude ?? "N/A"}</p>
          <p><strong>Country:</strong> {latLongData.country ?? "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default LatLongInfo;
