let cart = JSON.parse(localStorage.getItem('pedido')) || [];

function addToCart(id) {
    const prod = productos.find(p => p.id === id);
    const exists = cart.find(item => item.id === id);
    if (exists) exists.cantidad++;
    else cart.push({ ...prod, cantidad: 1 });
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('pedido', JSON.stringify(cart));
    updateUI(); 
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) cart = cart.filter(i => i.id !== id);
        saveAndRefresh();
        renderCartList();
    }
}

function iniciarCheckout() {
    toggleCheckout(true); 
}

// NUEVA FUNCIÓN DE VALIDACIÓN
function procesarEnvioWhatsApp() {
    try {
        if (!checkStoreStatus()) {
            alert("El local está cerrado. Nuestro horario es de " + TIENDA_CONFIG.horario.apertura + " a " + TIENDA_CONFIG.horario.cierre);
            return;
        }

        // Leemos los valores asegurándonos de que no haya espacios en blanco (.trim())
        const nombreElement = document.getElementById('cust-name');
        const direccionElement = document.getElementById('cust-address');
        const zoneSelect = document.getElementById('cust-zone');
        const pagoSelect = document.getElementById('cust-payment');
        
        const nombre = nombreElement ? nombreElement.value.trim() : '';
        const direccion = direccionElement ? direccionElement.value.trim() : '';

        // Validación estricta
        if (!nombre || !direccion || !zoneSelect || zoneSelect.value === "") {
            alert("⚠️ Por favor, completa tu Nombre, Dirección y elige una Zona de Envío.");
            return;
        }

        const zonaTexto = zoneSelect.options[zoneSelect.selectedIndex].text;
        const costoEnvio = parseInt(zoneSelect.options[zoneSelect.selectedIndex].getAttribute('data-costo')) || 0;
        const pago = pagoSelect ? pagoSelect.value : "Efectivo";

        let mensaje = `*PEDIDO: ${TIENDA_CONFIG.nombre}*%0A`;
        mensaje += `*Cliente:* ${nombre}%0A*Dirección:* ${direccion}%0A*Zona:* ${zonaTexto}%0A*Pago:* ${pago}%0A%0A`;
        
        let subtotal = 0;
        cart.forEach(item => {
            const sub = item.precio * item.cantidad;
            subtotal += sub;
            mensaje += `- ${item.cantidad}x ${item.nombre} ($${sub.toLocaleString()})%0A`;
        });

        const totalFinal = subtotal + costoEnvio;
        mensaje += `%0A*Subtotal:* $${subtotal.toLocaleString()}%0A*Envío:* $${costoEnvio.toLocaleString()}%0A*TOTAL: $${totalFinal.toLocaleString()}*`;

        window.open(`https://wa.me/${TIENDA_CONFIG.telefono}?text=${mensaje}`, '_blank');
        
    } catch (error) {
        // ESTO NOS DIRÁ EXACTAMENTE QUÉ ESTÁ ROTO
        alert("Error técnico: " + error.message);
        console.error("Error al enviar WhatsApp:", error);
    }
}
function finalizarPedido(datosCliente) {
    const { nombre, direccion, pago } = datosCliente;
    
    const zoneSelect = document.getElementById('cust-zone');
    const zonaTexto = zoneSelect.options[zoneSelect.selectedIndex].text;
    const costoEnvio = parseInt(zoneSelect.options[zoneSelect.selectedIndex].getAttribute('data-costo') || 0);

    let mensaje = `*NUEVO PEDIDO - ${TIENDA_CONFIG.nombre}*%0A`;
    mensaje += `--------------------------%0A`;
    mensaje += `*Cliente:* ${nombre}%0A`;
    mensaje += `*Entrega:* ${direccion}%0A`;
    mensaje += `*Zona:* ${zonaTexto}%0A`;
    mensaje += `*Pago:* ${pago}%0A`;
    mensaje += `--------------------------%0A%0A`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const sub = item.precio * item.cantidad;
        subtotal += sub;
        mensaje += `• ${item.cantidad}x ${item.nombre} ($${sub.toLocaleString()})%0A`;
    });

    const totalFinal = subtotal + costoEnvio;
    
    mensaje += `%0A--------------------------%0A`;
    mensaje += `*Subtotal:* $${subtotal.toLocaleString()}%0A`;
    mensaje += `*Envío:* $${costoEnvio.toLocaleString()}%0A`;
    mensaje += `*TOTAL A PAGAR: $${totalFinal.toLocaleString()}*%0A`;
    mensaje += `--------------------------`;
    
    window.open(`https://wa.me/${TIENDA_CONFIG.telefono}?text=${mensaje}`, '_blank');
}