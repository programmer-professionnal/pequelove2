(() => {
  'use strict';

  const grid = document.querySelector('#letters-grid');
  const dialog = document.querySelector('#letter-dialog');
  const title = document.querySelector('#letter-title');
  const message = document.querySelector('#letter-message');
  const poem = document.querySelector('#letter-poem');
  const poemBlock = document.querySelector('#poem-block');
  const letterNumber = document.querySelector('#letter-number');
  const closeButton = document.querySelector('#close-letter');
  let activeEnvelope = null;
  let pointerStartedOutside = false;

  // Un error en una entrada no impide abrir las demás cartas.
  const seenIds = new Set();
  const letters = (Array.isArray(window.CARTAS) ? window.CARTAS : []).filter((letter) => {
    const valid = letter && typeof letter.id === 'string' && letter.id.trim()
      && !seenIds.has(letter.id) && typeof letter.titulo === 'string'
      && letter.titulo.trim() && typeof letter.mensaje === 'string'
      && letter.mensaje.trim();
    if (!valid) {
      console.warn('Carta omitida: comprueba su id único, título y mensaje.', letter);
      return false;
    }
    seenIds.add(letter.id);
    return true;
  });

  function openLetter(letter, index, button, options = {}) {
    activeEnvelope = button;
    title.textContent = letter.titulo;
    message.textContent = letter.mensaje;
    const poemText = typeof letter.poema === 'string' ? letter.poema.trim() : '';
    poem.textContent = poemText;
    poemBlock.hidden = !poemText;
    letterNumber.textContent = options.label || `CARTA ${String(index + 1).padStart(2, '0')} · CON AMOR`;
    document.querySelector('#back-label').textContent = options.returnLabel || 'Volver al buzón';
    button.classList.add('is-opening');
    document.body.classList.add('has-open-letter');
    dialog.showModal();
    dialog.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  }

  const fragment = document.createDocumentFragment();
  letters.forEach((letter, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'letter-card';
    button.dataset.letterId = letter.id;
    button.setAttribute('aria-label', `Abrir carta: ${letter.titulo}`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'letter-dialog');

    // Solo la decoración usa HTML fijo; todo el contenido editable usa textContent.
    const envelope = document.createElement('span');
    envelope.className = 'envelope';
    envelope.setAttribute('aria-hidden', 'true');
    envelope.innerHTML = '<span class="envelope-fold"></span><span class="envelope-flap"></span><span class="envelope-stamp">♡</span><span class="envelope-seal">♥</span><span class="envelope-address">para ti, mi amor</span>';

    const label = document.createElement('span');
    label.className = 'letter-card-label';
    label.textContent = letter.titulo;
    const number = document.createElement('span');
    number.className = 'letter-card-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = `CARTA ${String(index + 1).padStart(2, '0')}`;

    button.append(envelope, label, number);
    button.addEventListener('click', () => openLetter(letter, index, button));
    fragment.append(button);
  });
  grid.replaceChildren(fragment);
  document.querySelector('#nav-letter-count').textContent = `${letters.length} sobres de amor`;
  if (typeof window.iniciarCalendarioAmor === 'function') window.iniciarCalendarioAmor(openLetter);

  document.querySelector('#empty-message').hidden = letters.length !== 0;
  document.querySelector('#collection-count').textContent = letters.length === 1
    ? 'Una carta, una forma de quererte.'
    : letters.length > 1
      ? `${letters.length} cartas, muchas formas de quererte.`
      : 'Cada carta, una forma de quererte.';

  function closeLetter() {
    dialog.close();
  }

  closeButton.addEventListener('click', closeLetter);
  document.querySelector('#back-button').addEventListener('click', closeLetter);
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-open-letter');
    if (activeEnvelope) {
      activeEnvelope.classList.remove('is-opening');
      activeEnvelope.focus({ preventScroll: true });
    }
    pointerStartedOutside = false;
  });

  // Cierra al pulsar el fondo; seleccionar texto dentro nunca cierra la carta.
  function isOutside(event) {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom;
  }
  dialog.addEventListener('pointerdown', (event) => {
    pointerStartedOutside = event.target === dialog && isOutside(event);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pointerStartedOutside && isOutside(event)) closeLetter();
    pointerStartedOutside = false;
  });
})();
