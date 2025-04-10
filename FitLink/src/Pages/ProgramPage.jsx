import React, { useState } from 'react';
import Header from '../Components/Header';
import Section from '../Components/Program/CardSection';
import ProgramCard from '../Components/Program/ProgramCard';
import ConfirmModal from '../Components/Program/ConfirmModal';
import ProgramModal from '../Components/Program/ProgramModal';
import NavBar from '../Components/NavBar';
import { BsPlusLg } from "react-icons/bs";

const ProgramPage = () => {
  const [customPrograms, setCustomPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddProgram = () => {
    const newTitle = `Custom Program ${customPrograms.length + 1}`;
    setCustomPrograms([...customPrograms, { title: newTitle }]);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Main content area */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-5 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text=gray-800">My Programs</h1>
          </div>
        </header>
        <div className="mt-5">
          
          <Section title="Clients Programs">
            <ProgramCard title="Popeyes" />
            <ProgramCard title="Wendy" />
            <ProgramCard title="KFC" />
            <ProgramCard title="McDonald" />
          </Section>
          <div className="mt-20"></div>

          {/*<Section title="My Programs">
            {customPrograms.map((program, index) => (
              <ProgramCard key={index} title={program.title} />
            ))}
          </Section>*/}

          <Section title="New Program">
            <ProgramCard
              title={<BsPlusLg size={100} color="white" />}
              color="#319FED"
              onClick={() => setShowModal(true)}
            />
            {showModal && (
              <ProgramModal
                title="Create New Program"
                message="Are you sure you want to add a new program?"
                onConfirm={handleAddProgram}
                onClose={() => setShowModal(false)}
              />
            )}
            <ProgramCard title="Use Template" color="grey" />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
