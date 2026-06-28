import { useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, ClipboardList, BarChart2 } from "lucide-react";

const ICON_COLOR = "currentColor";

const TABS = [
    { label: "Menú",  path: "/",            Icon: UtensilsCrossed },
    { label: "Carga", path: "/StockManager", Icon: ClipboardList   },
    { label: "Total", path: "/Contador",     Icon: BarChart2       },
];

function Navbar() {
    const navigate  = useNavigate();
    const { pathname } = useLocation();

    return (
        <nav className="navbar">
            {TABS.map(({ label, path, Icon }) => (
                <button
                    key={path}
                    className={`nav-btn${pathname === path ? " nav-btn--active" : ""}`}
                    onClick={() => navigate(path)}
                    aria-label={label}
                >
                    <span className="nav-btn__icon">
                        <Icon size={20} color={ICON_COLOR} strokeWidth={1.8} />
                    </span>
                    {label}
                </button>
            ))}
        </nav>
    );
}

export default Navbar;
