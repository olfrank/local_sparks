<<<<<<< HEAD
import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { businessInfo } from '../data/mock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const MobileCallButton = () => {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    town: '',
    busiestHours: '',
    missedCallsHandling: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCallbackOpen(false);
      setCallbackForm({
        name: '',
        businessName: '',
        phone: '',
        town: '',
        busiestHours: '',
        missedCallsHandling: ''
      });
    }, 3000);
  };

  const whatsappLink = `https://wa.me/${businessInfo.phone.replace(/\s/g, '')}`;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Gradient fade */}
        <div className="h-8 bg-gradient-to-t from-ink to-transparent" />
        
        {/* Button Container */}
        <div className="bg-ink border-none px-4 py-3 shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex flex-col items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-md shadow-primary/30 transition-all active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Call Now</span>
            </a>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-green-600/30 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">WhatsApp</span>
            </a>
            
            <Dialog open={callbackOpen} onOpenChange={setCallbackOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-1 bg-surface hover:bg-surface2 text-text font-semibold py-3 rounded-xl shadow-md transition-all active:scale-[0.98]">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">5-min fit check</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-text">Request a Callback</DialogTitle>
                </DialogHeader>
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-2">Thank You!</h3>
                    <p className="text-muted">We'll call you back within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <Input
                      placeholder="Your Name"
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      required
                      className="py-5 bg-surface2 border-border text-text placeholder:text-muted"
                    />
                    <Input
                      placeholder="Business Name"
                      value={callbackForm.businessName}
                      onChange={(e) => setCallbackForm({ ...callbackForm, businessName: e.target.value })}
                      required
                      className="py-5 bg-surface2 border-border text-text placeholder:text-muted"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      required
                      className="py-5 bg-surface2 border-border text-text placeholder:text-muted"
                    />
                    <Input
                      placeholder="Town/City"
                      value={callbackForm.town}
                      onChange={(e) => setCallbackForm({ ...callbackForm, town: e.target.value })}
                      required
                      className="py-5 bg-surface2 border-border text-text placeholder:text-muted"
                    />
                    <Select
                      value={callbackForm.busiestHours}
                      onValueChange={(value) => setCallbackForm({ ...callbackForm, busiestHours: value })}
                      required
                    >
                      <SelectTrigger className="py-5 bg-surface2 border-border text-text">
                        <SelectValue placeholder="Busiest hours" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border">
                        <SelectItem value="morning" className="text-text">Morning (8am-12pm)</SelectItem>
                        <SelectItem value="afternoon" className="text-text">Afternoon (12pm-5pm)</SelectItem>
                        <SelectItem value="evening" className="text-text">Evening (5pm-9pm)</SelectItem>
                        <SelectItem value="all-day" className="text-text">All day</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="How do you handle missed calls today?"
                      value={callbackForm.missedCallsHandling}
                      onChange={(e) => setCallbackForm({ ...callbackForm, missedCallsHandling: e.target.value })}
                      required
                      rows={3}
                      className="bg-surface2 border-border text-text placeholder:text-muted"
                    />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-5 rounded-xl">
                      Request Callback
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
=======
import React from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../data/mock';

const MobileCallButton = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient fade */}
      <div className="h-6 bg-gradient-to-t from-white to-transparent" />
      
      {/* Button Container */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <a
          href={`tel:${businessInfo.phone}`}
          className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
        >
          <Phone className="w-5 h-5" />
          <span>Call {businessInfo.phoneFormatted}</span>
        </a>
      </div>
    </div>
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  );
};

export default MobileCallButton;
