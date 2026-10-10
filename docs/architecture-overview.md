# Application Architecture Overview

## Purpose and Shape

TheAOE Labs is a single Git monorepo containing a React website and a Spring Boot API. The backend is currently a small modular monolith: the application runs as one process, with HTTP behavior grouped by capability (`health` and `contact`). The frontend is one React application with API calls separated from UI features.

```text
Browser
  |
  | React static site on Vercel or served locally
  v
  +---- /api/* via Webpack proxy or Nginx in local/container deployment
  |                                      |
  |                                      +----> Spring Boot API
  |
  +---- /api/* via configured HTTPS API base URL in split-cloud deployment
                                         |
                                         +-- GET  /api/health
                                         +-- POST /api/contact
                                                |
                                                +--> SMTP provider --> configured inbox
```

The frontend and backend remain separately buildable and deployable. There is no database or message queue in the current application.

## Repository Structure

```text
.github/workflows/ci.yml                  GitHub Actions build and test checks
backend/
  src/main/java/.../config/               API CORS configuration
  src/main/java/.../health/               Health endpoint and response model
  src/main/java/.../contact/              Contact request, endpoint, mail service, error handling
  src/main/resources/application.yml       Server, SMTP, and contact inbox configuration
  src/test/java/...                       Backend tests
  Dockerfile                               Multi-stage Spring Boot image build
frontend/
  src/App.jsx                              Website composition and health status
  src/api/                                 Browser-to-backend HTTP functions
  src/api/apiUrl.js                        Build-configured API base URL helper
  src/features/contact/                   Contact form UI and submission state
  src/styles/global.css                   Site and form styling
  Dockerfile                               React build and Nginx runtime image
  nginx.conf                               Static-site fallback and /api reverse proxy
  vercel.json                              Vercel build command and dist output
compose.yaml                               Local multi-container topology
.env.example                               Safe SMTP configuration template
```

## Request and Email Flow

1. The visitor enters a name, email, optional company, and enquiry message in the React contact form.
2. Browser validation checks required fields, email format, lengths, and minimum message length. The UI locks while a submission is pending and displays success or failure feedback.
3. `frontend/src/api/contactApi.js` sends JSON with `POST /api/contact`.
4. Spring validates the request again. Invalid requests receive HTTP `400` without attempting delivery.
5. `ContactService` creates a plain-text email with subject `The AOE Labs: Contact Enquiry`, sends it from the configured sender to `CONTACT_INBOX`, and sets the visitor's email as `Reply-To`.
6. Successful delivery returns HTTP `204`. SMTP failures are logged server-side and return a generic HTTP `503` response; SMTP details are not sent to the browser.

Email delivery is synchronous: the HTTP request remains open while the SMTP provider responds. SMTP must be configured in the backend process environment (or via Docker Compose's root `.env` file). A `.env.example` file is documentation only; Spring Boot does not automatically load it when launching via Maven.

## Technology and Versions

| Area | Technology | Version/configuration |
| --- | --- | --- |
| Backend language | Java | 25 (`java.version` and CI use major version 25) |
| Backend framework | Spring Boot | 4.1.1 |
| Backend build | Maven Wrapper | Maven 3.10.0; wrapper 3.3.4 |
| Backend HTTP | Spring MVC / embedded Tomcat | Spring Boot-managed dependencies; uses Render `PORT`, defaulting to 8080 |
| Validation | Jakarta Bean Validation | Spring Boot validation starter |
| Email | Spring Mail / JavaMailSender | SMTP settings provided through environment variables |
| Backend tests | JUnit, Spring Boot test starters, Mockito | Versions managed by Spring Boot 4.1.1 |
| Frontend language | JavaScript with JSX | Babel-transpiled |
| UI | React and React DOM | 19.3.0 |
| Frontend compiler | Babel core | 8.0.7 |
| Frontend build | Webpack | 5.111.1; webpack-cli 7.2.3 |
| Local frontend server | webpack-dev-server | 6.0.0; port 3000, proxies `/api` to port 8080 |
| Frontend runtime container | Nginx | `nginx:alpine` image tag |
| Container build images | Maven/Temurin and Node | `maven:3.9-eclipse-temurin-25`, `eclipse-temurin:25-jre`, `node:24-alpine` |
| CI | GitHub Actions | Java 25 and Node 24 on Ubuntu |

The installed development environment observed for this workspace is Java `25.0.4.1` and Node.js `24.21.0`. Container tags such as `nginx:alpine` and `node:24-alpine` can move over time; they are not pinned to immutable image digests.

## Deployment Topology

`docker compose up --build` builds two images:

- `backend`: Spring Boot API on the private Compose network at port 8080; it is not published directly to the host.
- `frontend`: static site served by Nginx on container port 80, with `/api/` proxied to `backend:8080`. The host port defaults to 8081 and can be changed with `WEB_PORT`.

For split deployment, Vercel serves the frontend bundle from `frontend/dist`; Webpack embeds `REACT_APP_API_BASE_URL` at build time. The browser calls the Render API directly over HTTPS. Spring CORS permits configured origins from `APP_CORS_ALLOWED_ORIGIN_PATTERNS`; set this to the deployed Vercel origin. Cookie credentials are not enabled.

Supply SMTP credentials through the hosting provider's secret store. Production deployment also needs HTTPS, appropriate host configuration, monitoring, and a deliberate image-update/rollback process. The current Compose setup is a starting point, not a complete production platform. See [deployment.md](deployment.md) for provider setup steps.

## Current Scope and Growth

- The backend has health and contact capabilities, but no accounts, authentication, authorization, database, or administrative dashboards yet.
- The frontend is a marketing site; dashboards should be introduced as routed, feature-oriented areas if and when product requirements need them.
- Continue adding backend capabilities as feature packages in the modular monolith. Consider separate services only when independent scaling, deployment, security boundaries, or team ownership justify the added operational complexity.
- For higher-volume or latency-sensitive email delivery, consider a durable queue and background worker so SMTP outages do not hold web requests open. Add rate limiting and abuse protection before exposing the public form broadly.

## Build and Test

From the repository root on Windows:

```powershell
cd backend
.\mvnw.cmd verify

cd ..\frontend
npm ci
npm run build
```

GitHub Actions runs the backend verification and frontend production build on pushes and pull requests.
