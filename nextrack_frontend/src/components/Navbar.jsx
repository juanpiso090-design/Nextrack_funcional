import React from 'react';

/**
 * Barra de navegación superior dinámica de Nextrack
 */
const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <h1>Nextrack - Panel de Gestión</h1>
      <div className="user-profile-zone">
        <div className="user-info">
          Bienvenido, <strong>{user.nombre}</strong> | Rol: <span className="role-badge">{user.rol}</span>
        </div>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Navbar;