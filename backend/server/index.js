const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const moment = require("moment");

// Utils + Routers
const env = require("./utils/env");
const { rootRouter } = require("./routes/rootRouter");
const { ipdrRouter } = require("./routes/ipdrRouter");
const { noteRouter } = require("./routes/noteRouter");
const { profileRouter } = require("./routes/profileRouter");
const { updateSuspiciousFlags } = require("./utils/update_suspicious_flags.js");

// Models
const { IPDR } = require("./models/ipDetails");
const { Profile } = require("./models/profileDetails.js");

const app = express();

// ---- Database Connection ----
mongoose.connect(
  "mongodb+srv://akshay21:akshay21@cluster0.avhdjnv.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));

// ---- MOVE SERVER STARTUP HERE ----
db.once("open", async () => {
  console.log("✅ Successfully connected to the database");
  
  // Start server ONLY after database connection is established
  app.listen(env.port, async () => {
    console.log(`🚀 Backend is running on port ${env.port}!`);

    try {
      await updateSuspiciousFlags();
      console.log("✅ Suspicious flags updated on server startup");
    } catch (err) {
      console.error("❌ Failed to update suspicious flags on startup:", err);
    }
  });
});

// ---- Middlewares ----
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// ---- File Upload Config ----
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage }).single("file");

// ---- Generic File Parser ----
async function parseFile(filePath, fileExt) {
  return new Promise((resolve, reject) => {
    let results = [];

    // CSV
    if (fileExt === "csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", reject);
    }

    // JSON
    else if (fileExt === "json") {
      try {
        const data = fs.readFileSync(filePath, "utf8");
        results = JSON.parse(data);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    }

    // TXT
    else if (fileExt === "txt") {
      try {
        const data = fs.readFileSync(filePath, "utf8");
        const lines = data.split("\n").filter((l) => l.trim().length);
        const headers = lines[0].split(/,|\|/);
        results = lines.slice(1).map((line) => {
          const values = line.split(/,|\|/);
          let obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = values[i] ? values[i].trim() : null;
          });
          return obj;
        });
        resolve(results);
      } catch (err) {
        reject(err);
      }
    }

    // XLSX
    else if (fileExt === "xlsx") {
      try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        results = XLSX.utils.sheet_to_json(sheet);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    }

    else {
      reject(new Error("Unsupported file format"));
    }
  });
}

// ---- Routes ----
// 📂 Profile Upload
app.post("/profile/upload", (req, res) => {
  upload(req, res, async function (err) {
    try {
      if (err) return res.status(500).json(err);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
      const records = await parseFile(file.path, fileExt);

      for (let row of records) {
        await Profile.findOneAndUpdate(
          { phoneNumber: row.phoneNumber },
          row,
          { upsert: true, new: true }
        );
      }

      res.status(200).json({
        message: `📂 Profile file (${fileExt}) processed successfully`,
        count: records.length,
      });
    } catch (outerErr) {
      console.error("❌ Upload error:", outerErr);
      res.status(500).json({ error: "File upload failed" });
    }
  });
});

// 📂 IPDR Upload
app.post("/ipdr/upload", (req, res) => {
  upload(req, res, async function (err) {
    try {
      if (err) return res.status(500).json(err);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
      const records = await parseFile(file.path, fileExt);

      for (let row of records) {
        row.originLatLong = {
          lat: parseFloat(row.originLat),
          long: parseFloat(row.originLong),
        };
        delete row.originLat;
        delete row.originLong;

        const startTime = moment(
          row.startTime || row.date,
          ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD"]
        ).toDate();
        const endTime = moment(
          row.endTime || row.date,
          ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD"]
        ).toDate();

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) continue;

        row.startTime = startTime;
        row.endTime = endTime;

        await IPDR.findOneAndUpdate(
          { phoneNumber: row.phoneNumber, startTime: row.startTime },
          row,
          { upsert: true, new: true }
        );
      }

      res.status(200).json({
        message: `📂 IPDR file (${fileExt}) processed successfully`,
        count: records.length,
      });
    } catch (outerErr) {
      console.error("❌ Upload error:", outerErr);
      res.status(500).json({ error: "File upload failed" });
    }
  });
});

// ---- Connect Routers ----
app.use("/", rootRouter);
app.use("/ipdr", ipdrRouter);
app.use("/note", noteRouter);
app.use("/profile", profileRouter);

// Server startup moved to db.once("open") callback above
