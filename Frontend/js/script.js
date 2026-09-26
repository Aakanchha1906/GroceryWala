// ===============================
// GroceryWala Frontend JavaScript
// ===============================



/* ===============================
   SEARCH PRODUCTS
=============================== */

let allProducts = [];

const searchInput =
    document.querySelector(".search-box input");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const filteredProducts = allProducts.filter(
            function(product) {

                return (
                    product.name.toLowerCase().includes(searchText) ||
                    product.category.toLowerCase().includes(searchText)
                );

            }
        );

        displayProducts(filteredProducts);

    });

}


// CART QUANTITY
const quantityButtons = document.querySelectorAll(".quantity button");

quantityButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const quantityBox = button.parentElement;
        const quantityText = quantityBox.querySelector("span");

        let quantity = parseInt(quantityText.textContent);

        if (button.textContent === "+") {
            quantity++;
        }

        else if (button.textContent === "−" && quantity > 1) {
            quantity--;
        }

        quantityText.textContent = quantity;

    });

});

 // ==========================
 // LOAD AND DISPLAY PRODUCTS
 // ==========================

const productContainer =
    document.getElementById("product-container");

function displayProducts(productsToDisplay) {

    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    if (productsToDisplay.length === 0) {
        productContainer.innerHTML =
            "<p>No products found!</p>";
        return;
    }

    productsToDisplay.forEach(function(product) {

        const productCard =
            document.createElement("div");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="product-image">
                <img src="./images/${product.image}"
                     alt="${product.name}">
            </div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="product-bottom">

                <span class="product-price">
                    ₹${product.price}
                </span>

                <div class="product-actions">

                    <button onclick="addToCart('${product._id}')">
                        Add to Cart
                    </button>

                    <button
                        class="wishlist-btn"
                        onclick="addToWishlist('${product._id}')"
                        title="Add to Wishlist">
                        ♡
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(productCard);

    });
}

if (productContainer) {

    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(products => {

            console.log("Products from MongoDB:", products);

            allProducts = products;

            displayProducts(allProducts);

        })
        .catch(error => {

            console.error(
                "Error loading products:",
                error
            );

        });

}

// ==========================
// ADD PRODUCT TO CART
// ==========================

function addToCart(productId) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct =
        cart.find(item => item.productId === productId);

    if (existingProduct) {

        existingProduct.quantity++;

        console.log(
            "Quantity increased:",
            existingProduct.quantity
        );

    } else {

        cart.push({
            productId: productId,
            quantity: 1
        });

        console.log("Product added to cart");

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    console.log("Current cart:", cart);
}

function addToWishlist(productId) {

    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.includes(productId)) {

        alert("This product is already in your wishlist!");

    } else {

        wishlist.push(productId);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        alert("Product added to your wishlist!");
    }
}
// ==========================
// LOAD CART PRODUCTS
// ==========================


const cartContainer =
    document.getElementById("cart-items-container");

if (cartContainer) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    console.log("Cart:", cart);

    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(products => {

            cart.forEach(function(cartItem) {

                const product = products.find(
                    p => p._id === cartItem.productId
                );

                if (product) {

                    const cartProduct =
                        document.createElement("div");

                    cartProduct.classList.add("cart-item");

                    const quantity =
                        cartItem.quantity;

                    const totalPrice =
                        product.price * quantity;

                    cartProduct.innerHTML = `
                        <div class="product-image">
                            <img src="images/${product.image}"
                                 alt="${product.name}">
                        </div>

                        <div class="product-info">

                            <h3>${product.name}</h3>

                            <p>₹${product.price}</p>

                            <div class="quantity">

                                <button class="decrease-btn">
                                    −
                                </button>

                                <span class="quantity-value">
                                    ${quantity}
                                </span>

                                <button class="increase-btn">
                                    +
                                </button>

                            </div>

                        </div>

                        <div class="item-price"
                             data-price="${product.price}">
                            ₹${totalPrice}
                        </div>

                        <button class="remove-btn"
                                data-id="${product._id}">
                            🗑
                        </button>
                    `;

                    cartContainer.appendChild(cartProduct);

                }

            });

            updateCartSubtotal();
            updateCartTotal();

        })
        .catch(error => {

            console.error(
                "Error loading cart:",
                error
            );

        });

}
// ==========================
// CART QUANTITY CONTROLS
// ==========================
// ==========================
// CART QUANTITY CONTROLS
// ==========================

// ==========================
// UPDATE CART QUANTITY
// ==========================

document.addEventListener("click", function(event) {

    if (
        !event.target.classList.contains("increase-btn") &&
        !event.target.classList.contains("decrease-btn")
    ) {
        return;
    }

    const cartItem =
        event.target.closest(".cart-item");

    const quantityValue =
        cartItem.querySelector(".quantity-value");

    const itemPrice =
        cartItem.querySelector(".item-price");

    const productId =
        cartItem.querySelector(".remove-btn").dataset.id;

    const pricePerItem =
        parseFloat(itemPrice.dataset.price);

    let quantity =
        parseInt(quantityValue.textContent);

    // Increase quantity
    if (
        event.target.classList.contains("increase-btn")
    ) {
        quantity++;
    }

    // Decrease quantity
    if (
        event.target.classList.contains("decrease-btn") &&
        quantity > 1
    ) {
        quantity--;
    }

    // Update quantity on screen
    quantityValue.textContent = quantity;

    // Update product total
    const totalPrice =
        pricePerItem * quantity;

    itemPrice.textContent =
        "₹" + totalPrice;

    // Update localStorage
    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const cartProduct =
        cart.find(item => item.productId === productId);

    if (cartProduct) {
        cartProduct.quantity = quantity;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // Update summary
    updateCartSubtotal();
    updateCartTotal();

});
// ==========================
// UPDATE CART SUBTOTAL
// ==========================

function updateCartSubtotal() {

    const subtotalElement =
        document.getElementById("cart-subtotal");

    if (!subtotalElement) {
        return;
    }

    const cartItems =
        document.querySelectorAll(".cart-item");

    let subtotal = 0;

    cartItems.forEach(function(item) {

        const priceElement =
            item.querySelector(".item-price");

        const price =
            parseFloat(priceElement.textContent.replace("₹", ""));

        subtotal += price;

    });

    subtotalElement.textContent =
        "₹" + subtotal;

}
// ==========================
// UPDATE CART TOTAL
// ==========================

function updateCartTotal() {

    const subtotalElement =
        document.getElementById("cart-subtotal");

    const totalElement =
        document.getElementById("cart-total");

    if (!subtotalElement || !totalElement) {
        return;
    }

    const subtotal =
        parseFloat(
            subtotalElement.textContent.replace("₹", "")
        ) || 0;

    const delivery = 30;

    const total = subtotal + delivery;

    totalElement.textContent =
        "₹" + total;

}
      // ==========================
// REMOVE PRODUCT FROM CART
// ==========================

document.addEventListener("click", function(event) {

    if (!event.target.classList.contains("remove-btn")) {
        return;
    }

    const productId =
        event.target.dataset.id;

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    // Remove the selected product
    cart = cart.filter(function(item) {
        return item.productId !== productId;
    });

    // Save updated cart
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // Remove product from screen
    const cartItem =
        event.target.closest(".cart-item");

    cartItem.remove();

    // Update summary
    updateCartSubtotal();
    updateCartTotal();

    console.log("Product removed:", productId);
    console.log("Current cart:", cart);

});
// ==========================
// LOAD CHECKOUT PRODUCTS
// ==========================

const checkoutItems =
    document.getElementById("checkout-items");

if (checkoutItems) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(products => {

            let subtotal = 0;

            cart.forEach(function(cartItem) {

                const product = products.find(
                    p => p._id === cartItem.productId
                );

                if (product) {

                    const quantity =
                        cartItem.quantity;

                    const totalPrice =
                        product.price * quantity;

                    subtotal += totalPrice;

                    const item =
                        document.createElement("div");

                    item.classList.add(
                        "checkout-product"
                    );

                    item.innerHTML = `
                        <div>
                            <strong>${product.name}</strong>
                            <p>
                                ₹${product.price} × ${quantity}
                            </p>
                        </div>

                        <strong>
                            ₹${totalPrice}
                        </strong>
                    `;

                    checkoutItems.appendChild(item);
                }

            });

            const delivery = 30;

            const total =
                subtotal + delivery;

            document.getElementById(
                "checkout-subtotal"
            ).textContent = "₹" + subtotal;

            document.getElementById(
                "checkout-total"
            ).textContent = "₹" + total;

        })
        .catch(error => {

            console.error(
                "Error loading checkout:",
                error
            );

        });

}
// ==========================
// PLACE ORDER
// ==========================

const checkoutForm =
    document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const phone =
            document.getElementById("phone").value;

        const address =
            document.getElementById("address").value;

        const city =
            document.getElementById("city").value;

        const pincode =
            document.getElementById("pincode").value;

        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        fetch("http://localhost:5000/api/products")
            .then(response => response.json())
            .then(products => {

                const orderItems = [];

                let subtotal = 0;

                cart.forEach(function(cartItem) {

                    const product =
                        products.find(
                            p => p._id === cartItem.productId
                        );

                    if (product) {

                        const quantity =
                            cartItem.quantity;

                        orderItems.push({

                            productId:
                                product._id,

                            name:
                                product.name,

                            price:
                                product.price,

                            quantity:
                                quantity

                        });

                        subtotal +=
                            product.price * quantity;
                    }

                });

                const delivery = 30;

                const total =
                    subtotal + delivery;

                const orderData = {

                    customer: {

                        name:
                            name,

                        phone:
                            phone,

                        address:
                            address,

                        city:
                            city,

                        pincode:
                            pincode

                    },

                    items:
                        orderItems,

                    subtotal:
                        subtotal,

                    delivery:
                        delivery,

                    total:
                        total,

                    paymentMethod:
                        "Cash on Delivery"

                };

                return fetch(
                    "http://localhost:5000/api/orders",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(orderData)

                    }
                );

            })
            .then(response => response.json())
            .then(data => {

                console.log(
                    "Order response:",
                    data
                );

                if (data.order) {

    alert(
        "Order placed successfully!"
    );

    // ==========================
    // CREATE WHATSAPP MESSAGE
    // ==========================

    let message =
        "🛒 *New GroceryWala Order*%0A%0A";

    message +=
        "👤 Customer: " + name + "%0A";

    message +=
        "📞 Phone: " + phone + "%0A";

    message +=
        "📍 Address: " +
        address + ", " +
        city + " - " +
        pincode + "%0A%0A";

    message +=
        "🛍️ *Items:*%0A";

    data.order.items.forEach(function(item) {
        const itemTotal =
            item.price * item.quantity;

        message +=
            "• " +
            item.name +
            " × " +
            item.quantity +
            " — ₹" +
            itemTotal +
            "%0A";

    });

    message += "%0A";

    message +=
              "💰 Subtotal: ₹" +
    data.order.subtotal +
        "%0A";
  

    message +=
        "🚚 Delivery: ₹" +
    data.order.delivery +
        "%0A";

    message +=
        "💵 *Total: ₹" +
    data.order.total +
        "*%0A";

    message +=
        "💳 Payment: Cash on Delivery%0A";

    message +=
        "📦 Status: Order Placed";


    // Shopkeeper WhatsApp number
    const shopkeeperNumber =
        "919304386233";


    // Create WhatsApp link
    const whatsappURL =
        "https://wa.me/" +
        shopkeeperNumber +
        "?text=" +
        message;


    // Clear cart
    // Clear cart
localStorage.removeItem("cart");

// Open WhatsApp in a new tab
window.open(
    whatsappURL,
    "_blank"
);

// Show order success page
window.location.href =
    "order-success.html";

} else {

                    alert(
                        "Failed to place order."
                    );

                }

            })
            .catch(error => {

                console.error(
                    "Order error:",
                    error
                );

                alert(
                    "Something went wrong while placing the order."
                );

            });

    });

}
// LOGIN FORM
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Login successful! Welcome to GroceryWala.");

                window.location.href = "shop.html";
            } else {
                alert(data.message || "Login failed. Please try again.");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to the server. Please try again.");
        }
    });
}

 // REGISTRATION FORM
const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully! Please login.");

                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed.");
            }

        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to the server. Please try again.");
        }
    });
}
// SHOP LOGIN STATUS
const welcomeUser = document.getElementById("welcome-user");
const userName = document.getElementById("user-name");
const loginLink = document.getElementById("login-link");
const logoutBtn = document.getElementById("logout-btn");

if (welcomeUser && loginLink && logoutBtn) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
        welcomeUser.style.display = "inline";
        userName.textContent = user.name;

        loginLink.style.display = "none";
        logoutBtn.style.display = "inline-block";
    }

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("You have been logged out successfully!");

        window.location.href = "login.html";
    });
}

/* =========================
   WISHLIST PAGE
========================= */

const wishlistContainer =
    document.getElementById("wishlist-container");

if (wishlistContainer) {

    async function loadWishlist() {

        let wishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML =
                "<p>Your wishlist is empty!</p>";
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/products"
            );

            const products = await response.json();

            const wishlistProducts = products.filter(
                product => wishlist.includes(product._id)
            );

            if (wishlistProducts.length === 0) {
                wishlistContainer.innerHTML =
                    "<p>Your wishlist is empty!</p>";
                return;
            }

            wishlistContainer.innerHTML =
                wishlistProducts.map(product => `
                    <div class="product-card">

                        <img
                            src="images/${product.image}"
                            alt="${product.name}"
                            width="150"
                        >

                        <h3>${product.name}</h3>

                        <p>${product.description}</p>

                        <p>₹${product.price}</p>

                        <button
                             onclick="moveToCartAndRemove('${product._id}')">
                             Add to Cart
                        </button>

                        <button
                            class="wishlist-remove-btn"
                            data-id="${product._id}">
                            Remove
                        </button>

                    </div>
                `).join("");

        } catch (error) {
            wishlistContainer.innerHTML =
                "<p>Unable to load wishlist products.</p>";
            console.error(error);
        }
    }

    wishlistContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("wishlist-remove-btn")) {

            const productId = event.target.dataset.id;

            let wishlist =
                JSON.parse(localStorage.getItem("wishlist")) || [];

            wishlist = wishlist.filter(
                id => id !== productId
            );

            localStorage.setItem(
                "wishlist",
                JSON.stringify(wishlist)
            );

            loadWishlist();
        }

    });

    loadWishlist();
}

function moveToCartAndRemove(productId) {

    // Add product to cart
    addToCart(productId);

    // Remove product from wishlist
    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist = wishlist.filter(
        id => String(id) !== String(productId)
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    // Refresh the wishlist page
    location.reload();
}