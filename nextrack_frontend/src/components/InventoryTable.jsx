import React from 'react';
import StockAlert from './StockAlert';

/**
 * Renderiza la grilla del inventario general leyendo el estado de productos
 */
const InventoryTable = ({ productos }) => {
  return (
    <div className="table-container">
      <h2>Inventario General de Productos</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Producto</th>
            <th>Descripción</th>
            <th>Precio Unitario</th>
            <th>Stock Actual</th>
            <th>Stock Mínimo</th>
            <th>Estado Operativo</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td><strong>{prod.id}</strong></td>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion || 'Sin descripción'}</td>
              <td>${prod.precio.toLocaleString()}</td>
              <td>{prod.stock}</td>
              <td>{prod.stockMinimo}</td>
              <td>
                {/* Delegación lógica al subcomponente atómico de Alertas */}
                <StockAlert stock={prod.stock} stockMinimo={prod.stockMinimo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;