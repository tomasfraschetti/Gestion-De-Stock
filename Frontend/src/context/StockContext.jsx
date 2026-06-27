import { createContext, useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
    // useLiveQuery se re-ejecuta automáticamente cada vez que Dexie cambia → sin useState manual
    const todasLasViandas = useLiveQuery(() => db.viandas.orderBy('nombre').toArray(), [], []);
    const viandasDisponibles = useLiveQuery(() => db.viandas.where('activa').equals(1).toArray(), [], []);
    const pedidos = useLiveQuery(() => db.pedidos.toArray(), [], []);
    const clientes = useLiveQuery(() => db.clientes.orderBy('nombre').toArray(), [], []);

    // ── Viandas ──────────────────────────────────────────────────────────────
    const setviandasDisponibles = async (nuevasViandas) => {
        // Reemplaza la tabla completa (para compatibilidad con el código existente)
        await db.viandas.clear();
        if (nuevasViandas.length > 0) {
            await db.viandas.bulkAdd(nuevasViandas);
        }
    };

    const agregarVianda = async (vianda) => {
        await db.viandas.add({ ...vianda, activa: 1 });
    };

    const toggleVianda = async (id, activaActual) => {
        await db.viandas.update(id, { activa: activaActual ? 0 : 1 });
    };

    const eliminarVianda = async (id) => {
        await db.viandas.delete(id);
    };

    const editarVianda = async (id, campo, valor) => {
        await db.viandas.update(id, {
            [campo]: campo === 'precio' ? Number(valor) : valor
        });
    };

    // ── Pedidos ───────────────────────────────────────────────────────────────
    const setPedidos = async (updater) => {
        // Soporta tanto setPedidos([]) como setPedidos(prev => [...prev, ...nuevos])
        const actuales = await db.pedidos.toArray();
        const nuevos = typeof updater === 'function' ? updater(actuales) : updater;
        await db.pedidos.clear();
        if (nuevos.length > 0) {
            await db.pedidos.bulkAdd(nuevos);
        }
    };

    const agregarPedidos = async (nuevosPedidos) => {
        await db.pedidos.bulkAdd(nuevosPedidos);
    };

    const marcarFinalizado = async (id, valor) => {
        await db.pedidos.update(id, { finalizado: valor });
    };

    const limpiarJornada = async () => {
        await db.pedidos.clear();
    };

    // ── Clientes ──────────────────────────────────────────────────────────────
    // Upsert: guarda nuevo cliente o actualiza su domicilio si ya existe
    const guardarCliente = async (nombre, domicilio = '') => {
        const nombreTrim = nombre.trim();
        if (!nombreTrim) return;
        const id = nombreTrim.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
        await db.clientes.put({ id, nombre: nombreTrim, domicilio });
    };

    return (
        <StockContext.Provider value={{
            // Estado (reactivo desde IndexedDB)
            todasLasViandas,
            viandasDisponibles,
            pedidos,
            clientes,
            // Viandas
            setviandasDisponibles,
            agregarVianda,
            eliminarVianda,
            editarVianda,
            toggleVianda,
            // Pedidos
            setPedidos,
            agregarPedidos,
            marcarFinalizado,
            limpiarJornada,
            // Clientes
            guardarCliente,
        }}>
            {children}
        </StockContext.Provider>
    );
};

// Hook de conveniencia
export const useStock = () => useContext(StockContext);
