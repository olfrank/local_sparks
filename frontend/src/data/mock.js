// Mock data for Buckingham Electricians website

export const businessInfo = {
  name: "Buckingham Electricians",
  phone: "07901837771",
  phoneFormatted: "07901 837 771",
  location: "Buckinghamshire",
  serviceAreas: ["Tring", "Berkhamsted", "Hemel Hempstead"],
  rating: 4.9,
  yearsExperience: 20,
  email: "info@buckinghamelectricians.co.uk"
};

export const heroImages = {
  main: "https://images.unsplash.com/photo-1660330589693-99889d60181e?w=1920&q=80",
  secondary: "https://images.unsplash.com/photo-1509390373685-579356742d95?w=1200&q=80"
};

export const trustSignals = [
  { label: "NICEIC Approved", icon: "ShieldCheck" },
  { label: "20+ Years Experience", icon: "Award" },
  { label: "4.9★ Customer Rating", icon: "Star" },
  { label: "Local Electricians", icon: "MapPin" }
];

export const serviceCards = [
  {
    id: "emergency",
    title: "Emergency Call-Out",
    description: "24/7 emergency response. We prioritise urgent electrical issues to keep you safe.",
    icon: "Zap",
    urgent: true
  },
  {
    id: "domestic",
    title: "Domestic Electrical Work",
    description: "Full range of home electrical services from repairs to complete rewires.",
    icon: "Home",
    urgent: false
  },
  {
    id: "commercial",
    title: "Commercial Services",
    description: "Professional electrical solutions for businesses, offices, and retail premises.",
    icon: "Building2",
    urgent: false
  }
];

export const whyChooseUs = [
  { title: "Same-Day Response", description: "Where possible, we attend the same day you call", icon: "Clock" },
  { title: "No Call-Out Charge", description: "Free quotes with no obligation", icon: "PoundSterling" },
  { title: "Fully Insured & Certified", description: "Complete peace of mind guaranteed", icon: "ShieldCheck" },
  { title: "Friendly & Punctual", description: "Professional service with a personal touch", icon: "UserCheck" },
  { title: "Transparent Pricing", description: "No hidden fees, no surprises", icon: "Receipt" },
  { title: "Quality Guaranteed", description: "All work guaranteed for your protection", icon: "BadgeCheck" }
];

export const services = [
  { name: "Electrical Repairs", icon: "Wrench" },
  { name: "Fault Finding", icon: "Search" },
  { name: "Full Rewires", icon: "Cable" },
  { name: "Fuse Board Upgrades", icon: "LayoutGrid" },
  { name: "EV Charger Installation", icon: "Car" },
  { name: "Lighting & Security", icon: "Lightbulb" },
  { name: "Socket Installation", icon: "Plug" },
  { name: "Safety Inspections", icon: "ClipboardCheck" }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Tring",
    rating: 5,
    text: "Absolutely brilliant service. They came out within an hour of my call and fixed the issue quickly. Very professional and tidy. Highly recommend!",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "James P.",
    location: "Berkhamsted",
    rating: 5,
    text: "Used Buckingham Electricians for a full consumer unit upgrade. Excellent work, fair price, and they explained everything clearly. Will definitely use again.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Helen T.",
    location: "Hemel Hempstead",
    rating: 5,
    text: "Emergency call-out on a Sunday evening - they arrived within 45 minutes and sorted the problem. Can't thank them enough. True professionals.",
    date: "3 weeks ago"
  }
];

export const accreditations = [
  { name: "NICEIC Approved Contractor", abbr: "NICEIC" },
  { name: "Electrical Safety First", abbr: "ESF" },
  { name: "TrustMark Registered", abbr: "TrustMark" },
  { name: "Part P Registered", abbr: "Part P" }
];

export const conversionFeatures = [
  "Emergency calls prioritised above the fold",
  "Phone number always visible on mobile",
  "Minimal form fields to reduce friction",
  "Clear service routing to prevent drop-off",
  "Trust signals displayed immediately",
  "Mobile-first design for on-the-go users"
];

export const websiteComparison = {
  typical: [
    "Phone number buried in footer",
    "Generic stock imagery",
    "Long contact forms",
    "Unclear service offerings",
    "Desktop-first design"
  ],
  optimised: [
    "Click-to-call always visible",
    "Authentic, trust-building imagery",
    "Quick callback request",
    "Clear service routing",
    "Mobile-first approach"
  ]
};
