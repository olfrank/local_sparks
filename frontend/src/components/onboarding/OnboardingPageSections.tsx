import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingPageShellProps {
  children: React.ReactNode;
}

interface ProgressIndicatorProps {
  step: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: 'Your details', short: 'Details' },
  { n: 2, label: 'Activate',     short: 'Activate' },
  { n: 3, label: "You're live",  short: 'Live' },
] as const;

export function OnboardingPageShell({ children }: OnboardingPageShellProps): React.ReactElement {
  return (
    <main className="min-h-screen bg-ink relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37, 100, 235, 0.08), transparent 65%)',
        }}
      />
      <div className="relative z-10 max-w-md mx-auto px-4 pt-28 pb-24">
        {children}
      </div>
    </main>
  );
}

export function ProgressIndicator({ step }: ProgressIndicatorProps): React.ReactElement {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, i) => {
        const done   = step > s.n;
        const active = step === s.n;
        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-semibold transition-colors ${
                  done || active
                    ? 'bg-primary text-white'
                    : 'bg-surface2 border border-border text-muted'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.n}
              </div>
              <span
                className={`text-base transition-colors ${
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

export function OnboardingIntro(): React.ReactElement {
  return (
    <div className="mb-8 text-center">
      <h1 className="cg-h1 text-h1 md:text-h1-lg text-text mb-3 max-w-sm mx-auto leading-tight">
        You&apos;re 2 minutes away from catching every missed call
      </h1>
      <p className="cg-body text-base text-muted max-w-xs mx-auto leading-relaxed">
        We&apos;ll wire CallGuard into your existing number. No app, no new number, no hassle.
      </p>
    </div>
  );
}

const TRUST_ITEMS = ['No contract', 'Cancel anytime', 'Live in 2 minutes', 'UK-based support'];

export function TrustStrip(): React.ReactElement {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-5">
      {TRUST_ITEMS.map((item, i) => (
        <React.Fragment key={item}>
          <span className="text-base text-muted/55">{item}</span>
          {i < TRUST_ITEMS.length - 1 && (
            <span className="text-border/60 text-base select-none">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
