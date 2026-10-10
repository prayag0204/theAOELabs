package com.theaoelabs.website.health;

public record HealthResponse(
        String status,
        String application
) {
}