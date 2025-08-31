import axios from "axios";

const API_BASE = "http://localhost:8080/profile";

// Get all profiles
export async function getAllProfiles() {
  try {
    const res = await axios.get(`${API_BASE}/getAllProfiles`);
    return res.data;
  } catch (err) {
    console.error("getAllProfiles error:", err);
    return null;
  }
}

// Add new profile data
export async function addProfile(profileData) {
  try {
    const res = await axios.post(`${API_BASE}/addProfile`, profileData);
    return res.data;
  } catch (err) {
    console.error("addProfile error:", err);
    return null;
  }
}

// Get profile data by criteria (e.g., phone number or id)
export async function getProfile(criteria) {
  try {
    const res = await axios.post(`${API_BASE}/getProfile`, criteria);
    return res.data;
  } catch (err) {
    console.error("getProfile error:", err);
    return null;
  }
}

// Search profiles with search parameters
export async function getSearchResults(searchParams) {
  try {
    const res = await axios.post(`${API_BASE}/getSearchResults`, searchParams);
    return res.data;
  } catch (err) {
    console.error("getSearchResults error:", err);
    return null;
  }
}

// Get all user details needed for dashboard
export async function getUserDetails(params) {
  try {
    const res = await axios.post(`${API_BASE}/getUserDetails`, params);
    return res.data;
  } catch (err) {
    console.error("getUserDetails error:", err);
    return null;
  }
}

// Update a user's data
export async function updateUser(userData) {
  try {
    const res = await axios.post(`${API_BASE}/updateUser`, userData);
    return res.data;
  } catch (err) {
    console.error("updateUser error:", err);
    return null;
  }
}
