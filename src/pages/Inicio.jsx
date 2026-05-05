import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StockContext } from "../context/StockContext";

function Inicio() {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const { viandasDisponibles, setviandasDisponibles } = useContext(StockContext);
    const navigate = useNavigate();

    const agregarVianda = (e) => {
        e.preventDefault();
        if (nombre.trim() === "" || precio === "") return;

        const nuevaVianda = {
            id: Date.now(),
            nombre: nombre,
            precio: Number(precio)
        };

        setviandasDisponibles([...viandasDisponibles, nuevaVianda]);
        setNombre("");
        setPrecio("");
    }

    const eliminarVianda = (id) => {
        setviandasDisponibles(viandasDisponibles.filter(v => v.id !== id));
    }

    const editarVianda = (id, campo, valor) => {
        setviandasDisponibles(viandasDisponibles.map(v => 
            v.id === id ? { ...v, [campo]: campo === 'precio' ? Number(valor) : valor } : v
        ));
    }

    return (
        <div className="container">
            <header className="header">
                <h1>Gestión de Viandas</h1>
                
            </header>

            <main className="main-content">
                <div className="card">
                    <h2 className="card-title">➕ Nueva Vianda</h2>
                    <form onSubmit={agregarVianda} className="add-form">
                        <div className="input-field">
                            <label htmlFor="nombre">Nombre vianda</label>
                            <input 
                                type="text"
                                id="nombre"
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                                placeholder="Ej. Pollo con puré"
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="precio">Precio Unitario ($)</label>
                            <input 
                                type="number"
                                id="precio"
                                value={precio} 
                                onChange={(e) => setPrecio(e.target.value)} 
                                required 
                                placeholder="0.00"
                            />
                        </div>
                        <button type="submit" className="btn-full btn-add" style={{marginTop: '0.5rem'}}>
                            Agregar al Menú
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2 className="card-title">📦 Lista de Viandas (Toca para editar)</h2>
                    <div className="vianda-list">
                        {viandasDisponibles.length === 0 ? (
                            <p className="empty-msg">Tu menú está vacío.</p>
                        ) : (
                            viandasDisponibles.map((vianda) => (
                                <div key={vianda.id} className="vianda-item" style={{ flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 100%', marginBottom: '0.5rem' }}>
                                        <input 
                                            type="text" 
                                            className="input-edit" 
                                            value={vianda.nombre} 
                                            onChange={(e) => editarVianda(vianda.id, 'nombre', e.target.value)}
                                            style={{ fontWeight: '600' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                                        <span style={{color: 'var(--text-muted)', marginRight: '0.5rem'}}>$</span>
                                        <input 
                                            type="number" 
                                            className="input-edit" 
                                            value={vianda.precio} 
                                            onChange={(e) => editarVianda(vianda.id, 'precio', e.target.value)}
                                            style={{ color: 'var(--primary)', fontWeight: 'bold' }}
                                        />
                                    </div>
                                    <button className="btn-icon btn-delete" onClick={() => eliminarVianda(vianda.id)}>🗑️</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Inicio;