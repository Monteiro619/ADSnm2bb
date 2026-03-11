# Câmara 360

Painel de apoio para gabinete com foco em acompanhamento legislativo da Câmara dos Deputados.

## Stack atual

- **Arquivo único**: `index.html`
- **UI**: Tailwind CSS (CDN)
- **Dados**: API Dados Abertos da Câmara (v2)

## Funcionalidades

- Sidebar fixa com navegação entre views (Visão Geral, Deputados e Agenda)
- Toggle de tema claro/escuro com persistência e preferência inicial pelo sistema operacional
- Agenda com filtro por tipo, texto e **data específica**
- Cards de deputados com busca/filtro por partido
- Modal acessível com detalhes do deputado:
  - dados básicos de contato
  - despesas de cota parlamentar
  - presenças recentes (quando disponíveis na rota)

## Executar localmente

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

> O HTML é autocontido e não depende de bundler.
