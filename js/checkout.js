/* ═══════════════════════════════════════════
   Brownies&Co — js/checkout.js
   Lògica del formulari de comanda i confirmació
   ═══════════════════════════════════════════ */

function openCheckout() {
  if (cart.length === 0) {
    showToast('La cistella és buida!');
    return;
  }
  closeCart();

  // Data mínima = demà
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fData = document.getElementById('fData');
  if (fData) {
    fData.min = tomorrow.toISOString().split('T')[0];
    fData.value = tomorrow.toISOString().split('T')[0];
  }

  // Actualitzar totals al modal
  refreshModalTotals();

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  // Restablir formulari
  setTimeout(() => {
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('successScreen').style.display = 'none';
  }, 350);
}

function selectDelivery(type, cost) {
  deliveryType = type;
  deliveryCost = cost;

  // Actualitzar visuals
  document.getElementById('dOptEnvio').classList.toggle('selected', type === 'envio');
  document.getElementById('dOptBotiga').classList.toggle('selected', type === 'botiga');

  // Mostrar/ocultar adreça
  const addrBlock = document.getElementById('addressBlock');
  if (addrBlock) addrBlock.style.display = type === 'envio' ? 'block' : 'none';

  refreshModalTotals();
}

function refreshModalTotals() {
  const subtotal = calcCartSubtotal();
  const total    = subtotal + deliveryCost;

  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('modalSubtotal', formatPrice(subtotal));
  setTxt('modalEnviament', deliveryCost > 0 ? formatPrice(deliveryCost) : 'Gratuït');
  setTxt('modalTotal', formatPrice(total));
}

function confirmOrder() {
  var nom     = document.getElementById("fNom").value.trim();
  var telefon = document.getElementById("fTelefon").value.trim();
  var email   = document.getElementById("fEmail").value.trim();
  var data    = document.getElementById("fData").value;

  if (!nom || !telefon || !email || !data) {
    showToast("Si us plau, omple tots els camps obligatoris *");
    return;
  }
  if (!email.includes("@")) {
    showToast("El correu electrònic no és vàlid");
    return;
  }

  var orderNum = "#BC-" + String(Math.floor(1000 + Math.random() * 9000));

  var productes = cart.map(function(item) {
    return item.name + " x" + item.qty + " — " + formatPrice(item.price) + " | " + item.detail;
  }).join("\n");

  var formData = new FormData();
  formData.append("form-name",        "comanda");
  formData.append("numero_comanda",   orderNum);
  formData.append("nom",              nom);
  formData.append("email",            email);
  formData.append("telefon",          telefon);
  formData.append("tipus_lliurament", deliveryType === "envio" ? "Enviament a domicili (+3,50€)" : "Recollida a casa");
  formData.append("adreca",           deliveryType === "envio"
    ? ((document.getElementById("fAdreca") ? document.getElementById("fAdreca").value : "") + ", " +
       (document.getElementById("fCP") ? document.getElementById("fCP").value : "") + " " +
       (document.getElementById("fCiutat") ? document.getElementById("fCiutat").value : ""))
    : "C/ Vint-i-vuit, 35 · Camarles");
  formData.append("data_lliurament",  data);
  formData.append("franja",           document.getElementById("fFranja").value);
  formData.append("productes",        productes);
  formData.append("total",            formatPrice(calcCartTotal()));
  formData.append("notes",            document.getElementById("fNotes").value || "Cap");

  fetch("/", {
    method: "POST",
    body: formData
  })
  .then(function() {
    document.getElementById("orderNum").textContent    = orderNum;
    document.getElementById("successTotal").textContent = formatPrice(calcCartTotal());
    document.getElementById("successNom").textContent  = nom;
    document.getElementById("checkoutForm").style.display  = "none";
    document.getElementById("successScreen").style.display = "block";
    cart = [];
    updateCartUI();
  })
  .catch(function() {
    showToast("Error enviant la comanda. Prova de nou.");
  });
}

function buildOrderData(nom, telefon, email, data, orderNum, total) {
  const adreca    = document.getElementById('fAdreca')?.value || '';
  const cp        = document.getElementById('fCP')?.value || '';
  const ciutat    = document.getElementById('fCiutat')?.value || 'Girona';
  const franja    = document.getElementById('fFranja')?.value || '';
  const notes     = document.getElementById('fNotes')?.value || '';

  const itemsText = cart.map(item =>
    `- ${item.name} (×${item.qty}): ${formatPrice(item.price)}\n  ${item.detail}${item.nota ? '\n  Nota: ' + item.nota : ''}`
  ).join('\n');

  return {
    numero: orderNum,
    client: { nom, telefon, email },
    lliurament: {
      tipus: deliveryType === 'envio' ? 'Enviament a domicili' : 'Recollida a la botiga',
      adreca: deliveryType === 'envio' ? `${adreca}, ${cp} ${ciutat}` : 'C/ Ballesteries, 12 · Girona',
      data,
      franja
    },
    productes: cart,
    notes,
    subtotal: formatPrice(calcCartSubtotal()),
    enviament: formatPrice(deliveryCost),
    total: formatPrice(total),
    // Missatge de correu formatat
    emailBody: `
=== NOVA COMANDA ${orderNum} ===

CLIENT
Nom: ${nom}
Telèfon: ${telefon}
Correu: ${email}

LLIURAMENT
Tipus: ${deliveryType === 'envio' ? 'Enviament a domicili' : 'Recollida a botiga'}
${deliveryType === 'envio' ? `Adreça: ${adreca}, ${cp} ${ciutat}` : ''}
Data: ${data}
Franja: ${franja}

PRODUCTES
${itemsText}

PREUS
Subtotal: ${formatPrice(calcCartSubtotal())}
Enviament: ${formatPrice(deliveryCost)}
TOTAL: ${formatPrice(total)}

NOTES ADDICIONALS
${notes || '(Cap)'}

PAGAMENT
Bizum pendent: ${formatPrice(total)}
Concepte: ${nom}
    `.trim()
  };
}

function resetAll() {
  closeCheckout();
  // Restablir estat
  brownieState.massa     = { name: 'Xocolata Negra', price: 0 };
  brownieState.cobertura = { name: 'Sense cobertura', price: 0 };
  brownieState.toppings  = [];
  brownieState.punt      = { name: 'Sucós (Estàndard)', price: 0 };
  brownieState.qty       = 1;

  // Restablir botons del builder
  document.querySelectorAll('.opt').forEach(function(b) { b.classList.remove('selected'); });
  document.querySelectorAll('.opt[data-name="Xocolata Negra"]').forEach(function(b) { b.classList.add('selected'); });
  document.querySelectorAll('.opt[data-name="Sense cobertura"]').forEach(function(b) { b.classList.add('selected'); });
  document.querySelectorAll('.opt[data-name="Sucos (Estandard)"]').forEach(function(b) { b.classList.add('selected'); });
  document.querySelectorAll('.top-btn').forEach(function(b) { b.classList.remove('selected'); });

  const qtyEl = document.getElementById('qtyDisplay');
  if (qtyEl) qtyEl.textContent = '1';
  const notaEl = document.getElementById('notaInput');
  if (notaEl) notaEl.value = '';

  updateSummary();
  updateToppingPreview();
  showToast('Fins aviat! Tornem a crear 🍫');
}

// Formulari de contacte simple
function sendContact(e) {
  e.preventDefault();
  showToast('Missatge enviat! T\'escrivim aviat 💌');
  e.target.reset();
}
