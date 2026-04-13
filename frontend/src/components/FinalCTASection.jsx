import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/utils';

const TIME_BANDS = [
  { value: 'morning', label: 'Morning (9am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm–5pm)' },
  { value: 'evening', label: 'Evening (5pm–8pm)' },
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FinalCTASection = () => {
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    email: '',
    phone: '',
    town: '',
    bestTime: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeBand, setTimeBand] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bestTimeDisplay =
    selectedDate && timeBand
      ? `${format(selectedDate, 'EEE d MMM')}, ${TIME_BANDS.find((t) => t.value === timeBand)?.label?.split(' ')[0] || timeBand}`
      : 'Pick date & time';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const bestTimeStr =
      selectedDate && timeBand
        ? `${format(selectedDate, 'EEE d MMM yyyy')}, ${TIME_BANDS.find((t) => t.value === timeBand)?.label || timeBand}`
        : callbackForm.bestTime;
    if (!callbackForm.name || !callbackForm.email || !callbackForm.phone || !callbackForm.town || (!bestTimeStr && !callbackForm.bestTime)) {
      setError('Please fill in all fields including email and date & time.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/contact`, {
        name: callbackForm.name,
        email: callbackForm.email,
        phone: callbackForm.phone,
        town: callbackForm.town,
        bestTime: bestTimeStr || callbackForm.bestTime,
      });
      setSubmitted(true);
      setCallbackForm({ name: '', email: '', phone: '', town: '', bestTime: '' });
      setSelectedDate(null);
      setTimeBand('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again or call directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-ink to-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="cg-h2 text-h1 md:text-h1-lg text-text mb-6">
          Want to see which jobs you're probably losing today?
        </h2>
        <p className="cg-body text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto">
          This is a quick sanity check — no selling, no setup. I'll show you exactly what happens after a missed call and whether this would even help you.
        </p>

        <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto border-2 border-primary/20 shadow-2xl">
          <h3 className="cg-h2 text-2xl text-text mb-2">Book a 5-min fit check</h3>
          <p className="cg-body text-muted mb-2 text-sm md:text-base">
            This takes 30 seconds. No obligation.
          </p>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="cg-label text-lg text-text mb-2">Thank You!</h4>
              <p className="cg-body text-muted">We'll call you back within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                  required
                  className="bg-surface2 border-border text-text placeholder:text-muted"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={callbackForm.email}
                  onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                  required
                  className="bg-surface2 border-border text-text placeholder:text-muted"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                  required
                  className="bg-surface2 border-border text-text placeholder:text-muted"
                />
                <Input
                  placeholder="Town/City"
                  value={callbackForm.town}
                  onChange={(e) => setCallbackForm({ ...callbackForm, town: e.target.value })}
                  required
                  className="bg-surface2 border-border text-text placeholder:text-muted"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Apple-style date + time picker */}
                <div className="flex flex-col gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface2 px-4 py-2 text-sm text-left text-text',
                          'focus:outline-none focus:ring-1 focus:ring-ring transition-colors hover:border-primary/30'
                        )}
                      >
                        <span className={!selectedDate && !timeBand ? 'text-muted' : ''}>
                          {bestTimeDisplay}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border bg-surface rounded-xl shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-xl border-0 bg-surface text-text"
                        classNames={{
                          day: 'h-9 w-9 rounded-lg text-sm hover:bg-primary/20 hover:text-primary',
                          day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                          day_today: 'bg-surface2 font-medium',
                          head_cell: 'text-muted text-xs font-medium',
                          nav_button: 'text-muted hover:text-text hover:bg-surface2 rounded-md',
                          caption_label: 'text-text font-medium',
                        }}
                      />
                      <div className="p-3 border-t border-border">
                        <p className="text-xs text-muted mb-2">Preferred time</p>
                        <Select value={timeBand} onValueChange={setTimeBand}>
                          <SelectTrigger className="h-9 bg-surface2 border-border text-text">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-surface border-border">
                            {TIME_BANDS.map((t) => (
                              <SelectItem key={t.value} value={t.value} className="text-text focus:bg-primary/20 focus:text-text">
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] disabled:opacity-70"
              >
                {loading ? 'Sending…' : 'Check if this would save me jobs'}
              </Button>
              <p className="cg-body text-center text-muted text-sm mt-4">
                I'll personally review this and get back to you.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
