import React, { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";

const EditProgram = (props) => {

  const sampleProgram = {
    clientId: "67faf81ba8e8c4f2815d5fe8",
    goal: "Strength",
    experience: "Beginner",
    days: ["Monday", "Wednesday", "Friday"],
    style: "Split",
    workoutPlan: {
      workouts: [
        {
          day: "Monday",
          focus: "Full Body Strength",
          notes: "Focus on form and full range of motion. Rest 1 minute between sets.",
          exercises: [
            { name: "Squat", sets: 3, reps: "10" },
            { name: "Push-up", sets: 3, reps: "15" },
            { name: "Bent-over Row", sets: 3, reps: "12" },
            { name: "Plank", sets: 3, reps: "60s" },
          ],
        },
        {
          day: "Wednesday",
          focus: "Cardio and Core",
          notes: "Maintain a steady cardio pace and focus on engaging core muscles throughout exercises.",
          exercises: [
            { name: "Jump Rope", sets: 5, reps: "60s" },
            { name: "Sit-up", sets: 3, reps: "20" },
            { name: "Mountain Climber", sets: 4, reps: "30" },
            { name: "Bicycle Crunch", sets: 3, reps: "20" },
          ],
        },
        {
          day: "Friday",
          focus: "Upper Body Strength",
          notes: "Use weights that are challenging but allow maintaining good form. Rest 60–90 seconds between sets.",
          exercises: [
            { name: "Bench Press", sets: 3, reps: "10" },
            { name: "Shoulder Press", sets: 3, reps: "10" },
            { name: "Lat Pulldown", sets: 3, reps: "12" },
            { name: "Bicep Curl", sets: 3, reps: "15" },
          ],
        },
      ],
    },
  };

  const client = props.client;
  const workouts = sampleProgram.workoutPlan.workouts;
  const [activeDay, setActiveDay] = useState(client.workoutSchedule[0].day);

  const workoutsByDay = workouts.reduce((acc, entry) => {
    acc[entry.day] = entry.exercises;
    return acc;
  }, {});

  
  console.log("Workouts is", workoutsByDay)
  const [cards, setCards] = useState(
    client.workoutSchedule.map((entry, index) => ({
      id: index + 1,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      focus: entry.focus || "TBD",
      exercises: (workoutsByDay[entry.day] || []).map((w) => ({ ...w })),
    }))
    // Add more as needed
  );

  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="bg-gray-50 p-8 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button (optional top-right) */}
        <button
          onClick={props.onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <div className="font-bold text-4xl text-gray-800 mb-8">
          {client.firstName ? `${client.firstName}'s Program` : "Guest Program"}
        </div>

        {/* Day Tabbing */}
        <div className="rounded-md flex gap-2 mb-4 p-1 w-full bg-[#F4F4F5] justify-between">
          {client.workoutSchedule.map((entry) => (
            <button
              key={entry.day}
              onClick={() => setActiveDay(entry.day)}
              className={`flex-1 px-4 py-2 rounded-md font-semibold ${
                activeDay === entry.day
                  ? "bg-white p-2"
                  : "bg-[#F4F4F5] text-gray-700 hover:cursor-pointer"
              }`}
            >
              {entry.day}
            </button>
          ))}
        </div>

        {/* Workout Cards Grid */}
        <div className=" ">
          {cards
            .filter((card) => card.day === activeDay)
            .map((card) => (
              <WorkoutCard
                key={card.id}
                id={card.id}
                day={card.day}
                startTime={card.startTime}
                endTime={card.endTime}
                focus={card.focus}
                exercises={card.exercises}
                onDelete={() => handleDeleteCard(card.id)}
                color={props.client.color}
              />
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end align-r gap-4">
          <button
            onClick={props.onClose}
            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => props.onSave(props.program)}
            className="btn bg-accent hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;
