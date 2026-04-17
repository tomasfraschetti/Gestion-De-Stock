

import { createContext, useState } from 'react';

// Creamos la "nube" de datos
export const StockContext = createContext();

// Creamos el "Proveedor" que va a envolver a toda la App
export const StockProvider = ({ children }) => {
    // Acá nacen tus dos listas vacías
    const [viandasDisponibles, setviandasDisponibles] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    return (
        <StockContext.Provider value={{
            viandasDisponibles,
            setviandasDisponibles,
            pedidos,
            setPedidos
        }}>
            {children}
        </StockContext.Provider>
    );
};



