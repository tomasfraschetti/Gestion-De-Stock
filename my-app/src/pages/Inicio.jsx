import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StockContext } from "../context/StockContext";





function Inicio() {

    const [valor, setValor] = useState("");
    const { viandasDisponibles, setviandasDisponibles } = useContext(StockContext);
    const navigate = useNavigate();

    const agregarVianda = (e) => {
        e.preventDefault(); // Evita que la página se recargue por el <form>
        if (valor.trim() === "") return; // No agregar si está vacío

        const nuevaVianda = {
            id: Date.now(),
            nombre: valor
        };

        setviandasDisponibles([...viandasDisponibles, nuevaVianda]);
        setValor("");
    }

    return (
        <>
            <header>
                <div>
                    <h1>Bienvenido</h1>
                </div>
            </header>
            <br />
            <br />
            <div>
                <h2>Menu</h2>
                <br />
                <ul>
                    {viandasDisponibles.map((vianda) => (
                        <li key={vianda.id}>{vianda.nombre}</li>
                    ))}
                </ul>
            </div>

            <form onSubmit={agregarVianda}>
                <div>
                    <label htmlFor="contenido">Agregar vianda:
                        <input type="text"
                            id="contnido"
                            value={valor} onChange={(e) => setValor(e.target.value)} required />
                    </label>
                </div>
                <br />
                <div>
                    <button type="submit">Agregar vianda</button>
                </div>
            </form>
            <br />
            <br />
            <br />

            <Link to="/StockManager">
                <button type="button">comenzar</button></Link>


        </>
    )

}

export default Inicio;