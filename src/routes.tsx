import Room from './pages/Room';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';

const routes = [
  {
    path: '/',
    element: <Homepage />,
    errorElement: <NotFound />,
  },
  {
    path: '/room/:roomId',
    element: <Room />,
  },
];

export default routes;
