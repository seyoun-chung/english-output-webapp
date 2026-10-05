import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LegalLinks, PrivacyPolicyPage, TermsPage } from '../src/PublicInfoPages';

describe('public information pages', () => {
  it('links to privacy and terms from the public login surface', () => {
    const html = renderToStaticMarkup(<LegalLinks />);
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('개인정보처리방침');
    expect(html).toContain('href="/terms"');
    expect(html).toContain('이용약관');
  });

  it('describes actual account data, service providers, audio handling and deletion', () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />);
    for (const text of [
      'Google 로그인', '학습 위치', 'Supabase 서울 지역', 'Vercel',
      '녹음은 서버에 업로드하지 않습니다', '최대 10개', '지원 연락처',
      '최초 유입 경로(UTM)', '분석 기록에는 작문 원문과 녹음을 포함하지 않습니다',
      '서비스 운영, 품질 개선, 이용 현황 분석, 통계·연구, 서비스 성과 확인 및 자료 작성',
      '개인을 식별할 수 없도록 집계하거나 가공합니다',
    ]) expect(html).toContain(text);
    expect(html).not.toContain('완전한 보안을 보장합니다');
    expect(html).not.toContain('@gmail.com');
  });

  it('states learning-use and content-redistribution limits without claiming permission', () => {
    const html = renderToStaticMarkup(<TermsPage />);
    for (const text of ['개인 학습용', '재배포', '중단 없는 제공', '각 권리자']) {
      expect(html).toContain(text);
    }
    expect(html).not.toContain('운영진의 허락을 받았습니다');
    expect(html).not.toContain('@gmail.com');
  });
});
