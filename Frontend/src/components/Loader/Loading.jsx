import React from 'react';
import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
  return <div className='flex items-center justify-center w-full h-full'>
    <HashLoader color="#53b6ca"/>
  </div>
}

export default Loading