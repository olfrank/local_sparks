import React, { useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import OnboardingActivation from '../components/OnboardingActivation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUKMobile(number) {
  const cleaned = number.replace(/[\s\-().]/g, '');
  return /^07\d{9}$/.test(cleaned) || /^\+447\d{9}$/.test(cleaned);
}

const JOB_VALUE_OPTIONS = [
  { label: '£50–£150', low: 50, high: 150 },
  { label: '£150–£300', low: 150, high: 300 },
  { label: '£300–£500', low: 300, high: 500 },
  { label: '£500+', low: 500, high: 800 },
];
const DEFAULT_JOB_VALUE = JOB_VALUE_OPTIONS[1];

// ─── Progress indicator ───────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Your details', short: 'Details' },
  { n: 2, label: 'Activate',     short: 'Activate' },
  { n: 3, label: "You're live",  short: 'Live' },
];

function ProgressIndicator({ step }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, i) => {
        const done   = step > s.n;
        const active = step === s.n;
        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done || active
                    ? 'bg-primary text-white'
                    : 'bg-surface2 border border-border text-muted'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.n}
              </div>
              <span
                className={`text-xs transition-colors ${
                  active ? 'text-primary font-semibold' : done ? 'text-primary/60' : 'text-muted'
                }`}
              >
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.short}</span>
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                  step > s.n ? 'bg-primary/50' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────

const TRUST_ITEMS = ['No contract', 'Cancel anytime', 'Live in 2 minutes', 'UK-based support'];

function TrustStrip() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-5">
      {TRUST_ITEMS.map((item, i) => (
        <React.Fragment key={item}>
          <span className="text-xs text-muted/55">{item}</span>
          {i < TRUST_ITEMS.length - 1 && (
            <span className="text-border/60 text-xs select-none">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Intake form ──────────────────────────────────────────────────────────────

function IntakeForm({ onSubmit }) {
  const mobileRef = useRef(null);
  const [form, setForm] = useState({
    contactName: '',
    businessName: '',
    mobileNumber: '',
    whatsappNumber: '',
  });
  const [jobValue, setJobValue] = useState(DEFAULT_JOB_VALUE);
  const [whatsappDifferent, setWhatsappDifferent] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.contactName.trim()) e.contactName = 'Please enter your first name';
    if (!form.businessName.trim()) e.businessName = 'Please enter your business name';
    if (!form.mobileNumber.trim()) {
      e.mobileNumber = 'Please enter your mobile number';
    } else if (!isValidUKMobile(form.mobileNumber)) {
      e.mobileNumber = 'Please enter a valid UK mobile number (e.g. 07911 123 456)';
    }
    if (whatsappDifferent && form.whatsappNumber.trim() && !isValidUKMobile(form.whatsappNumber)) {
      e.whatsappNumber = 'Please enter a valid UK mobile number';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    onSubmit({
      contactName: form.contactName.trim(),
      businessName: form.businessName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      whatsappNumber: whatsappDifferent && form.whatsappNumber.trim()
        ? form.whatsappNumber.trim()
        : form.mobileNumber.trim(),
      jobValueLow: jobValue.low,
      jobValueHigh: jobValue.high,
    });
  };

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <Input
              type="text"
              placeholder="Your first name"
              value={form.contactName}
              onChange={update('contactName')}
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${errors.contactName ? 'border-red-500/60' : ''}`}
            />
            {errors.contactName && <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.contactName}</p>}
          </div>

          {/* Business name */}
          <div>
            <Input
              type="text"
              placeholder="Business name (e.g. Smith Electrical)"
              value={form.businessName}
              onChange={update('businessName')}
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${errors.businessName ? 'border-red-500/60' : ''}`}
            />
            {errors.businessName && <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.businessName}</p>}
          </div>

          {/* Mobile number */}
          <div>
            <Input
              type="tel"
              placeholder="Your mobile number (07xxx xxx xxx)"
              ref={mobileRef}
              value={form.mobileNumber}
              onChange={update('mobileNumber')}
              inputMode="tel"
              autoComplete="tel"
              className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${errors.mobileNumber ? 'border-red-500/60' : ''}`}
            />
            {errors.mobileNumber && <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.mobileNumber}</p>}
          </div>

          {/* WhatsApp on a different number? */}
          <div>
            <button
              type="button"
              onClick={() => setWhatsappDifferent((p) => !p)}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${whatsappDifferent ? 'rotate-180' : ''}`} />
              WhatsApp on a different number?
            </button>
            {whatsappDifferent && (
              <div className="mt-2">
                <Input
                  type="tel"
                  placeholder="WhatsApp number (07xxx xxx xxx)"
                  value={form.whatsappNumber}
                  onChange={update('whatsappNumber')}
                  inputMode="tel"
                  className={`bg-surface2 border-border text-text placeholder:text-muted h-12 rounded-xl text-base ${errors.whatsappNumber ? 'border-red-500/60' : ''}`}
                />
                {errors.whatsappNumber && <p className="mt-1.5 text-sm text-red-400 leading-snug">{errors.whatsappNumber}</p>}
              </div>
            )}
          </div>

          {/* Job value */}
          <div>
            <p className="text-xs text-muted mb-2">
              What&apos;s a typical job worth?{' '}
              <span className="text-muted/60">Used for your weekly revenue report.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {JOB_VALUE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setJobValue(opt)}
                  className={`cg-label px-3 py-1.5 rounded-full text-xs transition-all border ${
                    jobValue.label === opt.label
                      ? 'bg-primary/20 border-primary/40 text-primary'
                      : 'bg-surface2/60 border-border text-muted hover:text-text hover:border-primary/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] mt-2"
          >
            Set up my account
          </Button>

          <p className="text-center text-muted text-xs pt-1">
            Takes about 2 minutes. Cancel anytime.
          </p>

          <p className="text-center text-xs text-muted/60 pt-0">
            Want to see how it works first?{' '}
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors inline-flex items-center gap-0.5"
            >
              Try the live demo
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── OnboardPage ──────────────────────────────────────────────────────────────

export default function OnboardPage() {
  const location = useLocation();
  const prefilled = location.state;

  const isPrefilled =
    prefilled?.contactName &&
    prefilled?.businessName &&
    prefilled?.mobileNumber;

  const [activationData, setActivationData] = useState(() =>
    isPrefilled ? prefilled : null
  );

  // 1 = form, 2 = provisioning/activation, 3 = vip/success
  const [activeStep, setActiveStep] = useState(() => (isPrefilled ? 2 : 1));

  const handleFormSubmit = useCallback((data) => {
    setActiveStep(2);
    setActivationData(data);
  }, []);

  const handlePhaseChange = useCallback((phase) => {
    if (phase === 'vip' || phase === 'success') setActiveStep(3);
  }, []);

  return (
    <main className="min-h-screen bg-ink relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.05), transparent 65%)',
        }}
      />
      <div className="relative z-10 max-w-md mx-auto px-4 pt-28 pb-24">
        <ProgressIndicator step={activeStep} />

        {activationData ? (
          <OnboardingActivation
            contactName={activationData.contactName}
            businessName={activationData.businessName}
            mobileNumber={activationData.mobileNumber}
            whatsappNumber={activationData.whatsappNumber}
            jobValueLow={activationData.jobValueLow}
            jobValueHigh={activationData.jobValueHigh}
            onPhaseChange={handlePhaseChange}
          />
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="cg-h1 text-h1 md:text-h1-lg text-text mb-3 max-w-sm mx-auto leading-tight">
                You&apos;re 2 minutes from never losing a job again
              </h1>
              <p className="cg-body text-sm md:text-base text-muted max-w-xs mx-auto leading-relaxed">
                We&apos;ll wire CallGuard into your existing number. No app, no new number, no hassle.
              </p>
            </div>

            <IntakeForm onSubmit={handleFormSubmit} />
            <TrustStrip />
          </>
        )}
      </div>
    </main>
  );
}
