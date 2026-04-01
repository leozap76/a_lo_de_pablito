const TIENDA_CONFIG = {
    nombre: "LA ROTISERIA",
    telefono: "542657780645",
    moneda: "$",
    // Horarios en formato 24hs
    horario: {
        turno1: { apertura: "09:00", cierre: "16:00" },
        turno2: { apertura: "18:00", cierre: "01:00" }
    },
    // Zonas de envío
    zonas: [
        { nombre: "Zona Centro", costo: 500 },
        { nombre: "Barrio Norte", costo: 900 },
        { nombre: "Retiro en Local", costo: 0 }
    ]
};




let productos = [];