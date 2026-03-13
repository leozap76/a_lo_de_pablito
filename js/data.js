const TIENDA_CONFIG = {
    nombre: "La Estación Gourmet",
    telefono: "542657234273",
    moneda: "$",
    // Horarios en formato 24hs
    horario: { apertura: "19:00", cierre: "23:59" },
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
        img: 'https://cdn3.myrealfood.app/recipes%2FPOCS6YfkZTzXBtNZ476G%2Fmain.jpg?alt=media&token=2350aee1-83f1-4522-b0f6-205145435698' 
    },
    { 
        id: 3, 
        nombre: 'Mila Napo con Fritas', 
        precio: 9000, 
        categoria: 'Minutas', 
        desc: 'Milanesa de carne con salsa de tomate premium, jamón y muzzarella gratinada.', 
        img: 'https://media.a24.com/p/bf7cf44c6a368f7d15dc3a30b8c5c419/adjuntos/296/imagenes/009/236/0009236858/1200x675/smart/el-plato-que-aman-todos-mila-napo-fritas-secretitos-que-ayudan.png' 
    },
    { 
        id: 6, 
        nombre: 'Lomo Completo', 
        precio: 9000, 
        categoria: 'Sandwiches', 
        desc: 'Sandwich de lomo tierno con huevo frito, jamón, queso y vegetales.', 
        img: 'https://cdn.pedix.app/2AzpcRFJOooNZMyp1dyE/products/AgQktqfy0-1N1KR9GMxOC.png?size=800x800' 
    },
    { 
        id: 7, 
        nombre: 'Hamburguesa Completa', 
        precio: 5000, 
        categoria: 'Sandwiches', 
        desc: 'Hamburguesa casera con papas fritas. ¡Un clásico infaltable!', 
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' 
    },

    // --- PIZZAS ---
    { 
        id: 12, 
        nombre: 'Pizza Muzzarella', 
        precio: 5500, 
        categoria: 'Pizzas', 
        desc: 'Nuestra muzzarella clásica con aceitunas verdes y orégano.', 
        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' 
    },
    { 
        id: 15, 
        nombre: 'Pizza Napolitana', 
        precio: 6500, 
        categoria: 'Pizzas', 
        desc: 'Muzzarella, rodajas de tomate fresco, ajo y perejil.', 
        img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80' 
    },
    { 
        id: 17, 
        nombre: 'Pizza Calabresa', 
        precio: 8500, 
        categoria: 'Pizzas', 
        desc: 'Muzzarella y rodajas de salame tipo calabrés de primera calidad.', 
        img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80' 
    },

    // --- EMPANADAS ---
    { 
        id: 10, 
        nombre: 'Empanadas ½ Docena', 
        precio: 5000, 
        categoria: 'Empanadas', 
        desc: 'Seis unidades a elección: Carne suave o Jamón y Queso.', 
        img: 'https://chefstv.net/wp-content/uploads/2024/03/0045-empanadas-saltenas-fritas-wide-web.webp' 
    }
];