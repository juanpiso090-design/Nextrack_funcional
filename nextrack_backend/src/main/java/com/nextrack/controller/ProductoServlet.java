package com.nextrack.controller;

import com.nextrack.model.Producto;
import com.nextrack.dao.ProductoDAO;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/ProductoServlet")
public class ProductoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ProductoDAO productoDAO;

    @Override
    public void init() throws ServletException {
        productoDAO = new ProductoDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        String nombreProd = request.getParameter("nombreProducto");
        String desc = request.getParameter("descripcion");
        int stockInic = Integer.parseInt(request.getParameter("stockInicial"));
        int stockMin = Integer.parseInt(request.getParameter("stockMinimo")); // 👈 Añade esta línea
        double precioProd = Double.parseDouble(request.getParameter("precio"));

        Producto producto = new Producto();
        producto.setNombreProducto(nombreProd);
        producto.setPageDescripcion(desc);
        producto.setStock(stockInic);
        producto.setStockMinimo(stockMin); // 👈 Añade esta línea
        producto.setPrecio(precioProd);

        productoDAO.guardarProducto(producto);

        // Al terminar, nos quedamos en el dashboard refrescado
        response.sendRedirect("dashboard.jsp");
    }
}