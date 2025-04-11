import React from 'react'
import WorkoutCard from './WorkoutCard'

const EditProgram = () => {
  return (
    <div>
        <div className='grid grid-flow-col grid-rows-2 gap-2'>
            <WorkoutCard day="Monday" focusName="Glutes" />
            <WorkoutCard day="Monday" focusName="Glutes" />
            <WorkoutCard day="Monday" focusName="Glutes" />
            <WorkoutCard day="Monday" focusName="Glutes" />
            <WorkoutCard day="Monday" focusName="Glutes" />
            <WorkoutCard day="Monday" focusName="Glutes" />
        </div>
    </div>
  )
}

export default EditProgram
