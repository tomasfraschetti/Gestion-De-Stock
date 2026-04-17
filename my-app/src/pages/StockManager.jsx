import { useContext, useState } from "react";
import { StockContext } from "../context/StockContext";
import { useNavigate } from "react-router-dom";

function StockManager() {
    const { viandasDisponibles, setPedidos } = useContext(StockContext);
    const navigate = useNavigate();

    // Estados locales para el formulario de pedidos
    const [viandaSeleccionada, setViandaSeleccionada] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");
    const [cliente, setCliente] = useState("");

    const guardarPedido = (e) => {
        e.preventDefault();

        // Creamos el objeto del pedido
        const nuevoPedido = {
            id: Date.now(),
            cliente: cliente,
            vianda: viandaSeleccionada,
            cantidad: cantidad,
            precio: precio,
            estado: "pendiente" // Estado inicial
        };

        // Lo guardamos en el array global de pedidos
        setPedidos(prev => [...prev, nuevoPedido]);

        // Limpiamos el formulario para el siguiente pedido
        setViandaSeleccionada("");
        setCantidad("");
        setPrecio("");
        setCliente("");

        alert("Pedido registrado con éxito");
    };

    return (
        <div>
            <h1>Registrar Pedido</h1>
            <form onSubmit={guardarPedido}>
                <div>
                    <label>Cliente: </label>
                    <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
                </div>

                <div>
                    <label>Seleccionar Vianda: </label>
                    <select
                        value={viandaSeleccionada}
                        onChange={(e) => setViandaSeleccionada(e.target.value)}
                        required
                    >
                        <option value="">-- Seleccione --</option>

                        {viandasDisponibles.map((v) => (
                            <option key={v.id} value={v.nombre}>{v.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Cantidad: </label>
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                </div>

                <div>
                    <label>Precio Unitario: </label>
                    <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                </div>

                <button type="submit">Agregar Pedido</button>
            </form>

            <br />
            <button onClick={() => navigate("/Resumen")}>Ver Tabla Final</button>
        </div>
    );
}

export default StockManager;

