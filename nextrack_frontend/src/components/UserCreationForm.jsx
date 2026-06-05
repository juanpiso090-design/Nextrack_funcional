import React, { useState } from 'react';

const UserCreationForm = ({ onCreateUsuario }) => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Operario');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!nombre || !usuario || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('https://nextrack-backend-3dfo.onrender.com/api/nextrack/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCompleto: nombre, usuario, password, rol }),
      });

      const data = await response.json();
      if (response.ok) {
        onCreateUsuario(data);
        setMessage('Usuario creado correctamente.');
        setNombre('');
        setUsuario('');
        setPassword('');
        setRol('Operario');
      } else {
        setError(data.error || 'No se pudo crear el usuario.');
      }
    } catch (err) {
      console.error('Error creando usuario:', err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="card user-card">
      <h2>Crear Usuario</h2>
      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Nombre completo</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: María López" />
        </div>
        <div className="form-group">
          <label>Usuario</label>
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Ej: maria_admin" />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="Administrador">Administrador</option>
            <option value="Operario">Operario</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Crear Usuario</button>
      </form>
    </div>
  );
};

export default UserCreationForm;
