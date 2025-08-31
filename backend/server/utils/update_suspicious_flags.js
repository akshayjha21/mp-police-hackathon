// server/utils/updateSuspiciousFlags.js
const mongoose = require("mongoose");
const axios = require("axios");

// Use your actual config here or import from env
// Replace with your actual MongoDB Atlas connection string, database, and collection name
const MONGODB_URI = "mongodb+srv://akshay21:akshay21@cluster0.avhdjnv.mongodb.net/";
const DATABASE_NAME = "Cluster0";         // e.g., "mp_police_hackathon"
const COLLECTION_NAME = "ipdatarecords";     // e.g., "ipdr_records"


async function updateSuspiciousFlags() {
  await mongoose.connect(MONGODB_URI, {
    dbName: DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  const ipdrCollection = db.collection(COLLECTION_NAME);

  try {
    await new Promise((res, rej) => {
      db.once("open", res);
      db.on("error", rej);
    });
    console.log("Connected to MongoDB for suspicious flags update");

    const records = await ipdrCollection.find({}, {
      projection: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        uplinkVolume: 1,
        downlinkVolume: 1,
        accessType: 1,
      }
    }).toArray();

    if (!records.length) {
      console.log("No records found");
      return;
    }

    const mlResponse = await axios.post(
      "http://127.0.0.1:8001/predict",
      records,
      { headers: { "Content-Type": "application/json" } }
    );

    const predictions = mlResponse.data.predictions;

    if (!predictions || predictions.length !== records.length) {
      throw new Error("Prediction count mismatch");
    }

    const updates = records.map((rec, idx) => ({
      updateOne: {
        filter: { _id: rec._id },
        update: { $set: { is_suspicious: !predictions[idx] } },
      }
    }));

    if (updates.length > 0) {
      const result = await ipdrCollection.bulkWrite(updates);
      console.log(`Updated ${result.modifiedCount} documents with suspicious flags.`);
    }
  } catch (error) {
    console.error("Error updating suspicious flags:", error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { updateSuspiciousFlags };
