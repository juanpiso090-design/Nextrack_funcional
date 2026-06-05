import React, { useState, useEffect } from 'react';

export default function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  // Cargar inventario desde la API real cuando se inicia sesión
  useEffect(() => {
    if (session) {
      fetch('http://localhost:3000/api/nextrack/productos')
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err => console.error("Error cargando inventario:", err));
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/nextrack/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setSession(data); // Guarda { usuario, rol }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor backend.');
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
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
        <h2>Nextrack 📦</h2>
        <p>Bienvenido: <strong>{session.usuario}</strong> ({session.rol})</p>
        <button onClick={() => setSession(null)}>Cerrar Sesión</button>
      </header>

      <h3>Panel de Inventario</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Código</th>
            <th>Descripción</th>
            <th>Existencias</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.stock}</td>
              <td>
                {p.stock <= p.stock_minimo 
                  ? <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Stock Crítico</span> 
                  : <span style={{ color: 'green' }}>✅ Óptimo</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}