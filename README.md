# ADSnm2bb · Painel Câmara 360

Dashboard web para monitoramento da Câmara dos Deputados com foco em uso por gabinetes parlamentares.

## Objetivo

Centralizar, em uma única página, dados estratégicos para análise política e legislativa em tempo real:

- Deputados e distribuição partidária;
- Comissões e atividade recente;
- Projetos de lei (PL) recentes;
- Agenda de comissões e plenário;
- Indicadores rápidos para suporte à tomada de decisão.

## Fontes de dados

A aplicação consome a API pública de Dados Abertos da Câmara dos Deputados:

- `GET /deputados`
- `GET /partidos`
- `GET /orgaos`
- `GET /proposicoes` (filtrando `siglaTipo=PL`)
- `GET /eventos`

Base: `https://dadosabertos.camara.leg.br/api/v2`

## Como executar

Como é uma SPA estática (HTML + CSS + JS), basta servir localmente:

```bash
npm start
```

Depois acesse `http://localhost:4173` (painel principal) ou `http://localhost:4173/live.html` (comissões e plenário ao vivo).

> Alternativa: `python3 -m http.server 8000` também funciona para execução local simples.

## Funcionalidades implementadas

- Layout em múltiplas views com barra lateral fixa (Visão Geral, Deputados, Controle Legislativo e Agenda);
- Toggle de tema claro/escuro com persistência local;
- KPIs de deputados, partidos, comissões, PLs e eventos nas próximas 48h;
- Gráfico de barras (Top 10 partidos por bancada);
- Lista de comissões mais ativas, baseada em eventos recentes;
- Lista de PLs mais recentes com link para detalhes;
- Tabela de agenda com filtros por tipo de evento e busca por texto;
- Atualização manual ou automática (30s, 60s ou 3 min).

## Próximos passos recomendados

- Adicionar autenticação e perfis por gabinete;
- Salvar filtros e alertas personalizados;
- Incluir análise de votações nominais por deputado;
- Integrar push de eventos críticos (e-mail/WhatsApp/Telegram);
- Criar camada de persistência para histórico e tendências.

## Solução de problemas

- **Tela em branco/sem dados**: não abra o arquivo `index.html` diretamente (via `file://`). Rode um servidor local com `python3 -m http.server 8000` e acesse `http://localhost:8000`.
- **Sem acesso à internet/API bloqueada**: o painel entra automaticamente em **modo demonstração** com dados locais para que a interface continue visível.

- **Prévia do PR mostrando `Not Found`**: alguns ambientes de preview precisam de um servidor web explícito. Este repositório agora inclui `package.json` + `server.js` com fallback SPA; use `npm start` para garantir que a rota `/` carregue `index.html`.


## Como testar navegação e cliques

1. Suba o servidor: `npm start`.
2. Abra `http://localhost:4173`.
3. Use os atalhos no topo (**Visão geral**, **Deputados**, **Comissões**, **Projetos**, **Agenda**) para rolar até cada seção.
4. Clique nos links dos projetos em destaque para abrir detalhes externos.
5. Use os filtros de agenda para validar interação em tempo real.

> Observação: em alguns ambientes, a aba **Prévia** do PR pode ser apenas uma renderização estática (não interativa). Para clicar de verdade, use a URL servida localmente (`localhost:4173`).


## Dados eleitorais (Amapá) para estratégia de campanha

Foi adicionada uma verificação de disponibilidade para dados eleitorais do AP via endpoint local:

- `GET /api/elections/ap`

Esse endpoint tenta consultar fonte pública do TSE (Resultados 2022) e devolve um resumo pronto para painel. Se a fonte externa estiver bloqueada, o sistema responde com fallback local (modo demonstração), sem quebrar a página.

### Como usar na análise do gabinete

- Cruzar desempenho eleitoral por município com base de atuação parlamentar;
- Priorizar agenda de campanha por território e partido;
- Identificar nomes competitivos no estado para alianças e comunicação.


## Página Ao Vivo

A rota `live.html` foi criada para acompanhamento de comissões e plenário em tempo real, com:

- bloco de eventos em possível transmissão no momento;
- próximos eventos em 24h;
- atalhos para canais oficiais (YouTube/TV Câmara/Agenda).

Se a API estiver indisponível, a página usa fallback para manter a visualização operacional.
