import React from 'react';

/**
 * Componente Atómico que calcula y despliega el estado de abastecimiento
 */
const StockAlert = ({ stock, stockMinimo }) => {
  // Evaluación del criterio lógico de la regla de negocio
  const esCritico = stock <= stockMinimo;

  return (
    <span className={esCritico ? 'badge-critico' : 'badge-normal'}>
      {esCritico ? '⚠️ BAJO STOCK! Reordenar' : '✅ Abastecido'}
    </span>
  );
};

export default StockAlert;