import { describe, expect, it } from 'vitest';
import {
  ANALYTICS_CONSENT_KEY,
  buildPageViewPayload,
  isGaMeasurementId,
  readAnalyticsConsent,
  sanitizeAnalyticsLocation,
} from '../src/googleAnalytics';

describe('Google Analytics privacy boundary', () => {
  it('accepts GA4 measurement IDs only', () => {
    expect(isGaMeasurementId('G-ABC123')).toBe(true);
    expect(isGaMeasurementId('UA-123')).toBe(false);
    expect(isGaMeasurementId('')).toBe(false);
  });

  it('keeps only bounded UTM parameters and removes OAuth or personal query data', () => {
    const location = sanitizeAnalyticsLocation(
      'https://english-output-webapp.vercel.app/?utm_source=community&utm_campaign=launch&code=oauth-secret&email=user%40example.com',
      '/app/chapters',
    );
    expect(location).toBe('https://english-output-webapp.vercel.app/app/chapters?utm_source=community&utm_campaign=launch');
    expect(location).not.toContain('oauth-secret');
    expect(location).not.toContain('email');
  });

  it('builds page-view payloads from controlled navigation metadata only', () => {
    expect(buildPageViewPayload(
      { screen: 'chapter_recall', title: 'Personality Traits · English Output', path: '/app/chapter/3/pass/1/recall' },
      'https://english-output-webapp.vercel.app/?utm_medium=community',
    )).toEqual({
      page_title: 'Personality Traits · English Output',
      page_location: 'https://english-output-webapp.vercel.app/app/chapter/3/pass/1/recall?utm_medium=community',
      page_path: '/app/chapter/3/pass/1/recall',
      app_screen: 'chapter_recall',
    });
  });

  it('defaults to no consent when storage is missing or invalid', () => {
    expect(readAnalyticsConsent(null)).toBe('unknown');
    expect(readAnalyticsConsent({ getItem: key => key === ANALYTICS_CONSENT_KEY ? 'granted' : null })).toBe('granted');
    expect(readAnalyticsConsent({ getItem: () => 'yes' })).toBe('unknown');
  });
});
