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
    path: '/home',
    element: (
      <ProtectRegisteredRoute>
        <Homepage />
      </ProtectRegisteredRoute>
    ),
  },
  {
    path: '/create-room',
    element: (
      <ProtectRegisteredRoute>
        <CreateNewRoom />
      </ProtectRegisteredRoute>
    ),
  },
  {
    path: '/join-room',
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
