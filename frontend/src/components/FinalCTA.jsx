import React, { useState } from 'react';
import { Phone, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { businessInfo } from '../data/mock';

const FinalCTA = () => {
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setCallbackForm({ name: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Available Now</span>
        </span>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Need an Electrician Today?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Get in touch now for a fast response. No call-out charges, no obligation quotes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={`tel:${businessInfo.phone}`}>
            <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-7 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <Phone className="w-5 h-5 mr-2" />
              Call {businessInfo.phoneFormatted}
            </Button>
          </a>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/40 bg-transparent text-white hover:bg-white/10 text-lg px-10 py-7 font-semibold transition-all">
                <Calendar className="w-5 h-5 mr-2" />
                Request a Callback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Request a Callback</DialogTitle>
              </DialogHeader>
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Thank You!</h3>
                  <p className="text-slate-600">We'll call you back as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <Input
                    placeholder="Your Name"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                    required
                    className="py-5"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                    required
                    className="py-5"
                  />
                  <Textarea
                    placeholder="Brief description of your issue (optional)"
                    value={callbackForm.message}
                    onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                    rows={3}
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-5">
                    Request Callback
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Trust Note */}
        <p className="mt-8 text-blue-100 text-sm">
          Trusted by hundreds of homeowners and businesses across {businessInfo.location}
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
