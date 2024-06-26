import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bem-vindo ao Gerenciador de Tarefas</h1>
      <p>Organize suas tarefas de forma eficiente</p>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')}>Registrar</button>
    </div>
  );
};

export default Home;
