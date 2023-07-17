import Room from './pages/Room';
import NotFound from './pages/NotFound';
import RegisterUser from './pages/RegisterUser';
import Homepage from './pages/Homepage';
import CreateNewRoom from './pages/CreateNewRoom';
import JoinRoom from './pages/JoinRoom';
import ProtectRegisteredRoute from './pages/ProtectRegisteredRoute';

const routes = [
  {
    path: '/',
    element: <RegisterUser />,
    errorElement: <NotFound />,
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
];

export default routes;
