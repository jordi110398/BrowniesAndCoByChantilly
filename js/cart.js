/* ═══════════════════════════════════════════
   Brownies&Co — js/cart.js
   Lògica de la cistella lateral
   ═══════════════════════════════════════════ */

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.body.style.overflow = '';
}

function removeFromCart(id) {
  cart = cart.filter(function(item) { return item.id !== id; });
  updateCartUI();
}

function updateCartUI() {
  // Badge del nav
  var badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce(function(s, i) { return s + i.qty; }, 0);

  var listEl = document.getElementById('cartItems');
  var footEl = document.getElementById('cartFoot');
  if (!listEl) return;

  // Buidar contingut sempre des de zero
  listEl.innerHTML = '';

  if (cart.length === 0) {
    listEl.innerHTML = '<div class="cart-empty" style="display:flex"><span>🧺</span><p>La cistella és buida.<br/>Crea el teu brownie!</p></div>';
    if (footEl) footEl.style.display = 'none';
    return;
  }

  if (footEl) footEl.style.display = 'flex';

  cart.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div class="cart-item-thumb">' + item.emoji + '</div>' +
      '<div class="cart-item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + item.detail + (item.nota ? ' · <em>' + item.nota + '</em>' : '') + ' · \u00d7' + item.qty + '</p>' +
        '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">Eliminar</button>' +
      '</div>' +
      '<div class="cart-item-price">' + formatPrice(item.price) + '</div>';
    listEl.appendChild(div);
  });

  var totalEl = document.getElementById('cartTotalPrice');
  if (totalEl) totalEl.textContent = formatPrice(calcCartSubtotal());
}
