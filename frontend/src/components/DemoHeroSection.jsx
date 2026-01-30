import React, { useState } from 'react';
import { Phone, Calendar, ShieldCheck, Award, Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Link } from 'react-router-dom';
import { businessInfo, heroImages, trustSignals } from '../data/mock';

const iconMap = {
  ShieldCheck,
  Award,
  Star,
  MapPin
};

const DemoHeroSection = () => {
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setCallbackForm({ name: '', phone: '', message: '' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1220] to-[#0F172A]">
      {/* Demo Banner */}
      <div className="absolute top-20 left-0 right-0 z-50 bg-primary/20 backdrop-blur-sm border-b border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <span className="text-text text-sm font-medium">
              Demo site — built as an example of the design
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors underline underline-offset-2"
            >
              See the Revenue-Capture System
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${heroImages.main})`,
          animation: 'slowZoom 20s ease-in-out infinite alternate'
        }}
      />
      
      {/* Vignette + Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/85 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(11,18,32,0.7)_100%)]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 mt-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-text text-sm font-medium">Available 24/7 for Emergencies</span>
          </div>

          {/* Headline */}
          <h1 className="text-h1 md:text-h1-lg font-bold text-text mb-6 leading-tight animate-fade-in-up">
            Emergency Electrician in Buckinghamshire — Call 24/7
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            Fast, reliable electrical services across Buckinghamshire. NICEIC approved, local electricians you can trust.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-200">
            <a href={`tel:${businessInfo.phone}`}>
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] rounded-xl">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-text/30 glass-card text-text hover:bg-surface2 hover:border-text/50 text-lg px-8 py-6 transition-all rounded-xl">
                  <Calendar className="w-5 h-5 mr-2" />
                  Request a Callback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-text">Request a Callback</DialogTitle>
                </DialogHeader>
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-2">Thank You!</h3>
                    <p className="text-muted">We'll call you back as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                        required
                        className="py-5 bg-surface2 border-border text-text"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                        required
                        className="py-5 bg-surface2 border-border text-text"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Brief description of your issue (optional)"
                        value={callbackForm.message}
                        onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                        rows={3}
                        className="bg-surface2 border-border text-text"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-5">
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
                  className="flex items-center gap-2 glass-card rounded-full px-4 py-2 text-text"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{signal.label}</span>
                </div>
              );
            })}
          </div>

          {/* Local Notice */}
          <p className="mt-8 text-muted text-sm animate-fade-in-up animation-delay-400">
            Local electricians — not a call centre
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-text/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-text/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default DemoHeroSection;
