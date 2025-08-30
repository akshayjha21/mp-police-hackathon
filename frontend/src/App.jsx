import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import UploadIPDRFile from "./components/UploadIPDRFile";
import AllIPDRRecords from "./components/AllIPDRRecords";
import AddIPDRRecord from "./components/AddIPDRRecord";
import SearchByPhoneNumber from "./components/SearchByPhoneNumber";
import SearchByTimeLocation from "./components/SearchByTimeLocation";
import LocationsList from "./components/LocationsList";
import LatLongInfo from "./components/LatLongInfo";
import IPDRStatistics from "./components/IPDRStatistics";
import Dashboard from "./pages/Dashboard";



const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Upload File</Link> |{" "}
        <Link to="/all-records">All Records</Link> |{" "}
        <Link to="/add-record">Add Record</Link> |{" "}
        <Link to="/search-phone">Search by Phone</Link> |{" "}
        <Link to="/search-time-location">Search by Time/Location</Link> |{" "}
        <Link to="/locations-list">Locations List</Link> |{" "}
        <Link to="/latlong-info">LatLong Info</Link> |{" "}
        <Link to="/statistics">Statistics</Link>
      </nav>

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<UploadIPDRFile />} />
        <Route path="/all-records" element={<AllIPDRRecords />} />
        <Route path="/add-record" element={<AddIPDRRecord />} />
        <Route path="/search-phone" element={<SearchByPhoneNumber />} />
        <Route path="/search-time-location" element={<SearchByTimeLocation />} />
        <Route path="/locations-list" element={<LocationsList />} />
        <Route path="/latlong-info" element={<LatLongInfo />} />
        <Route path="/statistics" element={<IPDRStatistics />} />
      </Routes>
    </Router>
  );
};

export default App;
