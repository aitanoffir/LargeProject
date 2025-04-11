import React from 'react'

const Section = ({title, children}) => {
  return (
    <div>
      <h3 className="px-6 py-3 text-left text-m font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className='flex gap-4'>
        {children}
      </div>
    </div>
  )
}

export default Section
