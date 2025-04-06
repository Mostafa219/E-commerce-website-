let regcontainer = document.querySelector(".regcontainer");
let registerBtn = document.querySelector(".register-btn");
let loginBtn = document.querySelector(".login-btn");
function showRegisterForm() {
  regcontainer.classList.add("active");
}
function showLoginForm() {
  regcontainer.classList.remove("active");
}
registerBtn.addEventListener("click", showRegisterForm);
loginBtn.addEventListener("click", showLoginForm);

function register(event) {
  event.preventDefault();
  var user = JSON.parse(localStorage.getItem("user")) || [];
  let name = document.getElementById("regName").value;
  let email = document.getElementById("regEmail").value;
  let password = document.getElementById("regPassword").value;

  // Regex for email validation
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // Regex for password validation (at least 8 characters, including at least one number and one letter capital one and small one at least one symbol )
  let passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!.%*?&_])[A-Za-z\d-@$!.%*?&_]{8,}$/;

  if (name && email && password) {
    // Validate email
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Validate password
    if (!passwordRegex.test(password)) {
      alert(
        "at least 8 characters, including at least one number and one letter capital one and small one at least one symbol."
      );
      return;
    }
    user.push({ name, email, password });
    localStorage.setItem("user", JSON.stringify(user));
    showLoginForm();
    alert("Registration Successful");
  } else {
    alert("Please fill all fields");
  }
}

function login(event) {
  event.preventDefault();

  let email = document.getElementById("logEmail").value;
  let password = document.getElementById("logPassword").value;
  let user = JSON.parse(localStorage.getItem("user"));

  // Regex for email validation
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Validate email format
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  var loginAcc = user.find((item) => item.email === email);

  if (loginAcc && loginAcc.password === password) {
    sessionStorage.setItem(
      "loggedAcc",
      JSON.stringify({
        name: loginAcc.name,
        email: loginAcc.email,
      })
    );
    showHome();
    alert("Logged in successfully!");
  } else {
    alert("Invalid email or password.");
  }
}
// show password if you need
function togglePassword() {
  let regPassword = document.getElementById("regPassword");
  let logPassword = document.getElementById("logPassword");
  let type = regPassword.getAttribute("type");
  let type2 = logPassword.getAttribute("type");

  if (type === "password" || type2 === "password") {
    regPassword.setAttribute("type", "text");
    logPassword.setAttribute("type", "text");
  } else {
    regPassword.setAttribute("type", "password");
    logPassword.setAttribute("type", "password");
  }
}
function showHome() {
  window.open("../index.html", "_self");
}

// dark mode toggle
document.addEventListener("DOMContentLoaded", function () {
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

  document.querySelector("#products").addEventListener("click", function () {
    window.open("../pages/products.html", "_blank");
  });
});
