const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var EventSchema = new Schema({
    command: {type: String, required: true},
    area: {type: String, required: true},
    tenantId: {type: String, required: true},
    userName: {type: String, required: true},
    userId: {type: String, required: true},
    targetUsers: [String],
    data: Map,
    createDate: { type: Date, default: Date.now, expires: '2y' }, // 2 years expiry
    visited: {type: Boolean, required: true},
});

module.exports = {
    EventSchema
}