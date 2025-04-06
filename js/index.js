const sliderContainer = document.querySelector(".slider-container");
const slider = document.querySelector(".slider");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let category_btn = document.querySelectorAll(".category_btn");

let slidesPerView = 4; // Ensure 4 slides are visible
let slideWidth; // Will be calculated dynamically

// Function to update slide width dynamically
function updateSlideWidth() {
  slideWidth = sliderContainer.clientWidth / slidesPerView; // Divide container width by slides per view
  document.querySelectorAll(".slide").forEach((slide) => {
    slide.style.width = `${slideWidth - 10}px`; // Adjust width with a margin
  });
}

// Function to go to the next slide
function nextSlide() {
  sliderContainer.scrollBy({ left: slideWidth, behavior: "smooth" });
}

// Function to go to the previous slide
function prevSlide() {
  sliderContainer.scrollBy({ left: -slideWidth, behavior: "smooth" });
}

// Disable buttons at edges
function checkScroll() {
  prevBtn.disabled = sliderContainer.scrollLeft === 0;
  nextBtn.disabled =
    sliderContainer.scrollLeft + sliderContainer.clientWidth + 0.5 >=
    sliderContainer.scrollWidth;
}

// Event Listeners for window resizing
window.addEventListener("resize", () => {
  updateSlidesPerView();
  updateSlideWidth(); // Recalculate slide width on window resize
  checkScroll(); // Recheck if buttons should be enabled/disabled
});

// Event Listeners for scroll event on the slider container
sliderContainer.addEventListener("scroll", checkScroll);

// Function to get products by category
async function getProductByCategory(category) {
  try {
    const response = await fetch(
      `https://fakestoreapi.in/api/products/category?type=${category}`
    );
    const products = await response.json();
    sliderdata(products, category);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

// Function to populate the slider with products
function sliderdata(data, category) {
  if (data) {
    document.querySelector(".slider-data h4").innerHTML = category;
    document.querySelector(
      ".slider-data p"
    ).innerHTML = `Discover our ${category}s collection, where style meets usage.`;
    document.querySelector(".slider-data .slider").innerHTML = `
          ${data.products
            .map((item) => {
              return `
              <div class="slide">
                <div class="slide-img" onClick="prodectDetails(${item.id})">
                  <img class="w-100 p-3" src="${item.image}" alt="${item.title}">
                </div>
                <div class="slide-content position-relative border-top">
                  <h3>${item.model}</h3>
                  <div class="d-flex justify-content-between ">
                    <p class="brand">${item.brand}</p>
                    <p class="price">Price: $${item.price}</p>
                  </div>
                  <i class="fa fa-shopping-cart" aria-hidden ="true" onClick="addToCard(${item.id})"></i>
                </div>
              </div>
            `;
            })
            .join("")}
    `;

    // Ensure slide width calculation happens after DOM update
    setTimeout(() => {
      updateSlideWidth(); // Recalculate slide width after DOM update
      checkScroll(); // Recheck if buttons should be enabled/disabled
    }, 0);
  }
}

// Initialize: Update slide width and check scroll position
updateSlideWidth();
checkScroll();

// Event listener for category buttons
category_btn.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    let category = e.target.value;
    document.querySelector(
      ".slider-data .slider"
    ).innerHTML = `<div class="text-center">
        <img class="loader" src="../assets/loader.svg" />
      </div>`;
    console.log("Fetching products for category:", category);

    // Wait for the asynchronous function to complete
    let data = await getProductByCategory(category);
    console.log("Data fetched:", data);
  });
});

// Adjust number of slides visible based on window size
function updateSlidesPerView() {
  if (window.innerWidth >= 1200) {
    slidesPerView = 4;
  } else if (window.innerWidth >= 992) {
    slidesPerView = 3;
  } else if (window.innerWidth >= 768) {
    slidesPerView = 2;
  } else {
    slidesPerView = 1;
  }
  updateSlideWidth(); // Ensure slide width updates after changing slidesPerView
}
window.onload = async function () {
  updateSlidesPerView();
  document.querySelector(
    ".slider-data .slider"
  ).innerHTML = `<div class="text-center">
        <img class="loader" src="../assets/loader.svg" />
      </div>`;
  await getProductByCategory("tv");
};

// Function to navigate to product details page
function prodectDetails(id) {
  window.open("../pages/productDetails.html", "_self");
  localStorage.setItem("id", id);
}

// Function to add product to cart
function addToCard(id) {
  let cardItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
  let isExist = cardItems.find((item) => item.id == id);
  if (isExist) {
    cardItems.map((item) => {
      if (item.id == id) {
        item.count++;
      }
    });
  } else {
    cardItems.push({ id: id, count: 1 });
  }
  localStorage.setItem("cartItems", JSON.stringify(cardItems));
  alert("Product added to cart");
}

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

document.querySelector("#products-h").addEventListener("click", function () {
  window.open("/pages/products.html", "_blank");
});

document.querySelector("#cart-h").addEventListener("click", function () {
  window.open("/pages/cart.html", "_blank");
});

document.querySelector("#home-h").addEventListener("click", function () {
  window.open("index.html");
});

document.querySelector("#about-h").addEventListener("click", function () {
  window.open("/pages/about.html", "_blank");
});

document.querySelector("#contact-h").addEventListener("click", function () {
  window.open("/pages/contact.html", "_blank");
});
