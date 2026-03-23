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




const productos = [
    // --- MINUTAS Y PARRILLA ---
    { 
        id: 1, 
        nombre: 'Pollo con Fritas', 
        precio: 18000, 
        precioAnterior: 22000,
        categoria: 'Minutas', 
        desc: 'Pollo entero asado a la leña, acompañado de papas fritas bastón.', 
        img: 'img/pollo-frita.webp' 
    },
    { 
        id: 3, 
        nombre: 'Mila Napo con Fritas', 
        precio: 9000, 
        categoria: 'Minutas', 
        desc: 'Milanesa de carne con salsa de tomate premium, jamón y muzzarella gratinada.', 
        img: 'img/napo-frita.webp' 
    },
    { 
        id: 6, 
        nombre: 'Lomo Completo', 
        precio: 9000, 
        categoria: 'Sandwiches', 
        desc: 'Sandwich de lomo tierno con huevo frito, jamón, queso y vegetales.', 
        img: 'img/lomo-frita.webp' 
    },
    { 
        id: 7, 
        nombre: 'Hamburguesa Completa', 
        precio: 5000, 
        categoria: 'Sandwiches', 
        desc: 'Hamburguesa casera con papas fritas. ¡Un clásico infaltable!', 
        img: 'img/hamburguesa.webp' 
    },

    // --- PIZZAS ---
    { 
        id: 12, 
        nombre: 'Pizza Muzzarella', 
        precio: 5500, 
        categoria: 'Pizzas', 
        desc: 'Nuestra muzzarella clásica con aceitunas verdes y orégano.', 
        img: 'img/pizza-muzza.webp' 
    },
    { 
        id: 15, 
        nombre: 'Pizza Napolitana', 
        precio: 6500, 
        categoria: 'Pizzas', 
        desc: 'Muzzarella, rodajas de tomate fresco, ajo y perejil.', 
        img: 'img/pizza-rucula.webp' 
    },
    { 
        id: 17, 
        nombre: 'Pizza Calabresa', 
        precio: 8500, 
        categoria: 'Pizzas', 
        desc: 'Muzzarella y rodajas de salame tipo calabrés de primera calidad.', 
        img: 'img/pizza-cala.webp' 
    },
    {
        "id": 1774003552708,
        "nombre": "Pizza Especial Grande/Chica",
        "precio": 5000,
        "categoria": "Pizzas",
        "desc": "Elige la que mas te guste",
        "img": "https://alicante.com.ar/wp-content/uploads/2022/06/iStock-1048461158-Pizza-especial-scaled.jpg",
        "opciones": [
            {
                "nombre": "Chica",
                "precio": 5000
            },
            {
                "nombre": "Grande",
                "precio": 7000
            }
        ]
    },
   

    // --- EMPANADAS ---
    { 
        id: 10, 
        nombre: 'Empanadas ½ Docena', 
        precio: 5000, 
        categoria: 'Empanadas', 
        desc: 'Seis unidades a elección: Carne suave o Jamón y Queso.', 
        img: 'img/empanadas.webp' 
    }
];