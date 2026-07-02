const STORE_KEY = 'jobtracker_entries_v1';

const STATUS = {
  applied:   { label: 'applied',    tag: 'tag-applied' },
  oa:        { label: 'assessment', tag: 'tag-oa' },
  interview: { label: 'interview',  tag: 'tag-interview' },
  offer:     { label: 'offer',      tag: 'tag-offer' },
  rejected:  { label: 'rejected',   tag: 'tag-rejected' },
};

let entries = [];
let activeFilter = 'all';
let openId = null;

function uid() {
  return 'e_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    entries = raw ? JSON.parse(raw) : [];
  } catch (e) {
    entries = [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('could not save', e);
  }
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function renderClock() {
  const el = document.getElementById('clock');
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

function renderStats() {
  const el = document.getElementById('statStrip');
  const total = entries.length;
  const counts = {};
  entries.forEach(e => counts[e.status] = (counts[e.status] || 0) + 1);
  let html = `<div class="stat-chip accent">total <b>${total}</b></div>`;
  Object.keys(STATUS).forEach(k => {
    if (counts[k]) html += `<div class="stat-chip">${STATUS[k].label} <b>${counts[k]}</b></div>`;
  });
  el.innerHTML = html;
}

function renderFilters() {
  const el = document.getElementById('filters');
  const opts = [['all', 'all'], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])];
  el.innerHTML = opts.map(([k, label]) =>
    `<button class="filter-tag${activeFilter === k ? ' active' : ''}" data-k="${k}">${label}</button>`
  ).join('');
  el.querySelectorAll('.filter-tag').forEach(btn => {
    btn.onclick = () => { activeFilter = btn.dataset.k; openId = null; renderAll(); };
  });
}

function renderTable() {
  const body = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  const list = (activeFilter === 'all' ? entries : entries.filter(e => e.status === activeFilter))
    .slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (list.length === 0) {
    body.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  body.innerHTML = list.map(e => {
    const st = STATUS[e.status] || STATUS.applied;
    return `<div class="row" data-id="${e.id}">
      <span class="col-company">${escapeHtml(e.company)}</span>
      <span class="col-role">${escapeHtml(e.role)}</span>
      <span class="tag ${st.tag}">${st.label}</span>
      <span class="col-date">${fmtDate(e.date)}</span>
      <button class="row-del" data-id="${e.id}" aria-label="delete entry">✕</button>
    </div>`;
  }).join('');

  body.querySelectorAll('.row').forEach(row => {
    row.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('row-del')) return;
      openId = openId === row.dataset.id ? null : row.dataset.id;
      renderDetail();
    });
  });
  body.querySelectorAll('.row-del').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      entries = entries.filter(e => e.id !== btn.dataset.id);
      if (openId === btn.dataset.id) openId = null;
      persist();
      renderAll();
    });
  });
}

function renderDetail() {
  const panel = document.getElementById('detailPanel');
  if (!openId) { panel.hidden = true; panel.innerHTML = ''; return; }
  const e = entries.find(x => x.id === openId);
  if (!e) { panel.hidden = true; return; }
  panel.hidden = false;
  panel.innerHTML = `
    <h3>${escapeHtml(e.company)} — ${escapeHtml(e.role)}</h3>
    <div class="drow"><b>applied</b> ${fmtDate(e.date)}</div>
    ${e.link ? `<div class="drow"><b>link</b> <a href="${escapeHtml(e.link)}" target="_blank" rel="noopener">${escapeHtml(e.link)}</a></div>` : ''}
    ${e.notes ? `<div class="drow"><b>notes</b> ${escapeHtml(e.notes)}</div>` : ''}
    <div class="drow"><b>status</b>
      <select id="detailStatus">
        ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === e.status ? 'selected' : ''}>${v.label}</option>`).join('')}
      </select>
    </div>
  `;
  document.getElementById('detailStatus').onchange = (ev) => {
    e.status = ev.target.value;
    persist();
    renderAll();
    openId = e.id;
    renderDetail();
  };
}

function renderFooter() {
  document.getElementById('footerCount').textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;
}

function renderAll() {
  renderStats();
  renderFilters();
  renderTable();
  renderDetail();
  renderFooter();
}

function openForm() {
  document.getElementById('f-company').value = '';
  document.getElementById('f-role').value = '';
  document.getElementById('f-status').value = 'applied';
  document.getElementById('f-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('f-link').value = '';
  document.getElementById('f-notes').value = '';
  document.getElementById('formPanel').hidden = false;
  document.getElementById('f-company').focus();
}

function closeForm() {
  document.getElementById('formPanel').hidden = true;
}

function saveEntry() {
  const company = document.getElementById('f-company').value.trim();
  const role = document.getElementById('f-role').value.trim();
  if (!company || !role) {
    document.getElementById(company ? 'f-role' : 'f-company').focus();
    return;
  }
  entries.push({
    id: uid(),
    company,
    role,
    status: document.getElementById('f-status').value,
    date: document.getElementById('f-date').value,
    link: document.getElementById('f-link').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
  });
  persist();
  closeForm();
  renderAll();
}

document.getElementById('addBtn').addEventListener('click', openForm);
document.getElementById('closeForm').addEventListener('click', closeForm);
document.getElementById('cancelBtn').addEventListener('click', closeForm);
document.getElementById('saveBtn').addEventListener('click', saveEntry);

load();
renderAll();
renderClock();
setInterval(renderClock, 1000);
