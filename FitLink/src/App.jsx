import { useState } from 'react'
import './App.css'
import SignUp from './Components/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <SignUp />
  );
}

export default App
