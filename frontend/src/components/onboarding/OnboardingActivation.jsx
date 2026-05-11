import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Check, Copy, Phone, PhoneOff, MessageCircle, RotateCcw, Users, X, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { signupOnboarding, verifyOnboarding, getOnboardingStatus, saveVipNumbers } from '../../api/onboarding.api';
import { OLLIE_WHATSAPP_URL } from '../../config';
import { isValidUKMobile, normaliseToE164 } from '../../lib/utils';

const OLLIE_WA = OLLIE_WHATSAPP_URL;
const SESSION_KEY = 'callguard_onboarding';

const POLL_INTERVAL = 3000;
const POLL_MAX_ATTEMPTS = 15;

function buildTelLink(code) {
  return `tel:${code.replace(/\+/g, '%2B').replace(/#/g, '%23')}`;
}

// ─── Provisioning phase ───────────────────────────────────────────────────────

function ProvisioningPhase() {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 text-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Phone className="w-7 h-7 text-primary" />
        </div>
      </div>
      <div>
        <h2 className="cg-h2 text-text text-xl mb-2">Setting up your account…</h2>
        <p className="cg-body text-muted text-base">This takes just a few seconds</p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            style={{ animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Code row ─────────────────────────────────────────────────────────────────

function CodeRow({ label, code, dialled, onDial }) {
  const [copied, setCopied] = useState(false);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface2 border border-border p-4">
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${dialled ? 'bg-primary' : 'bg-surface border border-border'}`}>
        {dialled ? <Check className="w-4 h-4 text-white" /> : <span className="text-base text-muted font-semibold">•</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base text-muted mb-0.5">{label}</p>
        <p className="text-base font-mono text-text tracking-wide">{code}</p>
      </div>
      <div className="flex gap-2">
        {!isMobile && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text hover:border-primary/30 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
        {isMobile && (
          <a
            href={buildTelLink(code)}
            onClick={onDial}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              dialled ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            {dialled ? 'Dialled' : 'Dial'}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Verify modal ─────────────────────────────────────────────────────────────

function VerifyModal({ isOpen, verifying, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={!verifying ? onCancel : undefined}
      />
      <div className="animate-fade-in relative z-10 w-full max-w-sm glass-card rounded-2xl border border-border p-6 flex flex-col gap-5">
        {!verifying ? (
          <>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center">
                <PhoneOff className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="cg-h2 text-text text-xl leading-snug">
                We're about to call you
              </h3>
              <p className="text-lg font-semibold text-amber-400 leading-relaxed">
                Don't answer it. Let it ring out.
              </p>
              <p className="cg-body text-muted text-md leading-relaxed">
                The missed call will forward to CallGuard and you'll get your first test alert on WhatsApp.
              </p>
            </div>
            <Button
              onClick={onConfirm}
              className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-5 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
            >
              Call me now, I won't answer
            </Button>
            <button
              type="button"
              onClick={onCancel}
              className="cg-label text-base text-muted hover:text-text transition-colors text-center"
            >
              Go back
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="cg-h2 text-text text-lg">Calling you now…</h3>
            <p className="cg-body text-muted text-base leading-relaxed">
              Let it ring, don't pick up. This takes about 15–20 seconds.
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  style={{ animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Activation phase ─────────────────────────────────────────────────────────

function ActivationPhase({ forwardingCode, onVerifyStart, verifying }) {
  const [dialled, setDialled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <h2 className="cg-h2 text-text text-2xl mb-2">Activate missed call forwarding</h2>
       
        <p className="cg-body text-muted text-md leading-relaxed">
          This is standard missed call forwarding, same as voicemail. 
        </p>
      </div>

      {/* Code section */}
      <div className="flex flex-col gap-2">
        <p className="text-base text-muted">Dial the code below from your phone:</p>
        <CodeRow
          label=""
          code={forwardingCode}
          dialled={dialled}
          onDial={() => setDialled(true)}
        />
      </div>

      {/* What this does */}
      <p className="cg-body text-muted text-md leading-relaxed">
        This just forwards missed calls to CallGuard so we can text the customer and send the job details to your WhatsApp.
      </p>

      {/* CTA */}
      <Button
        onClick={() => setShowModal(true)}
        className={`cg-label w-full py-6 text-base rounded-xl shadow-lg transition-all hover:scale-[1.02] ${
          dialled || !isMobile
            ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/25'
            : 'bg-surface2 text-muted border border-border cursor-not-allowed hover:scale-100'
        }`}
        disabled={isMobile && !dialled}
      >
        I've dialled it, verify me
      </Button>

      {/* Fallback */}
      <p className="text-base text-muted text-center leading-relaxed">
        Not sure?{' '}
        <a href={OLLIE_WA} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          Message Ollie directly on WhatsApp
        </a>{' '}
        and he'll walk you through it
      </p>

      <VerifyModal
        isOpen={showModal}
        verifying={verifying}
        onConfirm={onVerifyStart}
        onCancel={() => setShowModal(false)}
      />
      
    </div>
  );
}

// ─── VIP numbers phase ────────────────────────────────────────────────────────

function VipNumbersPhase({ customerId, onComplete, onSkip }) {
  const [entries, setEntries] = useState([{ number: '', label: '' }]);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const addEntry = () => setEntries((prev) => [...prev, { number: '', label: '' }]);

  const removeEntry = (i) => {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
    setErrors((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateEntry = (i, field, value) => {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
    if (field === 'number') {
      setErrors((prev) => prev.map((e, idx) => (idx === i ? null : e)));
    }
  };

  const handleSave = async () => {
    const filled = entries.filter((e) => e.number.trim());
    if (filled.length === 0) {
      onSkip();
      return;
    }
    const newErrors = entries.map((e) => {
      if (!e.number.trim()) return null;
      return isValidUKMobile(e.number) ? null : 'Invalid UK mobile number';
    });
    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    const vipNumbers = filled.map((e) => ({
      number: normaliseToE164(e.number),
      label: e.label.trim(),
    }));
    try {
      await saveVipNumbers({ customerId, vipNumbers });
    } catch (_) {
      // Best-effort
    } finally {
      setSaving(false);
      onComplete();
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h2 className="cg-h2 text-text text-xl mb-2">Who should skip the auto-reply?</h2>
        <p className="cg-body text-muted text-base leading-relaxed">
          Add numbers for your partner, colleagues, or anyone who shouldn't get the triage text when they call you.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="07911 123 456"
                value={entry.number}
                onChange={(e) => updateEntry(i, 'number', e.target.value)}
                inputMode="tel"
                className="flex-1 h-10 rounded-lg bg-surface2 border border-border text-text placeholder:text-muted px-3 text-base focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="e.g. Wife, Dave"
                value={entry.label}
                onChange={(e) => updateEntry(i, 'label', e.target.value)}
                className="w-28 h-10 rounded-lg bg-surface2 border border-border text-text placeholder:text-muted px-3 text-base focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(i)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors[i] && <p className="text-base text-red-400">{errors[i]}</p>}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="cg-label text-base text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 w-fit"
      >
        <Plus className="w-3.5 h-3.5" />
        Add another
      </button>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-70"
      >
        {saving ? 'Saving…' : 'Save and finish'}
      </Button>

      <button
        type="button"
        onClick={onSkip}
        className="cg-label inline-flex items-center gap-1 text-md text-muted hover:text-text transition-colors mx-auto"
      >
        Skip for now
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <p className="text-base text-muted/60 text-center">
        You can always add or change these later.
      </p>
    </div>
  );
}

// ─── Success phase ─────────────────────────────────────────────────────────────

function SuccessPhase({ businessName }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.1, y: 0.6 }, angle: 60, colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#FFFFFF'] });
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.9, y: 0.6 }, angle: 120, colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#FFFFFF'] });
      setTimeout(() => {
        confetti({ particleCount: 40, spread: 50, origin: { x: 0.15, y: 0.65 }, angle: 55, colors: ['#2563EB', '#3B82F6', '#60A5FA', '#FFFFFF'] });
        confetti({ particleCount: 40, spread: 50, origin: { x: 0.85, y: 0.65 }, angle: 125, colors: ['#2563EB', '#3B82F6', '#60A5FA', '#FFFFFF'] });
      }, 300);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 text-center py-8">
      <div className="w-20 h-20 rounded-full bg-[#00a8843d] flex items-center justify-center">
        <Check className="w-10 h-10 text-[#00a884]" />
      </div>
      <div>
        <h2 className="cg-h2 text-text text-2xl mb-3">You're live.</h2>
        <p className="cg-body text-muted text-base leading-relaxed max-w-xs mx-auto">
          CallGuard is now watching every call for{' '}
          <span className="text-text font-medium">{businessName}</span>. Miss a call — we've got it.
        </p>
      </div>
      <div className="glass-card rounded-2xl p-5 w-full border border-primary/20 text-left space-y-3">
        {['Missed call SMS triage — active', 'WhatsApp job alerts — active', 'Weekly missed-call report — active'].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-black" />
            </div>
            <p className="text-base text-text">{item}</p>
          </div>
        ))}
      </div>
      <a
        href={OLLIE_WA}
        target="_blank"
        rel="noopener noreferrer"
        className="cg-label inline-flex items-center gap-2 text-base text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Message Ollie on WhatsApp
      </a>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }) {
  return (
    <div className="animate-fade-in text-center">
      <div className="glass-card rounded-2xl p-8">
        <p className="cg-label text-text text-base mb-2">Something went wrong</p>
        <p className="cg-body text-muted text-base mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <Button onClick={onRetry} className="cg-label w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-5">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <a href={OLLIE_WA} target="_blank" rel="noopener noreferrer" className="cg-label text-base text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
            Or message Ollie on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── OnboardingActivation (main export) ───────────────────────────────────────

export default function OnboardingActivation({
  contactName,
  businessName,
  mobileNumber,
  whatsappNumber,
  jobValueLow = 150,
  jobValueHigh = 400,
  onPhaseChange,
}) {
  const [phase, setPhase] = useState('provisioning');
  const [provisionData, setProvisionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Session restore ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phase && parsed.provisionData) {
          // Old session format used forwardingCodes (object) — clear and re-provision
          if (!parsed.provisionData.forwardingCode && parsed.provisionData.forwardingCodes) {
            sessionStorage.removeItem(SESSION_KEY);
            provision();
            return;
          }
          setProvisionData(parsed.provisionData);
          setPhase(parsed.phase);
          return;
        }
      }
    } catch (_) {}
    provision();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveSession = useCallback((nextPhase, data) => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ phase: nextPhase, provisionData: data }));
    } catch (_) {}
  }, []);

  // ── Provisioning API call ────────────────────────────────────────────────
  const provision = useCallback(async () => {
    setPhase('provisioning');
    setErrorMsg('');
    try {
      const data = await signupOnboarding({
        contactName,
        businessName,
        whatsappNumber: whatsappNumber || mobileNumber,
        alertChannel: 'whatsapp',
        jobValueLow,
        jobValueHigh,
      });
      if (!mountedRef.current) return;
      setProvisionData(data);
      saveSession('activation', data);
      setPhase('activation');
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[Onboarding] provision error:', err);
      setErrorMsg(err.message || 'Could not set up your account. Please try again.');
      setPhase('error');
    }
  }, [contactName, businessName, mobileNumber, whatsappNumber, jobValueLow, jobValueHigh, saveSession]);

  // ── Verification ─────────────────────────────────────────────────────────
  const [verifying, setVerifying] = useState(false);
  const pollCountRef = useRef(0);
  const pollRef = useRef(null);

  const handleVerifyStart = useCallback(async () => {
    setVerifying(true);
    pollCountRef.current = 0;

    try {
      await verifyOnboarding({ customerId: provisionData?.customerId });
    } catch (_) {
      // Non-fatal — continue polling
    }

    pollRef.current = setInterval(async () => {
      if (!mountedRef.current) { clearInterval(pollRef.current); return; }
      pollCountRef.current += 1;

      if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
        clearInterval(pollRef.current);
        setVerifying(false);
        setErrorMsg("We couldn't confirm your forwarding codes. Please try again or message Ollie.");
        setPhase('error');
        return;
      }

      try {
        const data = await getOnboardingStatus(provisionData?.customerId);
        if (data.status === 'verified') {
          clearInterval(pollRef.current);
          saveSession('vip', provisionData);
          setPhase('vip');
        }
      } catch (_) {
        // Continue polling
      }
    }, POLL_INTERVAL);
  }, [provisionData, saveSession]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  // ── VIP complete / skip ───────────────────────────────────────────────────
  const handleVipDone = useCallback(() => {
    saveSession('success', provisionData);
    setPhase('success');
  }, [provisionData, saveSession]);

  // ── Retry ─────────────────────────────────────────────────────────────────
  const handleRetry = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
    provision();
  };

  return (
    <div className="w-full">
      {phase === 'provisioning' && <ProvisioningPhase />}
      {phase === 'activation' && provisionData && (
        <ActivationPhase
          forwardingNumber={provisionData.forwardingNumber}
          forwardingCode={provisionData.forwardingCode}
          deactivationCode={provisionData.deactivationCode}
          onVerifyStart={handleVerifyStart}
          verifying={verifying}
        />
      )}
      {phase === 'vip' && (
        <VipNumbersPhase
          customerId={provisionData?.customerId}
          onComplete={handleVipDone}
          onSkip={handleVipDone}
        />
      )}
      {phase === 'success' && <SuccessPhase businessName={businessName} />}
      {phase === 'error' && <ErrorState message={errorMsg} onRetry={handleRetry} />}
    </div>
  );
}
