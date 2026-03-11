const API_BASE = 'https://dadosabertos.camara.leg.br/api/v2';

const state = {
  deputados: [],
  partidos: [],
  orgaos: [],
  proposicoes: [],
  eventos: [],
  timerId: null,
};

const elements = {
  kpis: document.getElementById('kpis'),
  partyChart: document.getElementById('partyChart'),
  committeesList: document.getElementById('committeesList'),
  billsList: document.getElementById('billsList'),
  deputiesList: document.getElementById('deputiesList'),
  eventsTable: document.getElementById('eventsTable'),
  status: document.getElementById('status'),
  lastUpdate: document.getElementById('lastUpdate'),
  refreshInterval: document.getElementById('refreshInterval'),
  manualRefresh: document.getElementById('manualRefresh'),
  eventTypeFilter: document.getElementById('eventTypeFilter'),
  eventSearch: document.getElementById('eventSearch'),
  eventRowTemplate: document.getElementById('eventRowTemplate'),
};

const fallbackData = {
  deputados: [
    { nome: 'Dep. Exemplo 1', siglaPartido: 'PL', siglaUf: 'SP' },
    { nome: 'Dep. Exemplo 2', siglaPartido: 'PT', siglaUf: 'BA' },
    { nome: 'Dep. Exemplo 3', siglaPartido: 'PP', siglaUf: 'RS' },
  ],
  partidos: [],
  orgaos: [{ apelido: 'CCJC' }, { apelido: 'CFT' }, { apelido: 'PLENÁRIO' }],
  proposicoes: [
    { siglaTipo: 'PL', numero: 1234, ano: 2026, uri: 'https://www.camara.leg.br/', ementa: 'Proposição de demonstração para modo offline.' },
  ],
  eventos: [
    {
      dataHoraInicio: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      descricaoTipo: 'Reunião Deliberativa',
      descricao: 'Discussão e votação de requerimentos.',
      orgao: { apelido: 'CCJC', nome: 'Comissão de Constituição e Justiça e de Cidadania' },
      situacao: 'Confirmada',
    },
  ],
};

const formatNumber = new Intl.NumberFormat('pt-BR');
const formatDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

async function fetchJson(path, params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE}${path}?${query.toString()}`);
  if (!response.ok) throw new Error(`Erro HTTP ${response.status} em ${path}`);
  return response.json();
}

function normalizeType(evento) {
  const description = `${evento.descricaoTipo || ''} ${evento.descricao || ''}`.toLowerCase();
  return description.includes('plen') || description.includes('sessão') ? 'plenario' : 'comissao';
}

function setStateData(payload) {
  state.deputados = payload.deputados || [];
  state.partidos = payload.partidos || [];
  state.orgaos = payload.orgaos || [];
  state.proposicoes = payload.proposicoes || [];
  state.eventos = payload.eventos || [];
}

function renderKpis() {
  const partyCount = new Set(state.deputados.map((d) => d.siglaPartido)).size;
  const committees = state.orgaos.filter((o) => o.apelido && o.apelido !== 'PLENÁRIO').length;
  const eventsNext48h = state.eventos.filter((evento) => {
    const delta = new Date(evento.dataHoraInicio).getTime() - Date.now();
    return delta > 0 && delta <= 48 * 3600 * 1000;
  }).length;

  const items = [
    { title: 'Deputados ativos', value: formatNumber.format(state.deputados.length) },
    { title: 'Partidos representados', value: formatNumber.format(partyCount) },
    { title: 'Comissões mapeadas', value: formatNumber.format(committees) },
    { title: 'PLs recentes analisados', value: formatNumber.format(state.proposicoes.length) },
    { title: 'Eventos em 48h', value: formatNumber.format(eventsNext48h) },
  ];

  elements.kpis.innerHTML = items.map((item) => `<article class="kpi"><p>${item.title}</p><h3>${item.value}</h3></article>`).join('');
}

function renderPartyChart() {
  const counts = state.deputados.reduce((acc, deputado) => {
    const sigla = deputado.siglaPartido || 'N/I';
    acc[sigla] = (acc[sigla] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = entries[0]?.[1] ?? 1;

  elements.partyChart.innerHTML = entries
    .map(([sigla, total]) => `<div class="bar-row"><strong>${sigla}</strong><div class="bar-track"><div class="bar-fill" style="width:${(total / max) * 100}%"></div></div><span>${total}</span></div>`)
    .join('');
}

function renderCommittees() {
  const committeeMentions = state.eventos.reduce((acc, evento) => {
    const key = evento.orgao?.apelido || evento.orgao?.nome || 'Órgão não informado';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const items = Object.entries(committeeMentions)
    .filter(([name]) => !name.toLowerCase().includes('plen'))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  elements.committeesList.innerHTML = items
    .map(([name, meetings]) => `<li><strong>${name}</strong><br/><span class="badge">${meetings} evento(s) recente(s)</span></li>`)
    .join('');
}

function renderBills() {
  elements.billsList.innerHTML = state.proposicoes
    .slice(0, 8)
    .map((proposicao) => {
      const code = `${proposicao.siglaTipo} ${proposicao.numero}/${proposicao.ano}`;
      const link = proposicao.uri ? `<a target="_blank" href="${proposicao.uri}">${code}</a>` : code;
      return `<li>${link}<br/><small>${proposicao.ementa?.slice(0, 170) || 'Sem ementa disponível.'}</small></li>`;
    })
    .join('');
}

function renderDeputies() {
  elements.deputiesList.innerHTML = state.deputados
    .slice(0, 24)
    .map((dep) => `<article class="mini-card"><h3>${dep.nome || dep.nomeCivil || 'Deputado(a)'}</h3><p>${dep.siglaPartido || 'N/I'} · ${dep.siglaUf || 'N/I'}</p></article>`)
    .join('');
}

function renderEvents() {
  const typeFilter = elements.eventTypeFilter.value;
  const search = elements.eventSearch.value.trim().toLowerCase();
  const filtered = state.eventos
    .filter((evento) => {
      const tipo = normalizeType(evento);
      if (typeFilter !== 'todos' && tipo !== typeFilter) return false;
      if (!search) return true;
      const text = `${evento.descricaoTipo || ''} ${evento.descricao || ''} ${evento.orgao?.apelido || ''} ${evento.orgao?.nome || ''}`.toLowerCase();
      return text.includes(search);
    })
    .sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio))
    .slice(0, 25);

  if (!filtered.length) {
    elements.eventsTable.innerHTML = '<p>Nenhum evento encontrado com os filtros atuais.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Início</th><th>Tipo</th><th>Órgão</th><th>Descrição</th><th>Situação</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');

  filtered.forEach((evento) => {
    const row = elements.eventRowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('[data-col="inicio"]').textContent = formatDate.format(new Date(evento.dataHoraInicio));
    row.querySelector('[data-col="tipo"]').textContent = evento.descricaoTipo || 'Não informado';
    row.querySelector('[data-col="orgao"]').textContent = evento.orgao?.apelido || evento.orgao?.nome || '—';
    row.querySelector('[data-col="descricao"]').textContent = evento.descricao || 'Sem descrição';
    row.querySelector('[data-col="situacao"]').textContent = evento.situacao || '—';
    tbody.appendChild(row);
  });

  elements.eventsTable.innerHTML = '';
  elements.eventsTable.appendChild(table);
}

function renderAll() {
  renderKpis();
  renderPartyChart();
  renderCommittees();
  renderBills();
  renderDeputies();
  renderEvents();
}

async function loadDashboard() {
  elements.status.textContent = 'Atualizando dados...';
  try {
    const [deputados, partidos, orgaos, proposicoes, eventos] = await Promise.all([
      fetchJson('/deputados', { itens: 600, ordem: 'ASC', ordenarPor: 'nome' }),
      fetchJson('/partidos', { itens: 100, ordem: 'ASC', ordenarPor: 'sigla' }),
      fetchJson('/orgaos', { itens: 300, ordem: 'ASC', ordenarPor: 'sigla' }),
      fetchJson('/proposicoes', { siglaTipo: 'PL', itens: 30, ordem: 'DESC', ordenarPor: 'id' }),
      fetchJson('/eventos', {
        dataInicio: new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10),
        dataFim: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        itens: 100,
        ordem: 'ASC',
        ordenarPor: 'dataHoraInicio',
      }),
    ]);

    setStateData({ deputados: deputados.dados, partidos: partidos.dados, orgaos: orgaos.dados, proposicoes: proposicoes.dados, eventos: eventos.dados });
    renderAll();
    elements.lastUpdate.textContent = formatDate.format(new Date());
    elements.status.textContent = `Dados carregados: ${formatNumber.format(state.deputados.length)} deputados, ${formatNumber.format(state.eventos.length)} eventos.`;
  } catch (error) {
    setStateData(fallbackData);
    renderAll();
    elements.lastUpdate.textContent = formatDate.format(new Date());
    elements.status.textContent = `API indisponível (${error.message}). Exibindo modo demonstração com dados locais.`;
  }
}

function setAutoRefresh(seconds) {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = seconds > 0 ? setInterval(loadDashboard, seconds * 1000) : null;
}

elements.manualRefresh.addEventListener('click', loadDashboard);
elements.refreshInterval.addEventListener('change', (event) => setAutoRefresh(Number(event.target.value)));
elements.eventTypeFilter.addEventListener('change', renderEvents);
elements.eventSearch.addEventListener('input', renderEvents);

renderAll();
loadDashboard();
setAutoRefresh(Number(elements.refreshInterval.value));
