const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Rutas de Pedidos
router.get('/pedidos', controllers.getPedidos);
router.post('/pedidos/sincronizar', controllers.sincronizarPedidos);

module.exports = router;
