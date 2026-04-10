import { useState } from "react";



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
                <h2>Gestion De Stock</h2>
            </div>

            <form action="">
                <div>
                    <label htmlFor="">Seleccionar vianda:
                        <select name="opciones" id="opcion-vianda">
                            <option value="">Elige opcion..</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </label>
                </div>
                <br />
                <div>
                    <label htmlFor="contenido">Contenido:
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

        </>
    )

}

export default Inicio;