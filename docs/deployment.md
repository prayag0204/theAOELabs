# Deployment Notes

## Current Container Topology

Docker Compose builds the Spring Boot backend and the React static frontend as separate images. The frontend container uses Nginx to serve the site and proxy `/api` requests to the backend over the private Compose network. Only the frontend port is published to the host.

This keeps browser requests same-origin and avoids exposing the backend container directly. A hosting platform can use the same split: serve the static frontend through a web server or CDN and route `/api` to the backend service.

## Before Production

- Terminate HTTPS at the hosting platform or a managed reverse proxy.
- Store credentials and environment-specific values in the platform's secret/configuration service, never in Git.
- Add readiness checks, structured logs, metrics, and alerting appropriate to the host.
- Configure allowed origins and forwarded-header handling if the frontend and API are hosted on different origins.
- Add a database, persistent storage, backup, and migration strategy only when application data requires them.
- Set resource limits and a deployment/rollback policy based on the selected hosting provider.

No database, authentication, production secrets, or hosting-provider configuration is included yet because the application does not currently require them.