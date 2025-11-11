# PicBoard Frontend – Documentation

Aplicação frontend em React + Vite (TypeScript) para o PicBoard / PicMoney. A interface consome a API do backend (Entrega 2) para exibir KPIs, gráficos e relatórios.

## Resumo rápido

- **Stack:** Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build` + `npm run preview` para checar a build localmente
- **API (dev):** por padrão aponte `VITE_API_BASE_URL` para `http://localhost:3001` (veja seção de configuração)

## Índice

- Requisitos
- Instalação e Configuração
- Scripts úteis
- Como o frontend consome a API
- Estrutura do projeto

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+ (ou yarn/pnpm)
- Backend (Entrega 2) rodando para consumir dados em dev: ver `/src/Entrega 2/Backend/README.md`

## Instalação e Configuração

1. Instale dependências:

```sh
npm install
```

2. Variáveis de ambiente (opcional)

Crie um arquivo `.env.local` na raiz do frontend (ou use `.env`) com as variáveis abaixo. No Vite, variáveis públicas devem começar com `VITE_`.

Exemplo `.env.local`:

```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=PicBoard
```

Observação: se preferir configurar um proxy no Vite para evitar CORS durante o desenvolvimento, edite `vite.config.ts` (ou `vite.config.js`) e adicione o proxy apontando para `http://localhost:3001`.

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento (Vite)
- `npm run build` — gera os arquivos de produção
- `npm run preview` — executa um servidor local para pré-visualizar a build

Use o script de dev enquanto o backend estiver rodando em `http://localhost:3001` (ou ajuste `VITE_API_BASE_URL`).

## Como o frontend consome a API

Padrão esperado:

- Base URL: configurada pela variável `VITE_API_BASE_URL` (ex.: `http://localhost:3001`)
- Autenticação: JWT Bearer no header `Authorization: Bearer <token>` (o backend expõe `/auth/login` — veja README do backend)
- Content-Type: `application/json`

Exemplo de uso com fetch (TypeScript / React):

```ts
const API = import.meta.env.VITE_API_BASE_URL;

async function login(body: { userId: string; password: string }) {
	const res = await fetch(`${API}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	return res.json();
}

async function getKpisReceita(token: string) {
	const res = await fetch(`${API}/api/kpis/receita-total`, {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
	});
	return res.json();
}
```

Erros e códigos esperados (baseado no backend):

- 200 — OK (resposta JSON com dados)
- 401 — Não autorizado (token ausente/inválido)
- 404 — Recurso não encontrado (ex.: usuário) ou rota inexistente

### Observações de segurança

- O backend atualmente autentica com JWT (veja `JWT_SECRET_KEY` no backend). Guarde tokens com segurança — em memória/Context ou HttpOnly cookies (recomendado para produção).
- Evite armazenar senhas em texto; o backend atual compara em texto (melhorar para bcrypt se migrar para produção).

## Estrutura do projeto

Foco nas pastas mais relevantes:

- `src/` — código fonte da aplicação
	- `src/components/` — componentes UI (cards, gráficos, tabelas)
	- `src/pages/` — páginas/rotas
	- `src/services/` — chamadas à API, utilitários para requests
	- `src/hooks/` — hooks reutilizáveis (ex.: useAuth, useFetch)
	- `src/lib/` — helpers, formatação de números/datas

### Integração com o backend

- Ao consumir endpoints como `/api/kpis/receita-total`, verifique o formato de data (`YYYY-MM-DD`) para filtros `start`/`end`.
- Para rotas com paginação/filtros (ex.: `/api/kpis/total-parceiros`), envie queries conforme documentado no backend: `?start=YYYY-MM-DD&end=YYYY-MM-DD&sort=total&order=desc&limit=100&offset=0`.

### Troubleshooting

- Problema: CORS / Erro 401 na chamada à API
	- Verifique `VITE_API_BASE_URL` e se o backend está rodando.
	- Se necessário, ative proxy no `vite.config` durante o desenvolvimento.

- Problema: Variáveis `import.meta.env` sem valor
	- Garanta que o arquivo `.env.local` exista e que a variável comece com `VITE_`.