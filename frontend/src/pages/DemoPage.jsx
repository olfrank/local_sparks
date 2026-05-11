import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { startDemo, getDemoStatus } from '../api/demo.api';
import { SUPPORT_WHATSAPP_URL } from '../config';
import { isValidUKMobile } from '../lib/utils';
import { SMSConversation, WhatsAppConversation } from '../components/demo/DemoConversations';
import { DemoPhoneMockupPreview, DemoStepStrip, PhoneFrame } from '../components/demo/DemoPhoneDisplay';

const SUPPORT_WA = SUPPORT_WHATSAPP_URL;
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT_MS = 6 * 60 * 1000;
const FALLBACK_DELAY_MS = 15000;
const RESEND_COOLDOWN_MS = 30000;
const MAX_RESENDS = 2;

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
      const data = await getDemoStatus(demoId);
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
      await startDemo(formData);
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
        const data = await getDemoStatus(demoId);
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
      const data = await startDemo(form);
      console.log('[Demo] start parsed:', data);
      if (!data.success || !data.demoId) throw new Error('Unexpected response shape');
      setFormData(form);
      setDemoId(data.demoId);
      setStage(2);
    } catch (err) {
      console.error('[Demo] submit error:', err);
      if (err.status === 409) {
        setApiError("Looks like you've already got a demo running, check your phone for the SMS");
        return;
      }
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
