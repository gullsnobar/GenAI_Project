import { useState } from "react";
import "../auth.form.scss";

// --- Small inline icons (no extra dependency required) ---------------
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

// 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(1, score);
};

const STRENGTH_LABELS = { 1: "Weak", 2: "Fair", 3: "Good", 4: "Strong" };

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Enter your full name.";

    if (!formData.email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(formData.email)) next.email = "Enter a valid email address.";

    if (!formData.password) next.password = "Create a password.";
    else if (formData.password.length < 8) next.password = "Use at least 8 characters.";

    if (!formData.confirmPassword) next.confirmPassword = "Confirm your password.";
    else if (formData.confirmPassword !== formData.password) next.confirmPassword = "Passwords don't match.";

    if (!formData.agreeToTerms) next.agreeToTerms = "You need to accept the terms to continue.";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      // TODO: replace with your real registration call, e.g.
      // await api.post("/auth/register", formData);
      await new Promise((resolve) => setTimeout(resolve, 900));
    } catch {
      setFormError("We couldn't create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start your free account in under a minute</p>

        {formError && (
          <div className="auth-alert" role="alert">
            <AlertIcon />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.fullName ? "has-error" : ""}`}>
            <label htmlFor="fullName">Full name</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon"><UserIcon /></span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
            </div>
            {errors.fullName && (
              <span className="field-error" id="fullName-error">
                <AlertIcon /> {errors.fullName}
              </span>
            )}
          </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : "password-strength-label"}
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
            {formData.password && !errors.password && (
              <>
                <div className="password-strength" data-strength={strength} aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
                <span className="password-strength-label" id="password-strength-label">
                  {STRENGTH_LABELS[strength]} password
                </span>
              </>
            )}
            {errors.password && (
              <span className="field-error" id="password-error">
                <AlertIcon /> {errors.password}
              </span>
            )}
          </div>

          <div className={`input-group ${errors.confirmPassword ? "has-error" : ""}`}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="input-wrapper has-icon has-trailing">
              <span className="input-icon"><LockIcon /></span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <button
                type="button"
                className="input-trailing-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error" id="confirmPassword-error">
                <AlertIcon /> {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className={`input-group ${errors.agreeToTerms ? "has-error" : ""}`}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree to the <a className="text-link" href="/terms">Terms</a> and <a className="text-link" href="/privacy">Privacy Policy</a>
            </label>
            {errors.agreeToTerms && (
              <span className="field-error">
                <AlertIcon /> {errors.agreeToTerms}
              </span>
            )}
          </div>

          <button type="submit" className="button primary-button" disabled={isSubmitting}>
            {isSubmitting && <span className="spinner" />}
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button type="button" className="button social-button">
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="auth-footer">
          Already have an account? <a className="text-link" href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
};

export default Register;