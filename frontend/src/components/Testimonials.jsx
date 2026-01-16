import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { testimonials, accreditations, businessInfo } from '../data/mock';

const Testimonials = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-600 font-semibold">{businessInfo.rating} out of 5</span>
          </div>
          <p className="text-slate-500">Based on verified customer reviews</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative p-6 md:p-8 bg-slate-50 border-0 hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{testimonial.name}</p>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
                <span className="text-slate-400 text-sm">{testimonial.date}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Accreditations */}
        <div className="bg-slate-50 rounded-2xl p-8 md:p-12">
          <p className="text-center text-slate-600 mb-8 font-medium">
            Trusted by homeowners and businesses across {businessInfo.location}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {accreditations.map((acc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">{acc.abbr.substring(0, 2)}</span>
                </div>
                <span className="text-slate-700 font-medium text-sm hidden sm:block">{acc.name}</span>
                <span className="text-slate-700 font-medium text-sm sm:hidden">{acc.abbr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
