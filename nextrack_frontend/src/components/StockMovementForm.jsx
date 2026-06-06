import React, { useState } from 'react';

/**
 * Formulario operativo para registrar entradas y salidas físicas del almacén
 */
const StockMovementForm = ({ productos, onExecuteMovement }) => {
  const [productoId, setProductoId] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('SUMA');
  const [cantidad, setCantidad] = useState(1);

  const handleProcess = (e) => {
    e.preventDefault();
    const idNum = parseInt(productoId);
    
    // Validar si el ID de producto ingresado existe en el inventario
    const existe = productos.some(p => p.id === idNum);
    if (!existe) {
      alert('Error: El ID del producto no está registrado en el sistema.');
      return;
    }

    // Despachar transacción al estado global superior
    onExecuteMovement(idNum, tipoMovimiento, parseInt(cantidad));
    
    // Resetear formulario para nueva captura
    setProductoId('');
    setCantidad(1);
  };

  return (
    <form onSubmit={handleProcess} className="movement-form">
      <h3>Registrar Entrada / Salida de Stock</h3>
      <div className="form-group">
        <label>Seleccionar Producto por ID:</label>
        <input 
          type="number" 
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          required
          placeholder="Ej: 1"
          min="1"
        />
      </div>
      <div className="form-group">
        <label>Tipo de Movimiento:</label>
        <select value={tipoMovimiento} onChange={(e) => setTipoMovimiento(e.target.value)}>
          <option value="SUMA">Suma (Entrada de Mercancía)</option>
          <option value="RESTA">Resta (Salida de Mercancía)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Cantidad:</label>
        <input 
          type="number" 
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
          required
        />
      </div>
      <button type="submit" className="btn-submit">Aplicar Movimiento</button>
    </form>
  );
};

export default StockMovementForm;