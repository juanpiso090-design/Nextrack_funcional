package com.nextrack.controller;

import com.nextrack.model.Usuario;
import com.nextrack.dao.UsuarioDAO;
import com.nextrack.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/RegistroUsuarioServlet")
public class RegistroUsuarioServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        
        String nombre = request.getParameter("nombreCompleto");
        String user = request.getParameter("username");
        String pass = request.getParameter("password");
        String rol = request.getParameter("rol");

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreCompleto(nombre);
        nuevoUsuario.setUsername(user);
        nuevoUsuario.setPassword(pass);
        nuevoUsuario.setRol(rol);

        Transaction transaction = null;
        // Usamos una sesión directa para guardar rápidamente el nuevo usuario
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.persist(nuevoUsuario);
            transaction.commit();
            
            // Si todo sale bien, recargamos el dashboard
            response.sendRedirect("dashboard.jsp");
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            response.sendRedirect("dashboard.jsp");
        }
    }
}