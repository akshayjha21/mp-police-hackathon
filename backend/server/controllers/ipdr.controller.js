const config = require('../utils/env')
const { CustomError, calculateDistance } = require("../utils/utils")
const { IPDR } = require("./../models/ipDetails")
const nodeGeocoder = require('node-geocoder')
const axios = require('axios')
// const fetch = require('node-fetch');

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
// ========================= GEOCODER FUNCTIONS =========================

const getIPDRLatLong = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        
        // Input validation for phone number
        if (!phoneNumber || typeof phoneNumber !== "string") {
            return res.status(400).json({
                message: "Invalid request. 'phoneNumber' must be a valid string"
            });
        }

        // Step 1: Find IPDR record by phone number
        const ipdrRecord = await IPDR.findOne({ phoneNumber: phoneNumber });

        if (!ipdrRecord) {
            return res.status(404).json({
                message: "Phone number not found in IPDR database"
            });
        }

        // Step 2: Get publicIP and complete it if needed
        let completeIP = ipdrRecord.publicIP;
        
        // Complete partial IP addresses (your IPs are missing 4th octet)
        if (completeIP.split('.').length === 3) {
            completeIP = completeIP + '.1';
        }

        // Step 3: Call IP2Location API using axios
        const apiUrl = `https://api.ip2location.io/?key=${config.ip2location_api_key}&ip=${completeIP}`;
        
        const response = await axios.get(apiUrl, { 
            timeout: 10000
        });
        
        const result = response.data;

        // Check for API-specific errors
        if (result.error) {
            return res.status(400).json({
                message: "API Error: " + result.error.error_message
            });
        }

        // Check if API returned valid coordinates
        if (!result.latitude || !result.longitude) {
            return res.status(404).json({
                message: "No valid coordinates available for this phone number"
            });
        }

        // Step 4: Return only the specified fields
        return res.json({
            latitude: parseFloat(result.latitude),
            longitude: parseFloat(result.longitude),
            phoneNumber: phoneNumber,
            originalIP: ipdrRecord.publicIP,
            completedIP: completeIP,
            locationInfo: {
                city: result.city_name,
                region: result.region_name,
                country: result.country_name
            }
        });

    } catch (err) {
        console.error('Controller error:', err);
        
        if (err.code === 'ECONNABORTED') {
            return res.status(500).json({
                message: "Request timeout - IP2Location API took too long to respond"
            });
        } else if (err.response) {
            return res.status(500).json({
                message: "IP2Location API error"
            });
        } else if (err.request) {
            return res.status(500).json({
                message: "Network error - unable to reach IP2Location API"
            });
        } else {
            return res.status(500).json({ 
                message: "Error fetching lat/long"
            });
        }
    }
};


let getIPDRLocationsList = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;

        // Input validation
        if (!phoneNumber || typeof phoneNumber !== "string") {
            return res.status(400).json({
                message: "Invalid request. 'phoneNumber' must be a non-empty string",
                code: 400
            });
        }

        // Find IPDR record by phone number
        const ipdrRecord = await IPDR.findOne({ phoneNumber: phoneNumber });
        
        if (!ipdrRecord) {
            return res.status(404).json({
                message: "No IPDR record found for the given phone number",
                code: 404
            });
        }

        // Get IP address from IPDR record
        const ipAddress = ipdrRecord.publicIP;
        
        // Call IP2Location API
        const apiUrl = `https://api.ip2location.io/?key=${config.ip2location_api_key}&ip=${ipAddress}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            return res.status(500).json({
                message: "Failed to fetch location data from IP2Location API",
                code: 500
            });
        }

        const locationData = await response.json();

        // Check if API returned valid data
        if (!locationData || locationData.response === "INVALID") {
            return res.status(404).json({
                message: "Invalid IP address or no location data available",
                code: 404
            });
        }

        return res.json({
            message: "Location found successfully",
            data: {
                phoneNumber: phoneNumber,
                ipAddress: ipAddress,
                location: {
                    lat: parseFloat(locationData.latitude),
                    lng: parseFloat(locationData.longitude),
                    city: locationData.city_name,
                    region: locationData.region_name,
                    country: locationData.country_name,
                    countryCode: locationData.country_code,
                    zipCode: locationData.zip_code,
                    timeZone: locationData.time_zone,
                    isp: locationData.isp,
                    domain: locationData.domain
                },
                ipdrDetails: {
                    startTime: ipdrRecord.startTime,
                    endTime: ipdrRecord.endTime,
                    accessType: ipdrRecord.accessType,
                    totalVolume: ipdrRecord.totalVolume
                }
            },
            code: 200
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error fetching location data",
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
