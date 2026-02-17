const API_BASE = "http://localhost:8080/api";

export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body = null,
    responseType = "json" //  default
  } = {}
) {
  const token = JSON.parse(localStorage.getItem("auth"))?.auth_key;

  const headers = {};

  // Only set JSON header when sending JSON
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["auth_key"] = token;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw errText || "API Error";
  }
//  Handle 204 No Content
  if (res.status === 204) return null;

  //  Response handling
  if (responseType === "text") return res.text();
  if (responseType === "blob") return res.blob();
  return res.json(); // default
}
