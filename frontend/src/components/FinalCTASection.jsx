import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, useReducedMotion } from 'framer-motion';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WA_LINK = 'https://wa.me/447901837771';

// WhatsApp logo path (reused in two places)
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

const FinalCTASection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`${API_BASE}/api/callback-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong, message me on WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="cg-h2 text-h1 md:text-h1-lg text-text mb-3 leading-tight">
            Not sure if it&apos;s right for you?
          </h2>
          <p className="cg-body text-base md:text-lg text-muted">
            No pitch, no pressure. Just a quick chat to see if CallGuard fits how you work.
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid sm:grid-cols-2 gap-5 items-stretch">

          {/* WhatsApp card */}
          <motion.div
            className="glass-card rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: '1px solid rgba(37,211,102,0.30)', background: 'rgba(37,211,102,0.04)' }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(37,211,102,0.15)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366">
                  <path d={WA_PATH} />
                </svg>
              </div>
              <div>
                <p className="cg-label text-text font-semibold text-base leading-tight">
                  Message me on WhatsApp
                </p>
                <p className="text-base mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
                  Usually reply within a few minutes.
                </p>
              </div>
            </div>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="cg-label mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
              style={{
                background: '#25d36694',
                boxShadow: '0 4px 20px -4px rgba(37,211,102,0.45)',
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white" className="shrink-0">
                <path d={WA_PATH} />
              </svg>
              Open WhatsApp
            </a>
          </motion.div>

          {/* Callback card */}
          <motion.div
            className="glass-card rounded-2xl p-6 flex flex-col gap-5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/15">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="cg-label text-text font-semibold text-base leading-tight">
                  Leave your number
                </p>
                <p className="text-base mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
                  I&apos;ll call you back within a few hours.
                </p>
              </div>
            </div>

            {submitted ? (
              <p className="cg-body text-base text-text/80 leading-relaxed mt-auto py-1">
                Got it,  I&apos;ll give you a call soon. 👍
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
                <Input
                  type="tel"
                  placeholder="07xxx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  className="bg-surface2 border-border text-text placeholder:text-muted h-11 rounded-xl"
                  required
                />
                {error && (
                  <p className="text-base text-red-400 leading-snug">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading || !phone.trim()}
                  className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? 'Sending…' : 'Call me back'}
                </Button>
                <p className="text-[13px] text-center leading-snug" style={{ color: 'rgba(148, 163, 184, 0.68)' }}>
                  No voicemail, no email chain. Just a quick call.
                </p>
              </form>
            )}
          </motion.div>
        </div>

        {/* Personal sign-off */}
        <motion.p
          className="text-center textmd italic mt-8"
          style={{ color: 'rgba(148, 163, 184, 0.77)' }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
        >
          — Ollie, founder of CallGuard
        </motion.p>

      </div>
    </section>
  );
};

export default FinalCTASection;
