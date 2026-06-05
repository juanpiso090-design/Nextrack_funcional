import express from 'express';
import cors from 'cors'; // Importación de la librería de seguridad

const app = express();

// Configuración de CORS para permitir la integración con el Frontend de React
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://nextrack-funcional.vercel.app',
            'https://nextrack-funcional.vercel.app/'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Nextrack backend is running');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Base de datos simulada en memoria (Capa de persistencia temporal)
let usuarios = [
    { id: 1, usuario: "juan_admin", password: "123", rol: "Administrador" },
    { id: 2, usuario: "pedro_operario", password: "456", rol: "Operario" }
];

let productos = [
    { id: 101, codigo: "PROD01", nombre: "Disco Duro SSD 1TB", stock: 15, stock_minimo: 5 },
    { id: 102, codigo: "PROD02", nombre: "Memoria RAM 16GB", stock: 3, stock_minimo: 8 }
];

let movimientos = [];

// Endpoint: Login
app.post('/api/nextrack/auth/login', (req, res) => {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
        return res.status(400).json({ error: "Campos obligatorios faltantes." });
    }
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);
    if (usuarioEncontrado) {
        return res.status(200).json({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol });
    }
    return res.status(401).json({ error: "Credenciales inválidas." });
});

// Endpoint: Obtener inventario
app.get('/api/nextrack/productos', (req, res) => {
    res.status(200).json(productos);
});

// Endpoint: Crear usuario
app.post('/api/nextrack/usuarios', (req, res) => {
    const { nombreCompleto, usuario, password, rol } = req.body;
    if (!nombreCompleto || !usuario || !password || !rol) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const existeUsuario = usuarios.some((u) => u.usuario === usuario);
    if (existeUsuario) {
        return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
    }

    const nuevoUsuario = {
        id: usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
        usuario,
        password,
        rol,
        nombreCompleto,
    };
    usuarios.push(nuevoUsuario);

    return res.status(201).json({ mensaje: 'Usuario creado correctamente.', usuario: nuevoUsuario });
});

// Endpoint: Procesar Movimiento de Almacén con Regla de Negocio
app.post('/api/nextrack/movimientos', (req, res) => {
    const { codigoProducto, tipo, cantidad, usuarioResponsable } = req.body;
    
    const producto = productos.find(p => p.codigo === codigoProducto);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado." });

    if (tipo.toUpperCase() === "SALIDA" && producto.stock - cantidad < 0) {
        return res.status(400).json({ error: "Existencias insuficientes. El stock no puede ser negativo." });
    }

    if (tipo.toUpperCase() === "ENTRADA") {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    const nuevoMovimiento = { id_movimiento: Date.now(), codigoProducto, tipo, cantidad, usuarioResponsable };
    movimientos.push(nuevoMovimiento);

    res.status(201).json({ mensaje: "Movimiento procesado", stockActualizado: producto.stock });
});

// ==========================================
// 🧪 PRUEBAS UNITARIAS AUTOMATIZADAS (Requerimiento de Guía)
// ==========================================
// Función lógica aislada para probar unitariamente la regla de negocio del stock
export function calcularNuevoStock(stockActual, cantidad, tipo) {
    if (tipo === "ENTRADA") return stockActual + cantidad;
    if (tipo === "SALIDA") {
        if (stockActual - cantidad < 0) throw new Error("Stock negativo");
        return stockActual - cantidad;
    }
    return stockActual;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend de Nextrack integrado en puerto ${PORT}`);
});