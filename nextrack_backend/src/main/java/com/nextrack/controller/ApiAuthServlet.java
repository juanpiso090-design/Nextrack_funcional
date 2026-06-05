package com.nextrack.controller;

import com.nextrack.dao.UsuarioDAO;
import com.nextrack.model.Usuario;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/nextrack/auth/login")
public class ApiAuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private UsuarioDAO usuarioDAO;

    @Override
    public void init() throws ServletException {
        usuarioDAO = new UsuarioDAO();
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null && origin.startsWith("https://nextrack-funcional.vercel.app")) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null && origin.startsWith("https://nextrack-funcional.vercel.app")) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }
        response.setContentType("application/json;charset=UTF-8");

        // Leer body (esperamos JSON simple: {"usuario":"...","password":"..."})
        String body;
        try (BufferedReader reader = request.getReader()) {
            body = reader.lines().collect(Collectors.joining());
        }

        // Parseo muy básico sin dependencias externas
        String usuario = null;
        String password = null;
        if (body != null) {
            // busca "usuario":"..."
            int i = body.indexOf("\"usuario\"");
            if (i >= 0) {
                int colon = body.indexOf(':', i);
                if (colon >= 0) {
                    int start = body.indexOf('"', colon);
                    if (start >= 0) {
                        int end = body.indexOf('"', start + 1);
                        if (end > start) usuario = body.substring(start + 1, end);
                    }
                }
            }
            int j = body.indexOf("\"password\"");
            if (j >= 0) {
                int colon = body.indexOf(':', j);
                if (colon >= 0) {
                    int start = body.indexOf('"', colon);
                    if (start >= 0) {
                        int end = body.indexOf('"', start + 1);
                        if (end > start) password = body.substring(start + 1, end);
                    }
                }
            }
        }

        if (usuario == null || password == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Petición inválida\"}");
            return;
        }

        try {
            Usuario u = usuarioDAO.validarUsuario(usuario);
            if (u != null && u.getPassword() != null && u.getPassword().equals(password)) {
                HttpSession session = request.getSession();
                session.setAttribute("usuarioLogueado", u);
                session.setAttribute("nombre", u.getNombreCompleto());
                session.setAttribute("rol", u.getRol());

                String json = String.format("{\"usuario\":\"%s\",\"rol\":\"%s\",\"nombre\":\"%s\"}",
                        escapeJson(u.getUsername()), escapeJson(u.getRol()), escapeJson(u.getNombreCompleto()));
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(json);
                return;
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Usuario o contraseña incorrectos\"}");
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Error en el servidor\"}");
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
