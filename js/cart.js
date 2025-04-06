var cartItems = document.querySelector(".cart-content");
var total = document.querySelector("#total");
var checkout = document.querySelector("#checkout");

// Get cart data from localStorage
function getCartData() {
  return localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
}

// Save cart data to localStorage
function saveCartData(arr) {
  localStorage.setItem("cartItems", JSON.stringify(arr));
}

// Calculate and display total price
function totalPrice(arr) {
  var to = 0;
  arr.forEach((item) => {
    to += item.price * item.count;
  });
  total.innerText = to.toFixed(2);
}

// Fetch products from API and merge with local counts
function fetchProducts() {
  var rawItems = getCartData();
  var updatedItems = [];

  rawItems.forEach((item) => {
    var req = new XMLHttpRequest();
    req.open("GET", `https://fakestoreapi.in/api/products/${item.id}`, false); // sync

    req.onload = function () {
      if (req.status === 200) {
        var data = JSON.parse(req.responseText).product;
        updatedItems.push({
          id: data.id,
          count: item.count,
          title: data.title,
          image: data.image,
          price: data.price,
        });
      }
    };

    req.onerror = function () {
      alert("Network error. Please check your connection.");
    };

    req.send();
  });

  saveCartData(updatedItems);
}

// Display products in cart
function displayProducts() {
  var arr = getCartData();
  cartItems.innerHTML = "";

  if (arr.length === 0) {
    cartItems.innerHTML = `<h2 class="text-center text-capitalize">cart is empty</h2>`;
    total.innerText = "00.00";
    return;
  }

  arr.forEach((item) => {
    cartItems.innerHTML += `
      <article class="row text-center g-3 align-items-center cart-item mb-3">
        <figure class="cart-item-image col-12 col-md-2">
          <img class="img-fluid rounded-4" src="${item.image}" alt="${item.title}" />
        </figure>
        <h2 class="cart-item-title fw-bold fs-4 col-12 col-md-4 text-capitalize text-truncate">
          ${item.title}
        </h2>
        <h3 class="cart-item-price fw-bold fs-5 col-12 col-md-2">$${item.price}</h3>
        <div class="cart-item-quantity col-12 col-md-2 d-flex justify-content-center gap-3">
          <button class="cart-item-quantity-btn cart-item-quantity-decrement px-2 py-1 rounded-2 fw-bold" id="decrement" data-id="${item.id}">-</button>
          <span class="cart-item-quantity-value fw-bolder fs-5" data-id="${item.id}">${item.count}</span>
          <button class="cart-item-quantity-btn cart-item-quantity-increment px-2 py-1 rounded-2 fw-bold" id="increment" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-remove col-12 col-md-2">
          <button class="cart-btn-remove rounded-5 px-4 py-2 fw-bold text-capitalize" data-id="${item.id}">remove</button>
        </div>
      </article>
    `;
  });

  totalPrice(arr);
}

// Remove product from cart
function removeProduct(id) {
  var products = getCartData();
  products = products.filter((item) => item.id !== id);
  saveCartData(products);
  displayProducts();
}

// Increment product count
function productIncrement(id) {
  var products = getCartData();
  var item = products.find((item) => item.id === id);
  if (item) {
    item.count++;
    saveCartData(products);
    displayProducts();
  }
}

// Decrement product count
function productDecrement(id) {
  var products = getCartData();
  var item = products.find((item) => item.id === id);
  if (item) {
    item.count--;
    if (item.count <= 0) {
      removeProduct(id);
    } else {
      saveCartData(products);
      displayProducts();
    }
  }
}

// Checkout process
function checkOut() {
  if (sessionStorage.getItem("loggedAcc") === null) {
    alert("You need to login first");
    window.location.href = "logandreg.html";
  } else if (getCartData().length === 0) {
    alert("Cart is empty");
  } else {
    localStorage.removeItem("cartItems");
    alert("Checkout has been successfully!");
    displayProducts();
  }
}

// Event listeners
cartItems.addEventListener("click", function (e) {
  var id = Number(e.target.dataset.id);
  if (e.target.classList.contains("cart-btn-remove")) {
    removeProduct(id);
  } else if (e.target.classList.contains("cart-item-quantity-increment")) {
    productIncrement(id);
  } else if (e.target.classList.contains("cart-item-quantity-decrement")) {
    productDecrement(id);
  }
});

checkout.addEventListener("click", checkOut);

// Initial load
fetchProducts();
displayProducts();

//  dark mode toggle
// Event listener for dark mode toggle

// dark mode toggle
// Dark Mode toggle logic
document.addEventListener("DOMContentLoaded", function () {
  const themeSwitcher = document.getElementById("themeSwitcher");
  const switchToggle = document.getElementById("switchBtn");
  const themeLabel = document.getElementById("themeText");

  // Get current theme from localStorage
  const currentTheme = localStorage.getItem("theme");

  // Apply theme on page load
  if (currentTheme === "dark") {
    document.body.classList.add("darkmode");
    switchToggle.classList.add("active");
    themeLabel.textContent = "Light Mode";
  }

  // Switch theme on button click
  themeSwitcher.addEventListener("click", () => {
    document.body.classList.toggle("darkmode");

    const isDark = document.body.classList.contains("darkmode");

    switchToggle.classList.toggle("active", isDark);
    themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

    // Store selected theme in localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Authentication logic
  var authButton = document.getElementById("authButton");
  var welcomeMessage = document.getElementById("welcomeMessage");

  const user = sessionStorage.getItem("loggedAcc");

  if (user) {
    const userData = JSON.parse(user);
    const username = userData.name || "User";

    welcomeMessage.textContent = `Welcome, ${username}!`;
    authButton.textContent = "Logout";
    authButton.classList.remove("btn-outline-success");
    authButton.classList.add("btn-danger");

    authButton.onclick = function () {
      sessionStorage.removeItem("loggedAcc");
      window.location.href = "../pages/logandreg.html";
    };
  } else {
    welcomeMessage.textContent = "Welcome to Our Store!";
    authButton.textContent = "Login";
    authButton.classList.remove("btn-danger");
    authButton.classList.add("btn-outline-dark");

    authButton.onclick = function () {
      window.location.href = "../pages/logandreg.html";
    };
  }

  // Event listener for opening products page
  document.querySelector("#products").addEventListener("click", function () {
    window.open("../pages/products.html", "_blank");
  });
});

document.querySelector("#home-c").addEventListener("click", function () {
  window.open("../index.html", "_self");
});

document.querySelector("#products-c").addEventListener("click", function () {
  window.open("../pages/products.html", "_self");
});

document.querySelector("#about-c").addEventListener("click", function () {
  window.open("../pages/about.html", "_self");
});

document.querySelector("#cart-c").addEventListener("click", function () {
  window.open("../pages/cart.html", "_self");
});
document.querySelector("#contact-c").addEventListener("click", function () {
  window.open("../pages/contact.html", "_self");
});
