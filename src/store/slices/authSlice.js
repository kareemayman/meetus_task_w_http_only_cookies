import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as authService from "../../api/authService"

// login thunk: calls BFF API, backend sets cookie, fetches user
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, isEmployee = true }, { rejectWithValue }) => {
    try {
      await authService.loginRequest({ email, password, isEmployee })
      // After login, fetch user info (cookie will be sent automatically)
      const user = await authService.fetchUserRequest()
      return { user }
    } catch (err) {
      return rejectWithValue({
        status: err.status || 500,
        message: err.data?.message || err.message || "Login failed",
      })
    }
  }
)

// fetchCurrentUser: used at app start or when page reloads
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.fetchUserRequest()
      return { user }
    } catch (err) {
      return rejectWithValue({
        status: err.status || 500,
        message: err.data?.message || err.message || "Failed to fetch user",
      })
    }
  }
)

// logout thunk (calls backend to clear cookie)
export const logout = createAsyncThunk("auth/logout", async (_, { fulfillWithValue }) => {
  try {
    await authService.logoutRequest()
  } catch (e) {
    // ignore errors on logout
  }
  return fulfillWithValue({})
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | authenticated | unauthenticated | failed
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.status = "loading"
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "authenticated"
      state.user = action.payload.user
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed"
      state.error = action.payload?.message || "Login failed"
      state.user = null
    })

    // fetchCurrentUser
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "loading"
      state.error = null
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = "authenticated"
      state.user = action.payload.user
      state.error = null
    })
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = "unauthenticated"
      state.user = null
    })

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "unauthenticated"
      state.user = null
      state.error = null
    })
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer