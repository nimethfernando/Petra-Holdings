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
    name: '', email: '', company: '', phone: '',
    tier: 'commercial', scope: '', notes: '', agree: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('RFP Parameters Submitting:', formData);
  };

  return (
    <div className="contact-page">
      {/* Dynamic Ambiance Layer */}
      <div className="contact-bg-lines" />
      <div className="contact-bg-glow-1" />
      <div className="contact-bg-glow-2" />

      {/* ── Contact Page Hero Header ── */}
      <div className="contact-hero">
        <div className="contact-hero-left">
          <div className="contact-hero-eyebrow">Procurement Office</div>
          <h1 className="contact-hero-h">Initiate Your <span>Project Request</span></h1>
          <p className="contact-hero-sub">
            Connect with our structural infrastructure estimation desks. Submit custom specifications, resource schedules, or architectural directives directly.
          </p>
        </div>
        <div className="contact-hero-right">
          {[
            { label: 'RFP Processing Unit', val: 'estimates@petraholdings.com', icon: '✉' },
            { label: 'Tele-Schedules', val: '+1 (800) 555-PETRA', icon: '📞' }
          ].map((item, index) => (
            <div key={index} className="hero-info-pill">
              <div className="hero-info-pill-icon">{item.icon}</div>
              <div>
                <div className="hero-info-pill-label">{item.label}</div>
                <div className="hero-info-pill-val">{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Two-Column Component Layout ── */}
      <div className="contact-body">
        <div className="contact-sidebar">
          <div>
            <div className="contact-info-label">Direct Interfaces</div>
            <div className="c-card">
              <div className="c-card-icon">🏢</div>
              <div>
                <div className="c-card-label">Commercial Asset Desk</div>
                <div className="c-card-val">dev.procure@petraholdings.com</div>
              </div>
            </div>
            <div className="c-card">
              <div className="c-card-icon">⚡</div>
              <div>
                <div className="c-card-label">Substructure Tenders</div>
                <div className="c-card-val">civil.rfp@petraholdings.com</div>
              </div>
            </div>
          </div>

          <div className="availability-block">
            <div className="avail-top">
              <div className="avail-dot" />
              <div className="avail-title">Operations Status: Active</div>
            </div>
            <div className="avail-text">
              Estimation metrics engines and engineering review leads are fully staffed. Submission returns average within a 48-hour assessment framework cycle.
            </div>
          </div>
        </div>

        {/* ── Interactive RFP Submission Engine ── */}
        <div className="contact-form-wrap">
          <div className="form-header">
            <div>
              <div className="form-header-title">Request For Proposal Parameters</div>
              <div className="form-header-sub">Provide site blueprints, scope matrix blueprints, or asset limits.</div>
            </div>
            <div className="form-response-badge">⏱ Target Response: 48 Hrs</div>
          </div>

          <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Legal Full Name <span className="field-required">*</span></label>
                <input 
                  type="text" required placeholder="Alexander Vance"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-field">
                <label>Corporate Email <span className="field-required">*</span></label>
                <input 
                  type="email" required placeholder="vance@enterprise.com"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Entity / Enterprise</label>
                <input 
                  type="text" placeholder="Vance Logistics Infrastructure"
                  value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className="form-field">
                <label>Contact Direct Line</label>
                <input 
                  type="text" placeholder="+1 (555) 019-2831"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Asset Classification Category System</label>
              <div className="select-wrap">
                <select 
                  value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})}
                >
                  <option value="commercial">Commercial / High-Rise Enterprise</option>
                  <option value="civil">Civil Transport / Substructures</option>
                  <option value="industrial">Industrial Facilities & Logistics</option>
                  <option value="sustainable">Sustainable / Micro-Grid Dev</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Estimated Execution Scope Limit (USD)</label>
              <input 
                type="text" placeholder="e.g., $45M - $60M"
                value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label>Brief Operational Directives & Manifests</label>
              <textarea 
                placeholder="Outline clear project specifications, scheduling coordinates, or spatial dimensions..."
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="checkbox-row">
              <input 
                type="checkbox" id="agree-check" required
                checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})}
              />
              <label htmlFor="agree-check">
                I authorize Petra Holdings to catalog this documentation for the generation of structural evaluation estimates. View our <a href="#privacy">Privacy Directive Policy</a>.
              </label>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-btn">Submit RFP →</button>
              <div className="submit-note">Secure submission protocol | Encrypted Transit</div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Global Office Infrastructure Rows ── */}
      <div className="offices-section">
        <div className="offices-label">Global Offices</div>
        <div className="offices-row">
          {[
            { flag: '🇺🇸', city: 'New York', role: 'HQ & Commercial', addr: 'Petra Holdings Tower, Level 8\n10 Hudson Yards, New York, NY 10001' },
            { flag: '🇬🇧', city: 'London', role: 'European Operations', addr: '22 Bishopsgate, 34th Floor\nLondon, EC2N 4BQ, United Kingdom' },
            { flag: '🇦🇪', city: 'Dubai', role: 'MENA Infrastructure', addr: 'DIFC Gate Building, Suite 412\nDubai International Financial Centre' }
          ].map((o, i) => (
            <Reveal key={i} delay={i + 1}>
              <div className="office-card">
                <div className="office-flag">{o.flag}</div>
                <div className="office-city">{o.city}</div>
                <div className="office-role">{o.role}</div>
                <div className="office-addr">{o.addr}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}