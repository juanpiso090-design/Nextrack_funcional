<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="com.nextrack.model.Usuario"%>
<%@page import="com.nextrack.model.Producto"%>
<%@page import="com.nextrack.dao.ProductoDAO"%>
<%@page import="java.util.List"%>
<%
    // 1. Validación de seguridad
    if (session.getAttribute("usuarioLogueado") == null) {
        response.sendRedirect("index.jsp");
        return;
    }
    
    String nombreUsuario = (String) session.getAttribute("nombre");
    String rolUsuario = (String) session.getAttribute("rol");

    // 2. Instanciamos el DAO para obtener la lista de productos actualizada en cada recarga
    ProductoDAO prodDAO = new ProductoDAO();
    List<Producto> listaProductos = prodDAO.listarProductos();
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Nextrack - Panel de Control</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; background-color: #f4f6f9; color: #333; }
            .navbar { background-color: #2c3e50; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
            .navbar h1 { margin: 0; font-size: 24px; }
            .badge { background-color: #27ae60; color: white; padding: 5px 10px; border-radius: 4px; font-size: 14px; }
            .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            h2 { color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }
            .form-group { margin-bottom: 12px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            button { background-color: #3498db; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; }
            button:hover { background-color: #2980b9; }
            .btn-admin { background-color: #e67e22; }
            .btn-admin:hover { background-color: #d35400; }
            
            /* Estilos de la tabla de productos */
            .table-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; }
            th, td { padding: 12px; border-bottom: 1px solid #ddd; }
            th { background-color: #efefef; color: #333; }
            
            /* Estilos de Alertas */
            .alerta-normal { background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 13px; }
            .alerta-critica { background-color: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 13px; border: 1px solid #f5c6cb; animation: tilde 1.5s infinite; }
            .btn-logout {
            background-color: #c0392b;
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            margin-left: 15px;
            transition: background 0.2s;
        }
        .btn-logout:hover {
            background-color: #e74c3c;
        } 
        </style>
    </head>
    <body>
        
        <div class="navbar">
            <h1>Nextrack - Gestión de Inventario</h1>
            <div style="display: flex; align-items: center;">
                <div>
                    Bienvenido, <strong><%= nombreUsuario %></strong> | Rol: <span class="badge"><%= rolUsuario %></span>
                </div>
                <a href="LogoutServlet" class="btn-logout">Cerrar Sesión</a>
            </div>
        </div>

        <div class="container">
            
            <%-- SECCIÓN DE MOVIMIENTOS --%>
            <h2>Módulo de Movimientos (Operario / Administrador)</h2>
            <div class="grid">
                <div class="card">
                    <h3>Registrar Entrada / Salida de Stock</h3>
                    <form action="MovimientoServlet" method="POST">
                        <div class="form-group">
                            <label>ID del Producto:</label>
                            <input type="number" name="idProducto" required placeholder="Ej: 1">
                        </div>
                        <div class="form-group">
                            <label>Tipo de Movimiento:</label>
                            <select name="tipoMovimiento">
                                <option value="SUMA">Suma (Entrada de Stock)</option>
                                <option value="RESTA">Resta (Salida de Stock)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Cantidad:</label>
                            <input type="number" name="cantidad" min="1" required placeholder="Ej: 10">
                        </div>
                        <button type="submit">Aplicar Movimiento</button>
                    </form>
                </div>
            </div>

            <%-- SECCIÓN EXCLUSIVA PARA EL ADMINISTRADOR --%>
            <% if (rolUsuario != null && rolUsuario.equalsIgnoreCase("Administrador")) { %>
                <h2 style="margin-top: 40px; color: #d35400;">Módulo de Administración (Exclusivo Admin)</h2>
                <div class="grid">
                    
                    <div class="card">
                        <h3>Crear Nuevo Producto</h3>
                        <form action="ProductoServlet" method="POST">
                            <div class="form-group">
                                <label>Nombre del Producto:</label>
                                <input type="text" name="nombreProducto" required placeholder="Ej: Cable HDMI">
                            </div>
                            <div class="form-group">
                                <label>Descripción:</label>
                                <textarea name="descripcion" rows="2" placeholder="Detalles del producto..."></textarea>
                            </div>
                            <div class="row" style="display: flex; gap: 10px;">
                                <div class="form-group" style="flex: 1;">
                                    <label>Stock Inicial:</label>
                                    <input type="number" name="stockInicial" min="0" value="0">
                                </div>
                                <div class="form-group" style="flex: 1;">
                                    <label>Stock Mínimo:</label>
                                    <input type="number" name="stockMinimo" min="0" value="5"> </div>
                            </div>
                            <div class="form-group">
                                <label>Precio ($):</label>
                                <input type="number" step="0.01" name="precio" required placeholder="Ej: 15000">
                            </div>
                            <button type="submit" class="btn-admin">Guardar Producto</button>
                        </form>
                    </div>

                    <div class="card">
                        <h3>Registrar Nuevo Usuario del Sistema</h3>
                        <form action="RegistroUsuarioServlet" method="POST">
                            <div class="form-group">
                                <label>Nombre Completo:</label>
                                <input type="text" name="nombreCompleto" required placeholder="Ej: Carlos Pérez">
                            </div>
                            <div class="form-group">
                                <label>Nombre de Usuario (Username):</label>
                                <input type="text" name="username" required placeholder="Ej: carlosp">
                            </div>
                            <div class="form-group">
                                <label>Contraseña:</label>
                                <input type="password" name="password" required placeholder="••••••••">
                            </div>
                            <div class="form-group">
                                <label>Rol asignado:</label>
                                <select name="rol">
                                    <option value="Operario">Operario</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-admin">Crear Usuario</button>
                        </form>
                    </div>
                </div>
            <% } %>

            <%-- TABLA DE PRODUCTOS Y ALERTAS (COMPARTIDA PARA AMBOS ROLES) --%>
            <div class="table-container">
                <h2>Inventario General de Productos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            <th>Estado / Alerta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% if (listaProductos != null && !listaProductos.isEmpty()) { 
                            for (Producto p : listaProductos) { 
                        %>
                            <tr>
                                <td><strong><%= p.getIdProducto() %></strong></td>
                                <td><%= p.getNombreProducto() %></td>
                                <td><%= (p.getDescripcion() != null) ? p.getDescripcion() : "Sin descripción" %></td>
                                <td>$<%= p.getPrecio() %></td>
                                <td><%= p.getStock() %></td>
                                <td><%= p.getStockMinimo() %></td>
                                <td>
                                    <%-- 🚨 LÓGICA DE LA ALERTA: Si el stock es menor o igual al mínimo --%>
                                    <% if (p.getStock() <= p.getStockMinimo()) { %>
                                        <span class="alerta-critica">⚠️ ¡BAJO STOCK! Reordenar</span>
                                    <% } else { %>
                                        <span class="alerta-normal">✅ Abastecido</span>
                                    <% } %>
                                </td>
                            </tr>
                        <%  } 
                           } else { %>
                            <tr>
                                <td colspan="7" style="text-align: center; color: #999;">No hay productos registrados en el inventario actualmente.</td>
                            </tr>
                        <% } %>
                    </tbody>
                </table>
            </div>

        </div>
    </body>
</html>