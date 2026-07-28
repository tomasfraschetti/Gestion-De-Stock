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

    const [sugerencias,        setSugerencias]        = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const inputRef      = useRef(null);
    const contenedorRef = useRef(null);

    useEffect(() => {
        const texto = cliente.trim().toLowerCase();
        if (texto.length < 1 || !clientes) { setSugerencias([]); return; }
        const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(texto));
        setSugerencias(filtrados);
        setMostrarSugerencias(filtrados.length > 0);
    }, [cliente, clientes]);

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
            subtotal: Number(cantidad) * Number(precio),
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

    /* ── Clases reutilizables ─────────────────────────────── */
    const inputCls = "bg-stone-50 border border-stone-200 rounded-xl text-gray-900 px-4 h-[52px] font-sans text-base w-full outline-none focus:border-green-900 focus:ring-2 focus:ring-green-900/10 transition-shadow";
    const labelCls = "text-[0.8rem] font-semibold uppercase tracking-widest text-gray-500";
    const fieldCls = "flex flex-col gap-1 mb-4";

    return (
        <main className="flex flex-col gap-4 px-4 pt-4 pb-24 lg:pb-8">
            <header className="flex flex-col items-center gap-1 py-6">
                <h1 className="font-serif text-4xl text-green-900 leading-tight">Julia Retamal</h1>
                <p className="text-gray-500 text-[0.85rem]">Anotar Pedido</p>
                <div className="chess-line w-full mt-1" />
            </header>

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
            <div className="flex flex-col gap-4">
            {/* ── CLIENTE ───────────────────────────────────── */}
            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-green-900 mb-4">
                    <UserRound size={18} color="currentColor" strokeWidth={1.8} />
                    Cliente
                </h2>

                <div className={fieldCls} ref={contenedorRef}>
                    <label htmlFor="clienteInput" className={labelCls}>Nombre</label>
                    <div className="relative">
                        <input
                            id="clienteInput"
                            ref={inputRef}
                            type="text"
                            value={cliente}
                            onChange={e => { setCliente(e.target.value.toUpperCase()); setMostrarSugerencias(true); }}
                            onFocus={() => cliente.length > 0 && setMostrarSugerencias(true)}
                            placeholder="Ej. María García"
                            autoComplete="off"
                            className={inputCls}
                        />
                        {mostrarSugerencias && sugerencias.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 z-[100] bg-white border border-stone-200 rounded-2xl mt-1 p-1 list-none shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto">
                                {sugerencias.map(c => (
                                    <li
                                        key={c.id}
                                        onMouseDown={() => seleccionarCliente(c)}
                                        onTouchStart={() => seleccionarCliente(c)}
                                        className="flex flex-col gap-0.5 px-4 py-2 rounded-xl cursor-pointer transition-colors hover:bg-green-900/[0.06]"
                                    >
                                        <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                                            <UserRound size={14} color="#14532d" strokeWidth={2} />
                                            {c.nombre}
                                        </span>
                                        {c.domicilio && (
                                            <span className="text-[0.8rem] text-gray-500 flex items-center gap-1">
                                                <MapPin size={12} color="currentColor" strokeWidth={2} />
                                                {c.domicilio}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Tipo de entrega */}
                <div className={fieldCls}>
                    <label className={labelCls}>Entrega</label>
                    <div className="flex gap-2">
                        {["Retira", "Envío"].map(op => (
                            <label
                                key={op}
                                className={`flex-1 flex items-center justify-center gap-2 h-12 border rounded-xl cursor-pointer font-sans transition-all text-base
                                    ${entrega === op
                                        ? "border-green-900 bg-green-900/[0.08] font-bold text-green-900"
                                        : "border-stone-200 bg-transparent font-normal text-gray-500"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    value={op}
                                    checked={entrega === op}
                                    onChange={e => setEntrega(e.target.value)}
                                    className="hidden"
                                />
                                {op === "Retira"
                                    ? <><Store size={16} color="currentColor" strokeWidth={1.8} /> Retira</>
                                    : <><Bike  size={16} color="currentColor" strokeWidth={1.8} /> Envío</>
                                }
                            </label>
                        ))}
                    </div>
                </div>

                {entrega === "Envío" && (
                    <div className={fieldCls}>
                        <label htmlFor="domicilioInput" className={labelCls}>Dirección</label>
                        <input
                            id="domicilioInput"
                            type="text"
                            value={domicilio}
                            onChange={e => setDomicilio(e.target.value.toUpperCase())}
                            placeholder="Ej. Calle 123"
                            className={inputCls}
                        />
                    </div>
                )}
            </section>

            {/* ── VIANDAS ───────────────────────────────────── */}
            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-green-900 mb-4">
                    <UtensilsCrossed size={18} color="currentColor" strokeWidth={1.8} />
                    ¿Qué lleva?
                </h2>

                <div className={fieldCls}>
                    <label className={labelCls}>Vianda y cantidad</label>
                    <div className="flex items-center gap-2">
                        <select
                            id="viandaSelect"
                            value={viandaId}
                            onChange={e => setViandaId(e.target.value)}
                            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl text-gray-900 px-4 h-[52px] font-sans text-base outline-none focus:border-green-900 focus:ring-2 focus:ring-green-900/10 transition-shadow"
                        >
                            <option value="">— Seleccionar —</option>
                            {viandasDisponibles.map(v => (
                                <option key={v.id} value={v.id}>{v.nombre}</option>
                            ))}
                        </select>

                        {/* Stepper cantidad */}
                        <div className="flex items-center gap-0.5 bg-stone-50 border border-stone-200 rounded-xl h-[52px] px-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => setCantidad(c => Math.max(1, Number(c) - 1))}
                                aria-label="Reducir cantidad"
                                className="flex items-center justify-center w-[34px] h-[34px] rounded-lg bg-transparent border-none cursor-pointer text-green-900 hover:bg-green-900/[0.08] transition-colors"
                            >
                                <Minus size={14} color="currentColor" strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[28px] text-center font-bold text-base text-gray-900 select-none">
                                {cantidad}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCantidad(c => Number(c) + 1)}
                                aria-label="Aumentar cantidad"
                                className="flex items-center justify-center w-[34px] h-[34px] rounded-lg bg-transparent border-none cursor-pointer text-green-900 hover:bg-green-900/[0.08] transition-colors"
                            >
                                <Plus size={14} color="currentColor" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={agregarItem}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-transparent border border-stone-200 text-gray-900 font-semibold text-base cursor-pointer transition-colors hover:bg-stone-100"
                >
                    <Plus size={16} color="currentColor" strokeWidth={2.2} />
                    Agregar vianda
                </button>
            </section>
            </div>

            <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            {/* ── DETALLE ───────────────────────────────────── */}
            {items.length > 0 && (
                <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
                    <h2 className="flex items-center gap-2 text-base font-bold text-green-900 mb-4">
                        <ShoppingCart size={18} color="currentColor" strokeWidth={1.8} />
                        Detalle
                    </h2>
                    <div className="flex flex-col gap-1">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between text-[0.9rem] py-1"
                            >
                                <span><strong>{item.cantidad}x</strong> {item.vianda}</span>
                                <span className="text-green-900 font-bold">${item.subtotal}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-stone-200 pt-2 mt-2 font-bold text-[1.1rem]">
                        <span>Total</span>
                        <span className="text-green-900">${subtotal}</span>
                    </div>
                </section>
            )}

            <button
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-green-900 text-white border-none font-semibold text-[1.1rem] tracking-wide cursor-pointer transition-colors hover:bg-green-800"
                onClick={finalizar}
            >
                <CheckCircle2 size={20} color="currentColor" strokeWidth={2} />
                Finalizar Pedido
            </button>
            </div>
            </div>
        </main>
    );
}

export default StockManager;
