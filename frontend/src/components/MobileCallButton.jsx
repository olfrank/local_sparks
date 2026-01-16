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
  );
};

export default MobileCallButton;
