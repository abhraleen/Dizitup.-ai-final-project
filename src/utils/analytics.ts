// Simple analytics tracking utility
interface AnalyticsEvent {
  event: string;
  timestamp: number;
  userId?: string;
  properties?: Record<string, any>;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  track(event: string, properties?: Record<string, any>) {
    const eventObj: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      properties
    };

    this.events.push(eventObj);
    
    // Log to console for development
    console.log(`[Analytics] ${event}`, properties || '');
    
    // In a real implementation, you would send this to your analytics service
    // For example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventObj) });
  }

  // Get recent events for debugging
  getRecentEvents(limit = 10) {
    return this.events.slice(-limit);
  }

  // Clear events (useful for testing)
  clearEvents() {
    this.events = [];
  }
}

// Create a singleton instance
export const analytics = new AnalyticsTracker();

// Track page views
export const trackPageView = (page: string) => {
  analytics.track('page_view', { page });
};

// Track user actions
export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  analytics.track('user_action', { action, ...properties });
};

// Track conversions
export const trackConversion = (conversionType: string, value?: number) => {
  analytics.track('conversion', { conversionType, value });
};