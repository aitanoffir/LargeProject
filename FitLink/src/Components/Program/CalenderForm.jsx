import React, { useEffect, useState } from "react";

const CalenderForm = ({ color = "#93c5fd", schedule = [] }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const days = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];

  // Mapping from day names to abbreviations used in our table
  const dayMap = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  // Helper: Convert times like "1:00 PM" → 1
  const parseHour = (timeStr) => {
    const [hourStr] = timeStr.split(" ");
    return parseInt(hourStr.split(":")[0], 10);
  };

  // When schedule changes, highlight the appropriate cells
  useEffect(() => {
    if (!schedule || schedule.length === 0) return;
  
    const preselected = schedule.map((entry) => {
      const dayAbbrev = dayMap[entry.day];
      const hour = parseHour(entry.startTime);
      return `${hour}-${dayAbbrev}`;
    });
  
    // Prevent redundant updates
    if (JSON.stringify(preselected) !== JSON.stringify(selectedSlots)) {
      setSelectedSlots(preselected);
    }
  }, [schedule]);

  // Table header cell
  const Th = ({ children }) => (
    <th className="border border-[#e5e7eb] text-center px-2 py-1">
      {children}
    </th>
  );

  // Table data cell (highlighted if selected)
  const Td = ({ children, selected }) => (
    <td
      className="border border-[#e5e7eb] text-center px-2 py-1"
      style={selected ? { backgroundColor: color } : {}}
    >
      {children}
    </td>
  );

  // Row component for a given time
  const Tr = ({ time }) => (
    <tr>
      <Td>
        {time} {time >= 1 && time <= 7 ? "pm" : "am"}
      </Td>
      {days.slice(1).map((day) => {
        const id = `${time}-${day}`;
        const isSelected = selectedSlots.includes(id);
        return <Td key={id} selected={isSelected} />;
      })}
    </tr>
  );

  return (
    <div className="overflow-hidden">
      <table className="w-full border border-[#e5e7eb] border-collapse">
        <thead className="bg-gray-100">
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

    </div>
  );
};

export default CalenderForm;
