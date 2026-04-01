function initApp() {
    
    // 1. PRIMERO REVISAMOS EL HORARIO (Para quitar el "Cargando" de inmediato)
    checkStoreStatus();

    // 2. CARGAMOS EL RESTO PROTEGIDO (Si algo falla aquí, no congelará la web)
    try { 
        const storeName = document.getElementById('store-name');
        if (storeName) storeName.textContent = TIENDA_CONFIG.nombre; 
    } catch(e) {}

    try { 
        const catalog = document.getElementById('catalog-container');
        if (catalog) catalog.innerHTML = ''; 
    } catch(e) {}

    try { renderCategories(); } catch(e) { console.log("Aviso: renderCategories falló"); }
    try { renderProducts(productos); } catch(e) { console.log("Aviso: renderProducts falló"); }
    
    // Sospecho que setupSearch no existe en tu código actual y esto trababa la app
    try { setupSearch(); } catch(e) { console.log("Aviso: setupSearch no encontrado (Ignorado)"); }
    
    try { updateUI(); } catch(e) { console.log("Aviso: updateUI no encontrado"); }
}

function renderCartList() {
    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-500 gap-2 py-8"><i data-lucide="shopping-cart" class="w-10 h-10 opacity-20"></i><p>El carrito está vacío</p></div>`;
        if (typeof actualizarTotalConEnvio === "function") actualizarTotalConEnvio();
        if (window.lucide) lucide.createIcons();
        return;
    }

    listContainer.innerHTML = cart.map(item => {
        const idLimpio = String(item.cartItemId || item.id);

        return `
        <div class="flex justify-between items-center bg-[#111] p-4 rounded-2xl mb-3 border border-white/5">
            <div class="flex-1">
                <h4 class="font-bold text-white text-sm">${item.nombre}</h4>
                <p class="text-xs text-[#ff6b00] font-bold mt-1">$ ${(item.precio * item.cantidad).toLocaleString()}</p>
            </div>
            <div class="flex items-center gap-4 bg-black px-2 py-1.5 rounded-full border border-white/10">
                <button type="button" onclick="changeQuantity('${idLimpio}', -1)" 
                        class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-[#ff6b00] rounded-full text-white transition-all cursor-pointer">
                    <span class="text-xl font-bold leading-none mb-0.5">−</span>
                </button>

                <span class="font-bold text-sm w-4 text-center text-white">${item.cantidad}</span>

                <button type="button" onclick="changeQuantity('${idLimpio}', 1)" 
                        class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-[#ff6b00] rounded-full text-white transition-all cursor-pointer">
                    <span class="text-xl font-bold leading-none mb-0.5">+</span>
                </button>
            </div>
        </div>`;
    }).join('');

    if (typeof actualizarTotalConEnvio === "function") actualizarTotalConEnvio();
}

function checkStoreStatus() {
    try {
        console.log("Verificando horarios v2..."); // Mensaje para verificar en consola
        const ahora = new Date();
        const minActual = (ahora.getHours() * 60) + ahora.getMinutes();

        // Verificamos si existe la configuración de DOS TURNOS en data.js
        if (TIENDA_CONFIG.horario && TIENDA_CONFIG.horario.turno1) {
            
            const estaEnRango = (turno) => {
                if (!turno || !turno.apertura || !turno.cierre) return false;
                const [hApe, mApe] = turno.apertura.split(':').map(Number);
                const [hCie, mCie] = turno.cierre.split(':').map(Number);
                const minApe = (hApe * 60) + mApe;
                const minCie = (hCie * 60) + mCie;
                
                if (minApe <= minCie) {
                    return minActual >= minApe && minActual <= minCie;
                } else {
                    return minActual >= minApe || minActual <= minCie; // Cruce de medianoche
                }
            };

            const abiertoT1 = estaEnRango(TIENDA_CONFIG.horario.turno1);
            const abiertoT2 = estaEnRango(TIENDA_CONFIG.horario.turno2);
            const estaAbierto = abiertoT1 || abiertoT2;

            // Calcular próximo horario
            const [hA1, mA1] = TIENDA_CONFIG.horario.turno1.apertura.split(':').map(Number);
            const [hA2, mA2] = TIENDA_CONFIG.horario.turno2.apertura.split(':').map(Number);
            const minA1 = (hA1 * 60) + mA1;
            const minA2 = (hA2 * 60) + mA2;

            let proximo = "";
            if (minActual < minA1) proximo = TIENDA_CONFIG.horario.turno1.apertura;
            else if (minActual >= minA1 && minActual < minA2) proximo = TIENDA_CONFIG.horario.turno2.apertura;
            else proximo = TIENDA_CONFIG.horario.turno1.apertura; // Siguiente día

            updateStatusBadge(estaAbierto, proximo);
            return estaAbierto;
        } 
        
        // Si no hay configuración de 2 turnos, forzamos ABIERTO para no bloquear
        updateStatusBadge(true, "");
        return true;

    } catch (error) {
        console.error("Error fatal validando horario:", error);
        // SI OCURRE UN ERROR, QUITAMOS EL "CARGANDO" SÍ O SÍ
        updateStatusBadge(true, "");
        return true;
    }
}

function updateStatusBadge(abierto, proximo = "") {
    const badge = document.getElementById('status-badge');
    if (!badge) return;

    if (abierto) {
        badge.innerHTML = `
            <span class="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20 tracking-tight">
                ● ABIERTO AHORA
            </span>`;
    } else {
        badge.innerHTML = `
            <div class="flex flex-col items-center gap-1">
                <span class="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20 tracking-tight">
                    ● CERRADO
                </span>
                <span class="text-gray-500 text-[10px] font-medium uppercase tracking-widest">
                    Abre a las ${proximo} hs
                </span>
            </div>`;
    }
}

function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    const categories = ['Todos', ...new Set(productos.map(p => p.categoria))];
    
    container.innerHTML = categories.map(cat => `
        <button onclick="filterByCategory('${cat}')" 
                class="category-btn whitespace-nowrap px-6 py-2.5 rounded-full bg-[#1a1a1a] text-gray-400 border border-white/10 text-sm font-semibold transition-all active:scale-95">
            ${cat}
        </button>
    `).join('');
}

function filterByCategory(cat) {
    // Primero, quitamos el estilo activo de todos los botones
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-[#ff6b00]', 'text-black', 'border-[#ff6b00]');
        btn.classList.add('bg-[#1a1a1a]', 'text-gray-400', 'border-white/10');
    });

    // Marcamos como activo el botón clickeado
    const eventBtn = event?.currentTarget;
    if (eventBtn) {
        eventBtn.classList.remove('bg-[#1a1a1a]', 'text-gray-400', 'border-white/10');
        eventBtn.classList.add('bg-[#ff6b00]', 'text-black', 'border-[#ff6b00]');
    }

    if (cat === 'Todos') {
        renderProducts(productos);
    } else {
        const filtrados = productos.filter(p => p.categoria === cat);
        renderProducts(filtrados);
    }
}
function renderProducts(productosToRender) {
    const catalog = document.getElementById('catalog-container');
    if (!catalog) return;

    if (productosToRender.length === 0) {
        catalog.innerHTML = `<div class="p-8 text-center text-slate-500"><i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-20"></i><p>No se encontraron productos.</p></div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    // CLAVE: grid-cols-1 asegura que SIEMPRE ocupe toda la pantalla
    catalog.className = "grid grid-cols-1 gap-6 pb-24";

    catalog.innerHTML = productosToRender.map(prod => {
        let opcionesHTML = '';
        let precioDisplay = `$ ${prod.precio.toLocaleString()}`;
        
        let btnAgregar = `<button type="button" onclick="addToCart(${prod.id})" class="h-10 px-5 flex items-center justify-center bg-[#ff6b00] text-black rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wide text-xs">Agregar <span class="text-lg leading-none ml-2 mb-0.5">+</span></button>`;

        if (prod.opciones && prod.opciones.length > 0) {
            precioDisplay = `Desde $${prod.opciones[0].precio.toLocaleString()}`;
            opcionesHTML = `
                <select id="opc-${prod.id}" class="mt-3 w-full bg-[#1a1a1a] border border-white/10 text-white text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:border-[#ff6b00] transition-colors appearance-none">
                    ${prod.opciones.map((op, i) => `<option value="${i}">${op.nombre} - $${op.precio.toLocaleString()}</option>`).join('')}
                </select>
            `;
            btnAgregar = `<button type="button" onclick="addToCart(${prod.id}, document.getElementById('opc-${prod.id}').value)" class="h-10 px-5 flex items-center justify-center bg-[#ff6b00] text-black rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wide text-xs">Agregar <span class="text-lg leading-none ml-2 mb-0.5">+</span></button>`;
        }

        return `
        <div class="bg-[#111] rounded-[2rem] overflow-hidden shadow-lg border border-white/5 flex flex-col">
            <div class="relative w-full h-64 bg-black">
                <img src="${prod.img}" alt="${prod.nombre}" class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" loading="lazy">
            </div>
            <div class="p-5 flex flex-col gap-2">
                <div>
                    <h3 class="font-black text-white text-xl leading-tight">${prod.nombre}</h3>
                    <p class="text-sm text-gray-400 mt-1 line-clamp-2">${prod.desc}</p>
                    ${opcionesHTML}
                </div>
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span class="font-black text-[#ff6b00] text-2xl tracking-tighter">${precioDisplay}</span>
                    ${btnAgregar}
                </div>
            </div>
        </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function setupSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtrados = productos.filter(p => 
            p.nombre.toLowerCase().includes(term) || 
            p.desc.toLowerCase().includes(term)
        );
        renderProducts(filtrados);
    });
}

function updateUI() {
    const bar = document.getElementById('bottom-cart-bar');
    const countEl = document.getElementById('cart-count');
    const itemsTextEl = document.getElementById('cart-items-text');
    const totalEl = document.getElementById('cart-total');

    if (!bar || !countEl || !totalEl) return;

    const totalArticulos = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const precioTotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    if (totalArticulos > 0) {
        bar.classList.remove('translate-y-full', 'opacity-0');
        countEl.textContent = totalArticulos;
        if(itemsTextEl) itemsTextEl.textContent = totalArticulos === 1 ? '1 artículo' : `${totalArticulos} artículos`;
        
        // 🔥 ESTA ES LA LÍNEA REPARADA 🔥
        totalEl.textContent = `$ ${precioTotal.toLocaleString()}`;
        
    } else {
        bar.classList.add('translate-y-full', 'opacity-0');
    }
}

function toggleCheckout(show) {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    if (show) {
        modal.classList.remove('hidden');
        renderCartList();
        
        const zoneSelect = document.getElementById('cust-zone');
        if (zoneSelect && TIENDA_CONFIG.zonas) {
            zoneSelect.innerHTML = '<option value="" data-costo="0">Seleccionar zona...</option>' + 
                TIENDA_CONFIG.zonas.map((z, i) => `<option value="${i}" data-costo="${z.costo}">${z.nombre} (+$${z.costo})</option>`).join('');
        }
        actualizarTotalConEnvio();
        if (window.lucide) lucide.createIcons();
    } else {
        modal.classList.add('hidden');
    }
}

function actualizarTotalConEnvio() {
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const zoneSelect = document.getElementById('cust-zone');
    const costoEnvio = zoneSelect && zoneSelect.selectedIndex > 0 ? 
        parseInt(zoneSelect.options[zoneSelect.selectedIndex].getAttribute('data-costo') || 0) : 0;
    
    const displayTotal = document.getElementById('modal-total-amount');
    if (displayTotal) {
        displayTotal.textContent = `$ ${(subtotal + costoEnvio).toLocaleString()}`;
    }
}

function renderProducts(productosToRender) {
    const catalog = document.getElementById('catalog-container');
    if (!catalog) return;

    if (productosToRender.length === 0) {
        catalog.innerHTML = `<div class="p-8 text-center text-slate-500"><i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-20"></i><p>No se encontraron productos.</p></div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    // AHORA FORZAMOS A 1 SOLA COLUMNA SIEMPRE (grid-cols-1)
    catalog.className = "grid grid-cols-1 gap-6 pb-24";

    catalog.innerHTML = productosToRender.map(prod => {
        let opcionesHTML = '';
        let precioDisplay = `$ ${prod.precio.toLocaleString()}`;
        
        let btnAgregar = `<button type="button" onclick="addToCart(${prod.id})" class="h-10 px-5 flex items-center justify-center bg-[#ff6b00] text-black rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wide text-xs">Agregar <span class="text-lg leading-none ml-2 mb-0.5">+</span></button>`;

        if (prod.opciones && prod.opciones.length > 0) {
            precioDisplay = `Desde $${prod.opciones[0].precio.toLocaleString()}`;
            opcionesHTML = `
                <select id="opc-${prod.id}" class="mt-3 w-full bg-[#1a1a1a] border border-white/10 text-white text-sm py-2.5 px-3 rounded-xl focus:outline-none focus:border-[#ff6b00] transition-colors appearance-none">
                    ${prod.opciones.map((op, i) => `<option value="${i}">${op.nombre} - $${op.precio.toLocaleString()}</option>`).join('')}
                </select>
            `;
            btnAgregar = `<button type="button" onclick="addToCart(${prod.id}, document.getElementById('opc-${prod.id}').value)" class="h-10 px-5 flex items-center justify-center bg-[#ff6b00] text-black rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wide text-xs">Agregar <span class="text-lg leading-none ml-2 mb-0.5">+</span></button>`;
        }

        return `
        <div class="bg-[#111] rounded-[2rem] overflow-hidden shadow-lg border border-white/5 flex flex-col">
            <div class="relative w-full h-64 bg-black">
                <img src="${prod.img}" alt="${prod.nombre}" class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" loading="lazy">
            </div>
            <div class="p-5 flex flex-col gap-2">
                <div>
                    <h3 class="font-black text-white text-xl leading-tight">${prod.nombre}</h3>
                    <p class="text-sm text-gray-400 mt-1 line-clamp-2">${prod.desc}</p>
                    ${opcionesHTML}
                </div>
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span class="font-black text-[#ff6b00] text-2xl tracking-tighter">${precioDisplay}</span>
                    ${btnAgregar}
                </div>
            </div>
        </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
}