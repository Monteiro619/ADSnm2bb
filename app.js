const API_BASE = 'https://dadosabertos.camara.leg.br/api/v2';
const STORAGE_TRACKED = 'camara360_tracked_props_v1';
const STORAGE_THEME = 'camara360_theme';

const state = {
  currentView: 'dashboard',
  deputados: [],
  orgaos: [],
  proposicoes: [],
  eventos: [],
  deputyDetails: new Map(),
  tracked: [],
  changes: [],
  timerId: null,
};

const elements = {
  nav: document.getElementById('sidebarNav'),
  viewTitle: document.getElementById('viewTitle'),
  lastUpdate: document.getElementById('lastUpdate'),
  apiStatus: document.getElementById('apiStatus'),
  refreshInterval: document.getElementById('refreshInterval'),
  manualRefresh: document.getElementById('manualRefresh'),
  themeToggle: document.getElementById('themeToggle'),
  kpis: document.getElementById('kpis'),
  partyChart: document.getElementById('partyChart'),
  committeesHot: document.getElementById('committeesHot'),
  deputySearch: document.getElementById('deputySearch'),
  deputyPartyFilter: document.getElementById('deputyPartyFilter'),
  deputiesGrid: document.getElementById('deputiesGrid'),
  proposalList: document.getElementById('proposalList'),
  trackedList: document.getElementById('trackedList'),
  changesList: document.getElementById('changesList'),
  eventTypeFilter: document.getElementById('eventTypeFilter'),
  eventSearch: document.getElementById('eventSearch'),
  eventsTable: document.getElementById('eventsTable'),
  eventRowTemplate: document.getElementById('eventRowTemplate'),
  views: document.querySelectorAll('.view'),
};

const fallback = {
  deputados: [
    { id: 1, nome: 'Dep. Exemplo AP', siglaPartido: 'PL', siglaUf: 'AP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/160565.jpg' },
    { id: 2, nome: 'Dep. Exemplo Norte', siglaPartido: 'PT', siglaUf: 'AP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/220593.jpg' },
  ],
  orgaos: [{ apelido: 'CCJC' }, { apelido: 'CFT' }],
  proposicoes: [{ id: 999, siglaTipo: 'PL', numero: 1234, ano: 2026, ementa: 'Proposta de demonstração', uri: 'https://www.camara.leg.br/' }],
  eventos: [
    {
      dataHoraInicio: new Date(Date.now() + 3600000).toISOString(),
      descricaoTipo: 'Sessão Deliberativa',
      descricao: 'Discussão da pauta do dia',
      orgao: { apelido: 'PLEN' },
      situacao: 'Prevista',
    },
  ],
};

const nf = new Intl.NumberFormat('pt-BR');
const df = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function titleByView(view) {
  return {
    dashboard: 'Visão Geral',
    deputados: 'Deputados',
    legislativo: 'Controle Legislativo',
    agenda: 'Agenda de Eventos',
  }[view] || 'Câmara 360';
}

function normalizeEventType(evento) {
  const txt = `${evento.descricaoTipo || ''} ${evento.descricao || ''}`.toLowerCase();
  return txt.includes('plen') || txt.includes('sessão') ? 'plenario' : 'comissao';
}

async function fetchApi(path, params = {}) {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE}${path}?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${path}`);
  return res.json();
}

function loadTrackedFromStorage() {
  try {
    state.tracked = JSON.parse(localStorage.getItem(STORAGE_TRACKED) || '[]');
  } catch {
    state.tracked = [];
  }
}

function saveTrackedToStorage() {
  localStorage.setItem(STORAGE_TRACKED, JSON.stringify(state.tracked));
}

function applyThemeFromStorage() {
  const stored = localStorage.getItem(STORAGE_THEME) || 'dark';
  document.body.setAttribute('data-theme', stored);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_THEME, next);
}

function switchView(view) {
  state.currentView = view;
  elements.views.forEach((el) => el.classList.toggle('active', el.id === `view-${view}`));
  document.querySelectorAll('.nav-btn[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  elements.viewTitle.textContent = titleByView(view);
}

function renderKpis() {
  const parties = new Set(state.deputados.map((d) => d.siglaPartido)).size;
  const events48h = state.eventos.filter((e) => {
    const ms = new Date(e.dataHoraInicio).getTime() - Date.now();
    return ms > 0 && ms < 48 * 3600 * 1000;
  }).length;
  const cards = [
    ['Deputados ativos', nf.format(state.deputados.length)],
    ['Partidos', nf.format(parties)],
    ['Comissões', nf.format(state.orgaos.length)],
    ['PL recentes', nf.format(state.proposicoes.length)],
    ['Eventos 48h', nf.format(events48h)],
  ];
  elements.kpis.innerHTML = cards.map(([k, v]) => `<article class="kpi"><p>${k}</p><h3>${v}</h3></article>`).join('');
}

function renderPartyChart() {
  const counts = state.deputados.reduce((acc, dep) => {
    acc[dep.siglaPartido || 'N/I'] = (acc[dep.siglaPartido || 'N/I'] || 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = sorted[0]?.[1] || 1;
  elements.partyChart.innerHTML = sorted.map(([sigla, total]) => `<div class="bar-row"><strong>${sigla}</strong><div class="bar-track"><div class="bar-fill" style="width:${(total / max) * 100}%"></div></div><span>${total}</span></div>`).join('');
}

function renderCommitteesHot() {
  const mentions = state.eventos.reduce((acc, e) => {
    const key = e.orgao?.apelido || 'Órgão';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const items = Object.entries(mentions).sort((a, b) => b[1] - a[1]).slice(0, 8);
  elements.committeesHot.innerHTML = items.length
    ? items.map(([n, t]) => `<div class="list-item"><strong>${n}</strong><span class="badge">${t} eventos</span></div>`).join('')
    : '<p>Sem dados.</p>';
}

async function hydrateDeputy(dep) {
  if (!dep?.id || state.deputyDetails.has(dep.id)) return;
  try {
    const [details, legislaturas] = await Promise.all([
      fetchApi(`/deputados/${dep.id}`),
      fetchApi(`/deputados/${dep.id}/legislaturas`, { itens: 100 }),
    ]);
    const ultimo = details?.dados?.ultimoStatus || {};
    const gabinete = ultimo?.gabinete || {};
    state.deputyDetails.set(dep.id, {
      email: ultimo?.email || 'Não informado',
      telefone: gabinete?.telefone || 'Não informado',
      sala: gabinete?.sala ? `${gabinete.predio || ''} ${gabinete.sala}`.trim() : 'Não informado',
      legislaturas: (legislaturas?.dados || []).length,
    });
  } catch {
    state.deputyDetails.set(dep.id, {
      email: 'Não informado',
      telefone: 'Não informado',
      sala: 'Não informado',
      legislaturas: 0,
    });
  }
}

async function renderDeputies() {
  const search = elements.deputySearch.value.trim().toLowerCase();
  const party = elements.deputyPartyFilter.value;
  const filtered = state.deputados.filter((d) => {
    const txt = `${d.nome || ''} ${d.siglaPartido || ''} ${d.siglaUf || ''}`.toLowerCase();
    return txt.includes(search) && (!party || d.siglaPartido === party);
  }).slice(0, 30);

  await Promise.all(filtered.map(hydrateDeputy));

  elements.deputiesGrid.innerHTML = filtered.map((d) => {
    const extra = state.deputyDetails.get(d.id) || {};
    return `<article class="mini-card deputy-card">
      <img src="${d.urlFoto || ''}" alt="${d.nome || 'Deputado'}" onerror="this.style.display='none'" />
      <div>
        <h3>${d.nome || 'Deputado(a)'}</h3>
        <p>${d.siglaPartido || 'N/I'} · ${d.siglaUf || 'N/I'}</p>
        <p><strong>Legislaturas:</strong> ${extra.legislaturas ?? 0}</p>
        <p><strong>E-mail:</strong> ${extra.email || 'Não informado'}</p>
        <p><strong>Ramal/Telefone:</strong> ${extra.telefone || 'Não informado'}</p>
        <p><strong>Gabinete:</strong> ${extra.sala || 'Não informado'}</p>
      </div>
    </article>`;
  }).join('');
}

async function fetchProposalSnapshot(id) {
  try {
    const data = await fetchApi(`/proposicoes/${id}/tramitacoes`, { ordem: 'DESC', itens: 1, ordenarPor: 'dataHora' });
    const item = data?.dados?.[0];
    if (!item) return 'Sem tramitação';
    return `${item.dataHora || ''} | ${item.descricaoTramitacao || ''}`;
  } catch {
    return 'Sem tramitação';
  }
}

function renderLegislative() {
  const proposals = state.proposicoes.slice(0, 20);
  elements.proposalList.innerHTML = proposals.map((p) => {
    const code = `${p.siglaTipo} ${p.numero}/${p.ano}`;
    const tracked = state.tracked.find((t) => t.id === p.id);
    return `<div class="list-item"><div><strong>${code}</strong><p>${(p.ementa || '').slice(0, 100)}</p></div><button data-action="track" data-id="${p.id}">${tracked ? 'Acompanhando' : 'Acompanhar'}</button></div>`;
  }).join('');

  elements.trackedList.innerHTML = state.tracked.length
    ? state.tracked.map((t) => `<div class="list-item"><div><strong>${t.code}</strong><p>${t.lastSnapshot || 'Sem atualização'}</p></div><button data-action="untrack" data-id="${t.id}">Remover</button></div>`).join('')
    : '<p>Nenhuma proposta monitorada ainda.</p>';

  elements.changesList.innerHTML = state.changes.length
    ? state.changes.slice(0, 10).map((c) => `<div class="list-item"><div><strong>${c.code}</strong><p>${c.message}</p></div><span>${df.format(new Date(c.when))}</span></div>`).join('')
    : '<p>Sem mudanças detectadas.</p>';
}

function renderAgenda() {
  const type = elements.eventTypeFilter.value;
  const search = elements.eventSearch.value.trim().toLowerCase();
  const filtered = state.eventos.filter((e) => {
    const t = normalizeEventType(e);
    if (type !== 'todos' && t !== type) return false;
    const txt = `${e.descricaoTipo || ''} ${e.descricao || ''} ${e.orgao?.apelido || ''}`.toLowerCase();
    return txt.includes(search);
  }).sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio)).slice(0, 30);

  if (!filtered.length) {
    elements.eventsTable.innerHTML = '<p>Nenhum evento encontrado.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Início</th><th>Tipo</th><th>Órgão</th><th>Descrição</th><th>Situação</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');
  filtered.forEach((e) => {
    const row = elements.eventRowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('[data-col="inicio"]').textContent = df.format(new Date(e.dataHoraInicio));
    row.querySelector('[data-col="tipo"]').textContent = e.descricaoTipo || '-';
    row.querySelector('[data-col="orgao"]').textContent = e.orgao?.apelido || e.orgao?.nome || '-';
    row.querySelector('[data-col="descricao"]').textContent = e.descricao || '-';
    row.querySelector('[data-col="situacao"]').textContent = e.situacao || '-';
    tbody.appendChild(row);
  });
  elements.eventsTable.innerHTML = '';
  elements.eventsTable.appendChild(table);
}

function renderAll() {
  renderKpis();
  renderPartyChart();
  renderCommitteesHot();
  renderLegislative();
  renderAgenda();
  renderDeputies();
}

async function checkTrackedUpdates() {
  for (const item of state.tracked) {
    const snapshot = await fetchProposalSnapshot(item.id);
    if (item.lastSnapshot && item.lastSnapshot !== snapshot) {
      state.changes.unshift({ code: item.code, message: `Mudança: ${snapshot}`, when: Date.now() });
    }
    item.lastSnapshot = snapshot;
  }
  saveTrackedToStorage();
}

function setData(payload) {
  state.deputados = payload.deputados || [];
  state.orgaos = payload.orgaos || [];
  state.proposicoes = payload.proposicoes || [];
  state.eventos = payload.eventos || [];
}

async function loadDashboard() {
  elements.apiStatus.textContent = 'API: carregando...';
  try {
    const [deps, orgs, props, events] = await Promise.all([
      fetchApi('/deputados', { itens: 600, ordem: 'ASC', ordenarPor: 'nome' }),
      fetchApi('/orgaos', { itens: 250, ordem: 'ASC', ordenarPor: 'sigla' }),
      fetchApi('/proposicoes', { siglaTipo: 'PL', itens: 40, ordem: 'DESC', ordenarPor: 'id' }),
      fetchApi('/eventos', {
        dataInicio: new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10),
        dataFim: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        itens: 100,
        ordem: 'ASC',
        ordenarPor: 'dataHoraInicio',
      }),
    ]);

    setData({ deputados: deps.dados, orgaos: orgs.dados, proposicoes: props.dados, eventos: events.dados });
    elements.apiStatus.textContent = 'API: conectado';
  } catch (e) {
    setData(fallback);
    elements.apiStatus.textContent = `API: fallback (${e.message})`;
  }

  const parties = [...new Set(state.deputados.map((d) => d.siglaPartido).filter(Boolean))].sort();
  elements.deputyPartyFilter.innerHTML = '<option value="">Todos os partidos</option>' + parties.map((p) => `<option value="${p}">${p}</option>`).join('');

  await checkTrackedUpdates();
  renderAll();
  elements.lastUpdate.textContent = df.format(new Date());
}

function setRefresh(seconds) {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = seconds > 0 ? setInterval(loadDashboard, seconds * 1000) : null;
}

async function handleActionClick(event) {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'track') {
    const prop = state.proposicoes.find((p) => p.id === id);
    if (!prop) return;
    if (state.tracked.some((t) => t.id === id)) return;
    const code = `${prop.siglaTipo} ${prop.numero}/${prop.ano}`;
    const lastSnapshot = await fetchProposalSnapshot(id);
    state.tracked.unshift({ id, code, lastSnapshot });
    saveTrackedToStorage();
    renderLegislative();
  }

  if (btn.dataset.action === 'untrack') {
    state.tracked = state.tracked.filter((t) => t.id !== id);
    saveTrackedToStorage();
    renderLegislative();
  }
}

elements.nav.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-view]');
  if (btn) switchView(btn.dataset.view);
});

elements.manualRefresh.addEventListener('click', loadDashboard);
elements.refreshInterval.addEventListener('change', (e) => setRefresh(Number(e.target.value)));
elements.deputySearch.addEventListener('input', renderDeputies);
elements.deputyPartyFilter.addEventListener('change', renderDeputies);
elements.eventTypeFilter.addEventListener('change', renderAgenda);
elements.eventSearch.addEventListener('input', renderAgenda);
elements.themeToggle.addEventListener('click', toggleTheme);
document.body.addEventListener('click', handleActionClick);

applyThemeFromStorage();
loadTrackedFromStorage();
loadDashboard();
setRefresh(Number(elements.refreshInterval.value));
