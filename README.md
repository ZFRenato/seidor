# Seidor - API de Gestão de Motoristas, Veículos e Alocações
## Teste Tecnico Seidor

API Node.js/TypeScript para gerenciar motoristas, automóveis e alocações (vinculação motorista x veículo), com validações via Joi, arquitetura em camadas e persistência em memória para simplificar a execução local e testes.

## Sumário
- [Tecnologias](#tecnologias)
- [Arquitetura e Pastas](#arquitetura-e-pastas)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Seed de Dados](#seed-de-dados)
- [Testes](#testes)
- [Lint](#lint)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rotas HTTP](#rotas-http)
- [Casos de Uso (Use Cases)](#casos-de-uso-use-cases)

## Tecnologias
- Node.js + TypeScript
- Express 5
- Joi (validações)
- Jest + ts-jest (testes)
- ESLint (qualidade de código)

## Arquitetura e Pastas
```
src/
  application/
    useCases/                 # Regras de negócio (casos de uso)
  domain/
    entities/                 # Entidades de domínio (Driver, Automobile, Allocation)
    repositories/             # Interfaces de repositório
    error/                    # Tipos de erro de domínio (AppError, NotFound, BadRequest)
    validation/               # Validator (Joi)
  infrastructure/
    persistence/              # Repositórios em memória (InMemory*)
  interfaces/
    http/
      App.ts                  # Bootstrap do servidor HTTP
      routes/                 # Rotas Express (drivers, automobiles, allocations)
      controllers/            # Controllers Express
      util/                   # Utilidades HTTP (response helper)
  util/
    IPagination.ts            # Tipo genérico de paginação
App.ts                         # Startup da aplicação (seed + server)
seed.ts                        # Popula dados em memória quando fora de produção
```

## Requisitos
- Node.js 18+ (recomendado)
- npm ou yarn

## Instalação
```bash
npm install
```

## Execução
- Ambiente de desenvolvimento (ts-node-dev):
```bash
npm run dev
```
O servidor sobe por padrão em `http://localhost:3000`.

### Documentação (Swagger)
- UI: acesse `http://localhost:3000/docs`
- Esquema OpenAPI (JSON): `http://localhost:3000/openapi.json`

- Build e start em produção:
```bash
npm run build
npm start
```

## Seed de Dados
Durante o bootstrap (`src/App.ts`), se `NODE_ENV` for diferente de `production`, o seed é executado automaticamente. Para rodar manualmente:
```bash
npm run dev --seed
# ou diretamente
npx ts-node-dev --respawn --transpile-only src/seed.ts
```
O seed cria motoristas, automóveis e algumas alocações em progresso.

## Testes
Executar a suíte completa (Jest + ts-jest):
```bash
npm test
```
A suíte cobre 100% dos casos de uso e validações principais.

## Lint
```bash
npm run lint
```

## Variáveis de Ambiente
- `PORT`: porta do servidor HTTP (padrão: 3000)
- `NODE_ENV`: define se o seed roda automaticamente (`production` desabilita o seed automático)

Crie um arquivo `.env` na raiz se desejar customizar:
```
PORT=3000
NODE_ENV=development
```

## Rotas HTTP
Base URL: `http://localhost:3000/api/v1`

### Drivers (`/drivers`)
- POST `/` – cria driver
  - body: `{ "name": string }`
- GET `/` – lista drivers
  - query: `name?`, `page?`, `limit?`
- GET `/:id` – busca driver por id
- PUT `/:id` – atualiza driver
  - body: `{ "name"?: string }`
- DELETE `/:id` – exclui driver

### Automobiles (`/automobiles`)
- POST `/` – cria automóvel
  - body: `{ "brand": string, "color": string, "plate": string }`
- GET `/` – lista automóveis
  - query: `brand?`, `color?`, `plate?`, `page?`, `limit?`
- GET `/:id` – busca automóvel por id
- PUT `/:id` – atualiza automóvel
  - body: `{ "brand"?, "color"?, "plate"? }`
- DELETE `/:id` – exclui automóvel

### Allocations (`/allocations`)
- POST `/` – cria alocação motorista x automóvel
  - body: `{ "driverId": string, "automobileId": string, "description": string(min 5) }`
- PUT `/:id` – finaliza alocação
- GET `/` – lista alocações
  - query: `page?`, `limit?`, `driverName?`, `automobilePlate?`, `status? (IN_PROGRESS|FINISHED)`

Respostas seguem um helper padrão em `interfaces/http/util/responseHttp`.

## Casos de Uso (Use Cases)
- Drivers: `Create`, `GetById`, `Update`, `List`, `Delete` (impede exclusão se houver alocação em andamento)
- Automobiles: `Create`, `GetById`, `Update`, `List`, `Delete` (impede exclusão se alocado)
- Allocations: `Create` (garante exclusividade de motorista e veículo em progresso), `Finish`, `List`

As validações de entrada utilizam Joi com sanitização (ex.: `plate` remove caracteres não alfanuméricos e normaliza para minúsculas na entidade).

---
Autor: Renato Carvalho
