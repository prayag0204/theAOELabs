package com.theaoelabs.website.contact;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
@Import({ContactExceptionHandler.class, com.theaoelabs.website.config.CorsConfig.class})
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContactService contactService;

    @Test
    void shouldAcceptValidEnquiry() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alex Client",
                                  "email": "alex@example.com",
                                  "company": "Example Co",
                                  "message": "We need help modernizing our customer portal."
                                }
                                """))
                .andExpect(status().isNoContent());

        verify(contactService).sendEnquiry(any(ContactRequest.class));
    }

                @Test
                void shouldAllowConfiguredLocalFrontendOriginWithoutCredentials() throws Exception {
                                mockMvc.perform(post("/api/contact")
                                                                                                .header("Origin", "http://localhost:3000")
                                                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                                                .content("""
                                                                                                                                {
                                                                                                                                        "name": "Alex Client",
                                                                                                                                        "email": "alex@example.com",
                                                                                                                                        "company": "Example Co",
                                                                                                                                        "message": "We need help modernizing our customer portal."
                                                                                                                                }
                                                                                                                                """))
                                                                .andExpect(status().isNoContent())
                                                                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"))
                                                                .andExpect(header().doesNotExist("Access-Control-Allow-Credentials"));
                }

    @Test
    void shouldRejectInvalidEnquiryWithoutSendingEmail() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "email": "not-an-email",
                                  "company": "Example Co",
                                  "message": "Short"
                                }
                                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(contactService);
    }

    @Test
    void shouldReturnGenericUnavailableResponseWhenEmailDeliveryFails() throws Exception {
        doThrow(new MailSendException("SMTP credentials rejected"))
                .when(contactService).sendEnquiry(any(ContactRequest.class));

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alex Client",
                                  "email": "alex@example.com",
                                  "company": "Example Co",
                                  "message": "We need help modernizing our customer portal."
                                }
                                """))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().string(org.hamcrest.Matchers.not(
                        org.hamcrest.Matchers.containsString("SMTP credentials rejected")
                )));
    }
}