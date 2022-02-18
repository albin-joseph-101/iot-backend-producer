import mongoose from 'mongoose'

const deviceDataSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        set: d => new Date(d),
        required: true
    },
    soc: {
        type: Number,
    },
    sop: {
        type: Number,
    },
    temp: {
        type: Number,
        required: true
    },
    voltage: {
        type: Number,
        required: true
    },
    current: {
        type: Number,
        required: true
    },
    chargeStatus: {
        type: String,
    },
    heading: {
        type: Number,
    },
    chargeCycle: {
        type: Number,
    },
    chargeFetStatus: {
        type: Number,
    },
    batterySerial: {
        type: String
    },
    dischargeFetStatus: {
        type: Number
    },
    alarms: {
        type: Object,
    },
    trackerAlarm: {
        type: String,
    },
    soh: {
        type: Number,
    },
    speed: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    altitude: {
        type: Number,
    },
    cellVoltage: {
        type: Object,
    },
    cellTemp: {
        type: Object,
    },
    key: {
        type: String,
        required: true,
    },
    reportedAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'deviceData' });

export default mongoose.model("deviceData", deviceDataSchema);