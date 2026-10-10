import { apiUrl } from "./apiUrl";

export async function submitContactEnquiry(enquiry) {
  const response = await fetch(apiUrl("/api/contact"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enquiry),
  });

  if (!response.ok) {
    throw new Error(`Contact request failed: ${response.status}`);
  }
}