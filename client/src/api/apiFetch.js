const BASE_URL = import.meta.env.VITE_BASE_URL;

//apiFetch
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(BASE_URL + url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body,
  });

  const contentType = response.headers.get("content-type");

  // If server returns HTML instead of JSON
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Server returned HTML instead of JSON:", text);
    throw new Error("Invalid API route or server error");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
