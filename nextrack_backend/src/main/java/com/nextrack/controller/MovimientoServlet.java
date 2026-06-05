package com.nextrack.controller;

import com.nextrack.model.Producto;
import com.nextrack.model.Movimiento;
import com.nextrack.dao.ProductoDAO;
import com.nextrack.dao.MovimientoDAO;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/MovimientoServlet")
public class MovimientoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ProductoDAO productoDAO;
    private MovimientoDAO movimientoDAO;

    @Override
    public void init() throws ServletException {
        productoDAO = new ProductoDAO();
        movimientoDAO = new MovimientoDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        int idProducto = Integer.parseInt(request.getParameter("idProducto"));
        String tipoMov = request.getParameter("tipoMovement"); // Captura SUMA o RESTA
        // Pequeño ajuste por si el jsp usa otro name, en nuestro dashboard pusimos name="tipoMovimiento"
        if(request.getParameter("tipoMovimiento") != null) {
            tipoMov = request.getParameter("tipoMovimiento");
        }
        int cantidad = Integer.parseInt(request.getParameter("cantidad"));

        // 1. Buscamos si el producto realmente existe en la base de datos
        Producto producto = productoDAO.obtenerProducto(idProducto);

        if (producto != null) {
            int stockActual = producto.getStock();
            
            // 2. Calculamos el nuevo stock según el tipo de movimiento
            if (tipoMov.equals("SUMA")) {
                producto.setStock(stockActual + cantidad);
            } else if (tipoMov.equals("RESTA")) {
                // Validación para que el stock no quede en negativo
                if (stockActual >= cantidad) {
                    producto.setStock(stockActual - cantidad);
                } else {
                    // Opcional: Podrías mandar un error de "Stock insuficiente"
                    response.sendRedirect("dashboard.jsp");
                    return;
                }
            }

            // 3. Guardamos los cambios en el Stock del producto
            productoDAO.actualizarProducto(producto);

            // 4. Registramos el movimiento en la tabla de historial
            Movimiento mov = new Movimiento();
            mov.setIdProducto(idProducto);
            mov.setTipoMovimiento(tipoMov);
            mov.setCantidad(cantidad);
            movimientoDAO.registrarMovimiento(mov);
        }

        response.sendRedirect("dashboard.jsp");
    }
}