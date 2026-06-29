import { useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, ClipboardList, BarChart2 } from "lucide-react";

const TABS = [
    { label: "Menú",  path: "/",            Icon: UtensilsCrossed },
    { label: "Carga", path: "/StockManager", Icon: ClipboardList   },
    { label: "Total", path: "/Contador",     Icon: BarChart2       },
];

function Navbar() {
    const navigate     = useNavigate();
    const { pathname } = useLocation();

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-white border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex z-50">
            {TABS.map(({ label, path, Icon }) => {
                const active = pathname === path;
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        aria-label={label}
                        className={`flex-1 flex flex-col items-center justify-center gap-0.5 border-none bg-transparent cursor-pointer text-[0.65rem] font-bold uppercase tracking-widest transition-colors ${
                            active ? "text-green-900" : "text-gray-400"
                        }`}
                    >
                        <span className="text-xl leading-none">
                            <Icon size={20} color="currentColor" strokeWidth={1.8} />
                        </span>
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}

export default Navbar;
