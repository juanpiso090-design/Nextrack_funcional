import React from 'react';

/**
 * Barra de navegación superior dinámica de Nextrack
 */
const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Nextrack</h1>
      </div>

      <div className="user-area" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="user-info">
          Bienvenido, <strong>{user.nombre}</strong> | Rol: <span className="badge">{user.rol}</span>
        </div>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Navbar;