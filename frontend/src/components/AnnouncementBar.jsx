import React from 'react';
import { X } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="font-medium">
          Built for busy local electricians — catch missed calls automatically
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
