import React from 'react';
import { MapPin } from 'lucide-react';
import { businessInfo } from '../data/mock';

const ServiceAreas = () => {
  const allAreas = [businessInfo.location, ...businessInfo.serviceAreas];

  return (
    <section className="py-16 bg-light-surface border-t border-light-border">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-light-muted">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-medium">Serving:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allAreas.map((area, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-light hover:bg-primary/10 text-light-text rounded-full text-sm font-medium transition-colors cursor-default"
              >
                {area}
              </span>
            ))}
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              + Surrounding Areas
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-light-muted max-w-2xl mx-auto mt-6 italic rounded-full bg-light border border-light-border p-2">
            This is a concept example designed to demonstrate conversion principles for local electricians.
          </p>
    </section>
  );
};

export default ServiceAreas;
