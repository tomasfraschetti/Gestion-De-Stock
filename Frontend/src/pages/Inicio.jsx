import { useState } from "react";
import { useStock } from "../context/StockContext";
import { toast } from "react-toastify";
import {
    Plus,
    Trash2,
    CheckCircle2,
    EyeOff,
    Package,
} from "lucide-react";

/* ── Componente inline de confirmación para el toast ── */
function ToastConfirmarEliminar({ closeToast, onConfirmar }) {
    return (
        <div className="flex flex-col gap-2.5">
            <p className="m-0 font-medium text-gray-900">¿Eliminar esta vianda?</p>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={async () => { await onConfirmar(); closeToast(); }}
                    className="px-3 py-1.5 bg-red-600 text-white border-none rounded cursor-pointer font-bold text-sm hover:bg-red-700 transition-colors"
                >
                    Eliminar
                </button>
                <button
                    onClick={closeToast}
                    className="px-3 py-1.5 bg-transparent border border-stone-200 text-gray-900 rounded cursor-pointer text-sm hover:bg-stone-100 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

function Inicio() {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const { todasLasViandas, agregarVianda, eliminarVianda, editarVianda, toggleVianda } = useStock();

    const activas   = todasLasViandas.filter(v => v.activa);
    const inactivas = todasLasViandas.filter(v => !v.activa);

    const handleAgregar = async (e) => {
        e.preventDefault();
        if (!nombre.trim() || !precio) return;
        await agregarVianda({ id: Date.now(), nombre: nombre.trim(), precio: Number(precio) });
        setNombre("");
        setPrecio("");
    };

    const ViandaRow = ({ vianda }) => {
        const activa = Boolean(vianda.activa);
        return (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 border transition-opacity
                ${activa ? "border-stone-200" : "opacity-45 border-dashed border-stone-200"}`}
            >
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <input
                        className={`bg-transparent border-none text-gray-900 font-normal text-base min-w-0 flex-1 outline-none w-full
                            ${activa ? "" : "line-through"}`}
                        type="text"
                        value={vianda.nombre}
                        onChange={e => editarVianda(vianda.id, "nombre", e.target.value.toUpperCase())}
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500 text-[0.85rem]">$</span>
                        <input
                            className="bg-transparent border-none text-green-900 font-bold text-base outline-none min-w-0 w-24"
                            type="number"
                            value={vianda.precio}
                            onChange={e => editarVianda(vianda.id, "precio", e.target.value)}
                        />
                    </div>
                </div>

                {/* Toggle activa/inactiva */}
                <button
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-900/[0.08] border-none cursor-pointer transition-colors hover:bg-green-900/15"
                    title={activa ? "Ocultar hoy" : "Activar hoy"}
                    onClick={() => toggleVianda(vianda.id, activa)}
                >
                    {activa
                        ? <CheckCircle2 size={20} color="#15803d" strokeWidth={2} />
                        : <EyeOff       size={20} color="#f59e0b" strokeWidth={2} />
                    }
                </button>

                {/* Eliminar */}
                <button
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-900/[0.08] border-none cursor-pointer transition-colors hover:bg-red-50"
                    title="Eliminar permanentemente"
                    onClick={() => {
                        toast(
                            ({ closeToast }) => (
                                <ToastConfirmarEliminar
                                    closeToast={closeToast}
                                    onConfirmar={() => eliminarVianda(vianda.id)}
                                />
                            ),
                            { autoClose: false, closeOnClick: false }
                        );
                    }}
                >
                    <Trash2 size={18} color="#dc2626" strokeWidth={2} />
                </button>
            </div>
        );
    };

    return (
        <main className="flex flex-col gap-4 px-4 pt-4 pb-24 lg:pb-8">
            {/* HEADER */}
            <header className="flex flex-col items-center gap-1 py-6">
                <h1 className="font-serif text-4xl text-green-900 leading-tight">Julia Retamal</h1>
                <p className="text-gray-500 text-[0.85rem]">Gestión de Menú</p>
                <div className="chess-line w-full mt-1" />
                {todasLasViandas.length > 0 && (
                    <p className="text-gray-500 text-[0.85rem] mt-1">
                        <strong className="text-green-700">{activas.length} activas</strong>
                        {inactivas.length > 0 && ` · ${inactivas.length} ocultas hoy`}
                    </p>
                )}
            </header>

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6 lg:items-start">
            {/* NUEVA VIANDA */}
            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 lg:sticky lg:top-20">
                <h2 className="flex items-center gap-2 text-base font-bold text-green-900 mb-4">
                    <Plus size={18} color="currentColor" strokeWidth={2.2} />
                    Nueva Vianda
                </h2>
                <form onSubmit={handleAgregar}>
                    <div className="flex flex-col gap-1 mb-4">
                        <label htmlFor="vNombre" className="text-[0.8rem] font-semibold uppercase tracking-widest text-gray-500">
                            Nombre
                        </label>
                        <input
                            id="vNombre"
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value.toUpperCase())}
                            placeholder="Ej. Pollo con puré"
                            required
                            className="bg-stone-50 border border-stone-200 rounded-xl text-gray-900 px-4 h-[52px] font-sans text-base w-full outline-none focus:border-green-900 focus:ring-2 focus:ring-green-900/10 transition-shadow"
                        />
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                        <label htmlFor="vPrecio" className="text-[0.8rem] font-semibold uppercase tracking-widest text-gray-500">
                            Precio ($)
                        </label>
                        <input
                            id="vPrecio"
                            type="number"
                            value={precio}
                            onChange={e => setPrecio(e.target.value)}
                            placeholder="0.00"
                            required
                            className="bg-stone-50 border border-stone-200 rounded-xl text-gray-900 px-4 h-[52px] font-sans text-base w-full outline-none focus:border-green-900 focus:ring-2 focus:ring-green-900/10 transition-shadow"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-green-900 text-white border-none font-semibold text-base cursor-pointer transition-colors hover:bg-green-800"
                    >
                        Agregar al Menú
                    </button>
                </form>
            </section>

            {/* LISTA PERMANENTE */}
            <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4">
                <h2 className="flex items-center justify-between text-base font-bold text-green-900 mb-4">
                    <span className="flex items-center gap-2">
                        <Package size={18} color="currentColor" strokeWidth={1.8} />
                        Menú permanente
                    </span>
                    <span className="flex items-center gap-1 text-[0.7rem] font-normal text-gray-500 bg-green-900/[0.08] px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={11} color="#15803d" strokeWidth={2.5} />
                        activa
                        <span className="mx-0.5">·</span>
                        <EyeOff size={11} color="#f59e0b" strokeWidth={2.5} />
                        ocultar
                    </span>
                </h2>

                <div className="flex flex-col gap-2">
                    {todasLasViandas.length === 0 && (
                        <p className="text-gray-500 italic text-[0.9rem]">Tu menú está vacío.</p>
                    )}

                    {activas.map(v => <ViandaRow key={v.id} vianda={v} />)}

                    {inactivas.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 text-gray-500 text-[0.8rem] uppercase tracking-widest my-1
                                before:content-[''] before:flex-1 before:h-px before:bg-stone-200
                                after:content-[''] after:flex-1 after:h-px after:bg-stone-200">
                                Ocultas hoy
                            </div>
                            {inactivas.map(v => <ViandaRow key={v.id} vianda={v} />)}
                        </>
                    )}
                </div>
            </section>
            </div>
        </main>
    );
}

export default Inicio;