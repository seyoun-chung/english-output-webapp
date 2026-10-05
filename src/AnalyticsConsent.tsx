import { useEffect, useState } from 'react';
import {
  ANALYTICS_CONSENT_EVENT,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  startGoogleAnalytics,
  stopGoogleAnalytics,
  type AnalyticsConsent,
} from './googleAnalytics';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

function localConsent(): AnalyticsConsent {
  return readAnalyticsConsent(typeof localStorage === 'undefined' ? null : localStorage);
}
export function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>(() => localConsent());
  const configured = typeof measurementId === 'string' && measurementId.length > 0;

  useEffect(() => {
    const listener = (event: Event) => setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);
    if (consent === 'granted') startGoogleAnalytics(measurementId);
    if (consent === 'denied') stopGoogleAnalytics();
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  }, [consent]);

  if (!configured || consent !== 'unknown') return null;
  const choose = (next: Exclude<AnalyticsConsent, 'unknown'>) => {
    saveAnalyticsConsent(next, localStorage);
    if (next === 'granted') startGoogleAnalytics(measurementId);
    else stopGoogleAnalytics();
  };
  return (
    <aside className="analytics-consent" aria-label="방문 분석 선택">
      <p><strong>방문 분석을 허용할까요?</strong> 익명 방문·유입 경로와 화면 흐름만 확인합니다. 이메일, 학습 문장, 작문, 녹음은 보내지 않습니다.</p>
      <div>
        <button className="secondary" onClick={() => choose('denied')}>허용 안 함</button>
        <button className="primary" onClick={() => choose('granted')}>방문 분석 허용</button>
      </div>
    </aside>
  );
}

export function AnalyticsPreferenceControl() {
  const [consent, setConsent] = useState<AnalyticsConsent>(() => localConsent());
  useEffect(() => {
    const listener = (event: Event) => setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  }, []);
  if (!measurementId) return null;
  const choose = (next: Exclude<AnalyticsConsent, 'unknown'>) => {
    saveAnalyticsConsent(next, localStorage);
    if (next === 'granted') startGoogleAnalytics(measurementId);
    else stopGoogleAnalytics();
  };
  return (
    <div className="analytics-preference" aria-label="방문 분석 설정">
      <span>현재 설정: {consent === 'granted' ? '허용' : consent === 'denied' ? '허용 안 함' : '선택 전'}</span>
      <button className="secondary" onClick={() => choose('denied')}>허용 안 함</button>
      <button className="secondary" onClick={() => choose('granted')}>허용</button>
    </div>
  );
}

