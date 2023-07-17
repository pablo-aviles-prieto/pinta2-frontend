import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectRegisteredRoute = ({ children }: { children: JSX.Element }) => {
  const { isRegistered, username } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isRegistered || !username) {
      navigate('/', {
        state: {
          notRegistered: 'Para poder acceder, escriba un nombre',
          from: location.pathname,
        },
      });
    }
  }, [isRegistered, username]);

  return children;
};

export default ProtectRegisteredRoute;
