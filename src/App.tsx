import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes';
import { SocketProvider } from './hooks/useSocket';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const router = createBrowserRouter(routes);

  return (
    <SocketProvider>
      <>
        <RouterProvider router={router} />
        <ToastContainer />
      </>
    </SocketProvider>
  );
};

export default App;
