import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

function isValidUKMobile(number) {
  const cleaned = number.replace(/[\s\-().]/g, '');
  return /^07\d{9}$/.test(cleaned) || /^\+447\d{9}$/.test(cleaned);
}

function extractAlert(data) {
  if (!data) return null;
  if (data.alert) return data.alert;
  if (data.urgency || data.postcode || data.summary || data.phoneNumber) {
    return {
      urgency: data.urgency,
      postcode: data.postcode,
      summary: data.summary,
      phoneNumber: data.phoneNumber,
    };
  }
  return null;
}

// ─── Phone frame ──────────────────────────────────────────────────────────────

function PhoneFrame({ children, floating = false }) {
  return (
    <div
      className="relative mx-auto select-none"
      style={{
        width: 'min(296px, 82vw)',
        animation: floating ? 'phoneFloat 3s ease-in-out infinite' : 'none',
      }}
    >
      {/* Side buttons (left) */}
      <div
        className="absolute"
        style={{
          left: '-3px', top: '90px',
          width: '3px', height: '26px',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        className="absolute"
        style={{
          left: '-3px', top: '128px',
          width: '3px', height: '44px',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        className="absolute"
        style={{
          left: '-3px', top: '184px',
          width: '3px', height: '44px',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Power button (right) */}
      <div
        className="absolute"
        style={{
          right: '-3px', top: '128px',
          width: '3px', height: '60px',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Outer frame */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: '44px',
          background: 'linear-gradient(160deg, #1c2233 0%, #0d1117 50%, #080c14 100%)',
          border: '2px solid rgba(255,255,255,0.09)',
          boxShadow:
            '0 40px 60px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 1px rgba(255,255,255,0.06) inset, 0 0 60px -20px rgba(37,99,235,0.15)',
        }}
      >
        {/* Dynamic island */}
        <div className="flex justify-center pt-3.5 pb-1">
          <div
            style={{
              width: '88px',
              height: '26px',
              borderRadius: '20px',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          />
        </div>

        {/* Status bar */}
        <div className="flex justify-between items-center text-[10px] font-medium px-5 pb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span style={{ letterSpacing: '0.05em' }}>●●●</span>
            <span className="ml-1">5G</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" className="ml-1 opacity-60">
              <rect x="0" y="4" width="3" height="6" rx="0.5" />
              <rect x="4.5" y="2.5" width="3" height="7.5" rx="0.5" />
              <rect x="9" y="1" width="3" height="9" rx="0.5" />
              <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="px-3 pb-2" style={{ minHeight: '430px' }}>
          {children}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-3">
          <div
            style={{
              width: '96px', height: '4px',
              borderRadius: '99px',
              background: 'rgba(255,255,255,0.18)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── SMS conversation ─────────────────────────────────────────────────────────

function SMSConversation({ businessName, customerReply, showReply }) {
  const triageText = `Hi, it's ${businessName}. Sorry I missed you, I'm on a job right now. Text me what you need, postcode, and if it's urgent, today, or a quote. For example: 'today, consumer unit issue, SW11 1AB'. I'll get back to you as soon as I'm free!`;

  return (
    <div className="font-system">
      {/* Conversation header */}
      <div className="text-center mb-4 pt-1">
        <div
          className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <MessageCircle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.55)' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.80)' }}>
          {businessName}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>
          Text Message
        </p>
        <p className="text-[9px] mt-1.5" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Today 9:41
        </p>
      </div>

      <div className="space-y-2.5">
        {/* Triage SMS from business (received = left) */}
        <div className="flex justify-start animate-fade-in-up">
          <div
            className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed text-white"
            style={{
              maxWidth: '92%',
              background: 'hsl(var(--primary))',
              boxShadow: '0 2px 8px rgba(37,99,235,0.30)',
            }}
          >
            {triageText}
          </div>
        </div>

        {/* Customer reply or pending indicator */}
        {showReply && customerReply ? (
          <div
            className="flex justify-end animate-fade-in-up"
            style={{ animationFillMode: 'backwards', animationDelay: '80ms' }}
          >
            <div
              className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs leading-relaxed"
              style={{
                maxWidth: '85%',
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.11)',
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              {customerReply}
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <div
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl rounded-tr-sm"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {[0, 0.25, 0.5].map((delay, i) => (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: 'rgba(255,255,255,0.40)',
                    animation: `pulseDot 1.4s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WhatsApp conversation ────────────────────────────────────────────────────

function WhatsAppConversation({ urgency, phoneNumber, postcode, summary, loading }) {
  return (
    <div className="font-system">
      {/* WhatsApp header */}
      <div
        className="flex items-center gap-2.5 px-1 py-2 mb-3"
        style={{ borderBottom: '1px solid rgba(37,211,102,0.18)' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shrink-0"
          style={{ background: '#25D366', fontSize: '11px' }}
        >
          CG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">CallGuard</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            online
          </p>
        </div>
        {/* Phone icon (decorative) */}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="rgba(255,255,255,0.25)">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </div>

      {loading ? (
        /* Waiting for alert data */
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: '7px',
                  height: '7px',
                  background: '#25D366',
                  opacity: 0.6,
                  animation: `pulseDot 1.2s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-slide-in-up" style={{ animationDuration: '0.4s' }}>
          {/* Alert bubble */}
          <div
            className="rounded-xl rounded-tl-none px-3.5 py-3 text-xs leading-relaxed"
            style={{
              background: 'rgba(37,211,102,0.12)',
              border: '1px solid rgba(37,211,102,0.20)',
            }}
          >
            <p className="font-bold text-white text-xs mb-2 leading-snug">
              MISSED CALL ENQUIRY — {urgency?.toUpperCase() || 'NEW ENQUIRY'}
            </p>
            <div className="space-y-0.5 text-[11px]" style={{ color: 'rgba(220,252,231,0.88)' }}>
              <p>📞 {phoneNumber || '—'}</p>
              <p>📍 {postcode || '—'}</p>
              <p>💬 {summary || '—'}</p>
            </div>
            <p
              className="text-[9px] mt-2.5 pt-2 leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.28)',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              This message was sent because the caller requested contact from your business.
            </p>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
              ✓✓ delivered
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stage 1: input form ──────────────────────────────────────────────────────

function Stage1Form({ onSubmit, loading, apiError }) {
  const [form, setForm] = useState({
    contactName: '',
    businessName: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.contactName.trim()) e.contactName = 'Please enter your first name';
    if (!form.businessName.trim()) e.businessName = 'Please enter your business name';
    if (!form.mobileNumber.trim()) {
      e.mobileNumber = 'Please enter your mobile number';
    } else if (!isValidUKMobile(form.mobileNumber)) {
      e.mobileNumber = 'Please enter a valid UK mobile number (e.g. 07911 123 456)';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(form);
  };

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="cg-h1 text-h1 md:text-h1-lg text-text mb-3 max-w-sm mx-auto leading-tight">
          See exactly what your customers experience
        </h1>
        <p className="cg-body text-sm md:text-base text-muted max-w-xs mx-auto leading-relaxed">
          Enter your details below. We'll show you the full flow in real time — takes about 30 seconds.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Input
              type="text"
              placeholder="Your first name"
              value={form.contactName}
              onChange={update('contactName')}
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${
                errors.contactName ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''
              }`}
            />
            {errors.contactName && (
              <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.contactName}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="e.g. Smith Electrical"
              value={form.businessName}
              onChange={update('businessName')}
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${
                errors.businessName ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''
              }`}
            />
            {errors.businessName && (
              <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.businessName}</p>
            )}
          </div>

          <div>
            <Input
              type="tel"
              placeholder="07xxx xxx xxx"
              value={form.mobileNumber}
              onChange={update('mobileNumber')}
              inputMode="tel"
              autoComplete="tel"
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${
                errors.mobileNumber ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''
              }`}
            />
            {errors.mobileNumber && (
              <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.mobileNumber}</p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-red-400 text-center leading-snug">{apiError}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                Sending…
              </span>
            ) : (
              'Send me the demo'
            )}
          </Button>

          <p className="text-center text-muted text-xs pt-1">
            We'll send one SMS to this number. That's it.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Stage 2: SMS sent, waiting for reply ─────────────────────────────────────

function Stage2Waiting({ demoId, businessName, onComplete, onTimeout }) {
  const [customerReply, setCustomerReply] = useState('');
  const [showReply, setShowReply] = useState(false);
  const pollRef = useRef(null);
  const startRef = useRef(Date.now());
  const doneRef = useRef(false);

  const poll = useCallback(async () => {
    if (doneRef.current) return;
    if (Date.now() - startRef.current > POLL_TIMEOUT_MS) {
      clearInterval(pollRef.current);
      onTimeout();
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/demo/status/${demoId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 'replied' || data.status === 'complete') {
        doneRef.current = true;
        clearInterval(pollRef.current);
        setCustomerReply(data.customerReply || data.reply || '');
        setShowReply(true);
        setTimeout(() => onComplete(data), 1000);
      }
    } catch (_) {
      // Silently continue on network errors
    }
  }, [demoId, onComplete, onTimeout]);

  useEffect(() => {
    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [poll]);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-8">
      <PhoneFrame floating>
        <SMSConversation
          businessName={businessName}
          customerReply={customerReply}
          showReply={showReply}
        />
      </PhoneFrame>

      <p
        className="cg-body text-center text-muted text-sm leading-relaxed"
        style={{ maxWidth: '280px' }}
      >
        Check your phone — you've just received an SMS. Reply to it with a job description,
        postcode, and urgency to continue the demo.
      </p>
    </div>
  );
}

// ─── Stage 3: WhatsApp alert reveal ──────────────────────────────────────────

function Stage3Complete({ demoId, initialData }) {
  const initialAlert = extractAlert(initialData);
  const [alert, setAlert] = useState(initialAlert);
  const [ctaVisible, setCtaVisible] = useState(false);
  const doneRef = useRef(!!initialAlert);
  const pollRef = useRef(null);

  useEffect(() => {
    if (doneRef.current) {
      const t = setTimeout(() => setCtaVisible(true), 2500);
      return () => clearTimeout(t);
    }

    const poll = async () => {
      if (doneRef.current) return;
      try {
        const res = await fetch(`${API_BASE}/api/demo/status/${demoId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'complete') {
          doneRef.current = true;
          clearInterval(pollRef.current);
          setAlert(extractAlert(data));
          setTimeout(() => setCtaVisible(true), 2500);
        }
      } catch (_) {
        // Silently continue on network errors
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL);
    poll();
    return () => clearInterval(pollRef.current);
  }, [demoId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="animate-fade-in flex flex-col items-center gap-8">
      <PhoneFrame floating={false}>
        <WhatsAppConversation
          urgency={alert?.urgency}
          phoneNumber={alert?.phoneNumber}
          postcode={alert?.postcode}
          summary={alert?.summary}
          loading={!alert}
        />
      </PhoneFrame>

      {ctaVisible && (
        <div className="animate-fade-in-up w-full text-center">
          <h2 className="cg-h2 text-h1 text-text mb-3 leading-tight">
            That just happened in under 30 seconds.
          </h2>
          <p className="cg-body text-muted text-sm md:text-base mb-8 leading-relaxed">
            Every missed call. Handled automatically. No app needed.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/onboarding">
              <Button className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                Start my free 30-day audit
              </Button>
            </Link>
            <a
              href="/#contact"
              className="cg-label text-sm text-muted hover:text-text transition-colors underline underline-offset-4 block text-center"
            >
              Or book a 5-min fit check
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Timeout state ────────────────────────────────────────────────────────────

function TimeoutState({ onRestart }) {
  return (
    <div className="animate-fade-in text-center">
      <div className="glass-card rounded-2xl p-8">
        <MessageCircle className="w-10 h-10 text-muted mx-auto mb-4" />
        <p className="cg-label text-text text-base mb-2">No reply received yet.</p>
        <p className="cg-body text-muted text-sm mb-6 leading-relaxed">
          Check your phone for the SMS and reply to continue — or try again.
        </p>
        <Button
          onClick={onRestart}
          className="cg-label w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-5"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart demo
        </Button>
      </div>
    </div>
  );
}

// ─── DemoPage ─────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState(null);
  const [demoId, setDemoId] = useState(null);
  const [stageData, setStageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [timedOut, setTimedOut] = useState(false);

  const handleFormSubmit = async (form) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${API_BASE}/api/demo/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 409) {
        setApiError(
          "Looks like you've already got a demo running — check your phone for the SMS"
        );
        return;
      }
      if (!res.ok) throw new Error('start failed');
      const data = await res.json();
      if (!data.success || !data.demoId) throw new Error('unexpected response');
      setFormData(form);
      setDemoId(data.demoId);
      setStage(2);
    } catch (_) {
      setApiError('Something went wrong — try again in a moment');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyReceived = (data) => {
    setStageData(data);
    setStage(3);
  };

  const handleTimeout = () => setTimedOut(true);

  const handleRestart = () => {
    setStage(1);
    setFormData(null);
    setDemoId(null);
    setStageData(null);
    setTimedOut(false);
    setApiError('');
  };

  const renderStage = () => {
    if (timedOut && stage === 2) {
      return <TimeoutState onRestart={handleRestart} />;
    }
    if (stage === 1) {
      return (
        <Stage1Form
          onSubmit={handleFormSubmit}
          loading={loading}
          apiError={apiError}
        />
      );
    }
    if (stage === 2) {
      return (
        <Stage2Waiting
          demoId={demoId}
          businessName={formData?.businessName || 'Your Business'}
          onComplete={handleReplyReceived}
          onTimeout={handleTimeout}
        />
      );
    }
    return (
      <Stage3Complete
        demoId={demoId}
        initialData={stageData}
      />
    );
  };

  return (
    <main className="min-h-screen bg-ink relative overflow-x-hidden">
      {/* Subtle radial accent at top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.07), transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-md mx-auto px-4 pt-28 pb-24">
        {renderStage()}
      </div>
    </main>
  );
}
