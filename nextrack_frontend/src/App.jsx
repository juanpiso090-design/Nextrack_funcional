import React, { useState } from 'react';
import LoginCard from './components/LoginCard';
import Navbar from './components/Navbar';
import StockMovementForm from './components/StockMovementForm';
import AdminPanel from './components/AdminPanel';
import InventoryTable from './components/InventoryTable';
import './App.css';

/**
 * Componente Principal de la Aplicación Nextrack
 * Administra el estado global de autenticación y la lista central de productos.
 */
function App() {
  // Estado para controlar el usuario autenticado
  const [user, setUser] = useState(null);

  // Estado global simulado con datos iniciales del inventario de Nextrack
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Cable HDMI 4K', descripcion: 'Cable de alta velocidad de 2 metros', precio: 15000, stock: 12, stockMinimo: 5 },
    { id: 2, nombre: 'Adaptador USB-C', descripcion: 'Conversor a USB 3.0 de aluminio', precio: 25000, stock: 3, stockMinimo: 8 }, // Activa alerta inmediatamente
    { id: 3, nombre: 'Teclado Mecánico', descripcion: 'Switch azul con retroiluminación RGB', precio: 120000, stock: 15, stockMinimo: 4 }
  ]);

  // Función para manejar el inicio de sesión exitoso
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Función para cerrar la sesión activa
  const logoutUser = () => {
    setUser(null);
  };

  // Función global para actualizar existencias desde el formulario de movimientos
  const actualizarStockGlobal = (idProd, tipo, cantidad) => {
    setProductos(prevProductos => 
      prevProductos.map(p => {
        if (p.id === idProd) {
          const nuevaCantidad = tipo === 'SUMA' ? p.stock + cantidad : p.stock - cantidad;
          // Validación técnica: Evitar que el stock caiga por debajo de cero
          if (nuevaCantidad < 0) {
            alert(`Error: No hay suficiente stock de "${p.nombre}" para realizar la operación.`);
            return p;
          }
          return { ...p, stock: nuevaCantidad };
        }
        return p;
      })
    );
  };

  // Función exclusiva para que el Administrador registre nuevos artículos
  const agregarProductoNuevo = (nuevoProd) => {
    setProductos(prev => [...prev, { ...nuevoProd, id: prev.length + 1 }]);
  };

  // Renderizado Condicional: Si no está logueado, muestra exclusivamente la pantalla de Login
  if (!user) {
    return <LoginCard onLoginSuccess={loginUser} />;
  }

  // Interfaz del Dashboard Principal una vez autenticado
  return (
    <div className="app-container">
      <Navbar user={user} onLogout={logoutUser} />
      
      <main className="dashboard-content">
        <section className="modules-grid">
          {/* Módulo de Operaciones: Accesible para Operarios y Administradores */}
          <div className="card-wrapper">
            <h2>Módulo de Movimientos</h2>
            <StockMovementForm productos={productos} onExecuteMovement={actualizarStockGlobal} />
          </div>

          {/* Módulo de Administración: Renderizado condicional estricto por Rol */}
          {user.rol === 'Administrador' && (
            <div className="card-wrapper admin-theme">
              <h2 style={{ color: '#d35400' }}>Módulo de Administración (Exclusivo Admin)</h2>
              <AdminPanel onAddProducto={agregarProductoNuevo} />
            </div>
          )}
        </section>

        {/* Tabla General de Inventario: Visible para todos los usuarios */}
        <section className="inventory-section">
          <InventoryTable productos={productos} />
        </section>
      </main>
    </div>
  );
}

export default App;