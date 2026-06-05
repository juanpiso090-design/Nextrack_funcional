package com.nextrack.controller;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Usamos doGet porque los botones de cerrar sesión suelen ser enlaces simples (links)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener la sesión actual si existe (false evita que cree una nueva)
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            // 2. Destruir la sesión por completo en el servidor
            session.invalidate();
        }
        
        // 3. Redireccionar de inmediato a la página de Login
        response.sendRedirect("index.jsp");
    }
}