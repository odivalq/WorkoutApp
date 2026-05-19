# WorkoutApp — CLAUDE.md

## Regra de ouro: leia apenas o necessário
Antes de qualquer tarefa, leia **somente** as seções deste arquivo marcadas como relevantes para o que você vai fazer. Não releia o projeto inteiro. Use os caminhos e contratos abaixo como referência rápida.

---

## Stack
| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3.x |
| Frontend | React 18 + Vite + TypeScript |
| Auth | JWT (access token no localStorage) |
| DB | PostgreSQL (prod) / H2 (dev/test) |
| Deploy Frontend | Netlify |
| Deploy Backend | Render ou Railway (variável de ambiente `BACKEND_URL`) |

---

## Estrutura de diretórios

```
WorkoutApp/
├── backend/          # Spring Boot (Maven)
│   ├── src/main/java/com/workoutapp/
│   │   ├── config/       # SecurityConfig, JwtConfig, CorsConfig
│   │   ├── controller/   # AuthController, UserController, RoutineController, StatsController
│   │   ├── domain/       # entidades JPA
│   │   ├── dto/          # request/response records
│   │   ├── repository/   # Spring Data JPA interfaces
│   │   └── service/      # lógica de negócio
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
└── frontend/         # React + Vite + TypeScript
    ├── src/
    │   ├── api/          # axios instances e hooks de API
    │   ├── components/   # componentes reutilizáveis (Timer, ExerciseCard…)
    │   ├── pages/        # Auth, Dashboard, Routines, RoutineDetail, ExerciseDetail
    │   ├── context/      # AuthContext
    │   ├── types/        # TypeScript interfaces (User, Routine, Exercise…)
    │   └── main.tsx
    ├── index.html
    ├── vite.config.ts
    └── netlify.toml
```

---

## Domínio — entidades e relacionamentos

```
User (id, name, email, passwordHash, createdAt)
  └── Routine (id, userId, name, category: STRENGTH|CARDIO|STRETCHING, createdAt)
        └── Exercise (id, routineId, name, sets, reps, loadKg, notes, orderIndex)

WorkoutSession (id, userId, routineId, startedAt, finishedAt)
  └── SessionExercise (id, sessionId, exerciseId, setsCompleted, repsCompleted, loadKg)
```

---

## Contratos de API (resumo)

| Método | Path | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | - | Cria conta |
| POST | `/api/auth/login` | - | Retorna JWT |
| GET | `/api/routines` | ✓ | Lista rotinas do usuário |
| POST | `/api/routines` | ✓ | Cria rotina |
| GET | `/api/routines/{id}` | ✓ | Detalhes + exercícios |
| PUT | `/api/routines/{id}` | ✓ | Atualiza rotina |
| DELETE | `/api/routines/{id}` | ✓ | Remove rotina |
| POST | `/api/routines/{id}/exercises` | ✓ | Adiciona exercício |
| PUT | `/api/exercises/{id}` | ✓ | Atualiza exercício |
| DELETE | `/api/exercises/{id}` | ✓ | Remove exercício |
| POST | `/api/sessions` | ✓ | Inicia sessão de treino |
| PUT | `/api/sessions/{id}/finish` | ✓ | Finaliza sessão |
| GET | `/api/stats/weekly` | ✓ | Stats da semana |
| GET | `/api/stats/monthly` | ✓ | Stats do mês |

---

## Regras de negócio importantes
- JWT expira em 24h; frontend renova via re-login.
- `category` da rotina é enum: `STRENGTH`, `CARDIO`, `STRETCHING`.
- Timer de descanso: frontend-only, valores fixos 30s ou 60s, não persiste no backend.
- Stats semanais: contagem de sessões + total de séries por categoria, agrupado por dia (seg-dom).
- Stats mensais: mesma estrutura, agrupado por semana do mês.
- Mobile-first: breakpoint principal é 375px; usar Tailwind CSS.

---

## Configurações críticas

### Backend — application.yml (prod)
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASS}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000
cors:
  allowed-origins: ${FRONTEND_URL}
```

### Frontend — variáveis de ambiente
```
VITE_API_BASE_URL=https://<seu-backend>.onrender.com
```

### netlify.toml
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Guia de trabalho por etapa

Quando for trabalhar em uma etapa específica, leia **apenas** os arquivos listados abaixo para aquela etapa — não explore o projeto inteiro.

| Etapa | Arquivos a ler antes de codar |
|-------|-------------------------------|
| 1 — Estrutura & CI | `pom.xml`, `package.json`, `netlify.toml` |
| 2 — Auth Backend | `SecurityConfig`, `AuthController`, `UserRepository` |
| 3 — Domínio Backend | `domain/`, `repository/`, `RoutineController`, `ExerciseController` |
| 4 — Stats Backend | `WorkoutSession`, `SessionExercise`, `StatsController`, `StatsService` |
| 5 — Auth Frontend | `context/AuthContext`, `pages/Auth`, `api/authApi` |
| 6 — Rotinas Frontend | `pages/Routines`, `pages/RoutineDetail`, `pages/ExerciseDetail`, `components/Timer` |
| 7 — Dashboard | `pages/Dashboard`, `api/statsApi`, `components/StatsChart` |
| 8 — Deploy | `netlify.toml`, `application.yml`, variáveis de ambiente |

---

## Convenções de código

- **Backend**: records para DTOs, sem Lombok. Exceções lançadas como `ResponseStatusException`.
- **Frontend**: componentes funcionais + hooks. Sem classes. Tailwind para estilo.
- **Commits**: `feat(etapa): descrição curta` — ex: `feat(auth): add JWT login endpoint`
- **Sem comentários** explicativos no código; nomes auto-descritivos.
- **Sem abstrações antecipadas**: crie a camada mínima para a etapa funcionar.

---

## O que NÃO fazer
- Não refatorar código de etapas anteriores sem pedido explícito.
- Não adicionar bibliotecas além das listadas no plano de cada etapa.
- Não criar testes unitários salvo pedido explícito.
- Não alterar `netlify.toml` ou `application.yml` fora da etapa de deploy.
