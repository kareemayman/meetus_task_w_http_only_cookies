const API_BASE = import.meta.env.VITE_API_BASE

// Generic fetch helper
async function rawFetch(
  url,
  { method = "GET", body = undefined, headers = {}, withCredentials = false } = {}
) {
  const finalHeaders = { "Content-Type": "application/json", ...headers }
  const resp = await fetch(`${API_BASE}${url}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: withCredentials ? "include" : "same-origin",
  })

  const text = await resp.text()
  const data = text ? JSON.parse(text) : null

  if (!resp.ok) {
    const err = new Error(data?.message || "Request failed")
    err.status = resp.status
    err.data = data
    throw err
  }
  return data
}

// Login: always use withCredentials, no token storage
export async function loginRequest({ email, password, isEmployee = true }) {
  return await rawFetch("/login", {
    method: "POST",
    body: { email, password, isEmployee },
    withCredentials: true,
  })
}

// Fetch user info: rely on cookie
export async function fetchUserRequest() {
  return await rawFetch("/user/info", {
    method: "GET",
    withCredentials: true,
  })
}

// Logout: call backend to clear cookie
export async function logoutRequest() {
  return await rawFetch("/logout", {
    method: "POST",
    withCredentials: true,
  })
}