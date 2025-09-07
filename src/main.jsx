import { createRoot } from "react-dom/client"
import { Provider, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchCurrentUser } from "./store/slices/authSlice.js"
import store from "./store/index.js"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx"
import { Toaster } from "react-hot-toast"
import "./index.css"
import "./media.css"

function AppInit({ children }) {
  const dispatch = useDispatch()
  useEffect(() => {
    // Dispatch any initialization actions
    dispatch(fetchCurrentUser())
  }, [dispatch])
  return children
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard></Dashboard>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppInit>
    </BrowserRouter>
    <Toaster></Toaster>
  </Provider>
)
