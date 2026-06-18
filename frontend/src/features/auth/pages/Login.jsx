import { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

// --- Small inline icons (no extra dependency required) ---------------
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61C4.06 8.12 2 11 1 12c0 0 4 7 11 7a9.26 9.26 0 0 0 5.39-1.61" />
    <path d="M2 2l20 20" />
    <path d="M9.5 9.5a3 3 0 0 0 4.24 4.24" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-2.97c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.07C3.24 21.3 7.27 24 12 24Z" />
    <path fill="#FBBC05" d="M5.27 14.3a7.18 7.18 0 0 1 0-4.6V6.63H1.27a11.96 11.96 0 0 0 0 10.74l4-3.07Z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.27 0 3.24 2.7 1.27 6.63l4 3.07C6.22 6.86 8.87 4.75 12 4.75Z" />
  </svg>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { handleLogin, loading } = useAuth();
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