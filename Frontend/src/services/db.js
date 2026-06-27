import Dexie from 'dexie';

// Base de datos local del navegador (IndexedDB vía Dexie)
export const db = new Dexie('GestorViandasDB');

db.version(1).stores({
    viandas: 'id, nombre, precio',
    pedidos: 'id, cliente, finalizado',
});

db.version(2).stores({
    viandas: 'id, nombre, precio',
    pedidos: 'id, cliente, finalizado',
    clientes: 'id, nombre',
});

db.version(3).stores({
    // activa: 1 (activa hoy) | 0 (oculta) — indexado para filtros rápidos
    viandas: 'id, nombre, precio, activa',
    pedidos: 'id, cliente, finalizado',
    clientes: 'id, nombre',
}).upgrade(tx => {
    // Todas las viandas existentes se marcan como activas por defecto
    return tx.table('viandas').toCollection().modify(v => {
        if (v.activa === undefined) v.activa = 1;
    });
});

