/* ═══════════════════════════════════════════
   Brownies&Co — js/state.js
   Estat global de l'aplicació
   ═══════════════════════════════════════════ */

const BASE_PRICE = 4.50;

// Estat del brownie personalitzat
const brownieState = {
  massa:     { name: 'Xocolata Negra', price: 0 },
  cobertura: { name: 'Sense cobertura', price: 0 },
  toppings:  [],   // [{ name, price, emoji }]
  punt:      { name: 'Sucós (Estàndard)', price: 0 },
  qty:       1,
  nota:      ''
};

// Cistella
let cart = [];

// Enviament
let deliveryType = 'envio';
let deliveryCost = 3.50;

// ── Càlculs ──
function calcBrowniePrice() {
  const extras = brownieState.massa.price
    + brownieState.cobertura.price
    + brownieState.toppings.reduce((s, t) => s + t.price, 0)
    + brownieState.punt.price;
  return (BASE_PRICE + extras) * brownieState.qty;
}

function calcCartSubtotal() {
  return cart.reduce((s, item) => s + item.price, 0);
}

function calcCartTotal() {
  return calcCartSubtotal() + deliveryCost;
}

function formatPrice(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}
