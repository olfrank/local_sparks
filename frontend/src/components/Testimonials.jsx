import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { testimonials, accreditations, businessInfo } from '../data/mock';

const Testimonials = () => {
  return (
    <section id="reviews" className="section-padding bg-light-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Customer Reviews
          </span>
          <h2 className="text-h2 md:text-h2-lg font-bold text-light-text mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-light-muted font-semibold">{businessInfo.rating} out of 5</span>
          </div>
          <p className="text-light-muted">Based on verified customer reviews</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative p-6 md:p-8 bg-light border border-light-border hover:shadow-lg transition-all duration-300 rounded-2xl"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-light-text leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-light-text">{testimonial.name}</p>
                  <div className="flex items-center gap-1 text-light-muted text-sm">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
                <span className="text-light-muted text-sm">{testimonial.date}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Accreditations */}
        <div className="bg-light rounded-2xl p-8 md:p-12 border border-light-border">
          <p className="text-center text-light-muted mb-8 font-medium">
            Trusted by homeowners and businesses across {businessInfo.location}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {accreditations.map((acc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-light-surface px-6 py-3 rounded-lg border border-light-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">{acc.abbr.substring(0, 2)}</span>
                </div>
                <span className="text-light-text font-medium text-sm hidden sm:block">{acc.name}</span>
                <span className="text-light-text font-medium text-sm sm:hidden">{acc.abbr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
