import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import InventoryTable from './components/InventoryTable.jsx';
import StockMovementForm from './components/StockMovementForm.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import UserCreationForm from './components/UserCreationForm.jsx';

const BACKEND_BASE = 'https://nextrack-backend-3dfo.onrender.com';

const adaptProducto = (producto) => ({
  id: producto.id,
  codigo: producto.codigo,
  nombre: producto.nombre,
  descripcion: producto.descripcion || '',
  precio: producto.precio != null ? producto.precio : 0,
  stock: producto.stock,
  stockMinimo: producto.stockMinimo != null ? producto.stockMinimo : producto.stock_minimo || 0,
});

export default function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Cargar inventario desde la API real cuando se inicia sesión
  useEffect(() => {
    if (session) {
      cargarInventario();
    }
  }, [session]);

  const cargarInventario = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_BASE}/api/nextrack/productos`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      const data = await response.json();
      setProductos(data.map(adaptProducto));
    } catch (err) {
      console.error('Error cargando inventario:', err);
      setError('No se pudo cargar el inventario.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${BACKEND_BASE}/api/nextrack/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSession({ usuario: data.usuario, rol: data.rol });
      } else {
        setError(data.error || 'Credenciales inválidas.');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError('No se pudo conectar con el servidor backend.');
    }
  };

  const handleLogout = () => {
    setSession(null);
    setProductos([]);
    setUsername('');
    setPassword('');
    setError('');
    setMessage('');
  };

  const handleAddProducto = (nuevoProducto) => {
    const nextId = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
    const codigo = `PROD${String(nextId).padStart(3, '0')}`;

    setProductos((prev) => [
      ...prev,
      {
        id: nextId,
        codigo,
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion,
        precio: nuevoProducto.precio,
        stock: nuevoProducto.stock,
        stockMinimo: nuevoProducto.stockMinimo,
      },
    ]);
    setMessage('Producto agregado correctamente al inventario local.');
  };

  const handleCreateUsuario = (usuarioCreado) => {
    setMessage(`Usuario ${usuarioCreado.usuario} creado exitosamente.`);
  };

  const handleExecuteMovement = async (productoId, tipoMovimiento, cantidad) => {
    setError('');
    setMessage('');

    const producto = productos.find((p) => p.id === productoId);
    if (!producto) {
      setError('El producto seleccionado no existe.');
      return;
    }

    const tipo = tipoMovimiento === 'SUMA' ? 'ENTRADA' : 'SALIDA';

    try {
      const response = await fetch(`${BACKEND_BASE}/api/nextrack/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoProducto: producto.codigo,
          tipo,
          cantidad,
          usuarioResponsable: session.usuario,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error procesando movimiento.');
        return;
      }

      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId ? { ...p, stock: data.stockActualizado } : p
        )
      );
      setMessage(data.mensaje || 'Movimiento procesado correctamente.');
    } catch (err) {
      console.error('Error procesando movimiento:', err);
      setError('No se pudo procesar el movimiento.');
    }
  };

  if (!session) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <h2>Nextrack - Ingreso al Sistema</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Usuario:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{width:'100%', marginBottom:'10px'}} />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{width:'100%', marginBottom:'10px'}} />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{width:'100%', padding:'10px'}}>Autenticar</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={{ nombre: session.usuario, rol: session.rol }} onLogout={handleLogout} />

      <div className="container">
        {error && <div className="message-error">{error}</div>}
        {message && <div className="message-success">{message}</div>}

        <h2>Módulo de Movimientos (Operario / Administrador)</h2>
        <div className="grid">
          <div className="card module-movements">
            <StockMovementForm productos={productos} onExecuteMovement={handleExecuteMovement} />
          </div>
        </div>

        {session.rol === 'Administrador' && (
          <>
            <h2 style={{ marginTop: 40, color: '#d35400' }}>Módulo de Administración (Exclusivo Admin)</h2>
            <div className="grid">
              <div className="card module-admin">
                <AdminPanel onAddProducto={handleAddProducto} />
              </div>
              <div className="card module-admin">
                <UserCreationForm onCreateUsuario={handleCreateUsuario} />
              </div>
            </div>
          </>
        )}

        <InventoryTable productos={productos} />
      </div>
    </div>
  );
}