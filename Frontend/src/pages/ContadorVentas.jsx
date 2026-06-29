import { useStock } from "../context/StockContext";
import { Save, CheckCircle2, Clock } from "lucide-react";
import { SeccionPedidos } from "../components/PedidoCard";
import { toast } from "react-toastify";

/* Agrupa los pedidos (un registro por vianda) por cliente */
function agruparPorCliente(lista) {
    const mapa = {};
    for (const p of lista) {
        if (!mapa[p.cliente]) {
            mapa[p.cliente] = {
                cliente: p.cliente,
                entrega: p.entrega || "Retira",
                domicilio: p.domicilio || "",
                items: [],
            };
        }
        mapa[p.cliente].items.push(p);
    }
    return Object.values(mapa);
}

/* ── Botones del toast de confirmación de cierre ── */
function ToastCerrarJornada({ closeToast, onConfirmar }) {
    return (
        <div className="flex flex-col gap-2.5">
            <p className="m-0 font-medium text-gray-900">¿Cerrar la jornada?</p>
            <p className="m-0 text-[0.9rem] text-gray-700">
                Se enviará todo al servidor y se limpiará la lista.
            </p>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => { onConfirmar(); closeToast(); }}
                    className="px-3 py-1.5 bg-green-900 text-white border-none rounded cursor-pointer font-bold text-sm hover:bg-green-800 transition-colors"
                >
                    Confirmar
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

function ContadorVentas() {
    const { pedidos, limpiarJornada } = useStock();

    const entregados = pedidos.filter(p => p.finalizado === true);
    const pendientes = pedidos.filter(p => !p.finalizado);

    const gruposEntregados = agruparPorCliente(entregados);
    const gruposPendientes = agruparPorCliente(pendientes);

    const sumaPendientes = pendientes.reduce((a, p) => a + Number(p.cantidad), 0);
    const sumaEntregados = entregados.reduce((a, p) => a + Number(p.cantidad), 0);

    const procesarCierre = async () => {
        const agrupados = pedidos.reduce((acc, p) => {
            if (!acc[p.cliente]) acc[p.cliente] = { cliente: p.cliente, items: [], total: 0 };
            acc[p.cliente].items.push({ nombre: p.vianda, precio: p.precio, cantidad: p.cantidad });
            acc[p.cliente].total += p.cantidad * p.precio;
            return acc;
        }, {});

        try {
            const res = await fetch("http://localhost:3000/api/pedidos/sincronizar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.values(agrupados)),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            toast.success(`¡Jornada cerrada! ${data.cantidad} pedidos guardados.`);
            await limpiarJornada();
        } catch {
            toast.error("Error al guardar. Revisá la consola.");
        }
    };

    const cerrarJornada = () => {
        if (!pedidos.length) {
            toast.warn("No hay pedidos para guardar.");
            return;
        }
        toast(
            ({ closeToast }) => (
                <ToastCerrarJornada closeToast={closeToast} onConfirmar={procesarCierre} />
            ),
            { autoClose: false, closeOnClick: false }
        );
    };

    return (
        <main className="flex flex-col gap-4 px-4 pt-4 pb-24">
            {/* HEADER */}
            <header className="flex flex-col items-center gap-1 py-6">
                <h1 className="font-serif text-4xl text-green-900 leading-tight">Julia Retamal</h1>
                <p className="text-gray-500 text-[0.85rem]">Estado del día</p>
                <div className="chess-line w-full mt-1" />
            </header>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-2">
                {/* Pendientes */}
                <div className="flex flex-col items-center justify-center p-4 bg-red-600/[0.06] border border-red-600 rounded-2xl shadow-sm text-center">
                    <span className="text-[2.5rem] font-bold leading-none text-red-600">
                        {sumaPendientes}
                    </span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-1 text-red-600">
                        Faltan
                    </span>
                </div>
                {/* Entregados */}
                <div className="flex flex-col items-center justify-center p-4 bg-green-700/[0.06] border border-green-700 rounded-2xl shadow-sm text-center">
                    <span className="text-[2.5rem] font-bold leading-none text-green-700">
                        {sumaEntregados}
                    </span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-1 text-green-700">
                        Listas
                    </span>
                </div>
            </div>

            {/* PENDIENTES */}
            <SeccionPedidos titulo="PENDIENTES" grupos={gruposPendientes} done={false} />

            {/* ENTREGADOS */}
            <SeccionPedidos titulo="ENTREGADAS" grupos={gruposEntregados} done={true} />

            {/* CERRAR JORNADA */}
            <button
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-green-900 text-white border-none font-semibold text-base tracking-wide cursor-pointer transition-colors hover:bg-green-800"
                onClick={cerrarJornada}
            >
                <Save size={18} color="currentColor" strokeWidth={2} />
                Cerrar Jornada
            </button>
        </main>
    );
}

export default ContadorVentas;
