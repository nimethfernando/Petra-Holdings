import React, { useState, useEffect, useRef } from 'react';

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

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(36px)',
      transition: `opacity 0.8s ${delay * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${delay * 0.12}s cubic-bezier(0.16,1,0.3,1)`
    }}>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', projectLocation: '', phone: '',
    discipline: 'turnkey', scopeEstimate: '', messages: '', agree: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Project Parameters Submitting:', formData);
  };

  return (
    <div className="contact-page" style={{ padding: "120px 2rem 60px" }}>
      <div className="contact-bg-lines" />
      <div className="contact-bg-glow-1" />
      <div className="contact-bg-glow-2" />

      {/* ── Contact Page Hero Header ── */}
      <div className="contact-hero" style={{ marginBottom: "4rem" }}>
        <div className="contact-hero-left">
          <div className="contact-hero-eyebrow" style={{ textTransform: "uppercase", color: "var(--gold, #cfa153)" }}>Engineering Estimations Desk</div>
          <h1 className="contact-hero-h" style={{ fontSize: "2.5rem", color: "#fff", margin: "0.5rem 0" }}>Initiate Your <span>Project Enquiry</span></h1>
          <p className="contact-hero-sub" style={{ color: "#ccc", maxWidth: "600px" }}>
            Reach out directly to coordinate structural planning, review architectural survey directives, or schedule detailed quantity bills (BOQs).
          </p>
        </div>
      </div>

      {/* ── Core Two-Column Component Layout ── */}
      <div className="contact-body" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem" }}>
        
        <div className="contact-sidebar">
          <div style={{ marginBottom: "2rem" }}>
            <div className="contact-info-label" style={{ fontWeight: "bold", color: "#fff", marginBottom: "1rem" }}>Direct Interfaces</div>
            
            <div className="c-card" style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="c-card-icon">🏢</div>
              <div>
                <div className="c-card-label" style={{ fontSize: "0.8rem", color: "#aaa" }}>Main Operations Office</div>
                <div className="c-card-val" style={{ color: "#fff", fontSize: "0.95rem" }}>71A Lake Road, Attidiya, Dehiwala</div>
              </div>
            </div>

            <div className="c-card" style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="c-card-icon">✉️</div>
              <div>
                <div className="c-card-label" style={{ fontSize: "0.8rem", color: "#aaa" }}>Email Enquiries</div>
                <div className="c-card-val" style={{ color: "#fff", fontSize: "0.95rem" }}><a href="mailto:pcap3@yahoo.com" style={{ color: "inherit" }}>pcap3@yahoo.com</a></div>
              </div>
            </div>

            <div className="c-card" style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="c-card-icon">📞</div>
              <div>
                <div className="c-card-label" style={{ fontSize: "0.8rem", color: "#aaa" }}>Direct Tele-Line</div>
                <div className="c-card-val" style={{ color: "#fff", fontSize: "0.95rem" }}>077 735 6371</div>
              </div>
            </div>
          </div>

          <div className="availability-block" style={{ background: "rgba(207,161,83,0.05)", padding: "1.25rem", borderRadius: "6px", border: "1px solid rgba(207,161,83,0.15)" }}>
            <div className="avail-top" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <div className="avail-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#55efc4" }} />
              <div className="avail-title" style={{ fontSize: "0.9rem", color: "#fff", fontWeight: "bold" }}>Review Capacity: Active</div>
            </div>
            <div className="avail-text" style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: "1.4" }}>
              Our dedicated quantity surveyors and engineering leads handle evaluation logs systematically. Turnarounds for residential structural estimations are processed directly.
            </div>
          </div>
        </div>

        {/* ── Interactive RFP Submission Engine ── */}
        <div className="contact-form-wrap" style={{ background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="form-header" style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <div className="form-header-title" style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#fff" }}>Project Matrix Parameters</div>
              <div className="form-header-sub" style={{ fontSize: "0.85rem", color: "#aaa" }}>Specify land/site dimensions, architectural intent, or building discipline requirements.</div>
            </div>
          </div>

          <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Full Name <span style={{ color: "red" }}>*</span></label>
                <input 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff" }}
                  type="text" required placeholder="Your Name"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Contact Email <span style={{ color: "red" }}>*</span></label>
                <input 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff" }}
                  type="email" required placeholder="client@domain.lk"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Proposed Project Site Location</label>
                <input 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff" }}
                  type="text" placeholder="e.g., Colombo, Dehiwala, Kalutara"
                  value={formData.projectLocation} onChange={e => setFormData({...formData, projectLocation: e.target.value})}
                />
              </div>
              <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: "#fff", fontSize: "0.85rem" }}>Direct Contact Phone Line <span style={{ color: "red" }}>*</span></label>
                <input 
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff" }}
                  type="text" required placeholder="077 XXXXXXX"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <label style={{ color: "#fff", fontSize: "0.85rem" }}>Primary Engineering Discipline Target</label>
              <div className="select-wrap">
                <select 
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff" }}
                  value={formData.discipline} onChange={e => setFormData({...formData, discipline: e.target.value})}
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
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "4px", color: "#fff", minHeight: "120px", resize: "vertical" }}
                placeholder="Outline details such as residential size, number of floors, beachfront/waterside terrain constraints, or current architectural draft parameters..."
                value={formData.messages} onChange={e => setFormData({...formData, messages: e.target.value})}
              />
            </div>

            <div className="checkbox-row" style={{ display: "flex", gap: "8px", alignItems: "start", marginBottom: "2rem" }}>
              <input type="checkbox" id="agree-check" required checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} />
              <label htmlFor="agree-check" style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: "1.4" }}>
                I authorize Petra Construction Co. (Pvt.) Ltd. to review this documentation for architectural consultation and estimation processing.
              </label>
            </div>

            <div className="form-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button type="submit" className="submit-btn" style={{ background: "var(--gold, #cfa153)", color: "#000", border: "none", padding: "0.75rem 2rem", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>Submit Project Request →</button>
              <div className="submit-note" style={{ fontSize: "0.75rem", color: "#777" }}>Secure Communication Protocol</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}