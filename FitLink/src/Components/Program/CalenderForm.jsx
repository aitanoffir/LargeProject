import React, {useState} from "react";

const CalenderForm = () => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const Th = ({ children }) => (
    <th className="border border-black text-center px-2 py-1">{children}</th>
  );

  const Td = ({ children, onClick, selected }) => (
    <td
      className={`border border-black text-center px-2 py-1 cursor-pointer ${
        selected ? "bg-blue-300" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </td>
  );

  const Tr = ({ time }) => (
    <tr>
      <Td>{time} {time >= 1 && time <= 7 ? "pm" : "am"}</Td>
      {days.slice(1).map((day) => {
        const id = `${time}-${day}`;
        const selected = selectedSlots.includes(id);
        return (
          <Td
            key={id}
            selected={selected}
            onClick={() => toggleSlot(time, day)}
          />
        );
      })}
    </tr>
  );

  const toggleSlot = (time, day) => {
    const id = `${time}-${day}`;
    setSelectedSlots((prev) =>
      prev.includes(id) ? prev.filter((slot) => slot !== id) : [...prev, id]
    );
  };

  const days = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div>
      <table className="w-full border border-black border-collapse">
        <thead>
          <tr>
            {days.map((day, idx) => (
              <Th key={idx}>{day}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <Tr key={time} time={time} />
          ))}
        </tbody>
      </table>

      {/* Optional: Display selected time slots */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Selected Time Slots:</h4>
        <ul className="list-disc ml-6">
          {selectedSlots.map((slot, idx) => (
            <li key={idx}>{slot}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalenderForm;
