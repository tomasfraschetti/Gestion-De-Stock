const { Pedido } = require('./models');

// GET /api/pedidos
const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fecha: -1 }); // Los traemos ordenados por fecha (más recientes primero)
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// POST /api/pedidos/sincronizar (Recibe toda la tanda al final del día)
const sincronizarPedidos = async (req, res) => {
    try {
        // Mongoose guarda en la base de datos lo que venga (1 pedido o 50 pedidos juntos)
        const pedidosGuardados = await Pedido.create(req.body);
        res.status(201).json({ 
            mensaje: "Sincronización exitosa en MongoDB Atlas", 
            cantidad: Array.isArray(pedidosGuardados) ? pedidosGuardados.length : 1 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al sincronizar pedidos' });
    }
};

module.exports = {
    getPedidos,
    sincronizarPedidos
};
