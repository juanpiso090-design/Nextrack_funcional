import React, { useState } from 'react';

/**
 * Componente que renderiza el formulario de inicio de sesión de Nextrack
 * @param {Function} onLoginSuccess - Callback para elevar el estado del usuario al login exitoso.
 */
const LoginCard = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de validación de base de datos local
    if (username === 'admin' && password === '123') {
      onLoginSuccess({ nombre: 'Juan Pablo Obando', username: 'admin', rol: 'Administrador' });
    } else if (username === 'operario' && password === '123') {
      onLoginSuccess({ nombre: 'Carlos Pérez', username: 'operario', rol: 'Operario' });
    } else {
      setError('Usuario o contraseña incorrectos. Intente nuevamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Nextrack</h1>
        <p>Gestión de Control de Inventarios</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de Usuario:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Ej: admin o operario"
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary">Ingresar al Sistema</button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;