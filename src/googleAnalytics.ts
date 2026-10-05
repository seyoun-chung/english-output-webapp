export type AnalyticsConsent = 'unknown' | 'granted' | 'denied';

export type AnalyticsPage = {
  screen: string;
  title: string;
  path: string;
};

type DataLayerEntry = IArguments | unknown[];

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const ANALYTICS_CONSENT_KEY = 'english-output:analytics-consent:v1';
export const ANALYTICS_CONSENT_EVENT = 'english-output:analytics-consent-change';
const SCRIPT_ID = 'english-output-google-analytics';
const ALLOWED_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

let activeMeasurementId = '';
let pendingPage: AnalyticsPage | null = null;
let lastPageKey = '';
let lastPageAt = 0;

export function isGaMeasurementId(value: unknown): value is string {
  return typeof value === 'string' && /^G-[A-Z0-9]+$/u.test(value.trim());
}

export function readAnalyticsConsent(storage: Pick<Storage, 'getItem'> | null): AnalyticsConsent {
  if (!storage) return 'unknown';
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function sanitizeAnalyticsLocation(rawUrl: string, logicalPath: string): string {
  const url = new URL(rawUrl, 'https://english-output.invalid');
  const safe = new URL(logicalPath, url.origin);
  for (const key of ALLOWED_UTM_KEYS) {
    const value = url.searchParams.get(key)?.trim().slice(0, 100);
    if (value) safe.searchParams.set(key, value);
  }
  return safe.toString();
}

export function buildPageViewPayload(page: AnalyticsPage, rawUrl: string) {
  return {
    page_title: page.title,
    page_location: sanitizeAnalyticsLocation(rawUrl, page.path),
    page_path: page.path,
    app_screen: page.screen,
  } as const;
}

function emitPage(page: AnalyticsPage) {
  if (!activeMeasurementId || !window.gtag) return;
  const key = `${page.screen}|${page.path}`;
  const now = Date.now();
  if (key === lastPageKey && now - lastPageAt < 1_000) return;
  lastPageKey = key;
  lastPageAt = now;
  window.gtag('event', 'page_view', buildPageViewPayload(page, window.location.href));
}

function clearFirstPartyAnalyticsCookies() {
  for (const item of document.cookie.split(';')) {
    const name = item.split('=')[0]?.trim();
    if (!name || !(name === '_ga' || name.startsWith('_ga_'))) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}

export function startGoogleAnalytics(measurementId: unknown): boolean {
  if (!isGaMeasurementId(measurementId)) return false;
  const nextMeasurementId = measurementId.trim();
  if (activeMeasurementId === nextMeasurementId && document.getElementById(SCRIPT_ID)) return true;
  activeMeasurementId = nextMeasurementId;
  window.dataLayer ??= [];
  window.gtag ??= function gtag() { window.dataLayer?.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('config', activeMeasurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(activeMeasurementId)}`;
    document.head.append(script);
  }
  if (pendingPage) emitPage(pendingPage);
  return true;
}

export function stopGoogleAnalytics() {
  if (window.gtag && activeMeasurementId) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  activeMeasurementId = '';
  clearFirstPartyAnalyticsCookies();
}

export function saveAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unknown'>, storage: Pick<Storage, 'setItem'> | null) {
  try { storage?.setItem(ANALYTICS_CONSENT_KEY, consent); } catch { /* The choice still applies for this page. */ }
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
}

export function trackAnalyticsPage(page: AnalyticsPage) {
  pendingPage = page;
  emitPage(page);
}
