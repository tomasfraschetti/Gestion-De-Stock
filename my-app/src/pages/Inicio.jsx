import { useState } from "react";
import { Link } from "react-router-dom";




function Inicio() {

    const [valor, setValor] = useState("");


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
            </div>

            <form action="">
                <div>
                    <label htmlFor="contenido">Agregar vianda:
                        <input type="text"
                            id="contnido"
                            value={valor} onChange={(e) => setValor(e.target.value)} />
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