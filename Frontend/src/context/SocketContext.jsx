// import { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:5000'); 
//     setSocket(newSocket);

//     return () => newSocket.close();
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('Socket is not initialized');
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    newSocket.on('connect', () => {
      setSocket(newSocket);
      setLoading(false);
    });

    return () => newSocket.close();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};



