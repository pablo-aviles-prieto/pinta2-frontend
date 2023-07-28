import Room from './pages/Room';
import RegisterUser from './pages/RegisterUser';
import Homepage from './pages/Homepage';
import CreateNewRoom from './pages/CreateNewRoom';
import JoinRoom from './pages/JoinRoom';
import ProtectRegisteredRoute from './pages/ProtectRegisteredRoute';
import { Navigate } from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <RegisterUser />,
  },
  {
    path: '/room/:roomId',
    element: <Room />,
  },
  {
    path: '/home', // Only accesible if the user is registered
    element: (
      <ProtectRegisteredRoute>
        <Homepage />
      </ProtectRegisteredRoute>
    ),
  },
  {
    path: '/create-room', // Only accesible if the user is registered
    element: (
      <ProtectRegisteredRoute>
        <CreateNewRoom />
      </ProtectRegisteredRoute>
    ),
  },
  {
    path: '/join-room', // Only accesible if the user is registered
    element: (
      <ProtectRegisteredRoute>
        <JoinRoom />
      </ProtectRegisteredRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Navigate
        to='/'
        state={{
          notValidPath: 'La URL indicada no es correcta, revísela por favor',
        }}
      />
    ),
  },
];

export default routes;
