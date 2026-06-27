import { useState } from "react";
import { useStock } from "../context/StockContext";
import {
    Plus,
    Trash2,
    CheckCircle2,
    EyeOff,
    Package,
} from "lucide-react";

function Inicio() {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const { todasLasViandas, agregarVianda, eliminarVianda, editarVianda, toggleVianda } = useStock();

    const activas   = todasLasViandas.filter(v => v.activa);
    const inactivas = todasLasViandas.filter(v => !v.activa);

    const handleAgregar = async (e) => {
        e.preventDefault();
        if (!nombre.trim() || !precio) return;
        await agregarVianda({ id: Date.now(), nombre: nombre.trim(), precio: Number(precio) });
        setNombre("");
        setPrecio("");
    };

    const ViandaRow = ({ vianda }) => {
        const activa = Boolean(vianda.activa);
        return (
            <div className={`menu-item${activa ? "" : " menu-item--inactive"}`}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                    <input
                        className="menu-item__input"
                        type="text"
                        value={vianda.nombre}
                        onChange={e => editarVianda(vianda.id, "nombre", e.target.value)}
                        style={{ textDecoration: activa ? "none" : "line-through" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ color: "var(--clr-muted)", fontSize: "0.85rem" }}>$</span>
                        <input
                            className="menu-item__input menu-item__price"
                            type="number"
                            value={vianda.precio}
                            onChange={e => editarVianda(vianda.id, "precio", e.target.value)}
                        />
                    </div>
                </div>

                {/* Toggle activa/inactiva */}
                <button
                    className="btn btn--icon"
                    title={activa ? "Ocultar hoy" : "Activar hoy"}
                    onClick={() => toggleVianda(vianda.id, activa)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    {activa
                        ? <CheckCircle2 size={20} color="var(--clr-success)" strokeWidth={2} />
                        : <EyeOff       size={20} color="var(--clr-warning)" strokeWidth={2} />
                    }
                </button>

                {/* Eliminar permanente */}
                <button
                    className="btn btn--icon"
                    title="Eliminar permanentemente"
                    onClick={async () => {
                        if (window.confirm("¿Eliminar esta vianda del menú permanente?"))
                            await eliminarVianda(vianda.id);
                    }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <Trash2 size={18} color="var(--clr-danger)" strokeWidth={2} />
                </button>
            </div>
        );
    };

    return (
        <main className="page">
            {/* HEADER */}
            <header className="page-header">
                <h1>Julia Retamal</h1>
                <p className="subtitle">Gestión de Menú</p>
                <div className="chess-line" />
                {todasLasViandas.length > 0 && (
                    <p className="subtitle" style={{ marginTop: "0.25rem" }}>
                        <strong style={{ color: "var(--clr-success)" }}>{activas.length} activas</strong>
                        {inactivas.length > 0 && ` · ${inactivas.length} ocultas hoy`}
                    </p>
                )}
            </header>

            {/* NUEVA VIANDA */}
            <section className="card">
                <h2 className="card__title" style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <Plus size={18} color="var(--clr-primary)" strokeWidth={2.2} />
                    Nueva Vianda
                </h2>
                <form onSubmit={handleAgregar}>
                    <div className="field">
                        <label htmlFor="vNombre">Nombre</label>
                        <input
                            id="vNombre"
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. Pollo con puré"
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="vPrecio">Precio ($)</label>
                        <input
                            id="vPrecio"
                            type="number"
                            value={precio}
                            onChange={e => setPrecio(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn--primary">
                        Agregar al Menú
                    </button>
                </form>
            </section>

            {/* LISTA PERMANENTE */}
            <section className="card">
                <h2 className="card__title" style={{ justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <Package size={18} color="var(--clr-primary)" strokeWidth={1.8} />
                        Menú permanente
                    </span>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: 400, color: "var(--clr-muted)",
                        background: "var(--clr-primary-tint)", padding: "2px 8px", borderRadius: "99px",
                        display: "flex", alignItems: "center", gap: "4px"
                    }}>
                        <CheckCircle2 size={11} color="var(--clr-success)" strokeWidth={2.5} />
                        activa
                        <span style={{ margin: "0 2px" }}>·</span>
                        <EyeOff size={11} color="var(--clr-warning)" strokeWidth={2.5} />
                        ocultar
                    </span>
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {todasLasViandas.length === 0 && (
                        <p style={{ color: "var(--clr-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>
                            Tu menú está vacío.
                        </p>
                    )}

                    {activas.map(v => <ViandaRow key={v.id} vianda={v} />)}

                    {inactivas.length > 0 && (
                        <>
                            <div className="divider">Ocultas hoy</div>
                            {inactivas.map(v => <ViandaRow key={v.id} vianda={v} />)}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Inicio;