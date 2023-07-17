import { useEffect } from 'react';
import { RegisterUserForm } from '../components/RegisterUserForm';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

const RegisterUser = () => {
  const { socket } = useSocket();
  const location = useLocation();
  const browsingState = location.state;

  useEffect(() => {
    if (browsingState) {
      console.log('browsingState', browsingState);
      // TODO: Display an error toast with the msg => browsingState.notRegistered
      // TODO: Check the from property in the state to redirect the user back => browsingState.from
      // (both coming from ProtectRegisteredRoute)
      // TODO: After settled to a state the url to be redirected, clear the location.state
      if (browsingState.disconnectUser) {
        socket?.disconnect();
        console.log(
          'Sigue los pasos para unirte/crear una sala y empezar a jugar!'
        );
        // TODO: Show a toast instead of a console.log
        // TODO:? Restart the disconnectUser prop to avoid possible problems
      }
    }
  }, [browsingState]);

  return (
    <>
      <div>Escribe un nombre!</div>
      <RegisterUserForm />
    </>
  );
};

export default RegisterUser;
