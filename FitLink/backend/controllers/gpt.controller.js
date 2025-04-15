// gpt.controller.js
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract JSON from GPT's reply
const extractJson = (text) => {
  // Try to extract from code blocks first
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim(); // Extracted JSON inside code blocks
  }

  // If no code blocks, clean up the text and try to parse it as JSON
  return text.trim();
};

export const generateWorkoutPlan = async (req, res) => {
  const { goal, experience, days, style } = req.body;

  // Join the days array into a comma-separated string for the prompt
  const daysString = Array.isArray(days) ? days.join(", ") : days;

  const prompt = `You are a certified personal trainer. Create a workout plan for a ${experience} client whose goal is to ${goal}. 
  They prefer ${style} and can train on these specific days: ${daysString}.
  Create exactly one workout for each of these days.
  ONLY output valid JSON, without any markdown, code fences, or explanations. 
  The JSON should include: day, focus, exercises (with sets & reps), and notes.
  Each workout object MUST have the exact day name as specified in the input.
  Here is the exact format required:
  {
    "workoutPlan": [
      {
        "day": "Monday",
        "focus": "Push",
        "exercises": [
          {
            "name": "Example Exercise",
            "sets": 3,
            "reps": "8-10"
          }
        ],
        "notes": "Example notes"
      }
    ]
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content;

    // Extract clean JSON
    const jsonString = extractJson(reply);
    let workoutJSON;

    try {
      workoutJSON = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.log("Problematic JSON string:", jsonString);
      return res.status(500).json({
        success: false,
        message: "Error parsing workout plan: " + parseError.message
      });
    }

    // Process the workout plan to ensure all reps are strings
    if (workoutJSON && workoutJSON.workoutPlan) {
      workoutJSON.workoutPlan.forEach(workout => {
        if (Array.isArray(workout.exercises)) {
          workout.exercises.forEach(exercise => {
            // Convert any array reps to strings
            if (Array.isArray(exercise.reps)) {
              exercise.reps = exercise.reps.join(", ");
            }
            // Ensure sets is a number
            if (typeof exercise.sets === 'string') {
              exercise.sets = parseInt(exercise.sets, 10);
            }
          });
        }
      });
    }

    console.log("Final workout plan:", JSON.stringify(workoutJSON, null, 2));
    res.status(200).json({ success: true, workoutPlan: workoutJSON });

  } catch (error) {
    console.error("Error generating workout plan:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate workout plan" });
  }
};
