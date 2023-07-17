import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>¿Quieres crear una sala, o unirte a una?</div>
      <button
        type='button'
        className='mr-4'
        onClick={() => navigate('/create-room')}
      >
        Crear
      </button>
      <button type='button' onClick={() => navigate('/join-room')}>
        Unirte
      </button>
    </>
  );
};

export default Homepage;
