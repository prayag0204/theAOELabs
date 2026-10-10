package com.theaoelabs.website.health;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class HealthControllerTest {

    @Autowired
    private HealthController healthController;

    @Test
    void shouldReturnHealthyStatus() {
        HealthResponse response = healthController.getHealth();

        assertEquals("UP", response.status());
        assertEquals("theaoe-labs-website", response.application());
    }
}