import React from 'react';
import { Zap, Home, Building2, ArrowRight, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { serviceCards, businessInfo } from '../data/mock';

const iconMap = {
  Zap,
  Home,
  Building2
};

const ServiceCards = () => {
  return (
    <section id="services" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            How Can We Help?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select the service that best matches your needs. Emergency calls are always prioritised.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {serviceCards.map((service, index) => {
            const Icon = iconMap[service.icon];
            const isUrgent = service.urgent;

            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  isUrgent
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0'
                    : 'bg-white border border-slate-200 hover:border-blue-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Urgent Badge */}
                {isUrgent && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-pulse" />
                      PRIORITY
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  isUrgent
                    ? 'bg-white/20'
                    : 'bg-blue-50 group-hover:bg-blue-100'
                }`}>
                  <Icon className={`w-7 h-7 ${isUrgent ? 'text-white' : 'text-blue-600'}`} />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-3 ${isUrgent ? 'text-white' : 'text-slate-800'}`}>
                  {service.title}
                </h3>
                <p className={`mb-6 leading-relaxed ${isUrgent ? 'text-blue-100' : 'text-slate-600'}`}>
                  {service.description}
                </p>

                {/* CTA */}
                {isUrgent ? (
                  <a href={`tel:${businessInfo.phone}`}>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-5 group-hover:shadow-lg transition-all">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                ) : (
                  <button className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Decorative Element */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full transition-opacity ${
                  isUrgent
                    ? 'bg-white/10 opacity-100'
                    : 'bg-blue-100 opacity-0 group-hover:opacity-50'
                }`} />
              </Card>
            );
          })}
        </div>

        {/* Note */}
        <p className="text-center text-slate-500 mt-8 text-sm">
          Not sure what you need? Give us a call and we'll guide you through your options.
        </p>
      </div>
    </section>
  );
};

export default ServiceCards;
