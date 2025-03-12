import React from 'react'
import '../index.css'
import sign_up_picture from '../assets/cropped_img_fitness_woman.jpg'

const SignUp = () => {
  return (
    <div className="w-1/2 h-1/2 overflow-hidden relative">
      <img 
        className="w-full h-full object-cover" 
        src={sign_up_picture} 
        alt="Fitness Woman Standing"
      />
    </div>
  );
}

export default SignUp
