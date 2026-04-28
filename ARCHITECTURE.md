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
 ┃ ┣ 📂 decorators/            (Decoradores personalizados. Ej: `@CurrentUser()`)
 ┃ ┣ 📂 filters/               (Manejo global de excepciones. Ej: Transformar 500 a JSON seguro)
 ┃ ┣ 📂 guards/                (Protección global de rutas. Ej: JwtAuthGuard)
 ┃ ┣ 📂 interceptors/          (Loggers globales, serializadores de respuesta)
 ┃ ┣ 📂 middlewares/           (Aduana de bajo nivel de Express. Ej: Logger de IP antes del contexto de NestJS)
 ┃ ┣ 📂 utils/                 (Funciones puras sin inyección de dependencias. Ej: formateadores de fecha)
 ┃ ┗ 📜 core.module.ts         (Módulo raíz transversal)
 ┃
 ┗ 📂 modules/                 👉 (Vertical Slices / Dominios de Negocio)
    ┗ 📂 resume/              (Ejemplo del módulo Core de negocio, debe ir en singular)
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
       ┃ ┣ 📂 persistence/     (Modelos exclusivos del ORM/DB que no deben mezclarse con el Dominio, con prisma no es necesario)
       ┃ ┣ 📂 adapters/        (Implementaciones reales de los `ports`. Ej: `PrismaResumeRepository.ts`)
       ┃ ┣ 📂 cron/            (Tareas programadas. Ej: `CleanupDraftResumes.job.ts`)
       ┃ ┗ 📂 http/            (Mecanismo de Entrega HTTP)
       ┃    ┣ 📂 controllers/  (Ruteadores REST. Ej: `resumes.controller.ts`)
       ┃    ┣ 📂 guards/       (Protección específica del módulo. Ej: `IsResumeOwnerGuard.ts`)
       ┃    ┗ 📂 middlewares/  (Filtros o loggers antes del controlador de esta ruta específica)
       ┃
       ┗ 📜 resume.module.ts  (Inyección de Dependencias. Conecta todo)
```

---

## ⚙️ 2. Variantes de Diseño de la Capa de Aplicación

1. **CQRS Estricto (Elegida por defecto):**
   - Separación física entre **Commands** (mutaciones, escrituras, lógica pesada) y **Queries** (lecturas puras, ultra rápidas). Evita el anti-patrón "God Object" (clases con 15 dependencias inyectadas). Cada archivo tiene UNA sola responsabilidad.
2. **Use Cases Agrupados (Servicios) (Variante simplificada):**
   - Usar una carpeta `use-cases/` con archivos tipo `users.use-cases.ts` que agrupan `login`, `register`, y `updateProfile` en una sola clase. **Desventaja:** Viola el Principio de Responsabilidad Única (SRP) y genera inyección de dependencias masiva. Solo recomendado para ABM/CRUDs extremadamente simples.

---

## 📏 3. Convenciones de Nomenclatura

Para mantener la consistencia en todo el código base, el proyecto adopta convenciones de nomenclatura estrictas inspiradas en el ecosistema de NestJS y Angular.

**Regla 1: Las carpetas utilizan `kebab-case` (minúsculas con guiones)**

- ✅ **Correcto:** `value-objects`, `event-handlers`, `job-offers`.
- ❌ **Incorrecto:** `valueObjects`, `EventHandlers`, `job_offers`.

**Regla 2: Los archivos utilizan sufijos de tipo (La regla del punto)**
El formato estándar es: `nombre-del-archivo.tipo-de-archivo.ts`. Todo en minúsculas y separado por guiones.

- Controladores: `users.controller.ts`
- Módulos: `users.module.ts`
- Comandos/Consultas: `generate-resume.command.ts`, `get-user.query.ts`
- Entidades: `resume.entity.ts` (o simplemente `resume.ts` si ya se encuentra dentro de la carpeta `entities/`).
- Excepciones: `user-not-found.exception.ts`
- DTOs: `create-user.dto.ts`

**Regla 3: Las Clases e Interfaces utilizan `PascalCase`**
El nombre de la clase (dentro del archivo) debe coincidir con el nombre del archivo (sin el sufijo de tipo).

- Archivo: `generate-resume.command.ts` ➔ Clase: `export class GenerateResumeCommand {}`
- Archivo: `user-not-found.exception.ts` ➔ Clase: `export class UserNotFoundException {}`
- **Interfaces:** Se utiliza el prefijo `I` (herencia de C# y SOLID) para distinguirlas de las implementaciones concretas.
  - Archivo: `resume.repository.port.ts` ➔ Interfaz: `export interface IResumeRepository {}`

**Regla 4: Variables, Métodos e Instancias utilizan `camelCase`**

- Instancias: `const generateResumeCommand = new GenerateResumeCommand();`
- Métodos: `async findUserById(userId: string) {}`

---

## 🔄 4. Flujos de Comunicación (Paso a Paso Detallado)

La regla arquitectónica estricta es: **La dependencia siempre apunta hacia adentro**. La Infraestructura depende de la Aplicación, y la Aplicación depende del Dominio. El Dominio no depende de capas externas.

### Flujo Simple de Lectura (Sin Guards ni Eventos)

Ejemplo de un flujo de lectura directo, como listar los CVs creados por un usuario.

1. **(Entrada)** El cliente realiza una petición HTTP `GET /resumes` que es recibida por el `resumes.controller.ts` (Infrastructure/HTTP).
2. El Controller transforma los parámetros de la petición en un DTO estructurado.
3. El Controller instancia y despacha el `GetUserResumesQuery` (Application).
4. El Query (Application) invoca el método de la interfaz `IResumeRepository.findByUserId(userId)` (Domain/Ports).
5. A través de la Inyección de Dependencias de NestJS, la ejecución se delega al adaptador `prisma-resume.repository.ts` (Infrastructure/Adapters), el cual realiza la consulta SQL en la base de datos PostgreSQL.
6. El Query recibe las entidades de la base de datos y las procesa mediante un Mapper para estructurarlas en un DTO de salida seguro.
7. El Query retorna el DTO de respuesta al Controller.
8. **(Salida)** El Controller responde con un código HTTP `200 OK` y el payload JSON al cliente.

---

### Flujo Complejo de Escritura (Escenario Full: IA, PDF, Guards y Eventos)

Ejemplo de una transacción compleja: el usuario envía una oferta de trabajo para generar un CV adaptado.

1. **(Entrada)** El cliente envía una petición HTTP `POST /resumes/generate` hacia el `resumes.controller.ts` (Infrastructure/HTTP).
2. Un `JwtAuthGuard` global (Core) intercepta la petición, verifica el token JWT y extrae la identidad del usuario. Posteriormente, un `HasCreditsGuard` (Infrastructure/HTTP/Guards) verifica si el usuario cuenta con saldo suficiente en su cuenta.
3. Superadas las validaciones de seguridad, el Controller transforma el cuerpo de la petición (JSON) en un DTO validado.
4. El Controller despacha el `GenerateResumeCommand` (Application).
5. El Command (Application) transfiere los datos a la Entidad `Resume` (Domain) para aplicar reglas de negocio estrictas (Ej: verificar si el perfil cumple con las habilidades mínimas requeridas por la oferta).
6. Si las reglas de negocio se cumplen, el Command invoca la interfaz `IOpenAiClient.generateJson()` (Domain/Ports).
7. NestJS resuelve esta interfaz hacia el adaptador `openai-cv.generator.ts` (Infrastructure/Adapters), el cual realiza la llamada a la API externa de OpenAI y retorna el JSON estructurado.
8. El Command recibe el resultado e invoca `IPdfMaker.create()` (Domain/Ports) para que el adaptador correspondiente (Puppeteer) genere el documento PDF final.
9. El Command llama a `IResumeRepository.save()` (Domain/Ports) para delegar la persistencia de la nueva entidad en la base de datos vía Prisma.
10. La Entidad (o el Command) emite un evento de dominio `ResumeGeneratedEvent` (Domain/Events).
11. Un `DeductCreditEventHandler` (Application/EventHandlers) intercepta el evento en segundo plano (background) y descuenta un crédito al usuario.
12. El Command procesa la entidad final mediante un Mapper, genera el DTO de respuesta y lo retorna al Controller.
13. **(Salida)** El Controller responde con un código HTTP `201 Created` al cliente, entregando el acceso al recurso generado.
