import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser'; // 1. Import EmailJS

// ── 2. Configure your EmailJS Credentials Here ──
const EMAILJS_SERVICE_ID  = "service_mykypzl";
const EMAILJS_TEMPLATE_ID = "template_gsgoysx";
const EMAILJS_PUBLIC_KEY  = "2zhl8MT0mjuy2IDYb";

const EMPTY_FORM = {
  name: '', email: '', projectLocation: '', phone: '',
  discipline: 'turnkey', messages: '', agree: false
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const contactStyles = `
  .contact-page { padding: 120px 2rem 60px; }
  .contact-body { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; }
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
  .contact-hero-h { font-size: 2.5rem; color: #fff; margin: 0.5rem 0; }
  .form-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .submit-btn {
    background: var(--gold, #cfa153); color: #000; border: none;
    padding: 0.75rem 2rem; border-radius: 4px; font-weight: bold;
    cursor: pointer; white-space: nowrap; transition: opacity 0.2s;
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .c-card { display: flex; align-items: flex-start; gap: 0.75rem; }

  @media (max-width: 768px) {
    .contact-page { padding: 80px 1rem 40px; }
    .contact-body { grid-template-columns: 1fr; gap: 2rem; }
    .form-grid-2 { grid-template-columns: 1fr; }
    .contact-hero-h { font-size: 1.75rem; }
    .contact-form-wrap { padding: 1.5rem !important; }
    .submit-btn { width: 100%; text-align: center; }
    .form-footer { flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .contact-page { padding: 70px 0.75rem 32px; }
    .contact-hero-h { font-size: 1.5rem; }
  }
`;

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  // status: 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus]     = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    // 3. Map your state parameters into template parameters for EmailJS
    const templateParams = {
      name:       formData.name,
      email:      formData.email,
      phone:      formData.phone,
      location:   formData.projectLocation,
      discipline: formData.discipline,
      message:    formData.messages,
    };

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setStatus('success');
        setFormData(EMPTY_FORM);
      } else {
        throw new Error('EmailJS failed to deliver');
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setErrorMsg('Something went wrong. Please call us directly on 077 735 6371 or 077 929 8315.');
      setStatus('error');
    }
  };

  const handleReset = () => { setStatus('idle'); setErrorMsg(''); };

  return (
    <div className="contact-page">
      <style>{contactStyles}</style>
      <div className="contact-bg-lines" />
      <div className="contact-bg-glow-1" />
      <div className="contact-bg-glow-2" />

      {/* ── Hero Header ── */}
      <div className="contact-hero" style={{ marginBottom: "4rem" }}>
        <div className="contact-hero-left">
          <div className="contact-hero-eyebrow" style={{ textTransform: "uppercase", color: "var(--gold, #cfa153)" }}>
            Engineering Estimations Desk
          </div>
          <h1 className="contact-hero-h">Initiate Your <span>Project Enquiry</span></h1>
          <p className="contact-hero-sub" style={{ color: "#ccc", maxWidth: "600px" }}>
            Reach out directly to coordinate structural planning, review architectural survey directives,
            or schedule detailed quantity bills (BOQs).
          </p>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="contact-body">

        {/* Sidebar */}
        <div className="contact-sidebar">
          <div style={{ marginBottom: "2rem" }}>
            <div className="contact-info-label" style={{ fontWeight: "bold", color: "#fff", marginBottom: "1rem" }}>
              Direct Interfaces
            </div>

            {[
              { icon: "🏢", label: "Main Operations Office", val: "71A Lake Road, Attidiya, Dehiwala" },
              { icon: "✉️", label: "Email Enquiries",        val: <a href="mailto:petraconstructionlk@gmail.com" style={{ color: "inherit" }}>petraconstructionlk@gmail.com</a> },
              { icon: "📞", label: "Direct Tele-Lines",       val: "077 735 6371 / 077 929 8315" },
            ].map(({ icon, label, val }, i) => (
              <div key={i} className="c-card" style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="c-card-icon">{icon}</div>
                <div>
                  <div className="c-card-label" style={{ fontSize: "0.8rem", color: "#aaa" }}>{label}</div>
                  <div className="c-card-val"   style={{ color: "#fff", fontSize: "0.95rem", lineHeight: "1.4" }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="availability-block" style={{ background: "rgba(207,161,83,0.05)", padding: "1.25rem", borderRadius: "6px", border: "1px solid rgba(207,161,83,0.15)" }}>
            <div className="avail-top" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <div className="avail-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#55efc4" }} />
              <div className="avail-title" style={{ fontSize: "0.9rem", color: "#fff", fontWeight: "bold" }}>Review Capacity: Active</div>
            </div>
            <div className="avail-text" style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: "1.4" }}>
              Our dedicated quantity surveyors and engineering leads handle evaluation logs systematically.
              Turnarounds for residential structural estimations are processed directly.
            </div>
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className="contact-form-wrap" style={{ background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>

          <div className="form-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
            <div className="form-header-title" style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#fff" }}>
              Project Matrix Parameters
            </div>
            <div className="form-header-sub" style={{ fontSize: "0.85rem", color: "#aaa" }}>
              Specify land/site dimensions, architectural intent, or building discipline requirements.
            </div>
          </div>

          {/* ── Success Screen ── */}
          {status === 'success' && (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>✅</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#fff", marginBottom: "0.75rem" }}>
                Enquiry Received
              </div>
              <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "420px", margin: "0 auto 2rem" }}>
                Thank you. Your project request has been sent to the Petra engineering desk.
                We'll be in touch within 1–2 business days.
              </p>
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "1rem 1.5rem", marginBottom: "2rem", fontSize: "0.82rem", color: "#ccc", lineHeight: "1.7" }}>
                Your enquiry has been forwarded to{" "}
                <strong style={{ color: "var(--gold, #cfa153)" }}>petraconstructionlk@gmail.com</strong>.<br />
                For urgent matters call <strong style={{ color: "#fff" }}>077 735 6371</strong> or <strong style={{ color: "#fff" }}>077 929 8315</strong>.
              </div>
              <button
                onClick={handleReset}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "0.7rem 1.8rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase" }}
              >
                Submit Another Enquiry
              </button>
            </div>
          )}

          {/* ── Error Banner ── */}
          {status === 'error' && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem" }}>⚠️</span>
              <div>
                <div style={{ color: "#f87171", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Submission Failed</div>
                <div style={{ color: "#ccc", fontSize: "0.8rem" }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* ── Form (idle + error states) ── */}
          {status !== 'success' && (
            <form className="form-body" onSubmit={handleSubmit}>

              <div className="form-grid-2">
                <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: "#fff", fontSize: "0.85rem" }}>Full Name <span style={{ color: "red" }}>*</span></label>
                  <input
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", width: "100%", boxSizing: "border-box" }}
                    type="text" required placeholder="Your Name"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: "#fff", fontSize: "0.85rem" }}>Contact Email <span style={{ color: "red" }}>*</span></label>
                  <input
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", width: "100%", boxSizing: "border-box" }}
                    type="email" required placeholder="client@domain.lk"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: "#fff", fontSize: "0.85rem" }}>Proposed Project Site Location</label>
                  <input
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", width: "100%", boxSizing: "border-box" }}
                    type="text" placeholder="e.g., Colombo, Dehiwala, Kalutara"
                    value={formData.projectLocation} onChange={e => setFormData({ ...formData, projectLocation: e.target.value })}
                  />
                </div>
                <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: "#fff", fontSize: "0.85rem" }}>Direct Contact Phone Line <span style={{ color: "red" }}>*</span></label>
                  <input
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", width: "100%", boxSizing: "border-box" }}
                    type="text" required placeholder="e.g., 0777356371"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Primary Engineering Discipline Target</label>
                <div className="select-wrap">
                  <select
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", boxSizing: "border-box" }}
                    value={formData.discipline} onChange={e => setFormData({ ...formData, discipline: e.target.value })}
                  >
                    <option value="turnkey">Full Turnkey Delivery (Concept to Handover)</option>
                    <option value="civil">Civil & Structural Works (RCC Frame, Foundations)</option>
                    <option value="me">Mechanical & Electrical Services (M&E Building Systems)</option>
                    <option value="management">Project Surveying & BOQ Assessment</option>
                  </select>
                </div>
              </div>

              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Brief Operational Requirements / Notes</label>
                <textarea
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", minHeight: "120px", resize: "vertical", width: "100%", boxSizing: "border-box" }}
                  placeholder="Outline details such as residential size, number of floors, beachfront/waterside terrain constraints, or current architectural draft parameters..."
                  value={formData.messages} onChange={e => setFormData({ ...formData, messages: e.target.value })}
                />
              </div>

              <div className="checkbox-row" style={{ display: "flex", gap: "8px", alignItems: "start", marginBottom: "2rem" }}>
                <input type="checkbox" id="agree-check" required checked={formData.agree} onChange={e => setFormData({ ...formData, agree: e.target.checked })} />
                <label htmlFor="agree-check" style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: "1.4" }}>
                  I authorize Petra Construction Co. (Pvt.) Ltd. to review this documentation for architectural consultation and estimation processing.
                </label>
              </div>

              <div className="form-footer">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? '⏳ Sending...' : 'Submit Project Request →'}
                </button>
                <div className="submit-note" style={{ fontSize: "0.75rem", color: "#777" }}>
                  {status === 'sending' ? 'Please wait…' : 'Secure Communication Protocol'}
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}