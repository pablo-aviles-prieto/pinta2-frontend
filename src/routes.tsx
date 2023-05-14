import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';

const routes = [
  {
    path: '/',
    element: <Homepage />,
    errorElement: <NotFound />,
  },
];

export default routes;
