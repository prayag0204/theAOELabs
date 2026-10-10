package com.theaoelabs.website.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final JavaMailSender mailSender;
    private final String inbox;
    private final String fromAddress;

    public ContactService(
            JavaMailSender mailSender,
            @Value("${app.contact.inbox}") String inbox,
            @Value("${app.contact.from}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.inbox = inbox;
        this.fromAddress = fromAddress;
    }

    public void sendEnquiry(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(inbox);
        message.setReplyTo(request.email().strip());
        message.setSubject("The AOE Labs: Contact Enquiry");
        message.setText("""
                Name: %s
                Email: %s
                Company: %s

                Message:
                %s
                """.formatted(
                request.name().strip(),
                request.email().strip(),
                request.company() == null || request.company().isBlank()
                        ? "Not provided"
                        : request.company().strip(),
                request.message().strip()
        ));

        mailSender.send(message);
    }
}