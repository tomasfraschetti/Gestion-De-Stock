const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    cliente: { 
        type: String, 
        required: true 
    },
    total: { 
        type: Number, 
        required: true 
    },
    fecha: {
        type: Date,
        default: Date.now // Se establecerá el momento exacto en el que llega o se crea
    },
    items: [{
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true, default: 1 }
    }]
}, { timestamps: true }); // Mongoose además guarda 'createdAt' y 'updatedAt' automáticamente

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = { Pedido };
