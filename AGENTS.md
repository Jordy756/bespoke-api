# OpenCode Agent Instructions for Bespoke

This repository follows a strict **Modular Monolith (Vertical Slices) + Hexagonal Architecture + CQRS** pattern in NestJS.

## 🏗️ Architecture & Boundaries

- **Strict Domain Isolation:** Files inside `src/modules/<module>/domain/` must have **ZERO** dependencies on NestJS, Prisma, HTTP, or external libraries. They contain pure TypeScript business logic (entities, value objects, exceptions, ports).
- **Application Layer:** Orchestrates logic using CQRS (`commands`, `queries`, `event-handlers`, `dtos`, `mappers`).
- **Infrastructure Layer:** Contains all implementations of domain ports (e.g., Prisma repositories), external API calls (OpenAI), and HTTP delivery (Controllers, Guards, Middlewares).

## 🛠️ Generating Modules

Do **NOT** use the standard Nest CLI `nest g resource` to create new modules.
Always use the custom bash script, and ensure the module name is in **singular**:

```bash
./generate-module.sh <module_name>
```

## 📦 Commands & Toolchain

- **Package Manager:** Use `pnpm` for all dependency management and script execution.
- **Database (Prisma & Postgres):**
  - Update schema: `pnpm exec prisma db push`
  - Generate client: `pnpm exec prisma generate`
  - Dev DB runs via `docker compose up -d`
- **Linting & Formatting:** `pnpm run format` and `pnpm run lint`

## 🧠 Core Business Logic Quirks

- **LLM Output:** The prompt extraction step must return **strict JSON** (no HTML, no layout).
- **PDF Generation:** Templates use plain HTML/CSS (no JS) to guarantee ATS compliance. Puppeteer renders the final PDF.
- **Validation:** Use `class-validator` and `class-transformer` on Application DTOs.

## 🧪 Testing

- Standard Jest commands apply (`pnpm run test`, `pnpm run test:cov`), but refer to the `domain/` rules to ensure tests for entities and value objects remain framework-agnostic.
