import { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router"

import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, AlertIcon, GoogleIcon } from "../components/Icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear the field-level error as soon as the user starts fixing it
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(formData.email)) next.email = "Enter a valid email address.";

    if (!formData.password) next.password = "Enter your password.";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;


    setFormError("");
    try {
      await handleLogin({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (error) {
      setFormError(error?.message || "We couldn't sign you in. Check your details and try again.");
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your account</p>

        {formError && (
          <div className="auth-alert" role="alert">
            <AlertIcon />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon"><MailIcon /></span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <span className="field-error" id="email-error">
                <AlertIcon /> {errors.email}
              </span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="input-wrapper has-icon has-trailing">
              <span className="input-icon"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="input-trailing-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span className="field-error" id="password-error">
                <AlertIcon /> {errors.password}
              </span>
            )}
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a className="text-link" href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="button primary-button" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button type="button" className="button social-button">
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="auth-footer">
          Don&apos;t have an account? <a className="text-link" href="/register">Sign up</a>
        </p>
      </div>
    </main>
  );
};

export default Login;