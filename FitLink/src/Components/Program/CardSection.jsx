import React from 'react'

const Section = ({title, children}) => {
  return (
    <div>
      <h3 className='text-gray-800 ml-5 my-2'>{title}</h3>
      <div className='flex gap-4'>
        {children}
      </div>
    </div>
  )
}

export default Section
