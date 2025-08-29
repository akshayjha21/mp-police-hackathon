const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const profileDetails = new Schema({
    phoneNumber: { type: String, required: true, unique: true, index: true, minLength: 10, maxLength: 10 },
    associatedPhoneNumbers: [String],
    imei: { type: String, required: true, maxLength: 15, minLength: 15 },
    associatedImeis: [String],
    imsi: { type: String, required: true, maxLength: 15, minLength: 15 },
    name: { type: String, index: true },
    age: { type: Number },
    email: String,
    aadharNumber: { type: String },
    company: String,
    address: String,
    remarks: String
});

module.exports = {
    Profile: Model("profileDetails", profileDetails)
};
