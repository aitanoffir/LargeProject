import Workout from "../models/workout.model.js";
import { verifyJwt } from "../helpers.js";

// [POST] Create a new workout
export const createWorkout = async (req, res) => {
  const { clientId, goal, experience, days, style, workoutPlan } = req.body;

  // Verify JWT
  const validToken = verifyJwt(req.headers.authorization);
  if (!validToken) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }

  try {
    // Check if the client already has a workout
    const existingWorkout = await Workout.findOne({ clientId });
    if (existingWorkout) {
      return res.status(409).json({
        success: false,
        message: "Client already has an active workout. Use PUT to update.",
      });
    }

    // Create and save the new workout
    const newWorkout = new Workout({ clientId, goal, experience, days, style, workoutPlan });
    await newWorkout.save();

    res.status(201).json({ success: true, data: newWorkout });
  } catch (error) {
    console.error("Error creating workout:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// [PUT] Update an existing workout
export const updateWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const updates = req.body;

  // Verify JWT
  const validToken = verifyJwt(req.headers.authorization);
  if (!validToken) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, updates, {
      new: true,
    });

    if (!updatedWorkout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    res.status(200).json({ success: true, data: updatedWorkout });
  } catch (error) {
    console.error("Error updating workout:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// [GET] Get a workout by clientId
export const getWorkoutByClientId = async (req, res) => {
  const { clientId } = req.params;

  // Verify JWT
  const validToken = verifyJwt(req.headers.authorization);
  if (!validToken) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }

  try {
    const workout = await Workout.findOne({ clientId });

    if (!workout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    console.error("Error fetching workout:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// [DELETE] Delete a workout
export const deleteWorkout = async (req, res) => {
  const { workoutId } = req.params;

  // Verify JWT
  const validToken = verifyJwt(req.headers.authorization);
  if (!validToken) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }

  try {
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
      data: deletedWorkout,
    });
  } catch (error) {
    console.error("Error deleting workout:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};