const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
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

const GlobalPreferencesSchema = new Schema({
    tenantId: {type: String, required: true},
    emailSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    inAppSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    MobileSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    desktopSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    createDate: { type: Date, default: Date.now }
});

const UserPreferencesSchema = new Schema({
    tenantId: {type: String, required: true},
    userId: {type: String, required: true},
    emailSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    inAppSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    MobileSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    desktopSettings: { type: Map, required: true, default: {enabled: true, areas: {ant: true}} },
    createDate: { type: Date, default: Date.now }
});

module.exports = {
    EventSchema,
    GlobalPreferencesSchema,
    UserPreferencesSchema
}