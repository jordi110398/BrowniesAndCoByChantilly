/* ═══════════════════════════════════════════
   Brownies&Co — js/builder.js
   Lògica del personalitzador de brownies
   ═══════════════════════════════════════════ */

function selectOption(btn, field, name, price) {
  var grid = btn.closest('.opts-grid');
  grid.querySelectorAll('.opt').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  brownieState[field] = { name: name, price: price };
  updateSummary();
}

function toggleTopping(btn, name, price, emoji) {
  btn.classList.toggle('selected');
  var idx = brownieState.toppings.findIndex(function(t) { return t.name === name; });
  if (idx > -1) {
    brownieState.toppings.splice(idx, 1);
  } else {
    brownieState.toppings.push({ name: name, price: price, emoji: emoji });
  }
  updateToppingPreview();
  updateSummary();
}

function changeQty(delta) {
  brownieState.qty = Math.max(1, Math.min(20, brownieState.qty + delta));
  var el = document.getElementById('qtyDisplay');
  if (el) el.textContent = brownieState.qty;
  updateSummary();
}

function updateToppingPreview() {
  var container = document.getElementById('svToppings');
  if (!container) return;
  container.innerHTML = '';
  brownieState.toppings.forEach(function(t) {
    var span = document.createElement('span');
    span.className = 'sv-topping';
    span.textContent = t.emoji;
    container.appendChild(span);
  });
}

function updateSummary() {
  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  set('sumMassa',     brownieState.massa.name);
  set('sumCobertura', brownieState.cobertura.name);
  set('sumToppings',  brownieState.toppings.length
    ? brownieState.toppings.map(function(t) { return t.name; }).join(', ')
    : '— Cap');
  set('sumPunt',      brownieState.punt.name.split(' ')[0]);
  set('sumQty',       brownieState.qty + (brownieState.qty === 1 ? ' unitat' : ' unitats'));
  set('summaryTotal', formatPrice(calcBrowniePrice()));
}

function addToCart() {
  var nota = document.getElementById('notaInput') ? document.getElementById('notaInput').value : '';
  var toppingNames = brownieState.toppings.map(function(t) { return t.name; }).join(', ');
  var detail = brownieState.massa.name + ' \u00b7 ' + brownieState.cobertura.name +
               (toppingNames ? ' \u00b7 ' + toppingNames : '') +
               ' \u00b7 ' + brownieState.punt.name.split(' ')[0];
  var item = {
    id: Date.now(),
    type: 'custom',
    name: 'Brownie personalitzat',
    detail: detail,
    emoji: '🍫',
    qty: brownieState.qty,
    price: calcBrowniePrice(),
    nota: nota
  };
  cart.push(item);
  updateCartUI();

  var btn = document.getElementById('addToCartBtn');
  if (btn) {
    btn.textContent = '\u2713 Afegit a la cistella!';
    btn.classList.add('added');
    setTimeout(function() {
      btn.textContent = 'Afegir a la cistella';
      btn.classList.remove('added');
    }, 2200);
  }
  showToast('Brownie afegit a la cistella 🍫');
}

function quickAdd(name, price, emoji, detail) {
  cart.push({
    id: Date.now(),
    type: 'quick',
    name: name,
    detail: detail,
    emoji: emoji,
    qty: 1,
    price: price,
    nota: ''
  });
  updateCartUI();
  showToast(name + ' afegit 🛍️');
}
