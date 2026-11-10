export type AnalyticsEventName =
  | 'view_page'
  | 'click_whatsapp_hero'
  | 'click_service_installation'
  | 'click_service_cleaning'
  | 'start_form'
  | 'submit_form'
  | 'faq_open'
  | 'click_phone';

export interface AnalyticsEventRecord {
  name: AnalyticsEventName;
  timestamp: number;
  metadata?: Record<string, string>;
}

const eventHistory: AnalyticsEventRecord[] = [];

export function trackEvent(
  name: AnalyticsEventName,
  metadata?: Record<string, string>
): AnalyticsEventRecord {
  const record: AnalyticsEventRecord = {
    name,
    timestamp: Date.now(),
    metadata,
  };
  eventHistory.push(record);

  if (typeof window !== 'undefined') {
    (window as unknown as { __MET_ANALYTICS__?: AnalyticsEventRecord[] }).__MET_ANALYTICS__ =
      eventHistory;
  }

  return record;
}

export function getTrackedEvents(): AnalyticsEventRecord[] {
  return [...eventHistory];
}
