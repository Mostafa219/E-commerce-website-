var demo = new XMLHttpRequest();
var title = document.getElementById("title");
var brand = document.getElementById("brand");
var price = document.getElementById("price");
var description = document.getElementById("description");
var mainProductImg = document.getElementById("mainProductImg");
var bttnAddToCart = document.getElementById("addToCart");
var bttnBuyNow = document.getElementById("buyNow");
var aler = document.getElementById("aler");

demo.addEventListener("readystatechange", function () {
  if (demo.readyState == 4) {
    if (demo.status == 200) {
      var response = JSON.parse(demo.responseText);
      title.innerHTML = response.product.title;
      brand.innerHTML = response.product.brand;
      price.innerHTML = response.product.price + "$";
      description.innerHTML = response.product.description;
      mainProductImg.src = response.product.image;
    } else {
      console.error("Error fetching data:", demo.status, demo.statusText);
    }
  }
});
// sessionStorage******************

var productId = JSON.parse(localStorage.getItem("id"));

// button add to cart*************

bttnAddToCart.addEventListener("click", function () {
  let arr = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  let isExist = arr.find((item) => item.id == productId);
  if (isExist) {
    arr.map((item) => {
      if (item.id == productId) {
        item.count++;
      }
    });
  } else {
    arr.push({ id: productId, count: 1 });
  }
  localStorage.setItem("cartItems", JSON.stringify(arr));
  aler.style.display = aler.style.display === "block" ? "none" : "block";
});

// button buynow*************

bttnBuyNow.addEventListener("click", function () {
  let arr = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  let isExist = arr.find((item) => item.id == productId);
  if (isExist) {
    arr.map((item) => {
      if (item.id == productId) {
        item.count++;
      }
    });
  } else {
    arr.push({ id: productId, count: 1 });
  }
  localStorage.setItem("cartItems", JSON.stringify(arr));

  window.open("../pages/cart.html", "_self");
  // open("cart.js");
  //  window.location.href = "cart.html";
});

// show product details******
function getProductDetails(id) {
  demo.open("GET", `https://fakestoreapi.in/api/products/${id}`, true);
  demo.send();
}
getProductDetails(productId);

// dark mode toggle
document.addEventListener("DOMContentLoaded", function () {
  var themeSwitcher = document.getElementById("themeSwitcher");
  var switchToggle = document.getElementById("switchBtn");
  var themeLabel = document.getElementById("themeText");

  var currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.body.classList.add("darkmode");
    switchToggle.classList.add("active");
    if (themeLabel) themeLabel.textContent = "Light Mode";
  }

  themeSwitcher.addEventListener("click", () => {
    document.body.classList.toggle("darkmode");

    var isDark = document.body.classList.contains("darkmode");

    switchToggle.classList.toggle("active", isDark);

    if (themeLabel)
      themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

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
      window.location.href = "/pages/logandreg.html";
    };
  } else {
    welcomeMessage.textContent = "Welcome to Our Store!";
    authButton.textContent = "Login";
    authButton.classList.remove("btn-danger");
    authButton.classList.add("btn-outline-dark");

    authButton.onclick = function () {
      window.location.href = "/pages/logandreg.html";
    };
  }

  document.querySelector("#home-pd").addEventListener("click", function () {
    window.open("../index.html", "_self");
  });

  document.querySelector("#products-pd").addEventListener("click", function () {
    window.open("../pages/products.html", "_self");
  });
});

document.querySelector("#about-pd").addEventListener("click", function () {
  window.open("../pages/about.html", "_self");
});

document.querySelector("#cart-pd").addEventListener("click", function () {
  window.open("../pages/cart.html", "_self");
});

document.querySelector("#contact-pd").addEventListener("click", function () {
  window.open("../pages/contact.html", "_self");
});
