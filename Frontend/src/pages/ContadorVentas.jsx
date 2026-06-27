import { useStock } from "../context/StockContext";
import { Save } from "lucide-react";
import { SeccionPedidos } from "../components/PedidoCard";

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

function ContadorVentas() {
    const { pedidos, limpiarJornada } = useStock();

    const entregados = pedidos.filter(p => p.finalizado === true);
    const pendientes = pedidos.filter(p => !p.finalizado);

    const gruposEntregados = agruparPorCliente(entregados);
    const gruposPendientes = agruparPorCliente(pendientes);

    const sumaPendientes  = pendientes.reduce((a, p) => a + Number(p.cantidad), 0);
    const sumaEntregados  = entregados.reduce((a, p) => a + Number(p.cantidad), 0);

    const cerrarJornada = async () => {
        if (!pedidos.length) { alert("No hay pedidos para guardar."); return; }
        if (!window.confirm("¿Cerrar la jornada? Se enviará todo al servidor y se limpiará la lista.")) return;

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
            alert(`¡Jornada cerrada! ${data.cantidad} pedidos guardados.`);
            await limpiarJornada();
        } catch {
            alert("Error al guardar. Revisá la consola.");
        }
    };

    return (
        <main className="page">
            {/* HEADER */}
            <header className="page-header">
                <h1>Julia Retamal</h1>
                <p className="subtitle">Estado del día</p>
                <div className="chess-line" />
            </header>

            {/* STATS */}
            <div className="stat-grid">
                <div className="stat stat--danger">
                    <span className="stat__num">{sumaPendientes}</span>
                    <span className="stat__label">Faltan</span>
                </div>
                <div className="stat stat--success">
                    <span className="stat__num">{sumaEntregados}</span>
                    <span className="stat__label">Listas</span>
                </div>
            </div>

            {/* PENDIENTES */}
            <SeccionPedidos
                titulo="PENDIENTES"
                grupos={gruposPendientes}
                done={false}
            />

            {/* ENTREGADOS */}
            <SeccionPedidos
                titulo="ENTREGADAS"
                grupos={gruposEntregados}
                done={true}
            />

            {/* CERRAR JORNADA */}
            <button
                className="btn btn--primary"
                onClick={cerrarJornada}
                style={{ fontSize: "1rem", letterSpacing: "0.03em" }}
            >
                <Save size={18} color="currentColor" strokeWidth={2} />
                Cerrar Jornada
            </button>
        </main>
    );
}

export default ContadorVentas;
