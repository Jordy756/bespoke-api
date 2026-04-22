# ARQUITECTURA DEL SISTEMA - BESPOKE (AI CV Generator)

Este proyecto está construido utilizando un **Monolito Modular** (Vertical Slices) combinado con **Arquitectura Hexagonal** interna y **CQRS (Command Query Responsibility Segregation)** para la capa de aplicación.

El objetivo principal es lograr un sistema escalable, donde la lógica de negocio esté completamente aislada del framework (NestJS), de la base de datos (PostgreSQL/Prisma) y de los servicios externos (OpenAI, Puppeteer).

---

## 🏗️ 1. Estructura de Directorios (El Árbol Completo)

La siguiente estructura representa un módulo llevado a su máxima madurez arquitectónica. **Aclaración:** No todos los módulos necesitan todas las carpetas. Solo se crean cuando el dominio lo exige.

```text
📂 src/
 ┣ 📂 core/                    👉 (Infraestructura transversal / Shared Kernel)
 ┃ ┣ 📂 config/                (Validación de .env, configuración de la app)
 ┃ ┣ 📂 database/              (Servicio de conexión a Prisma/Postgres)
 ┃ ┣ 📂 filters/               (Manejo global de excepciones. Ej: Transformar 500 a JSON seguro)
 ┃ ┣ 📂 guards/                (Protección global de rutas. Ej: JwtAuthGuard)
 ┃ ┣ 📂 interceptors/          (Loggers globales, serializadores de respuesta)
 ┃ ┗ 📜 core.module.ts         (Módulo raíz transversal)
 ┃
 ┗ 📂 modules/                 👉 (Vertical Slices / Dominios de Negocio)
    ┗ 📂 resumes/              (Ejemplo del módulo Core de negocio)
       ┣ 📂 domain/            👉 (Capa Interna: Reglas de Negocio Puras. CERO NestJS/Librerías)
       ┃ ┣ 📂 entities/        (Modelos de negocio ricos. Ej: `Resume.ts`. Tienen lógica y validaciones)
       ┃ ┣ 📂 value-objects/   (Tipos validados inmutables. Ej: `Score.ts` del 1 al 100)
       ┃ ┣ 📂 enums/           (Constantes exclusivas del negocio. Ej: `ResumeStatus.ts`)
       ┃ ┣ 📂 exceptions/      (Errores de dominio puro. Ej: `InsufficientSkillsException.ts`)
       ┃ ┣ 📂 events/          (Avisos de que algo pasó. Ej: `ResumeGeneratedEvent.ts`)
       ┃ ┗ 📂 ports/           (Interfaces. El contrato con el exterior. Ej: `IResumeRepository.ts`)
       ┃
       ┣ 📂 application/       👉 (Capa Intermedia: Orquestación vía CQRS)
       ┃ ┣ 📂 dtos/            (Data Transfer Objects. Lo que entra de afuera y lo que sale)
       ┃ ┣ 📂 mappers/         (Traductores de DTO <-> Entidad de Dominio)
       ┃ ┣ 📂 commands/        (Acciones que MUTAN estado. Ej: `GenerateResumeCommand.ts`)
       ┃ ┣ 📂 queries/         (Acciones que SOLO LEEN. Ej: `GetUserResumesQuery.ts`)
       ┃ ┗ 📂 event-handlers/  (Reaccionan a eventos de dominio en background. Ej: `DeductCreditsOnResumeGenerated.ts`)
       ┃
       ┣ 📂 infrastructure/    👉 (Capa Externa: NestJS, Express, Prisma, CronJobs, APIs Externas)
       ┃ ┣ 📂 persistence/     (Modelos exclusivos del ORM/DB que no deben mezclarse con el Dominio)
       ┃ ┣ 📂 adapters/        (Implementaciones reales de los `ports`. Ej: `PrismaResumeRepository.ts`)
       ┃ ┣ 📂 cron/            (Tareas programadas. Ej: `CleanupDraftResumes.job.ts`)
       ┃ ┗ 📂 http/            (Mecanismo de Entrega HTTP)
       ┃    ┣ 📂 controllers/  (Ruteadores REST. Ej: `resumes.controller.ts`)
       ┃    ┣ 📂 guards/       (Protección específica del módulo. Ej: `IsResumeOwnerGuard.ts`)
       ┃    ┗ 📂 middlewares/  (Filtros o loggers antes del controlador de esta ruta específica)
       ┃
       ┗ 📜 resumes.module.ts  (Inyección de Dependencias. Conecta todo)
```

---

## ⚙️ 2. Variantes de Diseño de la Capa de Aplicación

1. **CQRS Estricto (Elegida por defecto):**
   - Separación física entre **Commands** (mutaciones, escrituras, lógica pesada) y **Queries** (lecturas puras, ultra rápidas). Evita el anti-patrón "God Object" (clases con 15 dependencias inyectadas). Cada archivo tiene UNA sola responsabilidad.
2. **Use Cases Agrupados (Servicios) (Variante simplificada):**
   - Usar una carpeta `use-cases/` con archivos tipo `users.use-cases.ts` que agrupan `login`, `register`, y `updateProfile` en una sola clase. **Desventaja:** Viola el Principio de Responsabilidad Única (SRP) y genera inyección de dependencias masiva. Solo recomendado para ABM/CRUDs extremadamente simples.

---

## 🔄 3. Flujos de Comunicación (Paso a Paso Detallado)

La regla estricta es: **La dependencia siempre va hacia adentro**. La Infraestructura depende de la Aplicación, y la Aplicación depende del Dominio.

### Flujo Simple de Lectura (Sin Guards ni Eventos)

Un ejemplo clásico para leer datos rápido, como listar los CVs que ya creaste.

1. **(Entrada)** El internet le pega al `resumes.controller.ts` (Infrastructure/HTTP) haciendo un `GET /resumes`.
2. El Controller transforma los parámetros de la petición en un DTO.
3. El Controller llama al `GetUserResumesQuery` (Application).
4. El Query (Application) llama a la interfaz `IResumeRepository.findByUserId(userId)` (Domain/Ports).
5. NestJS entra en acción: como en el `resumes.module.ts` mapeamos esa interfaz con `prisma-resume.repository.ts` (Infrastructure/Adapters), la petición ejecuta SQL en Postgres.
6. El Query recibe las entidades de la base de datos, las pasa por un Mapper para limpiarlas y las convierte en un DTO de salida.
7. El Query devuelve ese DTO de éxito al Controller.
8. **(Salida)** El Controller devuelve un HTTP 200 OK con el JSON al frontend.

---

### Flujo Complejo de Escritura (Escenario Full: IA, PDF, Guards y Eventos)

Un escenario pesado, como cuando el usuario manda la oferta de trabajo para que le armen el CV.

1. **(Entrada)** El internet le pega al `resumes.controller.ts` (Infrastructure/HTTP) haciendo un `POST /resumes/generate`.
2. Un `JwtAuthGuard` global (Core) frena la pelota, verifica el token y extrae quién es el usuario. Luego, un `HasCreditsGuard` (Infrastructure/HTTP/Guards) chequea si el usuario tiene saldo para gastar.
3. Si pasa los Guards, el Controller transforma el body (JSON con la oferta) en un DTO.
4. El Controller llama al `GenerateResumeCommand` (Application).
5. El Command (Application) le pasa los datos a la Entidad `Resume` (Domain) para que valide reglas de negocio (Ej: "¿Tiene suficientes skills base para aplicar a esta oferta?").
6. Si el Dominio dice "Todo OK", el Command llama a la interfaz `IOpenAiClient.generateJson()` (Domain/Ports).
7. NestJS entra en acción: enruta esto al adaptador `openai-cv.generator.ts` (Infrastructure/Adapters), la petición sale hacia OpenAI y vuelve con el JSON estructurado.
8. El Command recibe el resultado y llama a `IPdfMaker.create()` (Domain/Ports) para que Puppeteer escupa el PDF real.
9. El Command llama a `IResumeRepository.save()` (Domain/Ports), que por detrás ejecuta Prisma para guardar en la base de datos de Postgres.
10. La entidad (o el Command) dispara un evento `ResumeGeneratedEvent` (Domain/Events).
11. Un `DeductCreditEventHandler` (Application/EventHandlers) escucha ese evento en background y le descuenta un crédito al usuario.
12. El Command pasa la nueva entidad por un Mapper, genera el DTO final y se lo devuelve al Controller.
13. **(Salida)** El Controller devuelve un HTTP 201 Created al frontend con la URL para descargar el PDF.
