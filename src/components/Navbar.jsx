import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: "Viandas", path: "/", icon: "🍱" },
        { name: "Cargar", path: "/StockManager", icon: "➕" },
        { name: "Pedidos", path: "/Resumen", icon: "🛵" },
        { name: "Total", path: "/Contador", icon: "📊" }
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--card-bg)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border)',
            zIndex: 1000,
            boxShadow: '0 -4px 10px rgba(0,0,0,0.3)'
        }}>
            {tabs.map((tab) => (
                <button 
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem',
                        color: location.pathname === tab.path ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}
                >
                    <span style={{ fontSize: '1.4rem' }}>{tab.icon}</span>
                    {tab.name}
                </button>
            ))}
        </nav>
    );
}

export default Navbar;
