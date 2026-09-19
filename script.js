document.addEventListener("DOMContentLoaded", () => {

    const featuredContainer = document.querySelector(".featured-products");
    const bestSellerContainer = document.querySelector(".best-sellers-grid");

    if (featuredContainer) {
        renderFeaturedProducts(featuredContainer);
    }

    if (bestSellerContainer) {
        renderBestSellers(bestSellerContainer);
    }

});


/* ================================
   PRODUCT CARD
================================ */

function createProductCard(product) {

    return `
        <article class="product-card">

            <a
                href="product.html?id=${product.id}"
                class="product-image-link"
            >

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>

            </a>


            <div class="product-info">

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <p class="product-price">
                    ₦${product.price.toLocaleString("en-NG")}
                </p>

                <a
                    href="product.html?id=${product.id}"
                    class="product-link"
                >
                    View Product →
                </a>

            </div>

        </article>
    `;
}


/* ================================
   FEATURED PRODUCTS
================================ */

function renderFeaturedProducts(container) {

    const featuredProducts = products.slice(0, 8);

    container.innerHTML = featuredProducts
        .map(createProductCard)
        .join("");
}


/* ================================
   BEST SELLERS
================================ */

function renderBestSellers(container) {

    const bestSellers = products.slice(8, 11);

    container.innerHTML = bestSellers
        .map(createProductCard)
        .join("");
}

/* =========================================
   PRICE FORMATTER
========================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}


/* =========================================
   PRODUCT DETAILS PAGE
========================================= */

const productName = document.getElementById("product-name");
const productImage = document.getElementById("product-image");
const productCategory = document.getElementById("product-category");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const addToCartButton = document.getElementById("add-to-cart");
const whatsappOrder = document.getElementById("whatsapp-order");


if (productName) {

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Find the product in data.js
    const product = products.find(item => item.id === productId);


    if (!product) {

        productName.textContent = "Product not found";

        productDescription.textContent =
            "Sorry, this product could not be found.";

        productImage.style.display = "none";

        addToCartButton.style.display = "none";

        whatsappOrder.style.display = "none";

    } else {

        // Product information
        productName.textContent = product.name;

        productCategory.textContent = product.category;

        productPrice.textContent = formatPrice(product.price);

        productImage.src = product.image;

        productImage.alt = product.name;


        // Product description
        productDescription.textContent =
            product.description ||
            "Premium quality hair carefully selected by Oma Hairline.";


        // WhatsApp order
        const message = `Hello Oma Hairline, I am interested in ${product.name} priced at ${formatPrice(product.price)}.`;
        const whatsappNumber = "2349135028166";

        whatsappOrder.href =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


        // Add to cart
        addToCartButton.addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("omaCart")) || [];

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    localStorage.setItem(
        "omaCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    addToCartButton.textContent = "Added ✓";

    setTimeout(() => {
        addToCartButton.textContent = "Add to Cart";
    }, 1500);

});
function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("omaCart")
    ) || [];

    const cartCountElements =
        document.querySelectorAll(".cart-count");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

updateCartCount();

    }

}


/* =========================================
   CART PAGE
========================================= */

const cartItemsContainer = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");


if (cartItemsContainer) {

    function renderCart() {

        const cart =
            JSON.parse(localStorage.getItem("omaCart")) || [];

        cartItemsContainer.innerHTML = "";


        // Empty cart
        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>
                        You haven't added any products yet.
                    </p>

                    <a href="shop.html">
                        Start Shopping
                    </a>
                </div>
            `;

            cartSubtotal.textContent = "₦0";
            cartTotal.textContent = "₦0";

            return;
        }


        let subtotal = 0;


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            subtotal += itemTotal;


            const cartItem =
                document.createElement("article");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="cart-item-info">

                    <h2>
                        ${item.name}
                    </h2>

                    <p>
                        ${formatPrice(item.price)}
                    </p>


                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${item.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${item.id}"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>


                <div class="cart-item-total">

                    ${formatPrice(itemTotal)}

                </div>

            `;


            cartItemsContainer.appendChild(cartItem);

        });


        cartSubtotal.textContent =
            formatPrice(subtotal);

        cartTotal.textContent =
            formatPrice(subtotal);


        attachCartEvents();

    }


    function attachCartEvents() {

        document
            .querySelectorAll(".quantity-plus")
            .forEach(button => {

                button.addEventListener("click", () => {

                    changeQuantity(
                        button.dataset.id,
                        1
                    );

                });

            });


        document
            .querySelectorAll(".quantity-minus")
            .forEach(button => {

                button.addEventListener("click", () => {

                    changeQuantity(
                        button.dataset.id,
                        -1
                    );

                });

            });


        document
            .querySelectorAll(".remove-item")
            .forEach(button => {

                button.addEventListener("click", () => {

                    removeFromCart(
                        button.dataset.id
                    );

                });

            });

    }


    function changeQuantity(productId, change) {

        let cart =
            JSON.parse(localStorage.getItem("omaCart")) || [];


        const item =
            cart.find(item => item.id === productId);


        if (!item) return;


        item.quantity += change;


        if (item.quantity <= 0) {

            cart =
                cart.filter(item => item.id !== productId);

        }


        localStorage.setItem(
            "omaCart",
            JSON.stringify(cart)
        );


        renderCart();

        updateCartCount();

    }


    function removeFromCart(productId) {

        let cart =
            JSON.parse(localStorage.getItem("omaCart")) || [];


        cart =
            cart.filter(item => item.id !== productId);


        localStorage.setItem(
            "omaCart",
            JSON.stringify(cart)
        );


        renderCart();

        updateCartCount();

    }


    renderCart();

}
/* =========================================
   CART BUTTON
========================================= */

const cartButtons = document.querySelectorAll(".cart-button");

cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        window.location.href = "cart.html";

    });

});

/* =========================================
   SHOP PAGE
========================================= */

const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-btn");

if (productsGrid) {

    let currentCategory = "all";
    let currentSearch = "";

    /* -----------------------------------------
       DISPLAY PRODUCTS
    ----------------------------------------- */

    function displayProducts(productsToDisplay) {

        productsGrid.innerHTML = "";

        if (productsToDisplay.length === 0) {

            productsGrid.innerHTML = `
                <div class="no-products">
                    <h2>No products found</h2>
                    <p>
                        We couldn't find a product matching your search.
                    </p>
                </div>
            `;

            return;
        }

        productsToDisplay.forEach(product => {

            const productCard = document.createElement("article");

            productCard.className = "product-card";

            productCard.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >
                </a>

                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h2>
                        ${product.name}
                    </h2>

                    <p class="product-price">
                        ${formatPrice(product.price)}
                    </p>

                    <button
                        type="button"
                        class="add-to-cart"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>
            `;

            productsGrid.appendChild(productCard);

        });

    }


    /* -----------------------------------------
       FILTER PRODUCTS
    ----------------------------------------- */

    function filterProducts() {

        const filteredProducts = products.filter(product => {

            const productName =
                product.name.toLowerCase();

            const productCategory =
                product.category.toLowerCase();

            const searchMatches =
                productName.includes(currentSearch) ||
                productCategory.includes(currentSearch);

            let categoryMatches = true;

            if (currentCategory !== "all") {

                if (currentCategory === "straight") {

                    categoryMatches =
                        productCategory.includes("straight");

                } else {

                    categoryMatches =
                        productCategory.includes(currentCategory);

                }

            }

            return searchMatches && categoryMatches;

        });

        displayProducts(filteredProducts);

    }


    /* -----------------------------------------
       SEARCH
    ----------------------------------------- */

   if (searchInput) {

    searchInput.addEventListener("input", () => {

        currentSearch =
            searchInput.value.trim().toLowerCase();

        filterProducts();

    });

}

const searchButton = document.getElementById("search-button");

if (searchButton) {

    searchButton.addEventListener("click", () => {

        currentSearch =
            searchInput.value.trim().toLowerCase();

        filterProducts();

    });

}

    /* -----------------------------------------
       CATEGORY FILTERS
    ----------------------------------------- */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentCategory =
                button.textContent.trim().toLowerCase();

            if (currentCategory === "all") {
                currentCategory = "all";
            }

            filterProducts();

        });

    });


    /* -----------------------------------------
       ADD TO CART
    ----------------------------------------- */

    productsGrid.addEventListener("click", event => {

        const button =
            event.target.closest(".add-to-cart");

        if (!button) return;

        const productId =
            button.dataset.productId;

        const product =
            products.find(item => item.id === productId);

        if (!product) return;

        let cart =
            JSON.parse(localStorage.getItem("omaCart")) || [];

        const existingProduct =
            cart.find(item => item.id === product.id);

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });

        }

        localStorage.setItem(
            "omaCart",
            JSON.stringify(cart)
        );


        /* Update cart number */

        const cartCountElements =
            document.querySelectorAll(".cart-count");

        const totalItems =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });


        /* Button feedback */

        button.textContent = "Added ✓";

        setTimeout(() => {
            button.textContent = "Add to Cart";
        }, 1500);

    });


    /* -----------------------------------------
       INITIAL DISPLAY
    ----------------------------------------- */

    displayProducts(products);

}
/* =========================================
   MOBILE HAMBURGER MENU
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const isOpen = navMenu.classList.contains("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    // Close menu when a navigation link is clicked

    navMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}

/* =========================================
   CHECKOUT PAGE
========================================= */

const checkoutItems = document.querySelector("#checkout-items");
const checkoutTotal = document.querySelector("#checkout-total");

if (checkoutItems && checkoutTotal) {

    const cart = JSON.parse(localStorage.getItem("omaCart")) || [];

    if (cart.length === 0) {

    checkoutItems.innerHTML = `
        <div class="empty-checkout">

            <h3>Your cart is empty</h3>

            <p>
                Add some beautiful hair products to your cart
                before proceeding to checkout.
            </p>

            <a href="shop.html" class="checkout-continue-button">
                Continue Shopping
            </a>

        </div>
    `;

    checkoutTotal.textContent = "₦0";

} else {

        let total = 0;

        checkoutItems.innerHTML = cart.map(item => {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            return `
                <div class="checkout-item">

                    <div>
                        <strong>${item.name}</strong>
                        <span>Qty: ${item.quantity}</span>
                    </div>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                </div>
            `;

        }).join("");

        checkoutTotal.textContent = formatPrice(total);
    }
}
/* =========================================
   CART → CHECKOUT
========================================= */

const checkoutButton = document.querySelector("#checkout-button");

if (checkoutButton) {

    checkoutButton.addEventListener("click", () => {

        const cart = JSON.parse(localStorage.getItem("omaCart")) || [];

        if (cart.length === 0) {
            alert("Your cart is empty. Please add a product before checkout.");
            return;
        }

        window.location.href = "checkout.html";

    });

}
/* =========================================
   WHATSAPP CHECKOUT
========================================= */

const checkoutForm = document.querySelector("#checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem("omaCart")) || [];

        if (cart.length === 0) {
            alert("Your cart is empty. Please add a product before placing an order.");
            return;
        }

        const customerName = document.querySelector("#customer-name").value.trim();
        const customerPhone = document.querySelector("#customer-phone").value.trim();
        const customerAddress = document.querySelector("#customer-address").value.trim();
        const customerNote = document.querySelector("#customer-note").value.trim();

        let total = 0;

        const orderItems = cart.map(item => {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            return `${item.name} x ${item.quantity} - ${formatPrice(itemTotal)}`;

        }).join("\n");

        let message = `Hello Oma Hairline,

I would like to place an order.

CUSTOMER DETAILS
Name: ${customerName}
Phone: ${customerPhone}
Delivery Address: ${customerAddress}

ORDER DETAILS
${orderItems}

TOTAL: ${formatPrice(total)}`;

        if (customerNote) {
            message += `

ORDER NOTE
${customerNote}`;
        }

        message += `

Thank you.`;

        const whatsappNumber = "2349135028166";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

}