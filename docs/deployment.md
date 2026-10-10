# Deployment Notes

## Current Container Topology

Docker Compose builds the Spring Boot backend and the React static frontend as separate images. The frontend container uses Nginx to serve the site and proxy `/api` requests to the backend over the private Compose network. Only the frontend port is published to the host.

This keeps browser requests same-origin and avoids exposing the backend container directly. A hosting platform can use the same split: serve the static frontend through a web server or CDN and route `/api` to the backend service.

## Split Deployment: Render API and Vercel Frontend

The repository is a monorepo. Configure each hosting project to use its module directory as its root.

### Render Backend

1. Create a Render Web Service connected to this GitHub repository and set **Root Directory** to `backend`.
2. Select **Docker** as the runtime and use the `backend/Dockerfile` in that root directory.
3. Set the health check path to `/api/health` if the dashboard offers a health-check setting.
4. Add these environment variables in Render's service settings:
	- `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`
	- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` and `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE`
	- `CONTACT_INBOX` and `CONTACT_FROM`
	- `APP_CORS_ALLOWED_ORIGIN_PATTERNS` set to the exact deployed Vercel origin, for example `https://your-project.vercel.app`

The backend listens on Render's `PORT` variable, falling back to port 8080 for local use. Keep SMTP credentials in Render's environment settings, never in Git. The Dockerfile uses Java 25 and the Maven Wrapper.

### Vercel Frontend

1. Create a Vercel project from the same GitHub repository and set **Root Directory** to `frontend`.
2. The checked-in `frontend/vercel.json` selects `npm ci`, `npm run build`, and `dist` as the output directory.
3. Set the Vercel environment variable `REACT_APP_API_BASE_URL` to the Render service's public HTTPS origin, without an `/api` suffix, for example `https://your-api.onrender.com`.
4. Redeploy after setting or changing the variable. Webpack embeds this public URL at build time; do not put secrets in it.

The browser sends API requests directly from Vercel to Render. Render's `APP_CORS_ALLOWED_ORIGIN_PATTERNS` must include the Vercel site's exact origin. Preview deployment origins must also be configured if previews should call the API; prefer specific origins and use wildcard patterns only if needed, because CORS patterns can grant browser access to any matching site. Cookies/authentication credentials are not enabled.

The hosting provider dashboards and deployment authorization must be completed by an account owner. This repository configuration does not create services or deploy the application by itself.

## Contact Email Configuration

The backend uses Spring Mail with SMTP. For local Compose testing, copy `.env.example` to `.env` and replace the username, app password, sender, and inbox values with those for your mail provider. Gmail requires an app password when two-step verification is enabled; other providers may use different host, port, and TLS requirements.

The backend accepts these environment variables:

- `SPRING_MAIL_HOST` and `SPRING_MAIL_PORT`
- `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD`
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` and `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE`
- `CONTACT_INBOX` and `CONTACT_FROM`

For production, configure these through the hosting provider's secret/configuration service. Keep SMTP credentials out of Git and logs. `CONTACT_FROM` should be an address authorized by the SMTP provider; enquiry replies are addressed to the submitter through `Reply-To`.

## Before Production

- Terminate HTTPS at the hosting platform or a managed reverse proxy.
- Store credentials and environment-specific values in the platform's secret/configuration service, never in Git.
- Add readiness checks, structured logs, metrics, and alerting appropriate to the host.
- Configure allowed origins and forwarded-header handling if the frontend and API are hosted on different origins.
- Add a database, persistent storage, backup, and migration strategy only when application data requires them.
- Set resource limits and a deployment/rollback policy based on the selected hosting provider.

No database, authentication, production secrets, or hosting-provider configuration is included because the application does not currently require them. SMTP settings must be supplied before contact enquiries can be delivered.