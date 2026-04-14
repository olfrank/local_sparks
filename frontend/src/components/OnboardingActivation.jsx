import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Copy, Phone, MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

const API_BASE = process.env.REACT_APP_DEMO_API_URL || 'http://localhost:8000';
const OLLIE_WA = process.env.REACT_APP_OLLIE_WHATSAPP || 'https://wa.me/447901837771';
const SESSION_KEY = 'callguard_onboarding';

const POLL_INTERVAL = 3000;
const POLL_MAX_ATTEMPTS = 15;

function buildTelLink(code) {
  return `tel:${code.replace(/\+/g, '%2B').replace(/#/g, '%23')}`;
}

// ─── Provisioning phase ───────────────────────────────────────────────────────

function ProvisioningPhase({ onSuccess, onError }) {
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
        <p className="cg-body text-muted text-sm">This takes just a few seconds</p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            style={{
              animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Code row ─────────────────────────────────────────────────────────────────

function CodeRow({ label, code, dialled, onDial }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface2 border border-border p-4">
      {/* Checkmark or step indicator */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
          dialled ? 'bg-primary' : 'bg-surface border border-border'
        }`}
      >
        {dialled ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs text-muted font-semibold">•</span>
        )}
      </div>

      {/* Label + code */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted mb-0.5">{label}</p>
        <p className="text-sm font-mono text-text tracking-wide">{code}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* Copy button (always shown) */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-lg bg-surface border border-border text-muted hover:text-text hover:border-primary/30 transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Dial button — only on mobile */}
        {isMobile && (
          <a
            href={buildTelLink(code)}
            onClick={onDial}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              dialled
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-primary text-white hover:bg-primary/90'
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

// ─── Activation phase ─────────────────────────────────────────────────────────

function ActivationPhase({ forwardingNumber, forwardingCodes, onVerifyStart }) {
  const [dialled, setDialled] = useState({ noAnswer: false, unreachable: false, busy: false });
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const allDialled = dialled.noAnswer && dialled.unreachable && dialled.busy;

  const codes = [
    { key: 'noAnswer', label: 'When you don\'t answer', code: forwardingCodes.noAnswer },
    { key: 'unreachable', label: 'When your phone is off / no signal', code: forwardingCodes.unreachable },
    { key: 'busy', label: 'When you\'re on another call', code: forwardingCodes.busy },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <h2 className="cg-h2 text-text text-xl mb-2">Activate call forwarding</h2>
        <p className="cg-body text-muted text-sm leading-relaxed">
          {isMobile
            ? 'Tap each button to dial the codes from your mobile — takes under 60 seconds.'
            : 'Dial each code below from your mobile phone to switch on call forwarding.'}
        </p>
      </div>

      {/* Forwarding number info */}
      <div className="rounded-xl bg-surface2 border border-border p-4 text-center">
        <p className="text-xs text-muted mb-1">Your CallGuard forwarding number</p>
        <p className="text-base font-semibold text-text tracking-wide">{forwardingNumber}</p>
      </div>

      {/* Code rows */}
      <div className="flex flex-col gap-3">
        {codes.map(({ key, label, code }) => (
          <CodeRow
            key={key}
            label={label}
            code={code}
            dialled={dialled[key]}
            onDial={() => setDialled((prev) => ({ ...prev, [key]: true }))}
          />
        ))}
      </div>

      {/* Confirm button */}
      <Button
        onClick={onVerifyStart}
        className={`cg-label w-full py-6 text-base rounded-xl shadow-lg transition-all hover:scale-[1.02] ${
          allDialled
            ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/25'
            : 'bg-surface2 text-muted border border-border cursor-not-allowed hover:scale-100'
        }`}
        disabled={!allDialled}
      >
        {allDialled ? "I've dialled all three — verify me" : `Dial all 3 codes to continue`}
      </Button>

      {!isMobile && (
        <p className="text-xs text-muted text-center leading-relaxed">
          Need to do this on your phone?{' '}
          <a href={OLLIE_WA} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
            Message Ollie on WhatsApp
          </a>{' '}
          and he'll walk you through it.
        </p>
      )}
    </div>
  );
}

// ─── Success phase ─────────────────────────────────────────────────────────────

function SuccessPhase({ businessName }) {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 text-center py-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="cg-h2 text-text text-2xl mb-3">You're live.</h2>
        <p className="cg-body text-muted text-sm leading-relaxed max-w-xs mx-auto">
          CallGuard is now watching every call for{' '}
          <span className="text-text font-medium">{businessName}</span>. Miss a call — we've got it.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 w-full border border-primary/20 text-left space-y-3">
        {[
          'Missed call SMS triage — active',
          'WhatsApp job alerts — active',
          'Weekly missed-call report — active',
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm text-text">{item}</p>
          </div>
        ))}
      </div>

      <a
        href={OLLIE_WA}
        target="_blank"
        rel="noopener noreferrer"
        className="cg-label inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
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
        <p className="cg-body text-muted text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onRetry}
            className="cg-label w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-5"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <a
            href={OLLIE_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="cg-label text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            Or message Ollie on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── OnboardingActivation (main export) ───────────────────────────────────────

export default function OnboardingActivation({ contactName, businessName, mobileNumber }) {
  const [phase, setPhase] = useState('provisioning');
  const [provisionData, setProvisionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const mountedRef = useRef(true);

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
          setProvisionData(parsed.provisionData);
          setPhase(parsed.phase);
          return;
        }
      }
    } catch (_) {}
    // No saved session — start provisioning
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
      const res = await fetch(`${API_BASE}/api/onboarding/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          businessName,
          whatsappNumber: mobileNumber,
          alertChannel: 'whatsapp',
          jobValueLow: 150,
          jobValueHigh: 400,
        }),
      });
      if (!mountedRef.current) return;
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (_) { throw new Error('Invalid response from server'); }
      if (!res.ok || !data.success) {
        throw new Error(data?.error || `Server error (${res.status})`);
      }
      setProvisionData(data);
      saveSession('activation', data);
      setPhase('activation');
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[Onboarding] provision error:', err);
      setErrorMsg(err.message || 'Could not set up your account. Please try again.');
      setPhase('error');
    }
  }, [contactName, businessName, mobileNumber, saveSession]);

  // ── Verification ─────────────────────────────────────────────────────────
  const [verifying, setVerifying] = useState(false);
  const pollCountRef = useRef(0);
  const pollRef = useRef(null);

  const handleVerifyStart = useCallback(async () => {
    setVerifying(true);
    pollCountRef.current = 0;

    // POST to verify endpoint
    try {
      await fetch(`${API_BASE}/api/onboarding/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: provisionData?.customerId }),
      });
    } catch (_) {
      // Non-fatal — continue polling
    }

    // Poll for status
    pollRef.current = setInterval(async () => {
      if (!mountedRef.current) { clearInterval(pollRef.current); return; }
      pollCountRef.current += 1;

      if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
        clearInterval(pollRef.current);
        setVerifying(false);
        setErrorMsg('We couldn\'t confirm your forwarding codes. Please try again or message Ollie.');
        setPhase('error');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/onboarding/status/${provisionData?.customerId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'active') {
          clearInterval(pollRef.current);
          saveSession('success', provisionData);
          setPhase('success');
        }
      } catch (_) {
        // Continue polling
      }
    }, POLL_INTERVAL);
  }, [provisionData, saveSession]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  const handleRetry = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
    provision();
  };

  return (
    <div className="w-full">
      {phase === 'provisioning' && (
        <ProvisioningPhase />
      )}
      {phase === 'activation' && provisionData && (
        <ActivationPhase
          forwardingNumber={provisionData.forwardingNumber}
          forwardingCodes={provisionData.forwardingCodes}
          onVerifyStart={handleVerifyStart}
          verifying={verifying}
        />
      )}
      {phase === 'success' && (
        <SuccessPhase businessName={businessName} />
      )}
      {phase === 'error' && (
        <ErrorState message={errorMsg} onRetry={handleRetry} />
      )}
    </div>
  );
}
