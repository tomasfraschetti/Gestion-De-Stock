import { useState } from "react";
import {
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    Bike,
    Store,
    MapPin,
    DollarSign,
    Pencil,
    Trash2,
    X,
    Minus,
    Plus,
    Check,
} from "lucide-react";
import { useStock } from "../context/StockContext";

/* ─────────────────────────────────────────────
   PedidoCard — un pedido expandible por cliente
   ───────────────────────────────────────────── */
function PedidoCard({ grupo, done }) {
    const [expandido, setExpandido]         = useState(false);
    const [editando, setEditando]           = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [cantidades, setCantidades]       = useState({});

    const { marcarFinalizado, eliminarPedido, actualizarCantidadPedido } = useStock();

    const esEnvio = grupo.entrega === "Envío";

    const resumenViandas = grupo.items
        .map(i => `${i.vianda}${i.cantidad > 1 ? ` ×${i.cantidad}` : ""}`)
        .join(", ");

    const total = grupo.items.reduce(
        (acc, i) => acc + Number(i.precio) * Number(i.cantidad),
        0
    );

    const handleMarcar = async (e) => {
        e.stopPropagation();
        await Promise.all(grupo.items.map(i => marcarFinalizado(i.id, !done)));
    };

    const handleEliminar = async (e) => {
        e.stopPropagation();
        if (!confirmDelete) { setConfirmDelete(true); return; }
        await Promise.all(grupo.items.map(i => eliminarPedido(i.id)));
    };

    const handleEditToggle = (e) => {
        e.stopPropagation();
        if (editando) {
            setCantidades({});
            setEditando(false);
        } else {
            const init = {};
            grupo.items.forEach(i => { init[i.id] = i.cantidad; });
            setCantidades(init);
            setEditando(true);
            setConfirmDelete(false);
        }
    };

    const handleGuardarEdit = async (e) => {
        e.stopPropagation();
        const cambios = grupo.items.filter(i => cantidades[i.id] !== i.cantidad);
        await Promise.all(cambios.map(i => actualizarCantidadPedido(i.id, cantidades[i.id])));
        setEditando(false);
        setCantidades({});
    };

    const changeCantidad = (id, delta) => {
        setCantidades(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] ?? 1) + delta),
        }));
    };

    const totalEdit = grupo.items.reduce(
        (acc, i) => acc + Number(i.precio) * (cantidades[i.id] ?? i.cantidad),
        0
    );

    return (
        <div
            className={`bg-stone-50 border rounded-xl mb-2 last:mb-0 cursor-pointer overflow-hidden transition-all
                ${done
                    ? "opacity-70 border-stone-200"
                    : "border-stone-200 hover:border-green-900 hover:shadow-md"
                }
                ${expandido ? "border-green-900 shadow-md" : ""}
            `}
            onClick={() => !editando && setExpandido(v => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && !editando && setExpandido(v => !v)}
            aria-expanded={expandido}
        >
            {/* ── Cabecera ── */}
            <div className="flex items-center justify-between gap-2 px-4 py-2 min-h-[60px]">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-[0.95rem] text-gray-900 truncate">
                        {grupo.cliente}
                    </span>
                    <span className="text-[0.78rem] text-gray-500 truncate max-w-[200px] lg:max-w-md">
                        {resumenViandas}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Badge tipo entrega */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.68rem] font-bold uppercase tracking-wide
                        ${esEnvio
                            ? "bg-green-900/10 text-green-900"
                            : "bg-orange-700/10 text-orange-700"
                        }`}
                    >
                        {esEnvio
                            ? <Bike  size={11} color="currentColor" strokeWidth={2} />
                            : <Store size={11} color="currentColor" strokeWidth={2} />
                        }
                        {esEnvio ? "Envío" : "Retira"}
                    </span>

                    <span className="text-gray-400">
                        {expandido
                            ? <ChevronUp   size={16} color="currentColor" />
                            : <ChevronDown size={16} color="currentColor" />
                        }
                    </span>
                </div>
            </div>

            {/* ── Detalle expandible ── */}
            {expandido && (
                <div
                    className="px-4 pb-4 border-t border-stone-200 cursor-default animate-slide-down"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Lista de viandas */}
                    <ul className="flex flex-col gap-1 pt-2 list-none">
                        {grupo.items.map(item => (
                            <li key={item.id} className="flex items-center gap-2 text-[0.88rem] py-0.5">
                                {editando ? (
                                    <div className="flex items-center gap-0.5 bg-stone-50 border border-stone-200 rounded-lg px-1 py-0.5 shrink-0">
                                        <button
                                            className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-transparent border-none cursor-pointer text-green-900 hover:bg-green-900/10 disabled:opacity-35 disabled:cursor-default transition-colors"
                                            onClick={() => changeCantidad(item.id, -1)}
                                            disabled={cantidades[item.id] <= 1}
                                        >
                                            <Minus size={12} color="currentColor" strokeWidth={2.5} />
                                        </button>
                                        <span className="text-[0.82rem] font-bold text-green-900 min-w-[20px] text-center">
                                            {cantidades[item.id]}
                                        </span>
                                        <button
                                            className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-transparent border-none cursor-pointer text-green-900 hover:bg-green-900/10 transition-colors"
                                            onClick={() => changeCantidad(item.id, +1)}
                                        >
                                            <Plus size={12} color="currentColor" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="font-bold text-green-900 text-[0.8rem] min-w-[24px]">
                                        ×{item.cantidad}
                                    </span>
                                )}
                                <span className="flex-1 text-gray-900">{item.vianda}</span>
                                <span className="font-semibold text-gray-500 text-[0.82rem]">
                                    ${Number(item.precio) * (editando ? (cantidades[item.id] ?? item.cantidad) : item.cantidad)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Domicilio */}
                    {esEnvio && grupo.domicilio && (
                        <div className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 mt-2 px-2 py-1 bg-white rounded-lg border border-stone-200">
                            <MapPin size={13} color="currentColor" strokeWidth={2} />
                            <span>{grupo.domicilio}</span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center gap-1.5 text-[0.9rem] mt-2 pt-2 border-t border-dashed border-stone-200 text-gray-500">
                        <DollarSign size={15} color="#14532d" strokeWidth={2} />
                        <span>Total</span>
                        <strong className="ml-auto text-[1.05rem] font-bold text-green-900">
                            ${editando ? totalEdit : total}
                        </strong>
                    </div>

                    {/* ── Fila de acciones ── */}
                    <div className="flex gap-1.5 mt-3 items-center">
                        {editando ? (
                            <>
                                <button
                                    className="flex-1 flex items-center justify-center gap-1.5 h-[34px] px-3 rounded-xl text-[0.8rem] font-semibold bg-green-700 text-white border-none cursor-pointer transition-colors hover:bg-green-800"
                                    onClick={handleGuardarEdit}
                                >
                                    <Check size={15} color="currentColor" strokeWidth={2.5} />
                                    Guardar
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center gap-1.5 h-[34px] px-3 rounded-xl text-[0.8rem] font-semibold bg-transparent border border-stone-200 text-gray-900 cursor-pointer transition-colors hover:bg-stone-100"
                                    onClick={handleEditToggle}
                                >
                                    <X size={15} color="currentColor" strokeWidth={2} />
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Marcar entregado */}
                                <button
                                    className={`flex-1 flex items-center justify-center gap-1.5 h-[34px] px-3 rounded-xl text-[0.8rem] font-semibold border-none cursor-pointer transition-colors
                                        ${done
                                            ? "bg-transparent border border-stone-200 text-gray-900 hover:bg-stone-100"
                                            : "bg-green-700 text-white hover:bg-green-800"
                                        }`}
                                    onClick={handleMarcar}
                                >
                                    <CheckCircle2 size={15} color="currentColor" strokeWidth={2} />
                                    {done ? "Pendiente" : "Entregado"}
                                </button>

                                {/* Editar */}
                                <button
                                    className="flex items-center justify-center w-[34px] h-[34px] rounded-xl bg-transparent border border-stone-200 text-amber-500 cursor-pointer transition-colors hover:bg-amber-50"
                                    onClick={handleEditToggle}
                                    title="Editar cantidades"
                                >
                                    <Pencil size={14} color="currentColor" strokeWidth={2} />
                                </button>

                                {/* Eliminar */}
                                <button
                                    className={`flex items-center justify-center gap-1.5 h-[34px] rounded-xl border-none cursor-pointer transition-colors font-semibold text-[0.8rem]
                                        ${confirmDelete
                                            ? "bg-red-600 text-white px-3 min-w-[34px]"
                                            : "bg-transparent border border-stone-200 text-red-600 w-[34px] hover:bg-red-50"
                                        }`}
                                    onClick={handleEliminar}
                                    onBlur={() => setConfirmDelete(false)}
                                    title={confirmDelete ? "¿Confirmar eliminación?" : "Eliminar pedido"}
                                >
                                    {confirmDelete
                                        ? <><Trash2 size={14} color="currentColor" strokeWidth={2} /> Confirmar</>
                                        : <Trash2 size={14} color="currentColor" strokeWidth={2} />
                                    }
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   SeccionPedidos — lista con filtro Retira/Envío
   ───────────────────────────────────────────── */
function SeccionPedidos({ titulo, grupos, done }) {
    const [filtro, setFiltro] = useState("todos");

    const gruposFiltrados = filtro === "todos"
        ? grupos
        : grupos.filter(g => g.entrega === filtro);

    return (
        <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
            {/* Encabezado */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
                <h2 className={`text-base font-bold m-0 flex items-center gap-2 ${done ? "text-green-700" : "text-amber-500"}`}>
                    {done
                        ? <CheckCircle2 size={17} color="currentColor" strokeWidth={2.2} />
                        : <Clock        size={17} color="currentColor" strokeWidth={2.2} />
                    }
                    {titulo}
                    <span className={`text-[0.7rem] font-bold rounded-full px-2 py-0.5
                        ${done ? "bg-green-700/10 text-green-700" : "bg-amber-500/10 text-amber-500"}`}
                    >
                        {grupos.length}
                    </span>
                </h2>

                {/* Toggle Retira / Envío */}
                <div className="flex gap-1 bg-stone-50 border border-stone-200 rounded-xl p-1">
                    {["todos", "Retira", "Envío"].map(op => (
                        <button
                            key={op}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border-none text-[0.7rem] font-semibold cursor-pointer whitespace-nowrap transition-all
                                ${filtro === op
                                    ? "bg-white text-green-900 shadow-sm"
                                    : "bg-transparent text-gray-500"
                                }`}
                            onClick={() => setFiltro(op)}
                        >
                            {op === "Retira" && <Store size={11} color="currentColor" strokeWidth={2} />}
                            {op === "Envío"  && <Bike  size={11} color="currentColor" strokeWidth={2} />}
                            {op === "todos" ? "Todos" : op}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                {gruposFiltrados.length === 0 ? (
                    <p className="text-gray-500 italic text-[0.88rem]">Sin movimientos.</p>
                ) : (
                    gruposFiltrados.map(g => (
                        <PedidoCard key={g.cliente} grupo={g} done={done} />
                    ))
                )}
            </div>
        </section>
    );
}

export { PedidoCard, SeccionPedidos };
