import React from 'react';
import { MessageCircle } from 'lucide-react';

export function SMSConversation({ contactName, businessName, customerReply, showReply }) {
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

export function WhatsAppConversation({ urgency, phoneNumber, postcode, summary, loading }) {
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
