import React, { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { set } from "mongoose";

const EditProgram = (props) => {
  const [formData, setFormData] = useState({
    _id: props.workoutPlan._id,
    clientId: props.clientId,
    goal: props.goal,
    experience: props.experience,
    days: props.days,
    style: props.style,
    workoutPlan: props.workoutPlan,
  });

  const workoutSchedule = props.client.workoutSchedule;
  const workoutPlan = props.workoutPlan;
  const [cards, setCards] = useState(() => {
    return workoutSchedule.map((entry, index) => {
      const plan = workoutPlan[index] || {};
      return {
        id: index + 1,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
        focus: plan.focus,
        exercises: (plan.exercises || []).map((ex) => ({ ...ex })),
        notes: plan.notes,
      };
    });
  });
  const [activeDay, setActiveDay] = useState(cards[0].day);

  const updateCard = (cardId, updates) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  };

  const onConfirm = () => {
    const updatedWorkoutPlan = cards.map(({ focus, notes, exercises }) => ({
      focus,
      notes,
      exercises,
    }));

    const updatedFormData = {
      ...formData,
      workoutPlan: updatedWorkoutPlan,
    };

    setFormData(updatedFormData);
    console.log("✅ Confirmed updated form data:", updatedFormData);
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
          {props.client.firstName
            ? `${props.client.firstName}'s Program`
            : "Guest Program"}
        </div>

        {/* Day Tabbing */}
        <div className="rounded-md flex gap-2 mb-4 p-1 w-full bg-[#F4F4F5] justify-between">
          {cards.map((entry) => (
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
                notes={card.notes}
                exercises={card.exercises}
                onDelete={() => handleDeleteCard(card.id)}
                onUpdate={(id, updates) => updateCard(id, updates)}
                onConfirm={onConfirm}
                color={props.client.color}
              />
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between align-r gap-4">
          <button
            onClick={() => {
              console.log(props.workoutId);
              if (
                window.confirm("Are you sure you want to delete this program?")
              ) {
                props.onDelete(props.workoutId);
              }
            }}
            className="btn bg-red-400 hover:bg-gray-400 text-gray-800"
          >
            Delete Program
          </button>
          <div className="flex gap-2">
            <button
              onClick={props.onClose}
              className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log(formData, props.workoutId);
                props.onEdit(formData, props.workoutId);
              }}
              className="btn bg-accent hover:bg-blue-700 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;
