import express, { json } from "express"
import fetch from "node-fetch"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(json())
app.use(cookieParser())

// Allow CORS for Vite frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

const API_BASE = "https://api-yeshtery.dev.meetusvr.com/v1"

// Login endpoint: forwards credentials, sets HTTP-only cookie
app.post("/api/login", async (req, res) => {
  const { email, password, isEmployee } = req.body
  const apiResp = await fetch(`${API_BASE}/yeshtery/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, isEmployee }),
  })
  const data = await apiResp.json()
  if (apiResp.ok && data.token) {
    res.cookie("auth_token", data.token, {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // Uncomment if using HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    })
    res.json({ success: true })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
})

// User info endpoint: reads token from cookie, proxies to API
app.get("/api/user/info", async (req, res) => {
  const token = req.cookies.auth_token
  if (!token) return res.status(401).json({ message: "Not authenticated" })
  const apiResp = await fetch(`${API_BASE}/user/info`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await apiResp.json()
  res.status(apiResp.status).json(data)
})

// Logout endpoint: clears cookie
app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token")
  res.json({ success: true })
})

app.listen(4001, () => {
  console.log("BFF server running on http://localhost:4001")
})