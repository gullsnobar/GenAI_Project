import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/home.scss";
import { FileText, Upload, X, BookOpen, Sparkles, Wand2, Heart } from "lucide-react";

/**
 * Home
 *
 * Entry screen for generating an interview prep report.
 */
const Home = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const MIN_JOB_DESC_LENGTH = 40;
  const MIN_SELF_DESC_LENGTH = 40;

  const jobValid = jobDescription.trim().length >= MIN_JOB_DESC_LENGTH;
  const selfValid = selfDescription.trim().length >= MIN_SELF_DESC_LENGTH;
  const resumeValid = resumeFile !== null;

  const validCount = [jobValid, selfValid, resumeValid].filter(Boolean).length;
  const isFormValid = validCount === 3;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGenerate = async () => {
    if (!isFormValid || isGenerating) return;
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("selfDescription", selfDescription);

      const response = await axios.post(
        "http://localhost:3000/api/interview",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("Report generated successfully:", response.data);
      const reportId = response.data?.data?._id;
      if (reportId) {
        navigate(`/interview/${reportId}`);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert(error?.response?.data?.error || error?.response?.data?.message || "Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="home-page">
      {/* Top bar */}
      <header className="home-header">
        <div className="home-header__inner">
          <div className="home-header__brand">
            <span className="home-header__mark">
              <BookOpen size={22} strokeWidth={1.8} />
            </span>
            <span className="home-header__title">Interview Brief</span>
          </div>

          <div className="home-header__meta">
            <div className="home-header__readiness-label">Report Readiness</div>
            <div className="home-header__readiness-track">
              <div
                className="home-header__readiness-fill"
                style={{ width: `${(validCount / 3) * 100}%` }}
              />
            </div>
            <div className="home-header__tagline">
              Prepare for the role, not just an interview
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="home-body">
        <div className="home-grid">
          {/* Left card — the role */}
          <section className="home-card">
            <div className="home-card__head">
              <span className="home-badge home-badge--role">
                <Sparkles size={12} />
                THE ROLE
              </span>
              <h2 className="home-card__title">What are you up against?</h2>
              <p className="home-card__subtitle">
                Paste the full job description. The more context it has, the
                sharper your prep will be.
              </p>
            </div>

            <div className="home-card__body">
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting here — responsibilities, requirements, team context, anything you were given..."
                className="home-field home-field--job"
              />
              <div className="home-field-meta">
                <span>
                  {!jobValid && jobDescription.length > 0
                    ? `${MIN_JOB_DESC_LENGTH - jobDescription.trim().length} more characters needed`
                    : "\u00A0"}
                </span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </section>

          {/* Right card — the candidate */}
          <section className="home-card">
            <div className="home-card__head">
              <span className="home-badge home-badge--you">
                <Wand2 size={12} />
                YOU
              </span>
              <h2 className="home-card__title">What you bring to it</h2>
              <p className="home-card__subtitle">
                Your resume and your own words — the report is built from the
                gap between the two.
              </p>
            </div>

            <div className="home-fields">
              {/* Resume upload */}
              <div className="home-field-group">
                <label className="home-label">
                  Resume
                  <span className="home-label__required">*</span>
                </label>

                {!resumeFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`home-dropzone ${isDragging ? "is-dragging" : ""}`}
                  >
                    <Upload size={20} />
                    <p>
                      <span className="home-dropzone__link">Choose a file</span>{" "}
                      or drag it here
                    </p>
                    <p className="home-dropzone__hint">PDF, up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="home-file-input"
                    />
                  </div>
                ) : (
                  <div className="home-file-preview">
                    <div className="home-file-preview__icon">
                      <FileText size={16} />
                    </div>
                    <div className="home-file-preview__info">
                      <p className="home-file-preview__name">{resumeFile.name}</p>
                      <p className="home-file-preview__size">
                        {formatFileSize(resumeFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove resume"
                      className="home-file-preview__remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Self description */}
              <div className="home-field-group">
                <label htmlFor="selfDescription" className="home-label">
                  How you'd describe yourself
                  <span className="home-label__required">*</span>
                </label>
                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="What you're proud of, where you're still growing, what kind of role you're looking for..."
                  className="home-field home-field--self"
                />

                <div className="home-chips" aria-hidden="true">
                  <span className="home-chip home-chip--passion">
                    <Heart size={13} fill="currentColor" />
                    Passion
                  </span>
                  <span className="home-chip home-chip--prompting">
                    <Wand2 size={13} />
                    Prompting
                  </span>
                  <span className="home-chip home-chip--skills">
                    <Sparkles size={13} />
                    Skills
                  </span>
                </div>

                <div className="home-field-meta">
                  <span>
                    {!selfValid && selfDescription.length > 0
                      ? `${MIN_SELF_DESC_LENGTH - selfDescription.trim().length} more characters needed`
                      : "\u00A0"}
                  </span>
                  <span>{selfDescription.length} characters</span>
                </div>
              </div>

              {/* Status line */}
              <p className={`home-status ${!isFormValid ? "home-status--incomplete" : ""}`}>
                {isFormValid
                  ? "Both fields completed — ready to analyze"
                  : `${validCount} of 3 ready`}
              </p>

              {/* CTA */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="home-cta"
              >
                {isGenerating ? (
                  <>
                    <span className="home-cta__spinner" />
                    Generating your report…
                  </>
                ) : (
                  "Generate interview report"
                )}
              </button>
              {!isFormValid && (
                <p className="home-hint">
                  Add a job description, your resume, and a few lines about
                  yourself to continue
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <a href="/how-it-works">How it works</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/help">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;