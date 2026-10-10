
export async function fetchHealth() {
  const response = await fetch("/api/health", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Health request failed: ${response.status}`);
  }

  return response.json();
}
