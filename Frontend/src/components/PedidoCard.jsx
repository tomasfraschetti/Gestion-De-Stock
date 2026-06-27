import { useState } from "react";
import {
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    Bike,
    Store,
    MapPin,
    DollarSign,
} from "lucide-react";
import { useStock } from "../context/StockContext";

/* ─────────────────────────────────────────────
   PedidoCard — un pedido expandible por cliente
   ───────────────────────────────────────────── */
function PedidoCard({ grupo, done }) {
    const [expandido, setExpandido] = useState(false);
    const { marcarFinalizado } = useStock();

    const esEnvio = grupo.entrega === "Envío";

    // Vista previa: nombres de viandas separados por coma
    const resumenViandas = grupo.items
        .map(i => `${i.vianda}${i.cantidad > 1 ? ` ×${i.cantidad}` : ""}`)
        .join(", ");

    const total = grupo.items.reduce((acc, i) => acc + Number(i.precio) * Number(i.cantidad), 0);

    const handleMarcar = async (e) => {
        e.stopPropagation();
        const nuevoEstado = !done;
        await Promise.all(grupo.items.map(i => marcarFinalizado(i.id, nuevoEstado)));
    };

    return (
        <div
            className={`pedido-card${done ? " pedido-card--done" : ""}${expandido ? " pedido-card--open" : ""}`}
            onClick={() => setExpandido(v => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setExpandido(v => !v)}
            aria-expanded={expandido}
        >
            {/* ── Cabecera siempre visible ── */}
            <div className="pedido-card__header">
                <div className="pedido-card__meta">
                    <span className="pedido-card__cliente">{grupo.cliente}</span>
                    <span className="pedido-card__preview">{resumenViandas}</span>
                </div>

                <div className="pedido-card__right">
                    {/* Badge tipo entrega */}
                    <span className={`pedido-chip pedido-chip--${esEnvio ? "envio" : "retira"}`}>
                        {esEnvio
                            ? <Bike  size={11} color="currentColor" strokeWidth={2} />
                            : <Store size={11} color="currentColor" strokeWidth={2} />
                        }
                        {esEnvio ? "Envío" : "Retira"}
                    </span>

                    {/* Chevron */}
                    <span className="pedido-card__chevron">
                        {expandido
                            ? <ChevronUp   size={16} color="var(--clr-muted)" />
                            : <ChevronDown size={16} color="var(--clr-muted)" />
                        }
                    </span>
                </div>
            </div>

            {/* ── Detalle expandible ── */}
            {expandido && (
                <div
                    className="pedido-card__detalle"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Lista de viandas con cantidad */}
                    <ul className="pedido-card__items">
                        {grupo.items.map(item => (
                            <li key={item.id} className="pedido-card__item">
                                <span className="pedido-card__item-qty">×{item.cantidad}</span>
                                <span className="pedido-card__item-nombre">{item.vianda}</span>
                                <span className="pedido-card__item-precio">
                                    ${Number(item.precio) * Number(item.cantidad)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Domicilio si es envío */}
                    {esEnvio && grupo.domicilio && (
                        <div className="pedido-card__domicilio">
                            <MapPin size={13} color="var(--clr-muted)" strokeWidth={2} />
                            <span>{grupo.domicilio}</span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="pedido-card__total">
                        <DollarSign size={15} color="var(--clr-primary)" strokeWidth={2} />
                        <span>Total</span>
                        <strong>${total}</strong>
                    </div>

                    {/* Botón de acción */}
                    <button
                        className={`btn btn--sm ${done ? "btn--ghost" : "btn--success"}`}
                        style={{ marginTop: "var(--space-sm)", width: "100%" }}
                        onClick={handleMarcar}
                    >
                        <CheckCircle2 size={16} color="currentColor" strokeWidth={2} />
                        {done ? "Marcar como pendiente" : "Marcar como entregado"}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   SeccionPedidos — lista con filtro Retira/Envío
   ───────────────────────────────────────────── */
function SeccionPedidos({ titulo, grupos, done }) {
    // filtro: "todos" | "Retira" | "Envío"
    const [filtro, setFiltro] = useState("todos");

    const gruposFiltrados = filtro === "todos"
        ? grupos
        : grupos.filter(g => g.entrega === filtro);

    return (
        <section className="card">
            {/* Encabezado con título + toggle filtro */}
            <div className="seccion-header">
                <h2 className="card__title seccion-header__title" style={{
                    color: done ? "var(--clr-success)" : "var(--clr-warning)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                }}>
                    {done
                        ? <CheckCircle2 size={17} color="var(--clr-success)" strokeWidth={2.2} />
                        : <Clock        size={17} color="var(--clr-warning)" strokeWidth={2.2} />
                    }
                    {titulo}
                    <span style={{
                        background: done ? "rgba(45,106,79,0.1)" : "rgba(180,124,44,0.1)",
                        color: done ? "var(--clr-success)" : "var(--clr-warning)",
                        fontSize: "0.7rem", fontWeight: 700, borderRadius: "99px",
                        padding: "2px 8px",
                    }}>
                        {grupos.length}
                    </span>
                </h2>

                {/* Toggle Retira / Envío */}
                <div className="entrega-toggle">
                    {["todos", "Retira", "Envío"].map(op => (
                        <button
                            key={op}
                            className={`entrega-toggle__btn${filtro === op ? " entrega-toggle__btn--active" : ""}`}
                            onClick={() => setFiltro(op)}
                        >
                            {op === "Retira" && <Store size={11} color="currentColor" strokeWidth={2} />}
                            {op === "Envío"  && <Bike  size={11} color="currentColor" strokeWidth={2} />}
                            {op === "todos" ? "Todos" : op}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "var(--space-md)" }}>
                {gruposFiltrados.length === 0 ? (
                    <p style={{ color: "var(--clr-muted)", fontStyle: "italic", fontSize: "0.88rem" }}>
                        Sin movimientos.
                    </p>
                ) : (
                    gruposFiltrados.map(g => (
                        <PedidoCard key={g.cliente} grupo={g} done={done} />
                    ))
                )}
            </div>
        </section>
    );
}

export { PedidoCard, SeccionPedidos };
