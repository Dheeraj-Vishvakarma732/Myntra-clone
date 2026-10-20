const products = [
  {
    id: 1,
    name: "Classic Casual Shirt",
    brand: "Roadster",
    category: "Men",
    price: 699,
    oldPrice: 1499,
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Women's Summer Dress",
    brand: "DressBerry",
    category: "Women",
    price: 899,
    oldPrice: 1799,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Everyday Sneakers",
    brand: "HRX",
    category: "Shoes",
    price: 1199,
    oldPrice: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Minimal Wrist Watch",
    brand: "Fossil Style",
    category: "Accessories",
    price: 999,
    oldPrice: 1999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Premium Denim Jacket",
    brand: "Roadster",
    category: "Men",
    price: 1499,
    oldPrice: 2999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Elegant Fashion Outfit",
    brand: "StyleCast",
    category: "Women",
    price: 1299,
    oldPrice: 2599,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Sport Running Shoes",
    brand: "HRX",
    category: "Shoes",
    price: 1399,
    oldPrice: 2799,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Stylish Sunglasses",
    brand: "StyleCast",
    category: "Accessories",
    price: 499,
    oldPrice: 999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

let selectedCategory = "All";
let searchText = "";
let cart = [];
let wishlist = [];

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const text = (
      product.name + " " +
      product.brand + " " +
      product.category
    ).toLowerCase();

    const matchesSearch = text.includes(searchText);

    return matchesCategory && matchesSearch;
  });

  resultCount.textContent =
    `${filteredProducts.length} products`;

  emptyMessage.hidden = filteredProducts.length !== 0;

  productGrid.innerHTML = filteredProducts.map(product => {
    const discount = Math.round(
      (1 - product.price / product.oldPrice) * 100
    );

    const isWishlisted = wishlist.includes(product.id);

    return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/500x600/f5f5f6/282c3f?text=Fashion+Product'"
          >

          <button
            class="wishlist ${isWishlisted ? "selected" : ""}"
            onclick="toggleWishlist(${product.id})"
            aria-label="Toggle wishlist"
          >${isWishlisted ? "♥" : "♡"}</button>
        </div>

        <div class="product-info">
          <h3>${product.brand}</h3>
          <p>${product.name}</p>

          <div class="price">
            ₹${product.price.toLocaleString("en-IN")}
            <del>₹${product.oldPrice.toLocaleString("en-IN")}</del>
            <span class="discount">${discount}% OFF</span>
          </div>

          <button class="add-btn"
            onclick="addToBag(${product.id})">
            ADD TO BAG
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function addToBag(id) {
  const product = products.find(item => item.id === id);

  cart.push(product);
  cartCount.textContent = cart.length;

  showToast(`${product.name} added to your bag!`);
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist ♥");
  }

  renderProducts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

searchInput.addEventListener("input", event => {
  searchText = event.target.value.trim().toLowerCase();
  renderProducts();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    renderProducts();
  });
});

document.querySelectorAll("[data-jump]").forEach(card => {
  card.addEventListener("click", () => {
    selectedCategory = card.dataset.jump;

    document.querySelectorAll(".filter").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === selectedCategory
      );
    });

    renderProducts();
  });
});

document.getElementById("bagButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your bag is empty!");
    return;
  }

  const total = cart.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  showToast(
    `${cart.length} item(s) in bag | Total: ₹${total.toLocaleString("en-IN")}`
  );
});

renderProducts();