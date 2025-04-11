// gpt.controller.js
import OpenAI from "openai";

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract JSON from GPT's reply
const extractJson = (text) => {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1]; // Extracted JSON inside ```json ... ```
  }
  return text; // Assume the whole reply is raw JSON if no code block
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
  Each workout object MUST have the exact day name as specified in the input.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    
    // Extract clean JSON
    const jsonString = extractJson(reply);
    const workoutJSON = JSON.parse(jsonString);

    res.status(200).json({ success: true, workoutPlan: workoutJSON });

  } catch (error) {
    console.error("Error generating workout plan:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate workout plan" });
  }
};
