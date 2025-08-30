import axios from "axios";

const API_BASE = "http://localhost:8080/ipdr";

// Upload IPDR file
export async function uploadIPDRFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("uploadIPDRFile error:", err);
    return null;
  }
}

// Get all IPDR records
export async function getAllIPDRRecords() {
  try {
    const res = await axios.get(`${API_BASE}/getAllIPDRRecords`);
    return res.data;
  } catch (err) {
    console.error("getAllIPDRRecords error:", err);
    return null;
  }
}

// Add a new IPDR record
export async function addIPDRRecord(record) {
  try {
    const res = await axios.post(`${API_BASE}/addIPDRRecord`, record);
    return res.data;
  } catch (err) {
    console.error("addIPDRRecord error:", err);
    return null;
  }
}

// Get IPDR records for a specific phone number
export async function getIPDRRecordsgivenNumber(phoneNumber) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRRecordsgivenNumber`, { phoneNumber });
    return res.data;
  } catch (err) {
    console.error("getIPDRRecordsgivenNumber error:", err);
    return null;
  }
}

// Get IPDR records for given time duration and location
export async function getIPDRRecords({ refTime, duration, location, radius }) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRRecords`, {
      refTime,
      duration,
      location,
      radius,
    });
    return res.data;
  } catch (err) {
    console.error("getIPDRRecords error:", err);
    return null;
  }
}

// Get list of up to 5 locations based on a location search string
export async function getIPDRLocationsList(locationSearchString) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRLocationsList`, { data: locationSearchString });
    return res.data;
  } catch (err) {
    console.error("getIPDRLocationsList error:", err);
    return null;
  }
}

// Get latitude, longitude, and country for a given location string
export async function getIPDRLatLong(locationString) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRLatLong`, { data: locationString });
    return res.data;
  } catch (err) {
    console.error("getIPDRLatLong error:", err);
    return null;
  }
}

// Get month-wise statistics of IPDR records
export async function getIPDRStatistics() {
  try {
    const res = await axios.get(`${API_BASE}/getStatistics`);
    return res.data;
  } catch (err) {
    console.error("getIPDRStatistics error:", err);
    return null;
  }
}
