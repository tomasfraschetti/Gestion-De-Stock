import { useState, useEffect, useRef } from "react";
import { useStock } from "../context/StockContext";
import { toast } from "react-toastify";
import {
    UserRound,
    MapPin,
    Store,
    Bike,
    UtensilsCrossed,
    Plus,
    Minus,
    ShoppingCart,
    CheckCircle2,
} from "lucide-react";

function StockManager() {
    const { viandasDisponibles, agregarPedidos, clientes, guardarCliente } = useStock();

    const [cliente,   setCliente]   = useState("");
    const [viandaId,  setViandaId]  = useState("");
    const [cantidad,  setCantidad]  = useState(1);
    const [precio,    setPrecio]    = useState("");
    const [entrega,   setEntrega]   = useState("Retira");
    const [domicilio, setDomicilio] = useState("");
    const [items,     setItems]     = useState([]);

    // Autocompletado
    const [sugerencias,        setSugerencias]        = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const inputRef      = useRef(null);
    const contenedorRef = useRef(null);

    // Filtra clientes al escribir
    useEffect(() => {
        const texto = cliente.trim().toLowerCase();
        if (texto.length < 1 || !clientes) { setSugerencias([]); return; }
        const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(texto));
        setSugerencias(filtrados);
        setMostrarSugerencias(filtrados.length > 0);
    }, [cliente, clientes]);

    // Cierra dropdown al click fuera
    useEffect(() => {
        const fn = e => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target))
                setMostrarSugerencias(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const seleccionarCliente = c => {
        setCliente(c.nombre);
        if (c.domicilio) { setDomicilio(c.domicilio); setEntrega("Envío"); }
        setMostrarSugerencias(false);
    };

    // Autocompleta precio al elegir vianda
    useEffect(() => {
        const v = viandasDisponibles.find(v => v.id === Number(viandaId));
        if (v) setPrecio(v.precio);
    }, [viandaId, viandasDisponibles]);

    const agregarItem = () => {
        if (!viandaId || !cantidad || !precio) { toast.warn("Completa los datos de la vianda"); return; }
        const vObj = viandasDisponibles.find(v => v.id === Number(viandaId));
        setItems(prev => [...prev, {
            id: Date.now() + Math.random(),
            vianda: vObj.nombre,
            cantidad: Number(cantidad),
            precio: Number(precio),
            subtotal: Number(cantidad) * Number(precio)
        }]);
        setViandaId(""); setCantidad(1); setPrecio("");
    };

    const finalizar = async (e) => {
        e.preventDefault();
        if (!cliente)                          { toast.warn("Falta el nombre del cliente"); return; }
        if (entrega === "Envío" && !domicilio) { toast.warn("Falta el domicilio"); return; }

        let pedidosAGuardar = [];
        if (items.length === 0 && viandaId) {
            const vObj = viandasDisponibles.find(v => v.id === Number(viandaId));
            pedidosAGuardar = [{ id: Date.now(), cliente, vianda: vObj.nombre, cantidad, precio, entrega, domicilio: entrega === "Envío" ? domicilio : "", fecha: new Date().toLocaleDateString() }];
        } else if (items.length > 0) {
            pedidosAGuardar = items.map(item => ({ ...item, cliente, entrega, domicilio: entrega === "Envío" ? domicilio : "", fecha: new Date().toLocaleDateString() }));
        } else {
            toast.warn("Agrega al menos una vianda");
            return;
        }

        await agregarPedidos(pedidosAGuardar);
        await guardarCliente(cliente, entrega === "Envío" ? domicilio : "");
        setCliente(""); setItems([]); setViandaId(""); setPrecio(""); setEntrega("Retira"); setDomicilio("");
        toast.success("¡Pedido guardado!");
    };

    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);

    return (
        <main className="page">
            <header className="page-header">
                <h1>Julia Retamal</h1>
                <p className="subtitle">Anotar Pedido</p>
                <div className="chess-line" />
            </header>

            {/* CLIENTE */}
            <section className="card">
                <h2 className="card__title" style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <UserRound size={18} color="var(--clr-primary)" strokeWidth={1.8} />
                    Cliente
                </h2>

                <div className="field" ref={contenedorRef} style={{ position: "relative" }}>
                    <label htmlFor="clienteInput">Nombre</label>
                    <input
                        id="clienteInput"
                        ref={inputRef}
                        type="text"
                        value={cliente}
                        onChange={e => { setCliente(e.target.value); setMostrarSugerencias(true); }}
                        onFocus={() => cliente.length > 0 && setMostrarSugerencias(true)}
                        placeholder="Ej. María García"
                        autoComplete="off"
                    />
                    {mostrarSugerencias && sugerencias.length > 0 && (
                        <ul style={{
                            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                            background: "var(--clr-surface)", border: "1px solid var(--clr-border)",
                            borderRadius: "var(--radius-card)", marginTop: "4px", padding: "var(--space-xs)",
                            listStyle: "none", boxShadow: "0 8px 24px rgba(27,59,43,0.18)",
                            maxHeight: "220px", overflowY: "auto",
                        }}>
                            {sugerencias.map(c => (
                                <li
                                    key={c.id}
                                    onMouseDown={() => seleccionarCliente(c)}
                                    onTouchStart={() => seleccionarCliente(c)}
                                    style={{
                                        padding: "var(--space-sm) var(--space-md)", cursor: "pointer",
                                        borderRadius: "10px", display: "flex", flexDirection: "column",
                                        gap: "2px", transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--clr-primary-tint)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <span style={{ fontWeight: 600, color: "var(--clr-text)", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <UserRound size={14} color="var(--clr-primary)" strokeWidth={2} />
                                        {c.nombre}
                                    </span>
                                    {c.domicilio && (
                                        <span style={{ fontSize: "0.8rem", color: "var(--clr-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <MapPin size={12} color="var(--clr-muted)" strokeWidth={2} />
                                            {c.domicilio}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Entrega */}
                <div className="field">
                    <label>Entrega</label>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        {["Retira", "Envío"].map(op => (
                            <label key={op} style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                gap: "var(--space-sm)", height: "48px", border: "1px solid",
                                borderColor: entrega === op ? "var(--clr-primary)" : "var(--clr-border)",
                                borderRadius: "var(--radius-input)", cursor: "pointer",
                                background: entrega === op ? "var(--clr-primary-tint)" : "transparent",
                                fontWeight: entrega === op ? 700 : 400,
                                color: entrega === op ? "var(--clr-primary)" : "var(--clr-muted)",
                                transition: "all 0.15s",
                            }}>
                                <input type="radio" value={op} checked={entrega === op}
                                    onChange={e => setEntrega(e.target.value)} style={{ display: "none" }} />
                                {op === "Retira"
                                    ? <><Store size={16} color="currentColor" strokeWidth={1.8} /> Retira</>
                                    : <><Bike  size={16} color="currentColor" strokeWidth={1.8} /> Envío</>
                                }
                            </label>
                        ))}
                    </div>
                </div>

                {entrega === "Envío" && (
                    <div className="field">
                        <label htmlFor="domicilioInput">Dirección</label>
                        <input
                            id="domicilioInput"
                            type="text"
                            value={domicilio}
                            onChange={e => setDomicilio(e.target.value)}
                            placeholder="Ej. Calle 123"
                        />
                    </div>
                )}
            </section>

            {/* VIANDAS */}
            <section className="card">
                <h2 className="card__title" style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <UtensilsCrossed size={18} color="var(--clr-primary)" strokeWidth={1.8} />
                    ¿Qué lleva?
                </h2>

                <div className="field">
                    <label>Vianda y cantidad</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        {/* Selector — solo nombre */}
                        <select
                            id="viandaSelect"
                            value={viandaId}
                            onChange={e => setViandaId(e.target.value)}
                            style={{ flex: 1 }}
                        >
                            <option value="">— Seleccionar —</option>
                            {viandasDisponibles.map(v => (
                                <option key={v.id} value={v.id}>{v.nombre}</option>
                            ))}
                        </select>

                        {/* Controles cantidad */}
                        <div className="qty-control">
                            <button
                                type="button"
                                className="qty-control__btn"
                                onClick={() => setCantidad(c => Math.max(1, Number(c) - 1))}
                                aria-label="Reducir cantidad"
                            >
                                <Minus size={14} color="currentColor" strokeWidth={2.5} />
                            </button>
                            <span className="qty-control__num">{cantidad}</span>
                            <button
                                type="button"
                                className="qty-control__btn"
                                onClick={() => setCantidad(c => Number(c) + 1)}
                                aria-label="Aumentar cantidad"
                            >
                                <Plus size={14} color="currentColor" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn--ghost" onClick={agregarItem}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)" }}>
                    <Plus size={16} color="currentColor" strokeWidth={2.2} />
                    Agregar vianda
                </button>
            </section>

            {/* DETALLE */}
            {items.length > 0 && (
                <section className="card">
                    <h2 className="card__title" style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <ShoppingCart size={18} color="var(--clr-primary)" strokeWidth={1.8} />
                        Detalle
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                        {items.map(item => (
                            <div key={item.id} style={{
                                display: "flex", justifyContent: "space-between",
                                fontSize: "0.9rem", padding: "var(--space-xs) 0"
                            }}>
                                <span><strong>{item.cantidad}x</strong> {item.vianda}</span>
                                <span style={{ color: "var(--clr-primary)", fontWeight: 700 }}>${item.subtotal}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderTop: "1px solid var(--clr-border)", paddingTop: "var(--space-sm)",
                        marginTop: "var(--space-sm)", fontWeight: 700, fontSize: "1.1rem"
                    }}>
                        <span>Total</span>
                        <span style={{ color: "var(--clr-primary)" }}>${subtotal}</span>
                    </div>
                </section>
            )}

            <button className="btn btn--primary" onClick={finalizar}
                style={{ fontSize: "1.1rem", letterSpacing: "0.03em", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)" }}>
                <CheckCircle2 size={20} color="currentColor" strokeWidth={2} />
                Finalizar Pedido
            </button>
        </main>
    );
}

export default StockManager;
