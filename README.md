# theAOELabs

TheAOE Labs website application is maintained as a monorepo with a Spring Boot API and a React frontend.

## Repository Layout

```text
backend/       Spring Boot API and backend tests
frontend/      React website and production assets
docs/          Architecture and deployment notes
.github/       GitHub Actions workflows
```

The backend is currently a modular monolith. Keep business capabilities isolated by feature as they are added; introduce separate services only when independent deployment, scaling, or ownership justifies the operational cost.

## Requirements

- Java 25
- Node.js 24 and npm
- Docker Compose (optional, for the containerized run)

## Run Locally

Start the backend in one terminal:

```powershell
cd backend
./mvnw.cmd spring-boot:run
```

Start the frontend in another terminal:

```powershell
cd frontend
npm ci
npm start
```

The frontend development server runs at <http://localhost:3000> and proxies `/api` requests to the backend at port 8080.

## Verify Builds

```powershell
cd backend
./mvnw.cmd verify
```

```powershell
cd frontend
npm ci
npm run build
```

GitHub Actions runs these backend and frontend checks for pushes and pull requests.

## Run With Containers

With Docker Engine and the Compose plugin installed:

```powershell
docker compose up --build
```

Open <http://localhost:8081>. The frontend container serves the static site and proxies `/api` traffic to the backend container. The backend is not published directly to the host.

The container setup is a portable starting point, not a production deployment by itself. Production hosting still needs TLS, secrets management, environment-specific configuration, monitoring, and a hosting-specific deployment process. See [docs/deployment.md](docs/deployment.md).

## Publish to GitHub

Create an empty repository on GitHub, then connect and push this local repository:

```powershell
git remote add origin https://github.com/<your-account>/<your-repository>.git
git add .
git commit -m "Initial application structure"
git push -u origin main
```
