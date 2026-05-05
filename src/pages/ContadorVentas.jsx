import { useContext } from "react";
import { StockContext } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

function ContadorVentas() {
    const { pedidos, setPedidos } = useContext(StockContext);
    const navigate = useNavigate();

    // Separamos pedidos
    const pedidosEntregados = pedidos.filter(p => p.finalizado === true);
    const pedidosPendientes = pedidos.filter(p => !p.finalizado);

    // Función para procesar totales
    const obtenerTotales = (lista) => {
        return lista.reduce((acc, p) => {
            if (!acc[p.vianda]) acc[p.vianda] = 0;
            acc[p.vianda] += Number(p.cantidad);
            return acc;
        }, {});
    };

    const totalesEntregados = obtenerTotales(pedidosEntregados);
    const totalesPendientes = obtenerTotales(pedidosPendientes);

    const sumaEntregados = Object.values(totalesEntregados).reduce((a, b) => a + b, 0);
    const sumaPendientes = Object.values(totalesPendientes).reduce((a, b) => a + b, 0);

    const cerrarJornada = async () => {
        if (pedidos.length === 0) {
            alert("No hay pedidos para guardar.");
            return;
        }

        if (!window.confirm("¿Estás seguro de cerrar la jornada? Esto guardará los pedidos en la base de datos y limpiará la lista actual.")) {
            return;
        }

        // Agrupar pedidos por cliente
        const agrupados = pedidos.reduce((acc, p) => {
            if (!acc[p.cliente]) {
                acc[p.cliente] = {
                    cliente: p.cliente,
                    items: [],
                    total: 0
                };
            }
            
            // Adaptar item al formato del schema
            const itemFormateado = {
                nombre: p.vianda,
                precio: p.precio,
                cantidad: p.cantidad
            };
            
            acc[p.cliente].items.push(itemFormateado);
            acc[p.cliente].total += (p.cantidad * p.precio);
            
            return acc;
        }, {});

        const payload = Object.values(agrupados);

        try {
            const response = await fetch("http://localhost:3000/api/pedidos/sincronizar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error al sincronizar con el servidor");
            }

            const data = await response.json();
            alert(`¡Jornada cerrada con éxito! ${data.cantidad} pedidos guardados en MongoDB.`);
            setPedidos([]); // Limpiar la jornada
        } catch (error) {
            console.error("Error cerrando jornada:", error);
            alert("Hubo un error al guardar los pedidos. Revisa la consola.");
        }
    };

    const RenderLista = ({ titulo, totales, color, icono }) => (
        <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: color, fontSize: '1.2rem', borderBottom: `1px solid ${color}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {icono} {titulo}
            </h2>
            {Object.keys(totales).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Sin movimientos.</p>
            ) : (
                Object.keys(totales).map(nombre => (
                    <div key={nombre} className="card" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        marginBottom: '0.5rem',
                        borderLeft: `4px solid ${color}` 
                    }}>
                        <span style={{ fontWeight: '500' }}>{nombre}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: color }}>x{totales[nombre]}</span>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <header className="header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Estado De Hoy</h1>
                <button 
                    onClick={cerrarJornada}
                    className="btn-primary" 
                    style={{ background: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}
                >
                    💾 Cerrar Jornada
                </button>
            </header>

            <main className="main-content">
                
                {/* RESUMEN RÁPIDO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '1rem' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--danger)', display: 'block' }}>{sumaPendientes}</span>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--danger)', fontWeight: 'bold' }}>Faltan</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '1rem' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)', display: 'block' }}>{sumaEntregados}</span>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 'bold' }}>Listas</span>
                    </div>
                </div>

                {/* DETALLE POR VIANDA */}
                <RenderLista titulo="PENDIENTES" totales={totalesPendientes} color="var(--warning)" icono="⏳" />
                <RenderLista titulo="ENTREGADAS" totales={totalesEntregados} color="var(--success)" icono="✅" />

            </main>
        </div>
    );
}

export default ContadorVentas;
