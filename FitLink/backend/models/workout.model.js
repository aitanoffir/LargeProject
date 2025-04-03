import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientInfo", // Links to the client
      required: true,
      unique: true, // Ensures one workout per client
    },
    goal: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    workoutPlan: [
      {
        day: { type: String, required: true },
        focus: { type: String, required: true },
        exercises: [
          {
            name: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: String, required: true },
          },
        ],
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;