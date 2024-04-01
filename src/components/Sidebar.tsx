import React from 'react';
import { Button } from '@nextui-org/react'
import { useState } from 'react';

export const Sidebar = ({ observations }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };
  
    return (
      <div>
        <Button onClick={toggleSidebar} />
        {isSidebarOpen && <ObservationList observations={observations} />}
      </div>
    );
  };

  const ObservationList = ({ observations }) => {
    return (
        <div className='flex flex-col justify-center mt-5 items-center'>
            <p className='text-4xl font-bold'>Observations:</p>
            <ul className='mt-2 w-full text-center rounded-lg bg-gray-800'>
              {observations.map((obs, i) => (
                <li key={i} className='text-lg p-2 border rounded-md'>
                  {obs}
                </li>
              ))}
            </ul>
          </div>
    );
  };
  