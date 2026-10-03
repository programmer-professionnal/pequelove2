/* Calendario local: las fechas se calculan sin convertir a UTC ni desplazar días. */
window.iniciarCalendarioAmor = function (openLetter) {
  'use strict';
  const dateKey = date => `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const localDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && dateKey(a) === dateKey(b);
  const serialDay = date => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
  const startFor = date => new Date(date.getFullYear() - (date.getMonth() < 7 ? 1 : 0), 7, 1, 12);
  const fullDate = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const spokenDate = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const monthName = new Intl.DateTimeFormat('es-MX', { month: 'long' });
  const letters = new Map();
  const entries = Array.isArray(window.CARTAS_DIARIAS) ? [...window.CARTAS_DIARIAS] : [];
  if (window.CARTA_BISIESTA) entries.push(window.CARTA_BISIESTA);
  for (const letter of entries) {
    const key = letter && letter.fecha;
    if (typeof key !== 'string' || !/^\d{2}-\d{2}$/.test(key)) continue;
    const [month, day] = key.split('-').map(Number);
    const check = new Date(2000, month - 1, day, 12);
    if (dateKey(check) !== key || letters.has(key) || typeof letter.titulo !== 'string'
      || !letter.titulo.trim() || typeof letter.mensaje !== 'string' || !letter.mensaje.trim()) {
      console.warn('Carta diaria omitida: revisa fecha, título y mensaje.', letter);
      continue;
    }
    letters.set(key, letter);
  }

  const grid = document.querySelector('#calendar-days');
  const monthSelect = document.querySelector('#calendar-month');
  const yearLabel = document.querySelector('#calendar-year');
  const openButton = document.querySelector('#daily-open');
  const status = document.querySelector('#daily-status');
  let today = localDay(new Date());
  let start = startFor(today);
  let end = new Date(start.getFullYear() + 1, 6, 31, 12);
  let selected = localDay(start);
  let view = localDay(start);
  let followToday = false;

  const inCycle = date => date >= start && date <= end;
  const forMonth = month => new Date(start.getFullYear() + (month < 7 ? 1 : 0), month, 1, 12);
  const ordinal = date => serialDay(date) - serialDay(start) + 1;
  const cycleLength = () => serialDay(end) - serialDay(start) + 1;

  for (let step = 0; step < 12; step++) {
    const month = (7 + step) % 12;
    const option = document.createElement('option');
    option.value = String(month);
    option.textContent = monthName.format(new Date(2000, month, 1, 12));
    monthSelect.append(option);
  }

  function selectedLetter() {
    const key = dateKey(selected);
    return letters.get(key) || (key === '02-29' ? letters.get('02-28') : undefined);
  }

  function renderCard(announce = false) {
    const letter = selectedLetter();
    const isToday = sameDay(selected, today);
    const dateLabel = fullDate.format(selected);
    const dayLabel = `DÍA ${ordinal(selected)} DE ${cycleLength()}`;
    document.querySelector('#daily-kicker').textContent = `${dayLabel} · ${isToday ? 'LA CARTA DE HOY' : 'DESDE AQUEL AGOSTO'}`;
    document.querySelector('#daily-month').textContent = monthName.format(selected);
    document.querySelector('#daily-day').textContent = String(selected.getDate()).padStart(2, '0');
    const time = document.querySelector('#daily-date');
    time.dateTime = `${selected.getFullYear()}-${dateKey(selected)}`;
    time.textContent = dateLabel;
    document.querySelector('#daily-title').textContent = letter ? letter.titulo : 'Un sobre por escribir';
    document.querySelector('#daily-excerpt').textContent = letter
      ? letter.mensaje.replace(/^Mi amor,\s*/i, '').trim()
      : 'Esta fecha todavía no tiene una carta. Puedes elegir otro día del calendario.';
    openButton.disabled = !letter;
    openButton.setAttribute('aria-label', letter ? `Abrir carta del ${dateLabel}: ${letter.titulo}` : 'No hay carta para esta fecha');
    if (announce) status.textContent = `${dateLabel}. ${letter ? letter.titulo : 'Sin carta disponible.'}`;
  }

  function renderCalendar() {
    const year = view.getFullYear();
    const month = view.getMonth();
    monthSelect.value = String(month);
    yearLabel.textContent = String(year);
    document.querySelector('#previous-month').disabled = year === start.getFullYear() && month === 7;
    document.querySelector('#next-month').disabled = year === end.getFullYear() && month === 6;
    grid.setAttribute('aria-label', `Días de ${monthName.format(view)} de ${year}`);
    const fragment = document.createDocumentFragment();
    const offset = (new Date(year, month, 1, 12).getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement('span');
      blank.setAttribute('aria-hidden', 'true');
      fragment.append(blank);
    }
    const days = new Date(year, month + 1, 0, 12).getDate();
    for (let day = 1; day <= days; day++) {
      const date = new Date(year, month, day, 12);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'calendar-day';
      button.textContent = String(day);
      button.dataset.day = String(day);
      button.setAttribute('aria-label', spokenDate.format(date));
      button.setAttribute('aria-pressed', String(sameDay(date, selected)));
      if (sameDay(date, today)) button.setAttribute('aria-current', 'date');
      button.addEventListener('click', () => chooseDate(date, true));
      fragment.append(button);
    }
    grid.replaceChildren(fragment);
  }

  function chooseDate(date, focusDay = false, isToday = false) {
    if (!inCycle(date)) return;
    selected = localDay(date);
    view = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
    followToday = isToday;
    renderCard(true);
    renderCalendar();
    if (focusDay) grid.querySelector(`[data-day="${selected.getDate()}"]`).focus({ preventScroll: true });
  }

  document.querySelector('#previous-month').addEventListener('click', () => {
    const previous = new Date(view.getFullYear(), view.getMonth() - 1, 1, 12);
    if (!inCycle(previous)) return;
    view = previous;
    renderCalendar();
    status.textContent = `Calendario de ${monthName.format(view)} de ${view.getFullYear()}`;
  });
  document.querySelector('#next-month').addEventListener('click', () => {
    const next = new Date(view.getFullYear(), view.getMonth() + 1, 1, 12);
    if (!inCycle(next)) return;
    view = next;
    renderCalendar();
    status.textContent = `Calendario de ${monthName.format(view)} de ${view.getFullYear()}`;
  });
  monthSelect.addEventListener('change', () => {
    view = forMonth(Number(monthSelect.value));
    renderCalendar();
    status.textContent = `Calendario de ${monthName.format(view)} de ${view.getFullYear()}`;
  });
  document.querySelector('#calendar-today').addEventListener('click', () => {
    refreshToday();
    chooseDate(today, false, true);
  });
  document.querySelector('#calendar-start').addEventListener('click', () => chooseDate(start));
  grid.addEventListener('keydown', event => {
    const button = event.target.closest('.calendar-day');
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!button || !(event.key in offsets)) return;
    event.preventDefault();
    chooseDate(new Date(view.getFullYear(), view.getMonth(), Number(button.dataset.day) + offsets[event.key], 12), true);
  });
  openButton.addEventListener('click', () => {
    const letter = selectedLetter();
    if (!letter) return;
    openLetter(letter, 0, openButton, {
      label: `DÍA ${ordinal(selected)} · ${fullDate.format(selected).toLocaleUpperCase('es-MX')}`,
      returnLabel: 'Volver al calendario',
    });
  });

  function refreshToday() {
    const now = localDay(new Date());
    if (sameDay(now, today)) return;
    today = now;
    const newStart = startFor(today);
    if (!sameDay(newStart, start)) {
      const selectedMonth = selected.getMonth();
      const selectedDay = selected.getDate();
      const viewMonth = view.getMonth();
      start = newStart;
      end = new Date(start.getFullYear() + 1, 6, 31, 12);
      const projected = forMonth(selectedMonth);
      const lastDay = new Date(projected.getFullYear(), selectedMonth + 1, 0, 12).getDate();
      selected = new Date(projected.getFullYear(), selectedMonth, Math.min(selectedDay, lastDay), 12);
      view = forMonth(viewMonth);
    }
    if (followToday) chooseDate(today, false, true);
    else { renderCard(); renderCalendar(); }
  }
  // Recalcula al volver a la pestaña y al cambiar de día, también con horario de verano.
  function scheduleMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    window.setTimeout(() => { refreshToday(); scheduleMidnight(); }, next - now + 100);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshToday(); });
  renderCard();
  renderCalendar();
  scheduleMidnight();
};
