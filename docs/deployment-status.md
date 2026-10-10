# Deployment Guide Status

Status of the tasks in [`copilot-deployment-guide.md`](../copilot-deployment-guide.md).

## Completed

- Updated `backend/Dockerfile` for Java 25, Maven Wrapper dependency prefetch, and Spring Boot packaging.
- Added configurable CORS for `/api/**`; credentials are disabled because the application does not use cookie-based authentication.
- Made the backend bind to Render's `PORT`, with `8080` as the local default.
- Added the Webpack `REACT_APP_API_BASE_URL` build setting and shared URL helper. Without the setting, local `/api` proxy behavior remains in place.
- Added `frontend/vercel.json` for `npm ci`, `npm run build`, and the `dist` output directory.
- Documented Render and Vercel project roots, required environment variables, and deployment configuration in [`deployment.md`](deployment.md).

## Verified

- Backend Maven verification passed; all 7 tests passed.
- Frontend production build passed with a sample Render API URL; the URL was confirmed in the generated bundle.
- Focused CORS test passed for the local frontend origin.
- Docker image build was not run because Docker is unavailable in the development environment.

## Remaining

1. Review and commit the current changes on branch `emailFunctionalities`, then push it to GitHub.
2. Open a pull request, wait for CI, and merge to `main` (or intentionally deploy the feature branch for a preview).
3. Create the Render Web Service using repository root `backend`; configure SMTP credentials, sender/inbox, and the exact Vercel origin in `APP_CORS_ALLOWED_ORIGIN_PATTERNS`.
4. Create the Vercel project using repository root `frontend`; set `REACT_APP_API_BASE_URL` to the Render HTTPS origin and deploy.
5. Verify `/api/health` on Render and send a controlled contact enquiry through the public Vercel site.
6. Revoke any SMTP App Password previously exposed and use a newly generated credential in Render's secret settings. Never commit SMTP secrets.

The cloud services have not been created or deployed; those steps require access to the owner's GitHub, Render, and Vercel accounts.
