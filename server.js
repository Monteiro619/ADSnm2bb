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

const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const normalized = path.normalize(reqPath).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(root, normalized === '/' ? 'index.html' : normalized);

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(filePath, res);
      return;
    }

    // SPA fallback para qualquer rota de preview
    sendFile(path.join(root, 'index.html'), res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Painel Câmara 360 em http://0.0.0.0:${PORT}`);
});
