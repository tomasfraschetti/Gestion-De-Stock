import { useContext } from "react";
import { StockContext } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

function ContadorVentas() {
    const { pedidos } = useContext(StockContext);
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
            <header className="header" style={{ marginBottom: '1rem' }}>
                <h1>Estado De Hoy</h1>
                
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
