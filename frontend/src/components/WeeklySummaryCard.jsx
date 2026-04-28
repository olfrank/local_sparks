import React from 'react';
import { Phone, PhoneOff, MessageSquare, Calendar, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion, useReducedMotion } from 'framer-motion';

const WeeklySummaryCard = () => {
  const prefersReducedMotion = useReducedMotion();

  const summaryData = {
    totalCalls: 47,
    missedCalls: 8,
    repliedCalls: 6,
    jobsBooked: 5,
    topReasons: ['Power cut', 'Faulty socket', 'Lighting issue', 'Consumer unit', 'Emergency'],
    spamFiltered: 12
  };

  const stats = [
    { icon: Phone, value: summaryData.totalCalls, label: 'Total calls', bg: 'bg-surface2', iconColor: 'text-primary' },
    { icon: PhoneOff, value: summaryData.missedCalls, label: 'Missed calls', bg: 'bg-red-500/20', iconColor: 'text-red-400' },
    { icon: MessageSquare, value: summaryData.repliedCalls, label: 'Replied to', bg: 'bg-success/20', iconColor: 'text-success' },
    { icon: Calendar, value: summaryData.jobsBooked, label: 'Jobs booked', bg: 'bg-primary/20', iconColor: 'text-primary' },
  ];

  return (
    <section className="section-padding bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            A simple weekly summary so you can see what was caught
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
            No dashboards. No logins. Just a clear recap.
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
        >
          <Card className="glass-card overflow-hidden card-hover">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Weekly Summary</CardTitle>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Sample summary
                </Badge>
              </div>
              <p className="text-white/80 text-base mt-1">Week of Jan 15-21, 2024</p>
            </CardHeader>

            <CardContent className="p-6 bg-surface">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`text-center p-4 ${stat.bg} rounded-lg`}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.07, ease: 'easeOut' }}
                    >
                      <Icon className={`w-5 h-5 ${stat.iconColor} mx-auto mb-2`} />
                      <div className="text-2xl font-bold text-text">{stat.value}</div>
                      <div className="text-base text-muted mt-1">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Top Reasons */}
              <motion.div
                className="mb-6"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.45, ease: 'easeOut' }}
              >
                <h3 className="text-base font-semibold text-text mb-3">Top reasons people called</h3>
                <div className="flex flex-wrap gap-2">
                  {summaryData.topReasons.map((reason, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {reason}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Spam Filtered */}
              <motion.div
                className="flex items-center justify-between pt-4 border-t border-border"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted" />
                  <span className="text-base text-text">Spam filtered out</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Automatically filtered spam and robocalls</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge variant="outline" className="bg-surface2">
                  {summaryData.spamFiltered} calls
                </Badge>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Note */}
        <motion.p
          className="text-center text-base text-muted mt-6 italic"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
        >
          Sample summary for illustration purposes.
        </motion.p>
      </div>
    </section>
  );
};

export default WeeklySummaryCard;
