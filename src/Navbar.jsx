import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: "Menú", path: "/", icon: "🍱" },
        { name: "Carga", path: "/StockManager", icon: "➕" },
        { name: "Envío", path: "/Resumen", icon: "🛵" }, /* Moto por camión */
        { name: "Total", path: "/Contador", icon: "📊" }
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '10px 0',
            borderTop: '3px solid #6366f1',
            zIndex: 99999,
            boxShadow: '0 -10px 20px rgba(0,0,0,0.6)',
            height: '70px',
            alignItems: 'center'
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
                        justifyContent: 'center',
                        gap: '2px',
                        color: location.pathname === tab.path ? '#6366f1' : '#94a3b8',
                        cursor: 'pointer',
                        flex: 1
                    }}
                >
                    <span style={{ fontSize: '24px' }}>{tab.icon}</span>
                    <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px' 
                    }}>
                        {tab.name}
                    </span>
                </button>
            ))}
        </nav>
    );
}

export default Navbar;
