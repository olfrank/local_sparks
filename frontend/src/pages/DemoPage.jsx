import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, RotateCcw, PhoneIncoming, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const API_BASE = process.env.REACT_APP_DEMO_API_URL || 'http://localhost:8000';
const SUPPORT_WA = process.env.REACT_APP_SUPPORT_WHATSAPP || 'https://wa.me/447901837771';
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT_MS = 6 * 60 * 1000;
const FALLBACK_DELAY_MS = 15000;
const RESEND_COOLDOWN_MS = 30000;
const MAX_RESENDS = 2;

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
        <div className="px-3 pb-0" style={{ minHeight: '430px' }}>
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

// ─── Demo phone mockup preview ───────────────────────────────────────────────

function DemoPhoneMockupPreview() {
  return (
    <div className="relative opacity-80">
      <PhoneFrame floating>
        {/* WA header */}
        <div
          className="flex items-center gap-2.5 px-2 py-2.5 -mx-3 -mt-1"
          style={{ background: '#1f2c34' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#aebac1">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <img
            src="/CallGuard_logo_mark.png"
            alt=""
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-tight" style={{ color: '#e9edef' }}>
              CallGuard 360
            </p>
            <p className="text-[9px] leading-tight" style={{ color: '#8696a0' }}>
              online
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div
          className="-mx-3 px-2 pt-3 pb-2"
          style={{ background: '#0b141a', minHeight: '360px' }}
        >
          {/* Sample alert bubble */}
          <div
            className="rounded-lg rounded-tl-none px-3 pt-2.5 pb-1.5 text-[11px] leading-relaxed relative"
            style={{ background: '#202c33', maxWidth: '95%', color: '#e9edef' }}
          >
            <div
              className="absolute"
              style={{
                top: 0, left: '-7px',
                width: 0, height: 0,
                borderTop: '8px solid #202c33',
                borderLeft: '8px solid transparent',
              }}
            />
            <p className="font-semibold text-[11px] mb-1.5" style={{ color: '#00a884' }}>
              MISSED CALL ENQUIRY – URGENT
            </p>
            <p className="mb-0.5 select-none" style={{ color: '#00a884', textDecoration: 'underline', filter: 'blur(3px)' }}>
              07911 123 456
            </p>
            <p className="mb-0.5 select-none" style={{ filter: 'blur(3px)' }}>📍 SW11 2AB</p>
            <p className="mb-2 select-none" style={{ filter: 'blur(3px)' }}>💬 Total power cut, no lights, need someone ASAP</p>
            <p
              className="text-[9px] pb-0.5 select-none"
              style={{ color: '#8696a0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', filter: 'blur(2.5px)' }}
            >
              This message was sent because the caller requested contact from your business.
            </p>
            <div className="flex justify-end mt-0.5">
              <span className="text-[9px]" style={{ color: '#8696a0' }}>09:41</span>
            </div>
          </div>
        </div>
      </PhoneFrame>

      {/* Overlay hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center">
        <span className="text-[11px] text-white/50 bg-ink/70 backdrop-blur-sm rounded-full px-3 py-1 leading-snug">
          Enter your details to see this live ↑
        </span>
      </div>
    </div>
  );
}

// ─── Demo step strip ─────────────────────────────────────────────────────────

const DEMO_STEPS = [
  {
    Icon: PhoneIncoming,
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.12)',
    label: 'Enter your number',
    sub: 'Takes 10 seconds',
  },
  {
    Icon: CornerDownLeft,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    label: 'Reply to the SMS',
    sub: 'From your phone',
  },
  {
    Icon: MessageCircle,
    color: '#00A884',
    bg: 'rgba(0,168,132,0.12)',
    label: 'See your alert',
    sub: 'Instant WhatsApp delivery',
  },
];

function DemoStepStrip() {
  return (
    <div className="mb-2">
      <div className="flex items-start justify-center gap-1.5 sm:gap-2">
        {DEMO_STEPS.map(({ Icon, color, bg, label, sub }, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0 max-w-[90px]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={1.75} />
              </div>
              <p className="text-[11px] font-medium text-text/80 text-center leading-tight">{label}</p>
              <p className="hidden sm:block text-[10px] text-muted/55 text-center leading-tight">{sub}</p>
            </div>
            {i < DEMO_STEPS.length - 1 && (
              <span className="flex-shrink-0 text-muted/35 text-base mt-2.5">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-[11px] text-muted/50 mt-3">
        30 seconds. Nothing to install.
      </p>
    </div>
  );
}

// ─── SMS conversation ─────────────────────────────────────────────────────────

function SMSConversation({ contactName, businessName, customerReply, showReply }) {
  const triageText = `Hi, it's ${contactName} from ${businessName}. 👋 \n\n Sorry I missed you, I'm on a job right now. \n\n Text me what you need, postcode, and if it's urgent, today, or a quote. \n\n For example: 'urgent, plug socket sparking, SW11 1AB'. \n\n I'll get back to you as soon as I'm free! 🔨`;

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
  // Current time for the message timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="font-system flex flex-col" style={{ height: '100%' }}>
      {/* WhatsApp header — dark teal bar */}
      <div
        className="flex items-center gap-2.5 px-2 py-2.5 -mx-3 -mt-1 mb-0"
        style={{ background: '#1f2c34' }}
      >
        {/* Back arrow */}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#aebac1">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        {/* Avatar */}
        <img
          src='/CallGuard_logo_mark.png'
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
          style={{fontSize: '10px', letterSpacing: '0.02em' }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight" style={{ color: '#e9edef' }}>
            CallGuard 360
          </p>
          <p className="text-[9px] leading-tight" style={{ color: '#8696a0' }}>
            CallGuard 360
          </p>
        </div>
        {/* Icons */}
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>

      {/* Chat background */}
      <div
        className="-mx-3 flex-1 px-2 pt-3 pb-2"
        style={{ background: '#0b141a', minHeight: '340px' }}
      >
        {loading ? (
          <div className="flex justify-center pt-10">
            <div className="flex items-center gap-1.5">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{
                    width: '7px', height: '7px',
                    background: '#00a884',
                    opacity: 0.7,
                    animation: `pulseDot 1.2s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-slide-in-up" style={{ animationDuration: '0.4s' }}>
            {/* Message bubble — matches real WA dark theme */}
            <div
              className="rounded-lg rounded-tl-none px-3 pt-2.5 pb-1.5 text-[11px] leading-relaxed relative"
              style={{
                background: '#202c33',
                maxWidth: '95%',
                color: '#e9edef',
              }}
            >
              {/* Tail */}
              <div
                className="absolute"
                style={{
                  top: 0, left: '-7px',
                  width: 0, height: 0,
                  borderTop: '8px solid #202c33',
                  borderLeft: '8px solid transparent',
                }}
              />

              <p
                className="font-semibold text-[11px] mb-1.5"
                style={{ color: '#00a884' }}
              >
                MISSED CALL ENQUIRY – {urgency?.toUpperCase() || 'NEW ENQUIRY'}
              </p>

              <p className="mb-0.5" style={{ color: '#00a884', textDecoration: 'underline' }}>
                {phoneNumber || '—'}
              </p>
              <p className="mb-0.5" style={{ color: '#e9edef' }}>
                📍 {postcode || '—'}
              </p>
              <p className="mb-2" style={{ color: '#e9edef' }}>
                💬 {summary || '—'}
              </p>

              <p
                className="text-[9px] leading-relaxed pb-0.5"
                style={{ color: '#8696a0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}
              >
                This message was sent because the caller requested contact from your business.
              </p>

              {/* Time + ticks */}
              <div className="flex justify-end items-center gap-1 mt-0.5">
                <span className="text-[9px]" style={{ color: '#8696a0' }}>{timeStr}</span>
                {/* Blue double tick */}
                {/* <svg viewBox="0 0 18 11" width="14" height="9" fill="none">
                  <path d="M1 5.5L5.5 10L17 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 5.5L10.5 10L17 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        className="-mx-3 flex items-center gap-2 px-2 py-2"
        style={{ background: '#1f2c34' }}
      >
        <div
          className="flex-1 rounded-full px-3 py-1.5 text-[10px]"
          style={{ background: '#2a3942', color: '#8696a0' }}
        >
          Message
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#00a884' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
            <path d="M12 15.5a3.5 3.5 0 01-3.5-3.5H7a5 5 0 0010 0h-1.5A3.5 3.5 0 0112 15.5zm0-13C6.48 2.5 2 6.98 2 12.5c0 2.42.87 4.64 2.3 6.37L3 21.5l2.88-1.25A9.43 9.43 0 0012 22.5c5.52 0 10-4.48 10-10S17.52 2.5 12 2.5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Stage 1: input form ──────────────────────────────────────────────────────

function Stage1Form({ onSubmit, loading, apiError, initialValues }) {
  const mobileRef = useRef(null);
  const [form, setForm] = useState({
    contactName: initialValues?.contactName || '',
    businessName: initialValues?.businessName || '',
    mobileNumber: initialValues?.mobileNumber || '',
  });
  const [errors, setErrors] = useState({});

  // Auto-focus mobile field when pre-filled (retry flow)
  useEffect(() => {
    if (initialValues?.focusMobile) {
      mobileRef.current?.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="mb-6 text-center lg:text-left">
        <h1 className="cg-h1 text-h1 md:text-h1-lg text-text text-center mb-3 leading-tight">
          Try it with your real number
        </h1>
        <p className="cg-body text-base text-muted text-center leading-relaxed">
          Enter your details and we'll show you exactly what your customers experience when they can't reach you.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
        {/* Form column */}
        <div>
          <DemoStepStrip />

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
              <p className="mt-1.5 text-base text-red-400 leading-snug">{errors.contactName}</p>
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
              <p className="mt-1.5 text-base text-red-400 leading-snug">{errors.businessName}</p>
            )}
          </div>

          <div>
            <Input
              type="tel"
              placeholder="07xxx xxx xxx"
              ref={mobileRef}
              value={form.mobileNumber}
              onChange={update('mobileNumber')}
              inputMode="tel"
              autoComplete="tel"
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${
                errors.mobileNumber ? 'border-red-500/60 focus-visible:ring-red-500/30' : ''
              }`}
            />
            {errors.mobileNumber && (
              <p className="mt-1.5 text-base text-red-400 leading-snug">{errors.mobileNumber}</p>
            )}
          </div>

          {apiError && (
            <p className="text-base text-red-400 text-center leading-snug">{apiError}</p>
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
              'Try it with my number'
            )}
          </Button>

          <p className="text-center text-muted text-base pt-1">
            One SMS. No signup. Takes 20 seconds.
          </p>

            </form>
          </div>

          {/* Mobile flow line — only shown below form on small screens */}
          <p className="lg:hidden mt-5 text-center text-base text-muted/50 leading-relaxed">
            Missed call → SMS sent → WhatsApp alert. See it happen live.
          </p>
        </div>

        {/* Mockup preview — desktop only */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <DemoPhoneMockupPreview />
        </div>
      </div>
    </div>
  );
}

// ─── Stage 2: SMS sent, waiting for reply ─────────────────────────────────────

function Stage2Waiting({ demoId, contactName, businessName, formData, onComplete, onTimeout, onRetryNumber }) {
  const [customerReply, setCustomerReply] = useState('');
  const [showReply, setShowReply] = useState(false);
  const pollRef = useRef(null);
  const startRef = useRef(Date.now());
  const doneRef = useRef(false);

  // Fallback state
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [fallbackExpanded, setFallbackExpanded] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendConfirmed, setResendConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const fallbackTimerRef = useRef(null);
  const cooldownTimerRef = useRef(null);

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
      console.log('[Demo] stage2 poll:', JSON.stringify(data));
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
    // Show fallback after delay, but only if not already complete
    fallbackTimerRef.current = setTimeout(() => {
      if (!doneRef.current) setFallbackVisible(true);
    }, FALLBACK_DELAY_MS);
    return () => {
      clearInterval(pollRef.current);
      clearTimeout(fallbackTimerRef.current);
      clearTimeout(cooldownTimerRef.current);
    };
  }, [poll]);

  const handleResend = async () => {
    if (resendLoading || resendCooldown || resendCount >= MAX_RESENDS || !formData) return;
    setResendLoading(true);
    setResendConfirmed(false);
    try {
      await fetch(`${API_BASE}/api/demo/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (_) {
      // Best-effort — show confirmed regardless
    } finally {
      setResendLoading(false);
      setResendConfirmed(true);
      setResendCount((c) => c + 1);
      setResendCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setResendCooldown(false);
        setResendConfirmed(false);
      }, RESEND_COOLDOWN_MS);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center gap-8">
      <PhoneFrame floating>
        <SMSConversation
          contactName={contactName}
          businessName={businessName}
          customerReply={customerReply}
          showReply={showReply}
        />
      </PhoneFrame>

      <p
        className="cg-body text-center text-muted text-base leading-relaxed"
        style={{ maxWidth: '280px' }}
      >
        Check your phone, you've just received an SMS. Reply to it with a job description and
        postcode, to continue the demo.
      </p>

      {/* Fallback — fades in after FALLBACK_DELAY_MS */}
      <div
        className="w-full text-center"
        style={{
          maxWidth: '280px',
          opacity: fallbackVisible ? 1 : 0,
          transition: 'opacity 500ms ease',
          pointerEvents: fallbackVisible ? 'auto' : 'none',
        }}
      >
        {!fallbackExpanded ? (
          <button
            onClick={() => setFallbackExpanded(true)}
            className="text-[13px] text-muted hover:text-text transition-colors underline underline-offset-4"
          >
            Didn't get the text?
          </button>
        ) : (
          <div
            className="glass-card rounded-xl p-4 text-left space-y-3"
            style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
          >
            {/* Option 1: Resend */}
            {resendCount < MAX_RESENDS && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-base text-muted leading-snug">Send it again</span>
                {resendConfirmed ? (
                  <span className="text-base text-green-400 font-medium">Sent ✓</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || resendCooldown}
                    className="text-base border border-border rounded-lg px-3 py-1.5 text-text hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {resendLoading ? 'Sending…' : 'Send it again'}
                  </button>
                )}
              </div>
            )}

            {/* Option 2: Different number */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-base text-muted leading-snug">Wrong number?</span>
              <button
                onClick={onRetryNumber}
                className="text-base border border-border rounded-lg px-3 py-1.5 text-text hover:border-primary/50 hover:text-primary transition-colors shrink-0"
              >
                Try a different number
              </button>
            </div>

            {/* WhatsApp fallback */}
            <p className="text-[11px] text-muted/60 leading-relaxed pt-1 border-t border-border">
              Some networks delay automated texts by a minute or two. If it still hasn't arrived,{' '}
              <a
                href={SUPPORT_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-muted transition-colors"
              >
                drop me a message on WhatsApp
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Weekly report card ───────────────────────────────────────────────────────

function WeeklyReportCard({ businessName, postcode, summary, customerReply }) {
  // Current week Monday → Sunday
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMon = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const dateRange = `${fmt(monday)} – ${fmt(sunday)}`;
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const hasReply = postcode || summary || customerReply;

  // WhatsApp message body as plain text lines — matches the real screenshot format
  const msgLines = [
    { text: `CallGuard Weekly Report — ${businessName || 'Your Business'} (${dateRange})`, bold: true },
    { text: '' },
    { text: '6 enquiries recovered this week — 5 more than last week.' },
    { text: '' },
    { text: '📋 What came in', bold: true },
    { text: '• New enquiries: 6' },
    { text: '• Customers who replied: 3 (50%)' },
    { text: '' },
    { text: '💰 Value protected', bold: true },
    { text: '• Opportunities recovered: 2' },
    { text: '• Estimated recovered value: £300–£600' },
    { text: '' },
    { text: '⚡ Response speed', bold: true },
    { text: '• Time to alert you: 14s' },
    { text: '• Customer response time: 56s' },
    { text: '' },
    { text: '🔥 Urgency this week', bold: true },
    { text: 'Needed Today 33% • Quote 17% • Soon 17% • Emergency 17%' },
    { text: '' },
    { text: '📍 Busiest missed window', bold: true },
    { text: 'Thu 20:00–22:00' },
    { text: '' },
    { text: 'CallGuard has protected 16 enquiries since you started.' },
  ];

  return (
    <div className="w-full font-system">
      {/* Gap */}
      <div style={{ height: '88px' }} />

      <div className="text-center mb-6">
        <p className="cg-h2 text-xl md:text-2xl text-text leading-snug">
          After 7 days, you'll know exactly what you've been missing
        </p>
      </div>

      {/* Phone frame — identical to Stage 3 */}
      <PhoneFrame floating={false}>
        <div className="flex flex-col" style={{ height: '100%' }}>
          {/* WhatsApp header — identical colours */}
          <div
            className="flex items-center gap-2.5 px-2 py-2.5 -mx-3 -mt-1 mb-0"
            style={{ background: '#1f2c34' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#aebac1">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            <img src="/CallGuard_logo_mark.png" alt="" className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight" style={{ color: '#e9edef' }}>CallGuard 360</p>
              <p className="text-[9px] leading-tight" style={{ color: '#8696a0' }}>CallGuard 360</p>
            </div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
          </div>

          {/* Chat background */}
          <div
            className="-mx-3 px-2 pt-3 pb-2 overflow-y-auto"
            style={{ background: '#0b141a', minHeight: '340px' }}
          >
            {/* Message bubble */}
            <div
              className="rounded-lg rounded-tl-none px-3 pt-2.5 pb-1.5 relative"
              style={{ background: '#202c33', maxWidth: '97%' }}
            >
              {/* Tail */}
              <div className="absolute" style={{ top: 0, left: '-7px', width: 0, height: 0, borderTop: '8px solid #202c33', borderLeft: '8px solid transparent' }} />

              {/* Message lines */}
              <div className="space-y-0" style={{ lineHeight: '1.55' }}>
                {msgLines.map((line, i) =>
                  line.text === '' ? (
                    <div key={i} style={{ height: '6px' }} />
                  ) : (
                    <p
                      key={i}
                      className="text-[11px]"
                      style={{
                        color: line.bold ? '#e9edef' : '#d1d7db',
                        fontWeight: line.bold ? 600 : 400,
                      }}
                    >
                      {line.text}
                    </p>
                  )
                )}
              </div>

              {/* Time + ticks */}
              <div className="flex justify-end items-center gap-1 mt-1.5">
                <span className="text-[9px]" style={{ color: '#8696a0' }}>{timeStr}</span>
                <svg viewBox="0 0 18 11" width="14" height="9" fill="none">
                  <path d="M1 5.5L5.5 10L17 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 5.5L10.5 10L17 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="-mx-3 flex items-center gap-2 px-2 py-2" style={{ background: '#1f2c34' }}>
            <div className="flex-1 rounded-full px-3 py-1.5 text-[10px]" style={{ background: '#2a3942', color: '#8696a0' }}>
              Message
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: '#00a884' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                <path d="M12 15.5a3.5 3.5 0 01-3.5-3.5H7a5 5 0 0010 0h-1.5A3.5 3.5 0 0112 15.5zm0-13C6.48 2.5 2 6.98 2 12.5c0 2.42.87 4.64 2.3 6.37L3 21.5l2.88-1.25A9.43 9.43 0 0012 22.5c5.52 0 10-4.48 10-10S17.52 2.5 12 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </PhoneFrame>

      {/* Footer */}
      <p className="cg-body text-center text-base leading-relaxed mt-6" style={{ color: '#8696a0' }}>
        Delivered to your WhatsApp every Monday morning. Automatically.
      </p>
      <div className="text-center mt-3 mb-2">
        <a
          href="#demo-cta"
          className="text-base transition-colors"
          style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('demo-cta')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        >
          Start your free 30 day trial ↑
        </a>
      </div>
    </div>
  );
}

// ─── Stage 3: WhatsApp alert reveal ──────────────────────────────────────────

function Stage3Complete({ demoId, initialData, businessName, customerReply, onActivate }) {
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
        console.log('[Demo] stage3 poll:', JSON.stringify(data));
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
        <div className="animate-fade-in-up w-full">
          <div id="demo-cta" className="text-center">
            <h2 className="cg-h2 text-h1 text-text mb-3 leading-tight">
              That just happened in under 30 seconds.
            </h2>
            <p className="cg-body text-muted text-base mb-8 leading-relaxed">
              Every missed call. Handled automatically. No app needed.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onActivate}
                className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
              >
                Start my free 30 day trial.
              </Button>
              <a
                href="/#contact"
                className="cg-label text-base text-muted hover:text-text transition-colors underline underline-offset-4 block text-center"
              >
                Or book a 5 min fit check
              </a>
            </div>
          </div>

          <WeeklyReportCard
            businessName={businessName}
            postcode={alert?.postcode}
            summary={alert?.summary}
            customerReply={customerReply}
          />
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
        <p className="cg-body text-muted text-base mb-6 leading-relaxed">
          Check your phone for the SMS and reply to continue, or try again.
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
  const navigate = useNavigate();
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
          "Looks like you've already got a demo running, check your phone for the SMS"
        );
        return;
      }
      if (!res.ok) throw new Error('start failed');
      const text = await res.text();
      console.log('[Demo] start status:', res.status, 'body:', text);
      if (!text) throw new Error('empty response body');
      const data = JSON.parse(text);
      console.log('[Demo] start parsed:', data);
      if (!data.success || !data.demoId) throw new Error(`unexpected response shape: ${JSON.stringify(data)}`);
      setFormData(form);
      setDemoId(data.demoId);
      setStage(2);
    } catch (err) {
      console.error('[Demo] submit error:', err);
      setApiError('Something went wrong — try again in a moment');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyReceived = (data) => {
    setStageData(data);
    setStage(3);
  };

  const handleActivate = () => {
    navigate('/onboard', {
      state: {
        contactName: formData?.contactName || '',
        businessName: formData?.businessName || '',
        mobileNumber: formData?.mobileNumber || '',
      },
    });
  };

  const handleTimeout = () => setTimedOut(true);

  const [retryValues, setRetryValues] = useState(null);

  const handleRetryNumber = () => {
    setRetryValues({
      contactName: formData?.contactName || '',
      businessName: formData?.businessName || '',
      mobileNumber: '',
      focusMobile: true,
    });
    setStage(1);
    setDemoId(null);
    setApiError('');
  };

  const handleRestart = () => {
    setStage(1);
    setFormData(null);
    setDemoId(null);
    setStageData(null);
    setTimedOut(false);
    setApiError('');
    setRetryValues(null);
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
          initialValues={retryValues}
        />
      );
    }
    if (stage === 2) {
      return (
        <Stage2Waiting
          demoId={demoId}
          contactName={formData?.contactName}
          businessName={formData?.businessName || 'Your Business'}
          formData={formData}
          onComplete={handleReplyReceived}
          onTimeout={handleTimeout}
          onRetryNumber={handleRetryNumber}
        />
      );
    }
    return (
      <Stage3Complete
        demoId={demoId}
        initialData={stageData}
        businessName={formData?.businessName || 'Your Business'}
        customerReply={stageData?.customerReply || stageData?.reply || ''}
        onActivate={handleActivate}
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

      <div className={`relative z-10 ${stage === 1 ? 'max-w-4xl' : 'max-w-md'} mx-auto px-4 pt-28 pb-24`}>
        {renderStage()}
      </div>
    </main>
  );
}
