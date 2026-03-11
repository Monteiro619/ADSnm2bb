# Câmara 360

Painel legislativo para acompanhamento da Câmara dos Deputados com foco em uso por gabinetes.

## Stack

- `index.html` (arquivo único, auto-contido)
- Tailwind CSS (CDN)
- Chart.js (gráfico de bancadas)
- Lucide (ícones)
- API Dados Abertos da Câmara (`https://dadosabertos.camara.leg.br/api/v2`)

## Funcionalidades

- Navegação lateral fixa com views separadas:
  - Visão Geral
  - Monitor Digital (ao vivo)
  - Deputados
  - Comissões
  - Projetos (PL)
  - Agenda
- Dashboard com KPIs, gráfico partidário e comissões em atividade
- Filtros completos de deputados (nome, partido, UF e sexo)
- Filtros de comissões (texto e tipo)
- Controle legislativo com monitoramento de projetos via `localStorage`
- Agenda com filtros por tipo, texto e data
- Fallback local quando a API externa não responde

## Como executar

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.
