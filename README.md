# Job Email Sender API

Professional REST API for automated job application emails, built with a clean MVC architecture.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL + Sequelize ORM
- **Auth:** JWT + bcrypt
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi
- **Docs:** Swagger (OpenAPI 3.0)
- **Logging:** Morgan
- **Frontend:** React + Vite

## Project Structure

```
src/
  config/
    database.js          # Sequelize connection
    index.js             # Environment config
  controllers/           # HTTP request handlers
  models/                # Sequelize models (User, Contact, SentLog)
  routes/                # Express route definitions + Swagger annotations
  services/              # Business logic layer
  repositories/          # Database query abstraction
  middlewares/            # Auth, error handler, rate limiter, validation, upload
  validators/            # Joi schemas
  utils/                 # AppError, response helpers
  docs/                  # Swagger setup
  tests/                 # Test directory
  app.js                 # Express app configuration
  server.js              # Entry point (DB connect + listen)
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

### Frontend development

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173 with API proxy
npm run build   # Builds to frontend/dist/
```

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

## Swagger Documentation

Interactive API documentation is available at `/api/docs` when the server is running.
