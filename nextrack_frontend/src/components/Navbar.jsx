import React from 'react';

/**
 * Barra de navegación superior dinámica de Nextrack
 */
const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <h1>Nextrack - Gestión de Inventario</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '12px' }}>
          Bienvenido, <strong>{user.nombre}</strong> | Rol: <span className="badge">{user.rol}</span>
        </div>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Navbar;