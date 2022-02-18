import mongoose from 'mongoose'

const errorDeviceDataSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    body: {
        type: Object
    },
    key: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: 0,
    },
    reportedAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'errorDeviceData' });

export default mongoose.model("errorDeviceData", errorDeviceDataSchema);