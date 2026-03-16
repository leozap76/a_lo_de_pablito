function initApp() {
    document.getElementById('store-name').textContent = TIENDA_CONFIG.nombre;
    document.getElementById('catalog-container').innerHTML = ''; 
    renderCategories();
    renderProducts(productos); 
    setupSearch();
    updateUI(); 
    checkStoreStatus();
}

function checkStoreStatus() {
    try {
        const ahora = new Date();
        const minActual = (ahora.getHours() * 60) + ahora.getMinutes();

        const [hApe, mApe] = TIENDA_CONFIG.horario.apertura.split(':').map(Number);
        const [hCie, mCie] = TIENDA_CONFIG.horario.cierre.split(':').map(Number);

        const minApe = (hApe * 60) + mApe;
        const minCie = (hCie * 60) + mCie;

        let estaAbierto = false;

        if (minApe <= minCie) {
            estaAbierto = minActual >= minApe && minActual <= minCie;
        } else {
            estaAbierto = minActual >= minApe || minActual <= minCie;
        }
        
        updateStatusBadge(estaAbierto);
        return estaAbierto;
    } catch (error) {
        console.error("Error validando horario:", error);
        return true;
    }
}

function updateStatusBadge(open) {
    const badge = document.getElementById('store-status-badge');
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    
    if (!badge || !dot || !text) return; 

    if (open) {
        badge.className = "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200";
        dot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
        text.textContent = "Abierto ahora";
    } else {
        badge.className = "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200";
        dot.className = "w-2 h-2 rounded-full bg-slate-400";
        text.textContent = `Cerrado (Abre ${TIENDA_CONFIG.horario.apertura})`;
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

function renderProducts(lista) {
    const container = document.getElementById('catalog-container');
    if (!container) return;
    
    if (lista.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 text-gray-500">
                <i data-lucide="frown" class="w-16 h-16 mb-4 opacity-20"></i>
                <p class="text-xl font-medium">No encontramos lo que buscas</p>
            </div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="flex flex-col bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5 shadow-2xl group">
            <div class="relative w-full h-64 sm:h-72 overflow-hidden">
                <img src="${p.img}" 
                     alt="${p.nombre}" 
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     onerror="this.src='https://placehold.co/600x400/1a1a1a/ff6b00?text=Crazy+Food'">
                
                <div class="absolute top-5 right-5 bg-black/70 backdrop-blur-xl text-[#ff6b00] px-5 py-2 rounded-full font-black text-xl border border-[#ff6b00]/30 shadow-2xl">
                    ${TIENDA_CONFIG.moneda} ${p.precio.toLocaleString()}
                </div>
            </div>

            <div class="p-6 flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                <div class="flex justify-between items-center gap-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-white text-2xl mb-1 tracking-tight group-hover:text-[#ff6b00] transition-colors">${p.nombre}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">${p.desc}</p>
                    </div>
                    
                    <button onclick="addToCart(${p.id})" 
                            class="bg-[#ff6b00] text-black p-4 rounded-2xl shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all active:scale-90 flex items-center justify-center">
                        <i data-lucide="plus" class="w-7 h-7 stroke-[3px]"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

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
        totalEl.textContent = `${TIENDA_CONFIG.moneda} ${precioTotal.toLocaleString()}`;
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

function renderCartList() {
    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-slate-400 py-4 text-sm">El carrito está vacío</p>`;
        actualizarTotalConEnvio();
        return;
    }

    listContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-2">
            <div class="flex-1">
                <h4 class="font-bold text-slate-800 text-xs">${item.nombre}</h4>
                <p class="text-[10px] text-slate-500">$ ${item.precio.toLocaleString()}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="changeQuantity(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-red-500 border border-slate-100">
                    <i data-lucide="minus" class="w-3 h-3"></i>
                </button>
                <span class="font-bold text-xs w-4 text-center">${item.cantidad}</span>
                <button onclick="changeQuantity(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-orange-600 border border-slate-100">
                    <i data-lucide="plus" class="w-3 h-3"></i>
                </button>
            </div>
        </div>
    `).join('');

    actualizarTotalConEnvio();
    if (window.lucide) lucide.createIcons();
}