import React, { useState } from 'react';
import { Phone, Calendar, ShieldCheck, Award, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { businessInfo, heroImages, trustSignals } from '../data/mock';

const iconMap = {
  ShieldCheck,
  Award,
  Star,
  MapPin
};

const HeroSection = () => {
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setCallbackForm({ name: '', phone: '', message: '' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${heroImages.main})`,
          animation: 'slowZoom 20s ease-in-out infinite alternate'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-100 text-sm font-medium">Available 24/7 for Emergencies</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Emergency Electrician in{' '}
            <span className="text-blue-400">{businessInfo.location}</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-white/90">Call 24/7</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            Fully qualified, fully insured local electricians serving {businessInfo.location} and surrounding areas. Fast response, fair prices, quality guaranteed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-200">
            <a href={`tel:${businessInfo.phone}`}>
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-[1.02]">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 text-lg px-8 py-6 transition-all">
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
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                        required
                        className="py-5"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                        required
                        className="py-5"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Brief description of your issue (optional)"
                        value={callbackForm.message}
                        onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-5">
                      Request Callback
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in-up animation-delay-300">
            {trustSignals.map((signal, index) => {
              const Icon = iconMap[signal.icon];
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{signal.label}</span>
                </div>
              );
            })}
          </div>

          {/* Local Notice */}
          <p className="mt-8 text-slate-400 text-sm animate-fade-in-up animation-delay-400">
            Local electricians — not a call centre
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
