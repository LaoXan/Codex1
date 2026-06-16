const restaurants = [
  {
    id: "noodle-lab",
    name: "巷口面馆",
    category: "面食",
    cuisine: "川味小面",
    image: "assets/dish-noodles.png",
    rating: 4.9,
    time: 24,
    distance: 0.8,
    delivery: 3,
    badge: "爆款热卖",
    desc: "红油小面、牛腩拌面和冰粉，适合一人食和加班餐。",
    tags: ["满45减8", "准时达", "可少辣"],
    menu: [
      { id: "beef-noodle", name: "牛腩红汤面", price: 32 },
      { id: "sesame-noodle", name: "麻酱拌面", price: 24 },
    ],
  },
  {
    id: "green-bowl",
    name: "绿野轻食",
    category: "轻食",
    cuisine: "沙拉饭碗",
    image: "assets/dish-poke.png",
    rating: 4.8,
    time: 21,
    distance: 1.1,
    delivery: 4,
    badge: "低卡优选",
    desc: "鸡胸、牛油果、糙米和当季蔬菜，午餐高频复购。",
    tags: ["高蛋白", "轻负担", "月售3000+"],
    menu: [
      { id: "salmon-bowl", name: "三文鱼能量碗", price: 42 },
      { id: "chicken-salad", name: "香草鸡胸沙拉", price: 36 },
    ],
  },
  {
    id: "burger-works",
    name: "街角汉堡社",
    category: "汉堡",
    cuisine: "手作汉堡",
    image: "assets/dish-burger.png",
    rating: 4.7,
    time: 29,
    distance: 1.6,
    delivery: 5,
    badge: "第二份半价",
    desc: "现烤牛肉堡、脆薯和气泡水，适合分享套餐。",
    tags: ["套餐划算", "现做", "可双层"],
    menu: [
      { id: "classic-burger", name: "经典牛肉堡", price: 39 },
      { id: "fries-set", name: "脆薯双人组", price: 28 },
    ],
  },
  {
    id: "sushi-box",
    name: "松禾寿司",
    category: "日料",
    cuisine: "寿司便当",
    image: "assets/dish-sushi.png",
    rating: 4.9,
    time: 34,
    distance: 1.9,
    delivery: 6,
    badge: "新鲜到店",
    desc: "寿司拼盘、照烧鸡饭和味增汤，晚餐也很轻松。",
    tags: ["食安封签", "双人餐", "冷链"],
    menu: [
      { id: "sushi-combo", name: "十二贯寿司拼盘", price: 58 },
      { id: "teriyaki-rice", name: "照烧鸡腿饭", price: 35 },
    ],
  },
  {
    id: "cafe-morn",
    name: "晨间咖啡",
    category: "咖啡",
    cuisine: "咖啡轻点",
    image: "assets/dish-coffee.png",
    rating: 4.6,
    time: 18,
    distance: 0.5,
    delivery: 2,
    badge: "最快送达",
    desc: "拿铁、美式、可颂和贝果，从早到晚都在线。",
    tags: ["0元起送", "咖啡豆可选", "早餐"],
    menu: [
      { id: "iced-latte", name: "冰拿铁", price: 22 },
      { id: "croissant", name: "黄油可颂", price: 18 },
    ],
  },
  {
    id: "hotpot-mini",
    name: "小炉火锅",
    category: "夜宵",
    cuisine: "冒菜火锅",
    image: "assets/dish-hotpot.png",
    rating: 4.8,
    time: 38,
    distance: 2.0,
    delivery: 4,
    badge: "夜宵档",
    desc: "牛油锅底、麻辣冒菜和小份涮菜，深夜也能热乎。",
    tags: ["21点后免配送", "可微辣", "多人餐"],
    menu: [
      { id: "spicy-pot", name: "麻辣冒菜锅", price: 49 },
      { id: "beef-roll", name: "雪花肥牛卷", price: 32 },
    ],
  },
];

const categoryMeta = [
  { id: "全部", name: "全部", symbol: "全", color: "#202426" },
  { id: "面食", name: "面食", symbol: "面", color: "#d94b38" },
  { id: "轻食", name: "轻食", symbol: "轻", color: "#2d8f6f" },
  { id: "汉堡", name: "汉堡", symbol: "堡", color: "#f2c14e" },
  { id: "日料", name: "日料", symbol: "寿", color: "#2f6fbd" },
  { id: "咖啡", name: "咖啡", symbol: "啡", color: "#7f5539" },
  { id: "夜宵", name: "夜宵", symbol: "夜", color: "#8d4f8d" },
];

const state = {
  category: "全部",
  query: "",
  sort: "recommended",
  cart: new Map(),
};

const elements = {
  categoryGrid: document.querySelector("#categoryGrid"),
  restaurantGrid: document.querySelector("#restaurantGrid"),
  emptyState: document.querySelector("#emptyState"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  cartItems: document.querySelector("#cartItems"),
  cartEmpty: document.querySelector("#cartEmpty"),
  subtotal: document.querySelector("#subtotal"),
  deliveryFee: document.querySelector("#deliveryFee"),
  totalPrice: document.querySelector("#totalPrice"),
  checkoutButton: document.querySelector("#checkoutButton"),
  headerCartCount: document.querySelector("#headerCartCount"),
  cartJump: document.querySelector(".cart-jump"),
  orderPanel: document.querySelector("#orders"),
  locationButton: document.querySelector(".location-button"),
};

function yuan(value) {
  return `¥${value}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function categoryCount(category) {
  if (category === "全部") {
    return restaurants.length;
  }
  return restaurants.filter((restaurant) => restaurant.category === category).length;
}

function renderCategories() {
  elements.categoryGrid.innerHTML = categoryMeta
    .map(
      (category) => `
        <button
          class="category-button ${category.id === state.category ? "active" : ""}"
          type="button"
          data-category="${category.id}"
          style="--category-color: ${category.color}"
        >
          <span class="category-icon">${category.symbol}</span>
          <span class="category-name">${category.name}</span>
          <span class="category-count">${categoryCount(category.id)} 家可订</span>
        </button>
      `,
    )
    .join("");
}

function getFilteredRestaurants() {
  const query = state.query.trim().toLowerCase();
  let result = restaurants.filter((restaurant) => {
    const inCategory =
      state.category === "全部" || restaurant.category === state.category;
    const searchText = [
      restaurant.name,
      restaurant.category,
      restaurant.cuisine,
      restaurant.desc,
      ...restaurant.tags,
      ...restaurant.menu.map((item) => item.name),
    ]
      .join(" ")
      .toLowerCase();
    return inCategory && (!query || searchText.includes(query));
  });

  result = [...result].sort((a, b) => {
    if (state.sort === "rating") return b.rating - a.rating;
    if (state.sort === "time") return a.time - b.time;
    if (state.sort === "delivery") return a.delivery - b.delivery;
    return b.rating * 10 - b.time / 10 - (a.rating * 10 - a.time / 10);
  });

  return result;
}

function renderRestaurants() {
  const filtered = getFilteredRestaurants();
  elements.emptyState.hidden = filtered.length > 0;
  elements.restaurantGrid.innerHTML = filtered.map(renderRestaurantCard).join("");
}

function renderRestaurantCard(restaurant) {
  const tags = restaurant.tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
  const menu = restaurant.menu
    .map(
      (item) => `
        <div class="menu-item">
          <span class="menu-name">${escapeHtml(item.name)}</span>
          <span class="menu-price">${yuan(item.price)}</span>
          <button
            class="add-button"
            type="button"
            data-restaurant-id="${restaurant.id}"
            data-item-id="${item.id}"
            aria-label="加入${escapeHtml(item.name)}"
          >
            <svg class="icon"><use href="#icon-plus"></use></svg>
          </button>
        </div>
      `,
    )
    .join("");

  return `
    <article class="restaurant-card">
      <div class="restaurant-image">
        <img src="${restaurant.image}" alt="${escapeHtml(restaurant.name)}招牌餐品" loading="lazy" />
        <span class="badge">${escapeHtml(restaurant.badge)}</span>
      </div>
      <div class="restaurant-body">
        <div class="restaurant-title-row">
          <h3>${escapeHtml(restaurant.name)}</h3>
          <span class="price">起送 ${yuan(restaurant.menu[0].price)}</span>
        </div>
        <p class="restaurant-desc">${escapeHtml(restaurant.desc)}</p>
        <div class="metrics" aria-label="${escapeHtml(restaurant.name)}配送信息">
          <span class="metric"><svg class="icon"><use href="#icon-star"></use></svg>${restaurant.rating}</span>
          <span class="metric"><svg class="icon"><use href="#icon-clock"></use></svg>${restaurant.time} 分钟</span>
          <span class="metric"><svg class="icon"><use href="#icon-scooter"></use></svg>${restaurant.distance} km · ${yuan(restaurant.delivery)}</span>
        </div>
        <div class="tags">${tags}</div>
        <div class="menu-strip">${menu}</div>
      </div>
    </article>
  `;
}

function findMenuItem(restaurantId, itemId) {
  const restaurant = restaurants.find((entry) => entry.id === restaurantId);
  const item = restaurant?.menu.find((entry) => entry.id === itemId);
  if (!restaurant || !item) return null;
  return {
    ...item,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    delivery: restaurant.delivery,
  };
}

function addToCart(restaurantId, itemId) {
  const item = findMenuItem(restaurantId, itemId);
  if (!item) return;

  const current = state.cart.get(item.id);
  state.cart.set(item.id, {
    ...item,
    quantity: current ? current.quantity + 1 : 1,
  });
  renderCart();
}

function updateQuantity(itemId, delta) {
  const current = state.cart.get(itemId);
  if (!current) return;
  const nextQuantity = current.quantity + delta;
  if (nextQuantity <= 0) {
    state.cart.delete(itemId);
  } else {
    state.cart.set(itemId, { ...current, quantity: nextQuantity });
  }
  renderCart();
}

function cartTotals() {
  const items = [...state.cart.values()];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const delivery =
    items.length === 0 ? 0 : Math.min(...items.map((item) => item.delivery));
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, delivery, total: subtotal + delivery, quantity };
}

function renderCart() {
  const items = [...state.cart.values()];
  elements.cartEmpty.hidden = items.length > 0;
  elements.cartItems.innerHTML = items
    .map(
      (item) => `
        <div class="cart-row">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.restaurantName)} · ${yuan(item.price)}</span>
          </div>
          <div class="cart-quantity">
            <button class="quantity-button" type="button" data-item-id="${item.id}" data-delta="-1" aria-label="减少${escapeHtml(item.name)}">
              <svg class="icon"><use href="#icon-minus"></use></svg>
            </button>
            <span>${item.quantity}</span>
            <button class="quantity-button" type="button" data-item-id="${item.id}" data-delta="1" aria-label="增加${escapeHtml(item.name)}">
              <svg class="icon"><use href="#icon-plus"></use></svg>
            </button>
          </div>
        </div>
      `,
    )
    .join("");

  const totals = cartTotals();
  elements.subtotal.textContent = yuan(totals.subtotal);
  elements.deliveryFee.textContent = yuan(totals.delivery);
  elements.totalPrice.textContent = yuan(totals.total);
  elements.headerCartCount.textContent = totals.quantity;
  elements.checkoutButton.disabled = totals.quantity === 0;
}

function handleSearch(event) {
  event.preventDefault();
  state.query = elements.searchInput.value;
  renderRestaurants();
}

elements.categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderRestaurants();
});

elements.restaurantGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  addToCart(button.dataset.restaurantId, button.dataset.itemId);
});

elements.cartItems.addEventListener("click", (event) => {
  const button = event.target.closest(".quantity-button");
  if (!button) return;
  updateQuantity(button.dataset.itemId, Number(button.dataset.delta));
});

elements.searchForm.addEventListener("submit", handleSearch);
elements.searchInput.addEventListener("input", () => {
  state.query = elements.searchInput.value;
  renderRestaurants();
});
elements.sortSelect.addEventListener("change", () => {
  state.sort = elements.sortSelect.value;
  renderRestaurants();
});

document.querySelectorAll(".quick-addresses button").forEach((button) => {
  button.addEventListener("click", () => {
    elements.locationButton.innerHTML = `
      <svg class="icon"><use href="#icon-pin"></use></svg>
      ${button.textContent}
    `;
  });
});

elements.cartJump.addEventListener("click", () => {
  elements.orderPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.checkoutButton.addEventListener("click", () => {
  elements.checkoutButton.textContent = "已锁定订单";
  setTimeout(() => {
    elements.checkoutButton.textContent = "去结算";
  }, 1300);
});

renderCategories();
renderRestaurants();
renderCart();
