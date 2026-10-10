package com.theaoelabs.website.contact;

import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class ContactServiceTest {

    @Test
    void shouldSendEnquiryToConfiguredInboxAndSetReplyTo() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        ContactService contactService = new ContactService(
                mailSender,
                "hello@theaoelabs.com",
                "website@theaoelabs.com"
        );
        ContactRequest request = new ContactRequest(
                "Alex Client",
                "alex@example.com",
                "Example Co",
                "We need help modernizing our customer portal."
        );

        contactService.sendEnquiry(request);

        var messageCaptor = org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());
        SimpleMailMessage message = messageCaptor.getValue();
        assertEquals("website@theaoelabs.com", message.getFrom());
        assertEquals("hello@theaoelabs.com", message.getTo()[0]);
        assertEquals("alex@example.com", message.getReplyTo());
        assertEquals("The AOE Labs: Contact Enquiry", message.getSubject());
        org.junit.jupiter.api.Assertions.assertTrue(message.getText().contains("Example Co"));
        org.junit.jupiter.api.Assertions.assertTrue(message.getText().contains(request.message()));
    }
}