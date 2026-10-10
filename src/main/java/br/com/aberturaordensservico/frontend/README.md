# Front-End — Abertura de Ordens de Serviço

React + TypeScript + Vite + Tailwind CSS (v4) + Axios, integrado ao back-end Spring Boot (`aberturaordensservico/`, porta **9090**).

## Como rodar

```bash
# 1) Back-end (MySQL em localhost:3306/ordens_servico precisa estar no ar)
cd aberturaordensservico && ./mvnw spring-boot:run

# 2) Front-end
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## Sobre o CORS

O back-end não configura CORS e não foi alterado. Por isso o `api.ts` usa `baseURL = "/api"` e o
`vite.config.ts` faz proxy de `/api` → `http://localhost:9090`. Se quiser chamar `http://localhost:9090`
diretamente, crie `.env` com `VITE_API_URL=http://localhost:9090` (requer CORS liberado no servidor).

## Contratos do back-end

| Recurso | Endpoint | Corpo |
|---|---|---|
| Setores | `GET/POST /setores`, `GET/PUT/DELETE /setores/{id}` | `{ nome }` |
| Equipamentos | `GET/POST /equipamentos`, `GET/PUT/DELETE /equipamentos/{id}`, `GET /equipamentos/setor/{setorId}` | `{ nome, numeroPatrimonio, setorId }` |
| Ordens de serviço | `GET/POST /ordens-servico`, `GET /ordens-servico/{id}` | `{ descricao, equipamentoId }` |

## Estrutura

```
src/
  types/      interfaces espelhando models e DTOs Java
  services/   api.ts (axios) + setorService / equipamentoService / ordemServicoService
  utils/      errors.ts (normaliza erros do Spring) e format.ts (datas)
  components/ ui/ (Button, Field, Alert, Card, Feedback) e layout/
  pages/      SetoresPage, EquipamentosPage, OrdensServicoPage
```
