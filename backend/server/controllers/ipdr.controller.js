const { CustomError, calculateDistance } = require("../utils/utils")
const { IPDR } = require("./../models/ipDetails")
const nodeGeocoder = require('node-geocoder')

// ========================= GET ALL IPDR RECORDS =========================
let getAllIPDRRecords = async (req, res) => {
    try {
        let records = await IPDR.find({})
        return res.json(records)
    } catch (err) {
        return res.status(500).json({ message: "Error fetching records", error: err.message, code: 500 })
    }
}

// ========================= GET STATISTICS =========================
let getStatistics = async (req, res) => {
    try {
        let currentDate = new Date()
        let currentYear = currentDate.getFullYear()

        let allRecords = await IPDR.find({})
        let monthCounts = Array(12).fill(0)

        for (let record of allRecords) {
            let startTime = record.startTime
            let month = startTime.getMonth()  // 0 - 11
            let year = startTime.getFullYear()
            if (year === currentYear) {
                monthCounts[month] += 1
            }
        }

        return res.json({ ipdrCounts: monthCounts, code: 200 })
    } catch (err) {
        return res.status(500).json({ message: "Error generating statistics", error: err.message, code: 500 })
    }
}

// ========================= VALIDATE RECORD =========================
let validateIPDRRecord = async (req, res, next) => {
    try {
        const ipdrRecord = req.body
        if (!ipdrRecord) {
            return res.status(400).json({ message: "No ipdr data received", code: 400 })
        }

        const required_fields = [
            "privateIP", "privatePort", "publicIP", "publicPort", "destIP", "destPort",
            "phoneNumber", "startTime", "endTime", "uplinkVolume", "downlinkVolume",
            "totalVolume", "imei", "imsi", "originLatLong", "accessType"
        ]

        for (let req_field of required_fields) {
            if (!ipdrRecord.hasOwnProperty(req_field)) {
                return res.status(400).json({ message: `Missing property: ${req_field}`, code: 400 })
            }
        }

        res.locals.record = ipdrRecord
        return next()
    } catch (err) {
        return res.status(500).json({ message: "Error validating ipdr record", error: err.message, code: 500 })
    }
}

// ========================= GET RECORDS BY PHONE NUMBER =========================
let getIPDRRecordsgivenNumber = async (req, res) => {
    try {
        let phoneNumber = req.body.phoneNumber
        if (!phoneNumber) {
            return res.status(400).json({ message: "No phone number received", code: 400 })
        }

        let IPDetails = await IPDR.find({ phoneNumber })
        return res.json({ message: IPDetails, code: 200 })
    } catch (err) {
        return res.status(500).json({ message: "Error fetching records", error: err.message, code: 500 })
    }
}

// ========================= ADD NEW RECORD =========================
let addIPDRRecord = async (req, res) => {
    try {
        let IPRecord = res.locals.record
        IPRecord.startTime = new Date(IPRecord.startTime)
        IPRecord.endTime = new Date(IPRecord.endTime)

        await IPDR.findOneAndUpdate(
            { phoneNumber: IPRecord.phoneNumber, startTime: IPRecord.startTime },
            { $set: IPRecord },
            { upsert: true, new: true }
        )

        return res.status(201).json({ message: "Record successfully added", code: 201 })
    } catch (err) {
        return res.status(500).json({ message: "Error adding record", error: err.message, code: 500 })
    }
}

// ========================= GET RECORDS BY TIME + LOCATION =========================
let getIPDRRecords = async (req, res) => {
    try {
        let { refTime, duration, location, radius } = req.body;

        // Validate inputs
        if (!refTime || !duration || !location || !location.lat || !location.long) {
            return res.status(400).json({
                message: "Missing required fields: refTime (date), duration (minutes), location {lat, long}",
                code: 400
            });
        }

        refTime = new Date(refTime);
        radius = radius || 5; // default radius = 5 km

        // Define time window
        let startTimeReq = new Date(refTime.getTime() - duration * 60000);
        let endTimeReq = new Date(refTime.getTime() + duration * 60000);

        // Fetch candidate records
        let records = await IPDR.find({
            startTime: { $gte: startTimeReq, $lte: endTimeReq }
        });

        let ans = [];
        for (let record of records) {
            if (!record.originLatLong || !record.originLatLong.lat || !record.originLatLong.long) {
                continue; // skip records without location
            }

            let distance = calculateDistance(
                location.lat,
                location.long,
                record.originLatLong.lat,
                record.originLatLong.long
            );

            if (distance <= radius) {
                ans.push(record);
            }
        }

        if (ans.length === 0) {
            return res.json({
                message: "No matching records found within given time and radius",
                code: 200
            });
        }

        return res.json({ message: ans, code: 200 });

    } catch (err) {
        return res.status(500).json({
            message: "Error fetching records",
            error: err.message,
            code: 500
        });
    }
};


// ========================= GEOCODER FUNCTIONS =========================
let getIPDRLatLong = async (req, res) => {
    try {
        const location = req.body.data
        let options = { provider: 'openstreetmap' }
        let geoCoder = nodeGeocoder(options)
        const result = (await geoCoder.geocode(location))[0]

        return res.json({
            message: { latitude: result.latitude, longitude: result.longitude, country: result.country },
            code: 200
        })
    } catch (err) {
        return res.status(500).json({ message: "Error fetching lat/long", error: err.message, code: 500 })
    }
}

let getIPDRLocationsList = async (req, res) => {
    try {
        const location = req.body.data;

        // Input validation
        if (!location || typeof location !== "string") {
            return res.status(400).json({
                message: "Invalid request. 'data' must be a non-empty string",
                code: 400
            });
        }

        let options = { provider: 'openstreetmap' };
        let geoCoder = nodeGeocoder(options);

        const result = await geoCoder.geocode(location);

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "No locations found for the given input",
                code: 404
            });
        }

        return res.json({
            message: result.map(a => a.formattedAddress).slice(0, 5),
            code: 200
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching location list",
            error: typeof err === "object" ? JSON.stringify(err) : err,
            code: 500
        });
    }
};

// ========================= EXPORTS =========================
module.exports = {
    validateIPDRRecord,
    getAllIPDRRecords,
    getIPDRRecordsgivenNumber,
    addIPDRRecord,
    getIPDRRecords,
    getIPDRLocationsList,
    getIPDRLatLong,
    getStatistics
}
