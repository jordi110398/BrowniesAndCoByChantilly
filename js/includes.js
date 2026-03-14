/* ═══════════════════════════════════════════
   Brownies&Co — js/includes.js
   Carrega els fitxers HTML parcials de sections/
   i inicialitza l'app quan tots estan carregats.
   ═══════════════════════════════════════════ */

(async function loadIncludes() {
  const placeholders = document.querySelectorAll('[data-include]');
  const promises = Array.from(placeholders).map(async (el) => {
    const path = el.getAttribute('data-include');
    try {
      const res  = await fetch(path);
      const html = await res.text();
      // Substituïm el div contenidor pel contingut real
      el.outerHTML = html;
    } catch (err) {
      console.warn(`No s'ha pogut carregar: ${path}`, err);
      el.remove();
    }
  });

  // Esperem que tots els includes acabin
  await Promise.all(promises);

  // Disparem un event perquè ui.js sàpiga que el DOM està llest
  document.dispatchEvent(new Event('sectionsLoaded'));
})();
