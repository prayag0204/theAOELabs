# End-to-End Deployment & Environment Migration Guide

This document contains precise, version-matched architectural instructions for GitHub Copilot to safely prepare and migrate this specific React (v19.3.0) + Spring Boot (v4.1.1) full-stack application from its local multi-container Docker Compose layout into a production-ready, split cloud infrastructure using Vercel (Frontend) and Render (Backend).

---

## Technical Specifications Matrix
*   **Java Runtime:** Java 25 (Eclipse Temurin)
*   **Backend Framework:** Spring Boot 4.1.1
*   **Build Automation:** Maven 3.10.0 Wrapper
*   **Frontend UI:** React 19.3.0 (Webpack 5.111.1 & Babel 8.0.7)
*   **Local Server Routing:** Webpack Dev Server proxying `/api` -> `localhost:8080`
*   **Production Architecture:** Vercel Global CDN (Frontend Static Bundle) talking over HTTPS to a Render Docker Web Service (Backend).

---

## Phase 1: Java Backend Cloud Migration (Targeting Render)
Render's free tier hosting environment builds single independent containers from individual source files rather than standard multi-container Docker Compose networks.

### Step 1.1: Generate Version-Matched Production Dockerfile
*Task for Copilot:* Create a standalone file named `Dockerfile` directly inside the root directory of your backend folder. It must mirror the precise images, dependencies, and compilation paths specified in your runtime matrix (Java 25).

```dockerfile
# Stage 1: Build the Spring Boot application using Java 25
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copy Maven wrapper configuration and dependencies definitions
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source tree and compile execution target package
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Production JRE runtime deployment container
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copy the compiled JAR artifact from the build layer stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot embedded Tomcat listens on port 8080
EXPOSE 8080

# Run with headless optimizations for headless container instances
ENTRYPOINT ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
```

### Step 1.2: Implement Production CORS Mapping for Split-Domain Architecture
In your local Docker Compose setup, Nginx handles inverse proxies to make both apps look like they sit on one domain. In the cloud, your frontend on Vercel (`*.vercel.app`) must access your API on Render (`*.onrender.com`) across distinct origins.

*Task for Copilot:* Scan for or generate a new security configuration file (e.g., `src/main/java/.../config/CorsConfig.java`) to establish dynamic request allowances.

```java
package com.example.config; // Ensure package matching remains accurate to directory context

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addMapping(String registryPath) {
                // Adjust path parameters according to global architecture configurations
            }

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                            "http://localhost:3000",
                            "http://localhost:8081",
                            "https://*.vercel.app" // Permits seamless sub-domain branch previews on Vercel
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600); // Cache pre-flight pre-route validation for 1 hour
            }
        };
    }
}
```

---

## Phase 2: Frontend Environment Configuration Update (Targeting Vercel)
Vercel hosts the React application as optimized static files directly on an edge network, which renders Nginx proxy routing obsolete for network traffic.

### Step 2.1: Refactor Base Endpoints for Webpack Environment Switching
Instead of utilizing fixed `/api` endpoints reliant on an underlying Nginx host routing rule, your API configurations must adapt contextually between local build loops and the production cloud.

*Task for Copilot:* Update your client configuration modules (e.g., Axios instance file or base fetch wrappers) to determine target base URLs programmatically.

```javascript
import axios from 'axios';

/**
 * In local execution, requests route directly to the Webpack development proxy.
 * In a Vercel production environment, it targets the designated cloud environment variable.
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Complements Spring Boot security cross-origin cookie allowances
});
```

---

## Phase 3: Verification & Execution Pipeline

### Step 3.1: Verify Local Container Isolation Build
Instruct Copilot to simulate the isolated container layer generation pipeline using your terminal:
```bash
docker build -t app-backend-v25 .
```

### Step 3.2: Map Secret Variables on Live Cloud Environments

#### 1. Setup Render Dashboard (Spring Boot API)
*   Navigate to the [Render Control Console](https://dashboard.render.com).
*   Create a **New Web Service** and authorize access to your GitHub project repository.
*   Set **Runtime** explicitly to `Docker`.
*   Select the **Free Tier**.
*   Open the **Environment Variables** panel and attach your secret infrastructure components:
    *   `SPRING_MAIL_HOST` = `your-smtp-host.com`
    *   `SPRING_MAIL_USERNAME` = `your-smtp-username`
    *   `SPRING_MAIL_PASSWORD` = `your-smtp-password`
*   Copy your generated deployment URL string (e.g., `https://your-api.onrender.com`).

#### 2. Setup Vercel Panel (React UI Web Application)
*   Open the [Vercel Dashboard](https://vercel.com).
*   Choose **Add New Project** and pick the corresponding frontend code platform repository.
*   Vercel will dynamically notice Webpack configurations and parse compilation settings.
*   Expand the **Environment Variables** accordion window and input your version-matched connection keys:
    *   **NAME:** `REACT_APP_API_BASE_URL`
    *   **VALUE:** `https://your-api.onrender.com` *(The target instance URL from Render)*
*   Click **Deploy**.