import React from 'react'

const ProgramCard = ({title, color, onClick}) => {

    //stack overflow function for generating colors http://blog.adamcole.ca/2011/11/simple-javascript-rainbow-color.html
    function rainbowStop(h) 
    {
        let f= (n,k=(n+h*12)%12) => .5-.5*Math.max(Math.min(k-3,9-k,1),-1);  
        let rgb2hex = (r,g,b) => "#"+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,0)).join('');
        return ( rgb2hex(f(0), f(8), f(4)) );
    } 

    const bgColor = color || rainbowStop(Math.random());

    return (
        <div 
            onClick={onClick}
            className='w-40 h-30 rounded-md shadow-md flex justify-center items-center text-white text-lg font-semibold cursor-pointer'
            style={{ backgroundColor: bgColor }}
        >
            {title}
        </div>
    )
}

export default ProgramCard
