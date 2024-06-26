import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './AuthContext'; // Importar AuthProvider corretamente

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> {/* Usar AuthProvider aqui */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
