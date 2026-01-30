import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { businessInfo } from '../data/mock';

const DemoContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="section-padding bg-lightBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2 md:text-h2-lg font-bold text-lightText mb-4">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-lightMuted max-w-2xl mx-auto">
            Need electrical work? Call us 24/7 or send us a message.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-lightText mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center gap-3 text-lightText hover:text-primary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us 24/7</p>
                    <p className="text-lightMuted text-sm">{businessInfo.phoneFormatted}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/44${businessInfo.phone.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lightText hover:text-primary transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-lightMuted text-sm">Send us a message</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-lightText">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Service Area</p>
                    <p className="text-lightMuted text-sm">{businessInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-lightText">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-lightMuted text-sm">24/7 Emergency Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-lightBorder">
            <h3 className="text-xl font-semibold text-lightText mb-6">Send us a message</h3>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-lightText mb-2">Thank You!</h3>
                <p className="text-lightMuted">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="py-5 bg-lightBg border-lightBorder text-lightText"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="py-5 bg-lightBg border-lightBorder text-lightText"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="py-5 bg-lightBg border-lightBorder text-lightText"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tell us about your electrical issue"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    required
                    className="bg-lightBg border-lightBorder text-lightText"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-5 text-lg">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoContactSection;
