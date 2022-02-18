import mongoose from 'mongoose'

const keySchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUsed: {
        type: Date,
        default: null,
    }
},  { collection: 'keys' });

export default mongoose.model("keys", keySchema);
