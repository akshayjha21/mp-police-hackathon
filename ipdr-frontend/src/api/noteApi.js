import axios from "axios";

const API_BASE = "http://localhost:8080/note"; // Adjust if needed for note routes

// Add a new note
export async function addNote(note) {
  try {
    const res = await axios.post(`${API_BASE}/addNote`, note);
    return res.data;
  } catch (err) {
    console.error("addNote error:", err);
    return null;
  }
}

// Get all notes
export async function getAllNotes() {
  try {
    const res = await axios.get(`${API_BASE}/getAllNotes`);
    return res.data;
  } catch (err) {
    console.error("getAllNotes error:", err);
    return null;
  }
}

// Get notes for a specific edge
export async function getEdgeNotes(edgeInfo) {
  try {
    const res = await axios.post(`${API_BASE}/getEdgeNotes`, edgeInfo);
    return res.data;
  } catch (err) {
    console.error("getEdgeNotes error:", err);
    return null;
  }
}

// Uncomment below if you implement deleteNote route in backend
// export async function deleteNote(noteId) {
//   try {
//     const res = await axios.post(`${API_BASE}/deleteNote`, { noteId });
//     return res.data;
//   } catch (err) {
//     console.error("deleteNote error:", err);
//     return null;
//   }
// }
