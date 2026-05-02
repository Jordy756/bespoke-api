# 🎯 Bespoke – AI‑Powered, ATS‑Friendly CV Generator

**Bespoke** is a private web application that helps job‑seekers create highly targeted, ATS‑optimised résumés in seconds.

## 📋 What it does

1. **Profile storage** – the user keeps a single, encrypted professional profile (experience, education, skills, certifications, projects, …) in a PostgreSQL database.  
2. **Job offer input** – the user pastes the text of a job offer (or a link that will be scraped – future work).  
3. **AI evaluation** – a lightweight call to an LLM scores the fit and decides whether to proceed.  
4. **Data extraction** – a second LLM call returns a **strict JSON** containing only the information needed for the résumé (no HTML, no layout).  
5. **Template injection** – that JSON is injected into a proven‑ATS‑friendly HTML/CSS template chosen by the user.  
6. **(Optional) Events** – after a successful generation a domain event (e.g. `ResumeGenerated`) can trigger background tasks such as credit deduction, analytics, or email notifications.

All business logic is completely decoupled from framework, database, and external services by using a **Vertical‑Slice + Hexagonal (Ports & Adapters)** architecture. This makes the code base easy to understand, test, and evolve.

## 🛠️ Tech stack (the dream team)

| Layer | Choice | Why |
|-------|--------|-----|
| **Landing / marketing** | **Astro** | Blazing‑fast static site, excellent SEO, zero runtime cost. |
| **Authenticated SPA (the app)** | **React + Vite + TypeScript** | Minimal bundle, instant navigation, great DX, no SSR overhead (the app lives behind auth). |
| **Backend** | **NestJS (Node.js)** | Enterprise‑grade framework, built‑in DI, modular structure – perfect for Hexagonal Architecture. |
| **Database** | **PostgreSQL** | Solid relational core + powerful `JSONB` column for flexible profile storage. |
| **ORM** | **Prisma** | Type‑safe, auto‑generated client, migrations, works great with PostgreSQL JSONB. |
| **AI** | **OpenAI API (gpt‑4o‑mini)** | Fast, cheap, returns clean JSON – ideal for the two‑step AI flow (fit‑score → structured data). |
| **Architecture** | **Vertical Slices (Modular Monolith) + Hexagonal (Ports & Adapters)** | Business logic is decoupled from framework, DB, and external services – easy to replace or scale any slice. |
| **DevOps / Local DB** | **Docker Compose (Postgres)** | One‑command reproducible dev environment for the whole team. |
| **Validation** | **class-validator + class-transformer + ValidationPipe** | Official NestJS way, integrates with Swagger, solid performance. |
| **Styling (templates)** | **Plain HTML/CSS** (no JS) | Guarantees ATS parsers see only plain text; easy to audit and version. |
| **Linting / Formatter** | **ESLint + Prettier** | Keeps code tidy and consistent. |
| **Testing (future)** | **Jest** (unit) + **Supertest** (e2e) – to be added when the project matures. |

## 📂 Folder structure (Hexagonal + Vertical Slice)

```
src/
├─ core/                     # Shared kernel (config, DB service, guards, interceptors, etc.)
│  ├─ config/
│  ├─ database/
│  ├─ decorators/
│  ├─ filters/
│  ├─ guards/
│  ├─ interceptors/
│  ├─ middlewares/
│  └─ utils/
│
├─ modules/                  # Vertical slices – each slice is a business domain
│  ├─ users/                 # Example slice: authentication, profile management
│  │  ├─ domain/
│  │  │  ├─ entities/        # Pure domain models (User)
│  │  │  ├─ exceptions/      # Domain‑specific exceptions
│  │  │  ├─ events/          # Domain events (e.g. UserRegisteredEvent)
│  │  │  ├─ ports/           # Interfaces (IUserRepository)
│  │  │  ├─ value-objects/   # Immutable typed wrappers (Email, UserId)
│  │  │
│  │  ├─ application/
│  │  │  ├─ dtos/            # Data Transfer Objects (in/out)
│  │  │  ├─ mappers/         # Entity ↔ DTO transformations
│  │  │  ├─ commands/        # Write‑side use‑cases (CreateUserCommand, …)
│  │  │  ├─ queries/         # Read‑side use‑cases (GetUserByIdQuery, …)
│  │  │  └─ event-handlers/  # React to domain events in background
│  │  ├─ infrastructure/
│  │  │  ├─ adapters/        # Prisma implementations of the ports (PrismaUserRepository)
│  │  │  ├─ cron/            # Scheduled jobs (e.g. cleanup old drafts)
│  │  │  └─ http/            # NestJS specific layer
│  │  │     ├─ controllers/  # REST endpoints (users.controller.ts)
│  │  │     ├─ guards/       # Route‑specific guards (IsOwnerGuard)
│  │  │     └─ middlewares/  # Route‑specific middleware / loggers
│  │  └─ users.module.ts     # NestJS module that wires everything together
│  │
│  └─ resumes/               # The “magic” slice – AI fitting, PDF generation, etc.
│     … (same structure as users) …
│
├─ app.module.ts             # Root module – imports CoreModule + all feature modules
└─ main.ts                   # Bootstrap NestJS
```

*All domain logic lives under `domain/` and knows **nothing** about NestJS, Prisma, HTTP, or AI.*  
*All external concerns (DB, AI, PDF, HTTP) live in `infrastructure/` and implement the `ports` defined in the domain.*

## 🚀 Getting started (development)

> **Prerequisites** – Docker, Node.js (≥20) and **pnpm** (npm or yarn also work).

1. **Clone the repo**  

   ```bash
   git clone <private‑repo‑url>
   cd bespoke
   ```

2. **Start the database** (Postgres in Docker)  

   ```bash
   docker compose up -d
   ```

   This creates a container named `bespoke_db` listening on `localhost:5432` with database `bespoke`.

3. **Install dependencies**  

   ```bash
   pnpm install   # or npm install
   ```

4. **Generate the Prisma client**  

   ```bash
   pnpm exec prisma generate
   ```

5. **Push the schema to the DB** (creates the `User` table and any others you add)  

   ```bash
   pnpm exec prisma db push
   ```

6. **Run the API**  

   ```bash
   pnpm run start:dev
   ```

   The NestJS server starts on `http://localhost:3000`.

7. **(Optional) Run the Astro landing page** – for marketing / SEO  

   ```bash
   cd apps/landing   # if you placed the landing site under apps/
   pnpm install
   pnpm run dev      # serves on http://localhost:4321
   ```

8. **Test an endpoint** – e.g., register a user  

   ```bash
   curl -X POST http://localhost:3000/users/register \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"Secret123","name":"Test User"}'
   ```

   You should receive a `201 Created` JSON with the new user’s `id`, timestamps, etc.

## 📚 Documentation & further reading

* **NestJS + Prisma recipe** – <https://docs.nestjs.com/recipes/prisma>  
* **Prisma docs** – <https://www.prisma.io/docs>  
* **Astro docs** – <https://docs.astro.build>  
* **React + Vite** – <https://vitejs.dev/guide/>  
* **class-validator** – <https://github.com/typestack/class-validator>  
* **OpenAI API** – <https://platform.openai.com/docs/guides/text-generation>  

For a deeper dive into the hexagonal layers, CQRS, event handling and the reasoning behind each tech decision, see the `ARCHITECTURE.md` file in the repository.

## 🙌 Contributing (internal use)

As this is a **private** project, the internal workflow is:

1. Create a feature branch from `main`: `git checkout -b feature/mi-feature`.  
2. Make your changes, respecting the folder structure and naming conventions.  
3. Write or update tests as needed.  
4. Update documentation (`ARCHITECTURE.md` or this README) if the change affects usage or architecture.  
5. Commit with clear, conventional messages (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).  
6. Open a Pull Request toward `main`. A team member will review, comment, and after approval merge it.  
7. Delete the feature branch once merged.

## 📜 License

This project is for internal use only and is subject to the company's intellectual‑property policy. See the `LICENSE` (or internal IP document) for details.

---

**Happy coding, and may your CVs always beat the ATS!** 🚀
