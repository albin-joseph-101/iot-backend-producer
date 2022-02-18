import mongoose from 'mongoose'

const stationSchema = mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
    },
    body: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},  { collection: 'station' });

export default mongoose.model("station", stationSchema);
