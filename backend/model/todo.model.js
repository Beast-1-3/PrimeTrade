import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    priority: {
        type: String,
        enum: ["Extreme", "Moderate", "Low"],
        default: "Moderate"
    },
    isComplete: {
        type: Boolean,
        default: false,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const TodoModel = mongoose.model(`todo`, todoSchema);
export default TodoModel;