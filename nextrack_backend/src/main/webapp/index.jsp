<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Nextrack - Iniciar Sesión</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .login-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 320px; }
            h2 { text-align: center; color: #333; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; color: #666; }
            input[type="text"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 10px; background-color: #007bff; border: none; color: white; border-radius: 4px; font-size: 16px; cursor: pointer; }
            button:hover { background-color: #0056b3; }
            .error-message { background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-bottom: 15px; text-align: center; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2>Nextrack Login</h2>
            
            <%-- Aquí se pintará el error si el Servlet nos rebota --%>
            <% if (request.getAttribute("mensajeErrorLogin") != null) { %>
                <div class="error-message">
                    <%= request.getAttribute("mensajeErrorLogin") %>
                </div>
            <% } %>

            <%-- El action apunta exactamente a nuestro Servlet controlador --%>
            <form action="LoginServlet" method="POST">
                <div class="form-group">
                    <label for="username">Usuario:</label>
                    <input type="text" id="username" name="username" required placeholder="Ej: admin">
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required placeholder="••••••••">
                </div>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    </body>
</html>