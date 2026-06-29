import { useContext, useState, useEffect } from "react";
import { StockContext } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

function StockManager() {
    const { viandasDisponibles, setPedidos } = useContext(StockContext);
    const navigate = useNavigate();

    const [cliente, setCliente] = useState("");
    const [viandaId, setViandaId] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState("");
    const [entrega, setEntrega] = useState("Retira");
    const [domicilio, setDomicilio] = useState("");

    const [itemsActuales, setItemsActuales] = useState([]);

    useEffect(() => {
        const vianda = viandasDisponibles.find(v => v.id === Number(viandaId));
        if (vianda) setPrecio(vianda.precio);
    }, [viandaId, viandasDisponibles]);

    const agregarItemALista = () => {
        if (!viandaId || !cantidad || !precio) {
            alert("Completa los datos de la vianda");
            return;
        }
        const viandaObj = viandasDisponibles.find(v => v.id === Number(viandaId));
        const nuevoItem = {
            id: Date.now() + Math.random(),
            vianda: viandaObj.nombre,
            cantidad: Number(cantidad),
            precio: Number(precio),
            subtotal: Number(cantidad) * Number(precio)
        };
        setItemsActuales([...itemsActuales, nuevoItem]);
        setViandaId("");
        setCantidad(1);
        setPrecio("");
    };

    const finalizarPedidoCompleto = (e) => {
        e.preventDefault();
        
        if (!cliente) return alert("Falta el nombre del cliente");
        if (entrega === "Envío" && !domicilio) return alert("Falta el domicilio");

        let pedidosAGuardar = [];
        if (itemsActuales.length === 0 && viandaId) {
            const viandaObj = viandasDisponibles.find(v => v.id === Number(viandaId));
            pedidosAGuardar = [{
                id: Date.now(),
                cliente,
                vianda: viandaObj.nombre,
                cantidad,
                precio,
                entrega,
                domicilio: entrega === "Envío" ? domicilio : "",
                fecha: new Date().toLocaleDateString()
            }];
        } else if (itemsActuales.length > 0) {
            pedidosAGuardar = itemsActuales.map(item => ({
                ...item,
                cliente,
                entrega,
                domicilio: entrega === "Envío" ? domicilio : "",
                fecha: new Date().toLocaleDateString()
            }));
        } else {
            return alert("Agrega al menos una vianda");
        }

        setPedidos(prev => [...prev, ...pedidosAGuardar]);
        setCliente("");
        setItemsActuales([]);
        setViandaId("");
        setPrecio("");
        setEntrega("Retira");
        setDomicilio("");
        alert("¡Pedido guardado!");
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Nuevo Pedido</h1>
            </header>

            <main className="main-content">
                <div className="card">
                    <h2 className="card-title"> Agendar pedido:</h2>
                    <div className="input-field">
                        <label>Nombre Del Cliente</label>
                        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} disabled={itemsActuales.length > 0} />
                    </div>

                    <div className="input-field">
                        <label>Método de Entrega</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input type="radio" value="Retira" checked={entrega === "Retira"} onChange={(e) => setEntrega(e.target.value)} /> Retira en local
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input type="radio" value="Envío" checked={entrega === "Envío"} onChange={(e) => setEntrega(e.target.value)} /> Envío a domicilio
                            </label>
                        </div>
                    </div>

                    {entrega === "Envío" && (
                        <div className="input-field" style={{ marginTop: '1rem' }}>
                            <label>📍 Dirección</label>
                            <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} placeholder="Ej. Calle 123" />
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="card-title"> ¿Qué lleva?</h2>
                    <div className="input-field">
                        <select value={viandaId} onChange={(e) => setViandaId(e.target.value)}>
                            <option value="">-- Seleccionar --</option>
                            {viandasDisponibles.map((v) => (
                                <option key={v.id} value={v.id}>{v.nombre} (${v.precio})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-field" style={{ flex: 1 }}>
                            <label>Cant.</label>
                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
                        </div>
                        
                    </div>

                    <button type="button" className="btn-full" onClick={agregarItemALista} style={{ background: 'var(--primary)', color: 'white' }}>
                        ➕ Agregar Vianda
                    </button>
                </div>

                {itemsActuales.length > 0 && (
                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
                        <h2 className="card-title">🛒 Detalle Actual</h2>
                        {itemsActuales.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span><strong>{item.cantidad}x</strong> {item.vianda}</span>
                                <span>${item.subtotal}</span>
                            </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            Subtotal: ${itemsActuales.reduce((acc, curr) => acc + curr.subtotal, 0)}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <button className="btn-primary btn-add" onClick={finalizarPedidoCompleto} style={{ height: '60px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                        ✅ FINALIZAR PEDIDO
                    </button>
                </div>
            </main>
        </div>
    );
}

export default StockManager;
