import React, { useState } from 'react';

/**
 * Panel de Administración exclusivo para la creación de nuevos ítems de inventario
 */
const AdminPanel = ({ onAddProducto }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stockInicial, setStockInicial] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(5);
  const [precio, setPrecio] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      descripcion,
      stock: parseInt(stockInicial),
      stockMinimo: parseInt(stockMinimo),
      precio: parseFloat(precio)
    };

    onAddProducto(nuevoProducto);

    // Limpieza de campos del formulario
    setNombre('');
    setDescripcion('');
    setStockInicial(0);
    setStockMinimo(5);
    setPrecio('');
    alert('Producto registrado exitosamente en el catálogo general.');
  };

  return (
    <form onSubmit={handleCreate} className="admin-form">
      <div className="form-group">
        <label>Nombre del Producto:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Monitor LED" />
      </div>
      <div className="form-group">
        <label>Descripción Detallada:</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Pantalla IPS de 24 pulgadas" />
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Stock Inicial:</label>
          <input type="number" value={stockInicial} onChange={(e) => setStockInicial(e.target.value)} min="0" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Stock Mínimo:</label>
          <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} min="0" />
        </div>
      </div>
      <div className="form-group">
        <label>Precio Unitario ($):</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required min="1" step="0.01" placeholder="Ej: 450000" />
      </div>
      <button type="submit" className="btn-admin">Guardar Nuevo Producto</button>
    </form>
  );
};

export default AdminPanel;