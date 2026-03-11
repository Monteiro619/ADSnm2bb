const API_BASE = 'https://dadosabertos.camara.leg.br/api/v2';

const els = {
  refresh: document.getElementById('liveRefresh'),
  status: document.getElementById('liveStatus'),
  now: document.getElementById('liveNow'),
  next: document.getElementById('liveNext'),
  lastUpdate: document.getElementById('liveLastUpdate'),
};

const fmtDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const fallback = [
  {
    dataHoraInicio: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    descricaoTipo: 'Sessão Deliberativa',
    descricao: 'Discussão de pauta prioritária.',
    orgao: { nome: 'Plenário Ulysses Guimarães', apelido: 'PLEN' },
    situacao: 'Em andamento',
  },
  {
    dataHoraInicio: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    descricaoTipo: 'Reunião Deliberativa',
    descricao: 'Votação de requerimentos.',
    orgao: { nome: 'Comissão de Constituição e Justiça', apelido: 'CCJC' },
    situacao: 'Prevista',
  },
];

async function fetchEvents() {
  const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
  const end = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const url = `${API_BASE}/eventos?dataInicio=${start}&dataFim=${end}&itens=120&ordem=ASC&ordenarPor=dataHoraInicio`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  const payload = await res.json();
  return payload.dados || [];
}

function card(evento, live = false) {
  const dt = fmtDate.format(new Date(evento.dataHoraInicio));
  const orgao = evento.orgao?.apelido || evento.orgao?.nome || 'Órgão não informado';
  return `<article class="mini-card">
    <h3>${evento.descricaoTipo || 'Evento'}</h3>
    <p><strong>${orgao}</strong><br/>${evento.descricao || 'Sem descrição'}<br/>${dt}</p>
    <a class="nav-btn" href="https://www.youtube.com/@camaradosdeputadosoficial" target="_blank">${live ? 'Assistir transmissão' : 'Abrir canal ao vivo'}</a>
  </article>`;
}

function render(events) {
  const nowTs = Date.now();
  const current = events.filter((e) => {
    const t = new Date(e.dataHoraInicio).getTime();
    const status = (e.situacao || '').toLowerCase();
    return status.includes('andamento') || Math.abs(nowTs - t) <= 90 * 60 * 1000;
  }).slice(0, 8);

  const upcoming = events
    .filter((e) => new Date(e.dataHoraInicio).getTime() > nowTs)
    .sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio))
    .slice(0, 8);

  els.now.innerHTML = current.length ? current.map((e) => card(e, true)).join('') : '<p>Nenhum evento ao vivo identificado agora.</p>';
  els.next.innerHTML = upcoming.length ? upcoming.map((e) => card(e)).join('') : '<p>Sem próximos eventos no período.</p>';
}

async function loadLive() {
  els.status.textContent = 'Carregando eventos ao vivo...';
  try {
    const events = await fetchEvents();
    render(events);
    els.status.textContent = `Eventos carregados: ${events.length}.`;
  } catch (e) {
    render(fallback);
    els.status.textContent = `Fonte externa indisponível (${e.message}). Exibindo modo demonstração.`;
  }
  els.lastUpdate.textContent = fmtDate.format(new Date());
}

els.refresh.addEventListener('click', loadLive);
loadLive();
setInterval(loadLive, 60 * 1000);
