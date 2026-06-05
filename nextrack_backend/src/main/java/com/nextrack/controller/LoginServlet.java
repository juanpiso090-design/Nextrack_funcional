package com.nextrack.controller;

import com.nextrack.model.Usuario;
import com.nextrack.dao.UsuarioDAO;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;
    private UsuarioDAO usuarioDAO;

    @Override
    public void init() throws ServletException {
        // Inicializamos el objeto DAO al arrancar el Servlet
        usuarioDAO = new UsuarioDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Forzamos el encoding para evitar problemas con tildes o caracteres raros
        request.setCharacterEncoding("UTF-8");
        
        // Capturamos los campos del formulario JSP
        String userForm = request.getParameter("username");
        String passForm = request.getParameter("password");

        try {
            // Buscamos el usuario en la base de datos mediante Hibernate
            Usuario usuario = usuarioDAO.validarUsuario(userForm);

            // Validamos si el usuario existe y si la contraseña coincide exactamente
            if (usuario != null && usuario.getPassword() != null && usuario.getPassword().equals(passForm)) {
                
                // ¡Credenciales correctas! Creamos o recuperamos la sesión HTTP activa
                HttpSession session = request.getSession();
                session.setAttribute("usuarioLogueado", usuario);
                session.setAttribute("nombre", usuario.getNombreCompleto());
                session.setAttribute("rol", usuario.getRol());

                // Redirige al panel principal (dashboard) de forma limpia
                response.sendRedirect("dashboard.jsp");
                return;
                
            } else {
                // Si el usuario no existe o la contraseña está mal, enviamos el error al formulario index.jsp
                request.setAttribute("mensajeErrorLogin", "Usuario o contraseña incorrectos.");
                request.getRequestDispatcher("index.jsp").forward(request, response);
                return;
            }
            
        } catch (Exception e) {
            // Si ocurre un error inesperado de infraestructura, lo mostramos en pantalla para debuguear
            e.printStackTrace();
            request.setAttribute("mensajeErrorLogin", "Error crítico en el servidor: " + e.getMessage());
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }
}