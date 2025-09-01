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

// Get all IPDR records with pagination support
export async function getAllIPDRRecords(page = 1, limit = 50) {
  try {
    const res = await axios.get(`${API_BASE}/getAllIPDRRecords`, {
      params: {
        page,
        limit,
        offset: (page - 1) * limit
      }
    });

    // Handle different response structures from backend
    if (res.data && Array.isArray(res.data)) {
      // If backend returns simple array (no pagination implemented yet)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = res.data.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        totalCount: res.data.length,
        totalPages: Math.ceil(res.data.length / limit),
        currentPage: page
      };
    } else if (res.data && res.data.records) {
      // If backend returns paginated structure
      return {
        data: res.data.records || [],
        totalCount: res.data.totalCount || res.data.records.length || 0,
        totalPages: res.data.totalPages || Math.ceil((res.data.totalCount || res.data.records.length || 0) / limit),
        currentPage: res.data.currentPage || page
      };
    } else {
      // Fallback structure
      return {
        data: res.data || [],
        totalCount: (res.data || []).length,
        totalPages: Math.ceil((res.data || []).length / limit),
        currentPage: page
      };
    }
  } catch (err) {
    console.error("getAllIPDRRecords error:", err);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
}

// Get lightweight statistics for faster loading
export async function getIPDRStatisticsLight() {
  try {
    const res = await axios.get(`${API_BASE}/getStatisticsLight`);
    return res.data;
  } catch (err) {
    console.error("getIPDRStatisticsLight error:", err);
    // Fallback to regular statistics if light version doesn't exist
    return getIPDRStatistics();
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

// Get IPDR records for a specific phone number with pagination
export async function getIPDRRecordsgivenNumber(phoneNumber, page = 1, limit = 20) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRRecordsgivenNumber`, { 
      phoneNumber,
      page,
      limit 
    });
    
    // Handle pagination for specific phone number queries
    if (Array.isArray(res.data)) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = res.data.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        totalCount: res.data.length,
        totalPages: Math.ceil(res.data.length / limit),
        currentPage: page
      };
    }
    
    return res.data;
  } catch (err) {
    console.error("getIPDRRecordsgivenNumber error:", err);
    return null;
  }
}

// Get IPDR records for given time duration and location
export async function getIPDRRecords({ refTime, duration, location, radius, page = 1, limit = 50 }) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRRecords`, {
      refTime,
      duration,
      location,
      radius,
      page,
      limit
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

// Get latitude and longitude for a given phone number
export async function getIPDRLatLong(phoneNumber) {
  try {
    const res = await axios.post(`${API_BASE}/getIPDRLatLong`, { phoneNumber });
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

// Get records count for quick loading (optional)
export async function getIPDRRecordsCount() {
  try {
    const res = await axios.get(`${API_BASE}/getRecordsCount`);
    return res.data;
  } catch (err) {
    console.error("getIPDRRecordsCount error:", err);
    return { totalCount: 0 };
  }
}
