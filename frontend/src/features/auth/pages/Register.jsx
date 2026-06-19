import { useState } from "react";
import "../auth.form.scss";
import { useNavigate } from "react-router-dom";
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, AlertIcon, GoogleIcon } from "../components/Icons";

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

  const navigate = useNavigate();

  
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
      navigate("/login");
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