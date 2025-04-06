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
});

document.querySelector("#products-ca").addEventListener("click", function () {
  window.open("../pages/products.html", "_self");
});

document.querySelector("#cart-ca").addEventListener("click", function () {
  window.open("../pages/cart.html", "_self");
});

document.querySelector("#home-ca").addEventListener("click", function () {
  window.open("../index.html", "_self");
});

document.querySelector("#about-ca").addEventListener("click", function () {
  window.open("../pages/about.html", "_self");
});

document.querySelector("#contact-ca").addEventListener("click", function () {
  window.open("../pages/contact.html", "_self");
});
