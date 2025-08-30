import React, { useEffect, useState } from "react";
import UploadCard from "../components/";
import StatsCard from "../components/SearchByTimeLocation";
import Table from "../components/IPDRTable";
import { getAllIPDRRecords, getIPDRStatistics } from "../api/ipdrApi";

const IPDRPage = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllIPDRRecords().then(data => setRecords(data || []));
    getIPDRStatistics().then(data => setStats(data || {}));
  }, [refresh]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">IPDR Dashboard</h1>
      <div className="mb-4"><UploadCard onUploadSuccess={() => setRefresh(r => !r)} /></div>
      <div className="mb-4"><StatsCard stats={stats} /></div>
      <Table records={records} />
    </div>
  );
};

export default IPDRPage;
