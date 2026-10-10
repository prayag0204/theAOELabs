package com.theaoelabs.website.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = ContactController.class)
public class ContactExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ContactExceptionHandler.class);

    @ExceptionHandler(MailException.class)
    public ResponseEntity<ProblemDetail> handleMailFailure(MailException exception) {
        logger.error("Unable to deliver website contact enquiry", exception);
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Email delivery is temporarily unavailable. Please try again later."
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(problem);
    }
}