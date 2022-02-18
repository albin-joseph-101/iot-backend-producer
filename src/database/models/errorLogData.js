import mongoose from 'mongoose'

const errorLogDataSchema = mongoose.Schema({
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
}, { collection: 'errorLogData' });

export default mongoose.model("errorLogData", errorLogDataSchema);