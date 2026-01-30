import React from 'react';
import { Phone, X, CheckCircle2, ArrowRight, MessageSquare, Clock } from 'lucide-react';

const Timeline = ({ variant = 'without', steps }) => {
  const iconMap = {
    phone: Phone,
    x: X,
    check: CheckCircle2,
    arrow: ArrowRight,
    message: MessageSquare,
    clock: Clock
  };

  return (
    <div className="relative">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon] || ArrowRight;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={index} className="relative flex gap-4">
              {/* Timeline line */}
              {!isLast && (
                <div className={`absolute left-5 top-10 w-0.5 h-[70%] ${
                  variant === 'without' ? 'bg-red-500/30' : 'bg-success/30'
                }`} />
              )}
              
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                variant === 'without'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-success/20 text-success'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <p className={`font-medium ${
                  variant === 'without' ? 'text-text' : 'text-text'
                }`}>
                  {step.text}
                </p>
                {step.detail && (
                  <p className="text-sm text-muted mt-1">{step.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
