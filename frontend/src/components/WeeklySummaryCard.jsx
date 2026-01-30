import React from 'react';
import { Phone, PhoneOff, MessageSquare, Calendar, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const WeeklySummaryCard = () => {
  const summaryData = {
    totalCalls: 47,
    missedCalls: 8,
    repliedCalls: 6,
    jobsBooked: 5,
    topReasons: ['Power cut', 'Faulty socket', 'Lighting issue', 'Consumer unit', 'Emergency'],
    spamFiltered: 12
  };

  return (
    <section className="section-padding bg-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            A simple weekly summary — so you can see what was caught
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
            No dashboards. No logins. Just a clear recap.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="glass-card overflow-hidden card-hover">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Weekly Summary</CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Sample summary
              </Badge>
            </div>
            <p className="text-white/80 text-sm mt-1">Week of Jan 15-21, 2024</p>
          </CardHeader>
          
          <CardContent className="p-6 bg-surface">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-surface2 rounded-lg">
                <Phone className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-text">{summaryData.totalCalls}</div>
                <div className="text-xs text-muted mt-1">Total calls</div>
              </div>
              
              <div className="text-center p-4 bg-red-500/20 rounded-lg">
                <PhoneOff className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-text">{summaryData.missedCalls}</div>
                <div className="text-xs text-muted mt-1">Missed calls</div>
              </div>
              
              <div className="text-center p-4 bg-success/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-text">{summaryData.repliedCalls}</div>
                <div className="text-xs text-muted mt-1">Replied to</div>
              </div>
              
              <div className="text-center p-4 bg-primary/20 rounded-lg">
                <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-text">{summaryData.jobsBooked}</div>
                <div className="text-xs text-muted mt-1">Jobs booked</div>
              </div>
            </div>

            {/* Top Reasons */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text mb-3">Top reasons people called</h3>
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
            </div>

            {/* Spam Filtered */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted" />
                <span className="text-sm text-text">Spam filtered out</span>
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
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <p className="text-center text-sm text-muted mt-6 italic">
          Sample summary for illustration purposes.
        </p>
      </div>
    </section>
  );
};

export default WeeklySummaryCard;
