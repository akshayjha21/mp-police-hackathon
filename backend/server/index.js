const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");

// Utils + Routers
const env = require("./utils/env");
const { rootRouter } = require("./routes/rootRouter");
const { ipdrRouter } = require("./routes/ipdrRouter");
const { cdrRouter } = require("./routes/cdrRouter");
const { noteRouter } = require("./routes/noteRouter");
const { profileRouter } = require("./routes/profileRouter");

// Models
const { CDR } = require("./models/callDetails");
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
db.once("open", () => {
  console.log("✅ Successfully connected to the database");
});

// ---- Middlewares ----
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// ---- Routes ----

// 📂 CDR Upload CSV
app.post("/cdr/uploadCSV", function (req, res) {
  upload(req, res, function (err) {
    if (err) return res.status(500).json(err);

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", async (row) => {
        row.originLatLong = {
          lat: parseFloat(row.originLat),
          long: parseFloat(row.originLong),
        };
        row.destLatLong = {
          lat: parseFloat(row.destLat),
          long: parseFloat(row.destLong),
        };

        delete row.originLat;
        delete row.originLong;
        delete row.destLat;
        delete row.destLong;

        row.startTime = new Date(row.startTime);
        row.endTime = new Date(row.endTime);

        await CDR.findOneAndUpdate(
          { phoneNumber: row.phoneNumber, startTime: row.startTime },
          row,
          { upsert: true, new: true }
        );
      })
      .on("end", () => {
        console.log("📂 CDR CSV processed and records added");
        res.status(200).send({ message: "CDR file processed", file: req.file });
      });
  });
});

// 📂 Profile Upload CSV
app.post("/profile/uploadCSV", function (req, res) {
  upload(req, res, function (err) {
    if (err) return res.status(500).json(err);

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", async (row) => {
        await Profile.findOneAndUpdate(
          { phoneNumber: row.phoneNumber },
          row,
          { upsert: true, new: true }
        );
      })
      .on("end", () => {
        console.log("📂 Profile CSV processed and records added");
        res
          .status(200)
          .send({ message: "Profile file processed", file: req.file });
      });
  });
});

// 📂 IPDR Upload CSV
app.post("/ipdr/uploadCSV", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) return res.status(500).json(err);

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", async (row) => {
          // Lat/Long cleanup
          row.originLatLong = {
            lat: parseFloat(row.originLat),
            long: parseFloat(row.originLong),
          };
          delete row.originLat;
          delete row.originLong;

          // Date parsing with moment
          const startTime = moment(
            row.startTime || row.date,
            ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD"]
          ).toDate();
          const endTime = moment(
            row.endTime || row.date,
            ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD"]
          ).toDate();

          if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return; // silently skip invalid rows
          }

          row.startTime = startTime;
          row.endTime = endTime;

          // Save to DB
          await IPDR.findOneAndUpdate(
            { phoneNumber: row.phoneNumber, startTime: row.startTime },
            row,
            { upsert: true, new: true }
          );
        })
        .on("end", () => {
          console.log("📂 IPDR CSV processed and records added");
          res.status(200).send({
            message: "IPDR file processed successfully",
            file: req.file,
          });
        });
    });
  } catch (outerErr) {
    console.error("❌ Upload error:", outerErr);
    res.status(500).send({ error: "File upload failed" });
  }
});

// ---- Connect Routers ----
app.use("/", rootRouter);
app.use("/cdr", cdrRouter);
app.use("/ipdr", ipdrRouter);
app.use("/note", noteRouter);
app.use("/profile", profileRouter);

// ---- Start Server ----
app.listen(env.port, () =>
  console.log(`🚀 Backend is running on port ${env.port}!`)
);
