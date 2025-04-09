import React, {useState} from 'react'

const WorkoutCard = ({day, focusName}) => {

    const [exercises, setExercises] = useState([
        { name: 'Bench Press', sets: 4, reps: '8-10' },
        { name: 'Squats', sets: 3, reps: '10-12' },
      ]);

    const handleChange = (index, field, value) => {
        const updated = [...exercises];
        updated[index][field] = value;
        setExercises(updated);
    };

    const handleAdd = () => {
        setExercises([...exercises, {name: '', sets: '', reps: ''}])
    }

    const handleDelete = (index) => {
        const updated = exercises.filter((_, i) => i !== index);
        setExercises(updated);
      };

    return (
        <div>
            <h2>{day}</h2>
            <h4>{focusName}</h4>
        <table>
            <thead>
                <tr>
                    <th className='border'>Exercise</th>
                    <th className='border'>Sets</th>
                    <th className='border'>Reps</th>
                    <th className='border'>Actions</th>
                </tr>
            </thead>
            <tbody>
          {exercises.map((ex, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => handleChange(i, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) => handleChange(i, 'sets', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={ex.reps}
                  onChange={(e) => handleChange(i, 'reps', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    </div>
  )
}

export default WorkoutCard
