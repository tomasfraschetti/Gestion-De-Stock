import { useStock } from "../context/StockContext";
import { Save } from "lucide-react";
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

function ContadorVentas() {
    const { pedidos, limpiarJornada } = useStock();

    const entregados = pedidos.filter(p => p.finalizado === true);
    const pendientes = pedidos.filter(p => !p.finalizado);

    const gruposEntregados = agruparPorCliente(entregados);
    const gruposPendientes = agruparPorCliente(pendientes);

    const sumaPendientes  = pendientes.reduce((a, p) => a + Number(p.cantidad), 0);
    const sumaEntregados  = entregados.reduce((a, p) => a + Number(p.cantidad), 0);

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
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p style={{ margin: 0, fontWeight: 500, color: "var(--clr-text)" }}>¿Cerrar la jornada?</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--clr-text)" }}>Se enviará todo al servidor y se limpiará la lista.</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button 
                            onClick={() => { procesarCierre(); closeToast(); }} 
                            style={{ padding: '6px 12px', background: 'var(--clr-primary)', color: '#111', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Confirmar
                        </button>
                        <button 
                            onClick={closeToast} 
                            style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--clr-border)', color: 'var(--clr-text)', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeOnClick: false }
        );
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
