const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const root = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const electionFallback = {
  available: false,
  fonte: 'Dados locais (fallback)',
  message: 'Não foi possível consultar endpoint externo no momento.',
  resumo: [
    { titulo: 'Estado', valor: 'Amapá (AP)' },
    { titulo: 'Municípios para análise', valor: '16' },
    { titulo: 'Uso recomendado', valor: 'Planejamento territorial de campanha' },
  ],
};

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

async function handleElectionAp(res) {
  const target = 'https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/ap/ap-c0001-e000544-r.json';

  try {
    const response = await fetch(target);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();

    const candidatos = Array.isArray(payload?.cand) ? payload.cand : [];
    const totalValidos = Number(payload?.pst || 0);
    const top3 = candidatos
      .slice(0, 3)
      .map((c) => `${c.nm || 'Candidato'} (${c.sg || '-'})`)
      .join(' · ');

    const result = {
      available: true,
      fonte: 'TSE Resultados (ele2022)',
      message: 'Endpoint externo acessado com sucesso.',
      resumo: [
        { titulo: 'UF', valor: 'Amapá (AP)' },
        { titulo: 'Total de candidatos no recorte', valor: String(candidatos.length) },
        { titulo: 'Percentual líder (campo pst)', valor: String(totalValidos) },
        { titulo: 'Top 3 (amostra)', valor: top3 || 'Sem dados' },
      ],
    };

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(result));
  } catch (error) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ...electionFallback, message: `${electionFallback.message} (${error.message})` }));
  }
}

const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (reqPath === '/api/elections/ap') {
    handleElectionAp(res);
    return;
  }

  const normalized = path.normalize(reqPath).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(root, normalized === '/' ? 'index.html' : normalized);

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(filePath, res);
      return;
    }

    sendFile(path.join(root, 'index.html'), res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Painel Câmara 360 em http://0.0.0.0:${PORT}`);
});
