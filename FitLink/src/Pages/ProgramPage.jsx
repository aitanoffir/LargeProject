import React, {useState} from 'react'
import Header from '../Components/Header'
import Section from '../Components/Program/CardSection'
import ProgramCard from '../Components/Program/ProgramCard'
import ConfirmModal from '../Components/Program/ConfirmModal'
import ProgramModal from '../Components/Program/ProgramModal'

const ProgramPage = () => {

  const [customPrograms, setCustomPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddProgram = () => {

    const newTitle = `Custom Program ${customPrograms.length + 1}`;
    setCustomPrograms([...customPrograms, { title: newTitle }]);
    setShowModal(false);
  }

  return (
    <div className='m-2'>
        <Header title="My Program"/>
        <div className='mt-5'>
            <Section title="Clients" >
                <ProgramCard title="Popeyes"/>
                <ProgramCard title="Wendy"/>
                <ProgramCard title="KFC"/>
                <ProgramCard title="McDonald"/>
            </Section>
            <Section title="My Programs" >
                {customPrograms.map((program, index) => (
                <ProgramCard key={index} title={program.title} />
              ))}
            </Section>
            <Section title="Create New  ">
                <ProgramCard title="Add" color="blue" onClick={() => setShowModal(true)} />
                {showModal && (
                  <ProgramModal 
                    onConfirm={handleAddProgram}
                    onClose={() => setShowModal(false)}
                  />
                )}
                <ProgramCard title="Use Template" color="grey"/>
            </Section>
        </div>
    </div>
  )
}

export default ProgramPage
