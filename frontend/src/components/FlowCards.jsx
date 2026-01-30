import React from 'react';
import { MessageSquare, Phone, MousePointerClick, ArrowRight } from 'lucide-react';

const FlowCards = () => {
  const flows = [
    {
      icon: MousePointerClick,
      title: 'Website form',
      destination: 'WhatsApp',
      description: 'All form submissions go directly to your WhatsApp',
      detail: 'No email checking needed'
    },
    {
      icon: Phone,
      title: 'Missed call',
      destination: 'SMS → Callback',
      description: 'Instant SMS reply, then you call back when ready',
      detail: 'Customer details captured automatically'
    },
    {
      icon: MousePointerClick,
      title: 'Click-to-call',
      destination: 'Phone',
      description: 'Direct connection, no redirects or delays',
      detail: 'Works on all devices'
    }
  ];

  return (
    <section className="section-padding bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            Everything lands where you already work
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            No app-hopping. No new tools to learn. Everything routes to the tools you use every day.
          </p>
        </div>

        {/* Flow Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {flows.map((flow, index) => {
            const Icon = flow.icon;
            return (
              <div
                key={index}
                className="group glass-card rounded-xl p-6 card-hover"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/20 group-hover:bg-primary flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-text mb-1">{flow.title}</h3>

                {/* Destination */}
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold">{flow.destination}</span>
                </div>

                {/* Description */}
                <p className="text-muted text-sm mb-2">{flow.description}</p>

                {/* Detail */}
                <p className="text-xs text-muted">{flow.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Bullet Points */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <p className="font-medium text-text">Forms go to WhatsApp</p>
            </div>
            <div className="p-4">
              <p className="font-medium text-text">Missed calls get an instant reply</p>
            </div>
            <div className="p-4">
              <p className="font-medium text-text">You choose who to call back first</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowCards;
