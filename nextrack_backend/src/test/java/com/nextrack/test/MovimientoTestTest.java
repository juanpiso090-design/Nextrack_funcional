package com.nextrack.test;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import com.nextrack.model.Producto;

public class MovimientoTestTest {

    @Test
    public void verificarControlDeStockNegativo() {
        // 1. Configurar escenario: Producto con stock actual de 5 unidades
        Producto producto = new Producto();
        producto.setNombreProducto("Componente Electrónico");
        producto.setStock(5);

        // 2. Ejecutar acción: El operario intenta registrar una 'RESTA' de 8 unidades
        int cantidadSolicitada = 8;
        boolean transaccionAprobada;

        // Simulación de la lógica interna de tu MovimientoServlet
        if (producto.getStock() >= cantidadSolicitada) {
            producto.setStock(producto.getStock() - cantidadSolicitada);
            transaccionAprobada = true;
        } else {
            transaccionAprobada = false; 
        }

        // 3. Afirmación (Assert): Esperamos que la transacción sea RECHAZADA (false)
        assertFalse(transaccionAprobada, "Error: El sistema permitió dejar el stock en negativo.");
        assertEquals(5, producto.getStock(), "Error: El stock se alteró a pesar de ser insuficiente.");
    }
}