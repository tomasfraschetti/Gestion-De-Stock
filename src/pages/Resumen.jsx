import { useContext, useState } from "react";
import { StockContext } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

function Resumen() {
    const { pedidos, setPedidos, viandasDisponibles } = useContext(StockContext);
    const navigate = useNavigate();

    const [editandoId, setEditandoId] = useState(null);
    const [pedidoEditado, setPedidoEditado] = useState({});

    // SOLO MOSTRAMOS LOS PENDIENTES
    const pedidosPendientes = pedidos.filter(p => !p.finalizado);

    const agruparPedidos = (lista) => {
        return lista.reduce((acc, p) => {
            if (!acc[p.cliente]) acc[p.cliente] = [];
            acc[p.cliente].push(p);
            return acc;
        }, {});
    };

    const agrupadosRetiro = agruparPedidos(pedidosPendientes.filter(p => p.entrega === "Retira"));
    const agrupadosEnvio = agruparPedidos(pedidosPendientes.filter(p => p.entrega === "Envío"));

    const finalizarPedidoIndividual = (id) => {
        setPedidos(pedidos.map(p => p.id === id ? { ...p, finalizado: true } : p));
    };

    const eliminarPedido = (id) => {
        if (window.confirm("¿Seguro de borrar?\nNo contará como venta.")) {
            setPedidos(pedidos.filter(p => p.id !== id));
        }
    };

    const habilitarEdicion = (pedido) => {
        setEditandoId(pedido.id);
        setPedidoEditado({ ...pedido });
    };

    const guardarCambios = () => {
        setPedidos(pedidos.map(p => p.id === editandoId ? pedidoEditado : p));
        setEditandoId(null);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setPedidoEditado(prev => ({
            ...prev,
            [name]: name === "cantidad" || name === "precio" ? Number(value) : value
        }));
    };

    const RenderItemLogistica = ({ cliente, items, color }) => (
        <div className="card" style={{ borderLeft: `5px solid ${color}`, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cliente}</h3>
                <span style={{ fontWeight: 'bold' }}>${items.reduce((s, i) => s + (i.cantidad * i.precio), 0).toFixed(0)}</span>
            </div>
            {items[0].domicilio && (
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {items[0].domicilio}</p>
            )}
            
            {items.map(p => (
                <div key={p.id} style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {editandoId === p.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                            <input className="input-edit" type="number" value={pedidoEditado.cantidad} onChange={(e) => setPedidoEditado({...pedidoEditado, cantidad: Number(e.target.value)})} style={{ width: '60px', background: 'var(--bg)' }} />
                            <button className="btn-small btn-save" onClick={guardarCambios}>✔️</button>
                        </div>
                    ) : (
                        <>
                            <div style={{ flex: 1 }}>{p.cantidad}x {p.vianda}</div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button className="btn-icon" style={{ color: color, background: 'rgba(255,255,255,0.05)' }} onClick={() => finalizarPedidoIndividual(p.id)}>✅</button>
                                <button className="btn-icon" onClick={() => habilitarEdicion(p)}>✏️</button>
                                <button className="btn-icon" onClick={() => eliminarPedido(p.id)}>🗑️</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="container">
            <header className="header">
                <h1>Pedidos</h1>
                
            </header>

            <main className="main-content">
                <h2 style={{ color: 'var(--success)', fontSize: '1.4rem', marginBottom: '1rem' }}> Retiros</h2>
                {Object.keys(agrupadosRetiro).length === 0 ? <p className="empty-msg">No hay retiros hoy.</p> : 
                    Object.keys(agrupadosRetiro).map(c => <RenderItemLogistica key={c} cliente={c} items={agrupadosRetiro[c]} color="var(--success)" />)
                }

                <h2 style={{ color: 'var(--warning)', fontSize: '1.4rem', marginTop: '3rem', marginBottom: '1rem' }}> Envíos</h2>
                {Object.keys(agrupadosEnvio).length === 0 ? <p className="empty-msg">No hay envíos hoy.</p> : 
                    Object.keys(agrupadosEnvio).map(c => <RenderItemLogistica key={c} cliente={c} items={agrupadosEnvio[c]} color="var(--warning)" />)
                }
            </main>
        </div>
    );
}

export default Resumen;
