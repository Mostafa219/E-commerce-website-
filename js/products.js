const sliderContainer = document.querySelector(".slider-container");
const slider = document.querySelector(".slider");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let category_btn = document.querySelectorAll(".category_btn");
let sliderData = document.querySelector(".slider-data");

let slidesPerView = 4; // Ensure 4 slides are visible
let slideWidth; // Will be calculated dynamically
let allProducts = [];

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

    // Wait for the asynchronous function to complete
    let data = await getProductByCategory(category);
  });
});

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

  allProducts = localStorage.getItem("allProducts")
    ? JSON.parse(localStorage.getItem("allProducts"))
    : await getAllProducts();
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
};

function prodectDetails(id) {
  window.location = "productDetails.html";
  localStorage.setItem("id", id);
}
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

async function getAllProducts() {
  try {
    const response = await fetch(
      `https://fakestoreapi.in/api/products?limit=150`
    );
    const products = await response.json();
    return products.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

document.querySelector(".search_input").addEventListener("keyup", function (e) {
  let searchValue = e.target.value.toLowerCase();
  if (searchValue == "")
    document.querySelector(".product_search_container").innerHTML = "";

  let filteredProducts = allProducts.filter((item) =>
    item.title.toLowerCase().includes(searchValue)
  );
  document.querySelector(".product_search_container").innerHTML =
    filteredProducts
      .map((item) => {
        return `
<div class="col-12 col-sm-6 col-md-4 col-lg-3 px-2 mb-3">
  <div class="card h-100 shadow-sm rounded-3 d-flex flex-column">
    
    <div class="p-2">
      <img src="${item.image}" class="card-img-top" alt="${item.title}" 
        style="object-fit: contain; height: 200px; width: 100%;" />
    </div>

    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title text-truncate" title="${item.model}">
          ${item.model}
        </h5>

        <p class="card-text text-truncate-2" title="${item.title}">
          ${item.title}
        </p>
      </div>

      <div class="mt-3 d-flex justify-content-between gap-1">
        <button class="btn btn-primary btn-sm w-50" onclick="addToCard(${item.id})">
          Add to Cart
        </button>
        <button class="btn btn-success btn-sm w-50" onclick="prodectDetails(${item.id})">
          Details
        </button>
      </div>
    </div>
  </div>
</div>


    `;
      })
      .join("");
});

// document.getElementById("cartButton").addEventListener("click", function () {
//   window.open("../pages/cart.html", "_blank");
// });

// document.getElementById("contactButton").addEventListener("click", function () {
//   window.location.href = "";
// });
// document.getElementById("home").addEventListener("click", function () {
//   window.location.href = "";
// });
// document.getElementById("products").addEventListener("click", function () {
//   window.location.href = "products.html";
// });

// Handle the confirmation of logout (Yes button)
document.getElementById("confirmLogout").addEventListener("click", function () {
  // You can add your logout logic here (e.g., redirect or clear session)
  alert("Logged out successfully!");
  const logoutModal = new bootstrap.Modal(
    document.getElementById("logoutModal")
  );
  logoutModal.hide();
});

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
      window.location.href = "logandreg.html";
    };
  } else {
    welcomeMessage.textContent = "Welcome to Our Store!";
    authButton.textContent = "Login";
    authButton.classList.remove("btn-danger");
    authButton.classList.add("btn-outline-dark");

    authButton.onclick = function () {
      window.location.href = "logandreg.html";
    };
  }
});

document.querySelector("#home-p").addEventListener("click", function () {
  window.open("../index.html", "_self");
});
document.querySelector("#products-p").addEventListener("click", function () {
  window.open("/pages/products.html", "_self");
});
document.querySelector("#about-p").addEventListener("click", function () {
  window.open("/pages/about.html", "_self");
});
document.querySelector("#cart-p").addEventListener("click", function () {
  window.open("/pages/cart.html", "_self");
});
document.querySelector("#contact-p").addEventListener("click", function () {
  window.open("/pages/contact.html", "_self");
});
