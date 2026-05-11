import React from 'react';
import { MessageCircle, PhoneIncoming, CornerDownLeft, type LucideIcon } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  floating?: boolean;
}

interface DemoStep {
  Icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  sub: string;
}

export function PhoneFrame({ children, floating = false }: PhoneFrameProps): React.ReactElement {
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

export function DemoPhoneMockupPreview(): React.ReactElement {
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

const DEMO_STEPS: DemoStep[] = [
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

export function DemoStepStrip(): React.ReactElement {
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
