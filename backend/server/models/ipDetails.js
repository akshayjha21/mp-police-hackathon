// const mongoose = require("mongoose")
// const Schema = mongoose.Schema
// const Model = mongoose.model

// const ipDataRecords = Schema({
//     // Private IP - E.g. 1.2.3.4
//     privateIP : {type : String, required : true, index : true, minLength : 7, maxLength : 16},

//     // Private Port
//     privatePort : {type : Number, required : true},

//     // Public IP - E.g. 1.2.3.4
//     publicIP : {type : String, required : true, index : true, minLength : 7, maxLength : 16},

//     // Public Port
//     publicPort : {type : Number, required : true},

//     // Destination IP
//     destIP: {type : String, required : true, index : true, minLength : 7, maxLength : 16},

//     // Destination Port
//     destPort : {type : Number, required : true},

//     // Phone Number
//     phoneNumber : {type : String, required : true, minLength : 10, maxLength : 10},

//     // Caller name - Optional
//     associatedName : {type : String, index : true}, 

//     // Time of connecting
//     startTime : {type : Date, required : true, default : Date.now},

//     // Time of disconnecting
//     endTime : {type : Date, required : true, default : Date.now},
    
//     // Uplink Volume
//     uplinkVolume : {type : Number, required : true},

//     // Downlink Volume
//     downlinkVolume : {type : Number, required : true},

//     // Total Volume
//     totalVolume : {type : Number, required : true},

//     //Cell ID where connection was initiated
//     originCellID: {type: String, required: true, index: true},
    
//     // Position where call was initiated
//     originLatLong : {
//         type : {
//             lat : Schema.Decimal128,
//             long : Schema.Decimal128    
//         },
//         required: true
//     },

//     // IMEI
//     imei : {type : String, required : true, maxLength : 15, minLength : 15},
    
//     // IMSI
//     imsi : {type : String, required : true, maxLength : 15, minLength : 15},
    
//     // Access type / I_RATTYPE
//     accessType : {
//         type : String, 
//         enum : ['2G', '3G', '4G']
//     },
// });

// module.exports = {
//     IPDR : Model('ipDataRecords', ipDataRecords)
// }
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const ipDataRecords = new Schema({
    privateIP: { type: String, required: true, index: true, minLength: 7, maxLength: 16 },
    privatePort: { type: Number, required: true },
    publicIP: { type: String, required: true, index: true, minLength: 7, maxLength: 16 },
    publicPort: { type: Number, required: true },
    destIP: { type: String, required: true, index: true, minLength: 7, maxLength: 16 },
    destPort: { type: Number, required: true },
    phoneNumber: { type: String, required: true, minLength: 10, maxLength: 10 },
    associatedName: { type: String, index: true },

    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, required: true, default: Date.now },

    uplinkVolume: { type: Number, required: true },
    downlinkVolume: { type: Number, required: true },
    totalVolume: { type: Number, required: true },

    originCellID: { type: String, required: true, index: true },

    originLatLong: {
        lat: { type: mongoose.Schema.Types.Decimal128, required: true },
        long: { type: mongoose.Schema.Types.Decimal128, required: true }
    },

    imei: { type: String, required: true, maxLength: 15, minLength: 15 },
    imsi: { type: String, required: true, maxLength: 15, minLength: 15 },

    accessType: { type: String, enum: ["2G", "3G", "4G"] }
});

module.exports = {
    IPDR: Model("ipDataRecords", ipDataRecords)
};
