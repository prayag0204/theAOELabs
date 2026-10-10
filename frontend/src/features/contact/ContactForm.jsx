import { useRef, useState } from "react";
import { submitContactEnquiry } from "../../api/contactApi";

const emptyEnquiry = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export default function ContactForm() {
  const [enquiry, setEnquiry] = useState(emptyEnquiry);
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const submissionLock = useRef(false);
  const isSubmitting = submissionStatus === "submitting";

  function handleChange(event) {
    const { name, value } = event.target;
    setEnquiry((currentEnquiry) => ({ ...currentEnquiry, [name]: value }));

    if (submissionStatus === "success" || submissionStatus === "error") {
      setSubmissionStatus("idle");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionLock.current) {
      return;
    }

    submissionLock.current = true;
    setSubmissionStatus("submitting");

    try {
      await submitContactEnquiry(enquiry);
      setEnquiry(emptyEnquiry);
      setSubmissionStatus("success");
    } catch {
      setSubmissionStatus("error");
    } finally {
      submissionLock.current = false;
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <fieldset className="contact-form-fields" disabled={isSubmitting}>
        <label className="contact-field">
          <span>Name</span>
          <input
            autoComplete="name"
            maxLength={100}
            name="name"
            onChange={handleChange}
            required
            type="text"
            value={enquiry.name}
          />
        </label>

        <label className="contact-field">
          <span>Work email</span>
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={enquiry.email}
          />
        </label>

        <label className="contact-field contact-field-full">
          <span>Company <span className="contact-optional">Optional</span></span>
          <input
            autoComplete="organization"
            maxLength={120}
            name="company"
            onChange={handleChange}
            type="text"
            value={enquiry.company}
          />
        </label>

        <label className="contact-field contact-field-full">
          <span>How can we help?</span>
          <textarea
            maxLength={5000}
            minLength={20}
            name="message"
            onChange={handleChange}
            required
            rows={5}
            value={enquiry.message}
          />
        </label>

        <div className="contact-form-actions contact-field-full">
          <button className="button-primary contact-submit" type="submit">
            {isSubmitting ? "Sending..." : "Send enquiry"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </fieldset>

      {submissionStatus === "success" && (
        <p className="contact-status contact-status-success" role="status">
          Thanks for reaching out. Your enquiry has been sent.
        </p>
      )}
      {submissionStatus === "error" && (
        <p className="contact-status contact-status-error" role="alert">
          We couldn’t send your enquiry. Please try again or email hello@theaoelabs.com.
        </p>
      )}
    </form>
  );
}