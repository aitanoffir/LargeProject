import React from 'react'

const Section = ({title, children}) => {
  return (
    <div>
      <h3 className='my-2'>{title}</h3>
      <div className='flex gap-4'>
        {children}
      </div>
    </div>
  )
}

export default Section
