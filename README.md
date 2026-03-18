# Job Email Sender API (Monorepo)

Professional REST API for automated job application emails, built with a clean MVC architecture.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL + Sequelize ORM
- **Auth:** JWT + bcrypt
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi
- **Docs:** Swagger (OpenAPI 3.0)
- **Logging:** Morgan
- **Frontend:** React + Vite (projeto separado em `/frontend`)

## Arquitetura: Frontend e Backend separados

O backend é **apenas API** (não serve o frontend). O frontend é um app React independente que consome a API.

| Repositório | Backend (API) | Frontend (UI) |
|-------------|----------------|----------------|
| Pasta       | Raiz do repo   | `frontend/`   |
| Deploy      | Render, Railway, VPS… | Netlify, Vercel, Render (Static)… |
| URL exemplo | `https://job-email-sender-xxx.onrender.com` | `https://job-email-sender-ui.netlify.app` |

**Backend:** configure `CORS_ORIGIN` com a URL do frontend (ex: `https://job-email-sender-ui.netlify.app`).

**Frontend:** configure `VITE_API_URL` com a URL do backend (ex: `https://job-email-sender-xxx.onrender.com`). Em dev, deixe vazio para usar o proxy do Vite.

## Project Structure (Frontend separado)

```
backend/
  src/                  # API code (Express)
  templates/            # Email templates
  Dockerfile            # Backend container
  package.json          # Backend scripts/deps
  .env.example          # Backend env example

frontend/
  src/                  # React UI
  package.json          # Frontend scripts/deps
  vite.config.js
```

## API Endpoints

### Auth (public)
| Method | Path                | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/auth/register`| Register new user  |
| POST   | `/api/auth/login`   | Login, get JWT     |
| GET    | `/api/auth/me`      | Current user (JWT) |

### Users CRUD (protected)
| Method | Path             | Description     |
|--------|------------------|-----------------|
| POST   | `/api/users`     | Create user     |
| GET    | `/api/users`     | List all users  |
| GET    | `/api/users/:id` | Get user by ID  |
| PUT    | `/api/users/:id` | Update user     |
| DELETE | `/api/users/:id` | Delete user     |

### Contacts CRUD (protected)
| Method | Path                | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/contacts`     | Create contact     |
| GET    | `/api/contacts`     | List all contacts  |
| GET    | `/api/contacts/:id` | Get contact by ID  |
| PUT    | `/api/contacts/:id` | Update contact     |
| DELETE | `/api/contacts/:id` | Delete contact     |

### Emails (protected)
| Method | Path               | Description           |
|--------|--------------------|-----------------------|
| POST   | `/api/emails/send` | Start sending emails  |
| GET    | `/api/emails/status`| Get sending status   |
| GET    | `/api/emails/logs` | Get sent email logs   |
| DELETE | `/api/emails/logs` | Clear logs            |

### Resume (protected)
| Method | Path                | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/resume/upload`| Upload PDF resume  |
| GET    | `/api/resume/status`| Check upload status|

### Health (public)
| Method | Path          | Description    |
|--------|---------------|----------------|
| GET    | `/api/health` | Health check   |

## Response Format

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Getting Started

### With Docker (recommended)

```bash
# Copy and edit environment variables
cp .env.example .env

# Start PostgreSQL + API
docker compose up -d --build

# Check logs
docker compose logs -f app
```

The app will be available at **http://localhost:3001** and Swagger docs at **http://localhost:3001/api/docs**.

### Without Docker

Requires Node.js 18+ and a running PostgreSQL instance.

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run in development (with auto-reload)
npm run dev

# Run in production
npm start
```

### Frontend (separado)

```bash
cd frontend
cp .env.example .env   # Em produção, defina VITE_API_URL com a URL do backend
npm install
npm run dev           # http://localhost:5173 (proxy para API em :3001)
npm run build         # Gera frontend/dist/ para deploy estático
```

Deploy do frontend (ex.: Netlify / Vercel): build command `npm run build`, publish directory `dist`. Configure a variável de ambiente `VITE_API_URL` com a URL do backend.

## Default Credentials

| Field    | Value            |
|----------|------------------|
| Email    | admin@admin.com  |
| Password | admin123         |

## Environment Variables

| Variable          | Description                  | Default                         |
|-------------------|------------------------------|---------------------------------|
| `PORT`            | Server port                  | 3001                            |
| `NODE_ENV`        | Environment                  | development                     |
| `DATABASE_URL`    | PostgreSQL connection string | postgres://postgres:postgres@localhost:5432/job_email_sender |
| `JWT_SECRET`      | JWT signing secret           | change-me-in-production         |
| `ADMIN_EMAIL`     | Seed admin email             | admin@admin.com                 |
| `ADMIN_PASSWORD`  | Seed admin password          | admin123                        |
| `EMAIL_USER`      | SMTP username                |                                 |
| `EMAIL_PASS`      | SMTP password / app password |                                 |
| `SMTP_HOST`       | SMTP server host             | smtp.gmail.com                  |
| `SMTP_PORT`       | SMTP server port             | 587                             |
| `EMAIL_DELAY_MS`  | Delay between emails (ms)    | 7000                            |
| `CORS_ORIGIN`     | Allowed frontend origin(s), comma-separated | (allow all if empty) |

## Swagger Documentation

Interactive API documentation is available at `/api/docs` when the server is running.
