import Room from './pages/Room';
import RegisterUser from './pages/RegisterUser';
import Homepage from './pages/Homepage';
import CreateNewRoom from './pages/CreateNewRoom';
import JoinRoom from './pages/JoinRoom';
import ProtectRegisteredRoute from './pages/ProtectRegisteredRoute';
import { Navigate, RouteObject } from 'react-router-dom';
import { Layout } from './components/Styles/Layout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <RegisterUser />
      </Layout>
    ),
  },
  {
    path: '/room/:roomId',
    element: (
      <Layout>
        <Room />
      </Layout>
    ),
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
