const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
