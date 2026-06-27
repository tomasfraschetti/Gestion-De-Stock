import { useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, ClipboardList, Bike } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: "Viandas",  path: "/",            Icon: UtensilsCrossed },
        { name: "Pedidos",  path: "/StockManager", Icon: ClipboardList   },
        { name: "Entregas", path: "/Contador",     Icon: Bike            },
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
            {tabs.map(({ name, path, Icon }) => {
                const active = location.pathname === path;
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            color: active ? 'var(--primary)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}
                    >
                        <Icon
                            size={22}
                            color="currentColor"
                            strokeWidth={active ? 2.2 : 1.6}
                        />
                        {name}
                    </button>
                );
            })}
        </nav>
    );
}

export default Navbar;
