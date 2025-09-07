import { useEffect, useState } from "react"
import FormInput from "../../components/FormInput.jsx"
import logo from "../../assets/images/logo.png"
import meetus from "../../assets/images/meetus-cropped.png"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../../store/slices/authSlice"
import { emailValid } from "../../util/validation"
import toast from "react-hot-toast"
import "./Login.css"
import sms from "../../assets/images/sms.png"
import lock from "../../assets/images/lock.png"

export default function Login() {
  // Input States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disableLoginButton, setDisableLoginButton] = useState(false)

  // error states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Redux and Router Hooks
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Redirect to Dashboard if token is present
  useEffect(() => {
    if (auth.user) {
      navigate("/", { replace: true })
    }
  }, [auth.user, navigate])

  // Input Validation & Disabling Login Button
  useEffect(() => {
    addErrorMessage()
    if (email.trim() === "" || password.trim() === "" || !emailValid(email)) {
      setDisableLoginButton(true)
      return
    }
    setDisableLoginButton(false)
  }, [email, password])

  function addErrorMessage() {
    setEmailError("")
    setPasswordError("")
    if (email.trim() === "") {
      setEmailError("Email is required")
      return true
    } else if (!emailValid(email)) {
      setEmailError("Enter a valid email")
      return true
    } else if (password.trim() === "") {
      setPasswordError("Password is required")
      return true
    }
  }

  // Function To Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Don't submit if button is disabled (shouldn't happen, but extra safety)
    if (disableLoginButton) return
    try {
      await dispatch(login({ email, password, isEmployee: true })).unwrap()
      navigate("/", { replace: true })
    } catch (err) {
      // error message available in auth.error
      console.error("login error", err)
      toast.error(err?.message || "Login failed")
    }
  }

  return (
    <div className="login">
      <div className="background-container">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>

        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="welcome">
              <h1>Welcome back</h1>
              <p>Step into our shopping metaverse for an unforgettable shopping experience</p>
            </div>

            <div className="form-group">
              <FormInput
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (!emailTouched) setEmailTouched(true)
                }}
                onBlur={() => setEmailTouched(true)}
                icon={sms}
                error={emailTouched ? emailError : ""} // Only show error after touched
              />
              {emailError && emailTouched && <p className="error-message">{emailError}</p>}

              <FormInput
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (!passwordTouched) setPasswordTouched(true)
                }}
                onBlur={() => setPasswordTouched(true)}
                icon={lock}
                error={passwordTouched ? passwordError : ""} // Only show error after touched
              />
              {passwordError && passwordTouched && <p className="error-message">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={auth.status === "loading" || disableLoginButton}
              style={{
                opacity: auth.status === "loading" || disableLoginButton ? 0.3 : 1,
                cursor: auth.status === "loading" || disableLoginButton ? "not-allowed" : "pointer",
              }}
            >
              {auth.status === "loading" ? "Logging in..." : "Login"}
            </button>

            <p className="signup-link">
              Don't have an account? <a href="#">Sign Up</a>
            </p>
          </form>

          <div className="logo">
            <img src={meetus} alt="meetus" />
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  )
}
