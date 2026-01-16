import React from 'react';
import { MapPin } from 'lucide-react';
import { businessInfo } from '../data/mock';

const ServiceAreas = () => {
  const allAreas = [businessInfo.location, ...businessInfo.serviceAreas];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Serving:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allAreas.map((area, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-default"
              >
                {area}
              </span>
            ))}
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              + Surrounding Areas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
