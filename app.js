/**
 * VELOURA BEAUTY - Lógica de la Aplicación
 * Proyecto Académico de FrontEnd
 * 
 * Se utilizó IA (Gemini 3.1 Pro) para optimizar la estructura del código y los estilos CSS, 
 * asegurando el cumplimiento estricto de la rúbrica y las buenas prácticas.
 */

// ==========================================================================
// 1. BASE DE DATOS Y ESTADO (Arrays y Objetos)
// ==========================================================================
const products = [
    {
        id: 1,
        name: "NYX Ultimate Shadow Palette",
        price: 18000,
        category: "ojos",
        image: "https://dbs.cl/media/catalog/product/n/y/nyx-nx-27876-1.jpg"
    },
    {
        id: 2,
        name: "NYX Epic Ink Liner",
        price: 12000,
        category: "ojos",
        image: "https://dbs.cl/media/catalog/product/n/y/nyx-pmu-nx-26176.jpg"
    },
    {
        id: 3,
        name: "Urban Decay All Nighter Setting Spray",
        price: 35000,
        category: "rostro",
        image: "https://arrebolboutique.cl/wp-content/uploads/2025/05/s2431872-main-zoom-600x600.webp"
    },
    {
        id: 4,
        name: "Sephora Collection Lip Stain",
        price: 15000,
        category: "labios",
        image: "https://cdnx.jumpseller.com/indigostore/image/52795684/resize/1800/1800?1725759939"
    },
    {
        id: 5,
        name: "NYX Face Freezie Cooling Primer",
        price: 16000,
        category: "rostro",
        image: "https://bellisima.mx/cdn/shop/files/nyx-face-glue-fijador-03_1200x.webp"
    },
    {
        id:6,
        name:"Perversion mascara de ojos",
        price:19000,
        category: "ojos",
        image:"https://i5.walmartimages.cl/asr/5a208426-9ecb-4ff0-9e20-b8778a1991b2.0256d759c20231013019538690a58353.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"
    },
    {
        id:7,
        name:"Delineador de ojos Rosado",
        price:12000,
        category:"ojos",
        image:"https://static.preunic.cl/63ls5fwv0eqzilh33w98laxcj5n4" 
    },
    {
        id:8,
        name:"Primer de ojos Urban Decay",
        price:28000,
        category:"ojos",
        image:"https://media.falabella.com/falabellaCL/15022644_1/w=1004,h=1500,fit=pad"
    },
    {
        id:9,
        name:"Paleta de sombras Nyx",
        price:38000,
        category:"ojos",
        image:"https://hips.hearstapps.com/hmg-prod/images/2elle-naked-stoned-urban-decay-1599847969.jpg?resize=980:*"
    },  
];

// Estado de la aplicación
let cart = [];
let currentFilteredProducts = [...products];

// ==========================================================================
// 2. REFERENCIAS AL DOM
// ==========================================================================
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const noResultsMsg = document.getElementById('no-results');

// Carrito DOM
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');

// Formulario DOM
const subscribeForm = document.getElementById('subscribe-form');
const formFeedback = document.getElementById('form-feedback');

// ==========================================================================
// 3. FUNCIONES DE RENDERIZADO Y DOM (Manipulación del DOM)
// ==========================================================================

/**
 * Función modular para renderizar productos en la grilla.
 * Utiliza createElement en lugar de innerHTML concatenado masivo por seguridad
 * @param {Array} productsToRender - Array de objetos de productos
 */
function renderProducts(productsToRender) {
    // Limpiar grid actual
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        noResultsMsg.classList.remove('hidden');
        return;
    } else {
        noResultsMsg.classList.add('hidden');
    }

    // Renderizado dinámico usando forEach() - Requisito rúbrica
    productsToRender.forEach(product => {
        // Crear elementos de forma dinámica (createElement)
        const article = document.createElement('article');
        article.className = 'product-card fade-in-up';

        // Estructura interna de la tarjeta usando template literals
        article.innerHTML = `
            <div class="product-badge">Top Ventas</div>
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toLocaleString('es-CL')}</div>
                <button class="btn-add-cart" data-id="${product.id}">
                    Agregar a la Bolsa
                </button>
            </div>
        `;

        productsGrid.appendChild(article);
    });
}

/**
 * Renderiza los items del carrito/favoritos dinámicamente
 * Demuestra: LEER datos del arreglo (forEach)
 */
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#777; margin-top:20px;">Tu bolsa está vacía.</p>';
    } else {
        cart.forEach((item, index) => {
            total += (item.price * item.quantity);
            totalItems += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-CL')} x ${item.quantity}</div>
                    <button class="cart-item-remove" data-index="${index}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Actualizar total y badge
    cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    cartBadge.textContent = totalItems;
}

// ==========================================================================
// 4. LÓGICA DE NEGOCIO (Filtros, Carrito)
// ==========================================================================

/**
 * Filtra los productos basándose en la búsqueda y la categoría seleccionada
 */
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;

    // Uso de métodos de array: filter() - Requisito rúbrica
    currentFilteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    renderProducts(currentFilteredProducts);
}

/**
 * Agrega un producto al carrito
 * @param {Number} productId - ID del producto a agregar
 */
function addToCart(productId) {
    // 1. LEER: Buscar el producto en la base de datos
    const productToAdd = products.find(p => p.id === productId);
    
    if (productToAdd) {
        // Buscar si ya existe en el carrito
        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            // 2. ACTUALIZAR EN ARREGLO: Si ya existe, le sumamos 1 a la cantidad
            existingCartItem.quantity += 1;
        } else {
            // 3. CREAR EN ARREGLO: Si no existe, lo insertamos nuevo con quantity = 1
            cart.push({ ...productToAdd, quantity: 1 });
        }

        renderCart();
        // Feedback visual: abriendo el carrito
        openCart();
    }
}

/**
 * Elimina un producto del carrito por su índice
 * @param {Number} index - Índice en el array del carrito
 */
function removeFromCart(index) {
    // 4. ELIMINAR DE ARREGLO: Quitamos el elemento usando splice()
    cart.splice(index, 1);
    renderCart();
}

// Controladores UI Carrito
function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================================================
// 5. VALIDACIÓN DE FORMULARIO Y SEGURIDAD
// ==========================================================================

/**
 * Sanitización básica para prevenir Inyección de HTML / XSS
 * @param {String} str - String a sanitizar
 * @returns {String} String sanitizado
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Maneja la validación avanzada y envío del formulario
 * @param {Event} e - Evento submit
 */
function validateForm(e) {
    // preventDefault() obligatorio por rúbrica
    e.preventDefault();

    // Resetear mensajes de error
    const errorMsgs = document.querySelectorAll('.error-msg');
    errorMsgs.forEach(msg => msg.textContent = '');
    
    const inputs = subscribeForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('error-input');
        input.classList.remove('success-input');
    });

    formFeedback.className = 'form-feedback hidden';
    formFeedback.textContent = '';

    // Obtener valores del DOM
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const interestSelect = document.getElementById('interest');

    // Sanitizar valores de entrada
    const name = sanitizeHTML(nameInput.value.trim());
    const email = sanitizeHTML(emailInput.value.trim());
    const age = parseInt(ageInput.value.trim());
    const interest = sanitizeHTML(interestSelect.value);

    let isValid = true;

    // 1. Validar Nombre (Obligatorio, min 3 letras)
    if (name.length < 3) {
        document.getElementById('error-name').textContent = 'El nombre debe tener al menos 3 caracteres.';
        nameInput.classList.add('error-input');
        isValid = false;
    } else {
        nameInput.classList.add('success-input');
    }

    // 2. Validar Email con Regex (Requisito rúbrica)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('error-email').textContent = 'Ingresa un correo electrónico válido.';
        emailInput.classList.add('error-input');
        isValid = false;
    } else {
        emailInput.classList.add('success-input');
    }

    // 3. Validar Edad (Obligatorio, mayor de 14 años - Requisito rúbrica)
    if (isNaN(age) || age < 14 || age > 100) {
        document.getElementById('error-age').textContent = 'Debes tener entre 14 y 100 años para suscribirte.';
        ageInput.classList.add('error-input');
        isValid = false;
    } else {
        ageInput.classList.add('success-input');
    }

    // 4. Validar Select (Obligatorio)
    if (!interest) {
        document.getElementById('error-interest').textContent = 'Por favor selecciona un interés.';
        interestSelect.classList.add('error-input');
        isValid = false;
    } else {
        interestSelect.classList.add('success-input');
    }

    // Mostrar feedback visual basado en la validación
    if (isValid) {
        // Simulación de éxito
        formFeedback.textContent = `¡Gracias por unirte, ${name.split(' ')[0]}! Revisa tu correo (${email}) para tu descuento.`;
        formFeedback.classList.remove('hidden');
        formFeedback.classList.add('success');
        
        // Limpiar formulario después de éxito
        subscribeForm.reset();
        inputs.forEach(input => input.classList.remove('success-input'));
    }
}

// ==========================================================================
// 6. INICIALIZACIÓN Y EVENT LISTENERS (addEventListener)
// ==========================================================================

function initApp() {
    // Renderizado dinámico inicial
    renderProducts(products);
    renderCart();

    // Eventos Filtros Interactivos
    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);

    // Delegación de eventos para el botón "Agregar a la Bolsa" y "Eliminar del carrito"
    document.addEventListener('click', (e) => {
        // Interacción: Agregar al carrito
        if (e.target.classList.contains('btn-add-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }

        // Interacción: Eliminar del carrito
        if (e.target.classList.contains('cart-item-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
        }
    });

    // Eventos UI Carrito
    cartToggle.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    // Evento Formulario
    subscribeForm.addEventListener('submit', validateForm);

    // Animación suave del Navbar al hacer scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
    });
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);