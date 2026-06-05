import express from 'express';

const app = express();
app.use(express.json()); // Habilitar lectura de JSON en el body

// ==========================================
// 🛠️ BASE DE DATOS SIMULADA EN MEMORIA (ESTRUCTURA DE NEXTRACK)
// ==========================================
let usuarios = [
    { id: 1, usuario: "juan_admin", password: "123", rol: "Administrador" },
    { id: 2, usuario: "pedro_operario", password: "456", rol: "Operario" }
];

let productos = [
    { id: 101, codigo: "PROD01", nombre: "Disco Duro SSD 1TB", stock: 15, stock_minimo: 5 },
    { id: 102, codigo: "PROD02", nombre: "Memoria RAM 16GB", stock: 3, stock_minimo: 8 } // Generará alerta visual
];

let movimientos = [];

// ==========================================
// 🔐 SERVICIO 1: AUTENTICACIÓN (LOGIN)
// ==========================================
app.post('/api/nextrack/auth/login', (req, res) => {
    const { usuario, password } = req.body;

    // Validaciones de datos obligatorios
    if (!usuario || !password) {
        return res.status(400).json({ error: "El usuario y la contraseña son campos obligatorios." });
    }

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

    if (usuarioEncontrado) {
        return res.status(200).json({
            mensaje: "Autenticación satisfactoria",
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol
        });
    } else {
        return res.status(401).json({ error: "Error en la autenticación. Credenciales inválidas." });
    }
});

// ==========================================
// 📦 SERVICIO 2: GESTIÓN DE PRODUCTOS (SOLO ADMINISTRADOR)
// ==========================================
app.get('/api/nextrack/productos', (req, res) => {
    // Retorna la lista agregando la alerta condicional de stock de forma dinámica
    const productosConAlerta = productos.map(p => ({
        ...p,
        alerta_stock: p.stock <= p.stock_minimo ? "⚠️ ALERTA: STOCK MÍNIMO SUPERADO" : "✅ OK"
    }));
    res.status(200).json(productosConAlerta);
});

app.post('/api/nextrack/productos', (req, res) => {
    const { codigo, nombre, stock, stock_minimo, rolUsuario } = req.body;

    // Validación de Control de Acceso por Rol
    if (rolUsuario !== "Administrador") {
        return res.status(403).json({ error: "Acceso denegado. Solo el Administrador puede registrar productos." });
    }

    // Validaciones estrictas de datos (Formatos, campos y longitudes)
    if (!codigo || !nombre || stock === undefined || stock_minimo === undefined) {
        return res.status(400).json({ error: "Todos los campos del producto son obligatorios." });
    }
    if (typeof stock !== 'number' || typeof stock_minimo !== 'number' || stock < 0 || stock_minimo < 0) {
        return res.status(400).json({ error: "Los valores de stock deben ser números positivos." });
    }
    if (codigo.trim().length < 4) {
        return res.status(400).json({ error: "El código del producto debe tener al menos 4 caracteres." });
    }

    // Verificar si el código ya existe
    if (productos.some(p => p.codigo === codigo)) {
        return res.status(400).json({ error: "El código de producto ya está registrado." });
    }

    const nuevoProducto = { id: Date.now(), codigo, nombre, stock, stock_minimo };
    productos.push(nuevoProducto);

    res.status(201).json({
        mensaje: "Producto registrado exitosamente en Nextrack.",
        producto: nuevoProducto
    });
});

// ==========================================
// 🔄 SERVICIO 3: REGISTRO DE MOVIMIENTOS (ADMINISTRADOR Y OPERARIO)
// ==========================================
app.post('/api/nextrack/movimientos', (req, res) => {
    const { codigoProducto, tipo, cantidad, usuarioResponsable } = req.body;

    // Validaciones de datos de entrada
    if (!codigoProducto || !tipo || !cantidad || !usuarioResponsable) {
        return res.status(400).json({ error: "Todos los campos del movimiento son requeridos." });
    }
    if (!["ENTRADA", "SALIDA"].includes(tipo.toUpperCase())) {
        return res.status(400).json({ error: "El tipo de movimiento debe ser obligatoriamente ENTRADA o SALIDA." });
    }
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad del movimiento debe ser un número entero mayor a cero." });
    }

    // Buscar el producto en el inventario
    const producto = productos.find(p => p.codigo === codigoProducto);
    if (!producto) {
        return res.status(404).json({ error: "El producto especificado no existe en el inventario." });
    }

    // Lógica de negocio condicional: Validar que el stock nunca sea menor a 0
    if (tipo.toUpperCase() === "SALIDA" && producto.stock - cantidad < 0) {
        return res.status(400).json({
            error: "Operación rechazada. Existencias insuficientes. El stock no puede ser negativo.",
            stockActual: producto.stock,
            cantidadSolicitada: cantidad
        });
    }

    // Aplicar la transacción en el inventario
    if (tipo.toUpperCase() === "ENTRADA") {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    // Registrar el log del movimiento con fecha automática
    const nuevoMovimiento = {
        id_movimiento: Date.now(),
        codigoProducto,
        tipo: tipo.toUpperCase(),
        cantidad,
        fecha: new Date().toISOString(),
        usuarioResponsable
    };
    movimientos.push(nuevoMovimiento);

    res.status(201).json({
        mensaje: `Movimiento de ${tipo} procesado correctamente.`,
        stockActualizado: producto.stock,
        alerta: producto.stock <= producto.stock_minimo ? "⚠️ Alerta: Stock por debajo del límite mínimo." : "Aceptable",
        detalle: nuevoMovimiento
    });
});

// Arranque del Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API REST de Nextrack operativa en http://localhost:${PORT}`);
});