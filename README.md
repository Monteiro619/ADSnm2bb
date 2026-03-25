# Câmara 360

Plataforma focada no legislativo da Câmara dos Deputados para apoio de gabinete.

## O que foi reforçado nesta versão

- **Validação de APIs em tempo real** na home (`/deputados`, `/orgaos`, `/proposicoes`, `/eventos`) com status visual.
- **Links corrigidos** para páginas válidas:
  - Órgãos: Portal Câmara (`/orgaos/{id}`) e rota API (`uri`);
  - Proposições: ficha de tramitação oficial (`proposicoesWeb/fichadetramitacao?idProposicao=`).
- **Mais dados de deputados** via modal detalhado:
  - nome, partido, UF, contato, gabinete, condição eleitoral;
  - legislaturas registradas;
  - órgãos/comissões vinculados;
  - últimas despesas da cota parlamentar.
- **Integrações úteis para operação parlamentar**:
  - Infoleg
  - Swagger da API da Câmara
  - Portal da Câmara

## Stack

- `index.html` (arquivo único, auto-contido)
- Tailwind CSS (CDN)
- Chart.js
- Lucide
- API Dados Abertos Câmara v2

## Executar local

```bash
python3 -m http.server 8000
```

Acesse: `http://localhost:8000`
