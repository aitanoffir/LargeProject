import React from 'react'

const Section = ({title, children}) => {
  return (
    <div>
      <h3 className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className='flex gap-2'>
        {children}
      </div>
    </div>
  )
}

export default Section
