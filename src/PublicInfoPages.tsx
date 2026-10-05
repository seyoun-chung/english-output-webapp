import { useEffect } from 'react';
import './public-info.css';

export function LegalLinks() {
  return (
    <nav className="legal-links" aria-label="서비스 안내">
      <a href="/privacy">개인정보처리방침</a>
      <a href="/terms">이용약관</a>
    </nav>
  );
}

function PublicPage({ title, children }: { title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} · English Output`;
  }, [title]);

  return (
    <main className="public-info-page">
      <a className="public-info-home" href="/">← English Output</a>
      <article>
        <header>
          <p className="public-info-label">English Output</p>
          <h1>{title}</h1>
          <p className="public-info-date">시행일: 2026년 10월 5일</p>
        </header>
        {children}
      </article>
      <LegalLinks />
    </main>
  );
}

export function PrivacyPolicyPage() {
  return (
    <PublicPage title="개인정보처리방침">
      <section>
        <h2>수집하는 정보</h2>
        <p>Google 로그인 시 제공되는 계정 식별자, 이메일, 프로필 정보를 사용합니다.</p>
        <p>학습 위치, 진도, 자기평가, 힌트 사용, 답변과 작문을 계정별로 저장합니다.</p>
      </section>
      <section>
        <h2>이용 목적</h2>
        <p>로그인한 사용자를 구분하고, 여러 기기에서 학습 기록을 저장하고 이어서 보여주기 위해 사용합니다.</p>
      </section>
      <section>
        <h2>저장 위치와 외부 서비스</h2>
        <p>Google은 로그인에, Supabase 서울 지역은 계정과 학습 기록 저장에, Vercel은 웹 앱 제공에 사용됩니다.</p>
        <p>빠른 복구를 위한 기록 사본이 사용 중인 브라우저에도 남을 수 있습니다. 공용 기기에서는 로그아웃하고 브라우저의 사이트 데이터를 삭제해 주세요.</p>
      </section>
      <section>
        <h2>녹음</h2>
        <p>녹음은 서버에 업로드하지 않습니다. 현재 브라우저에서만 임시로 사용되며 화면 이동, 새로고침 또는 탭 이탈 시 정리됩니다.</p>
      </section>
      <section>
        <h2>공유와 보관</h2>
        <p>개인정보를 판매하거나 광고에 사용하지 않습니다. 서비스 운영, 보안 또는 법적 의무에 필요한 경우에만 위 서비스 제공자와 처리합니다.</p>
        <p>계정 기록은 삭제 요청 전까지 보관할 수 있습니다. 서버 복구 사본은 계정당 최대 10개이며, 브라우저 사본은 사이트 데이터를 지울 때까지 남을 수 있습니다.</p>
      </section>
      <section>
        <h2>이용자의 선택</h2>
        <p>언제든 로그아웃하거나 브라우저의 사이트 데이터를 삭제할 수 있습니다. 서버의 학습 기록과 계정 데이터 삭제는 Google 로그인 화면의 지원 연락처로 요청해 주세요.</p>
      </section>
      <section>
        <h2>보호 조치</h2>
        <p>HTTPS와 사용자별 데이터 접근 제한을 적용합니다. 다만 인터넷 서비스의 완전한 보안을 보장할 수는 없습니다.</p>
      </section>
    </PublicPage>
  );
}

export function TermsPage() {
  return (
    <PublicPage title="이용약관">
      <section>
        <h2>서비스 목적</h2>
        <p>English Output은 사용자가 보유한 영어 교재의 내용을 반복해서 말하고 쓰며 복습하도록 돕는 개인 학습용 웹 앱입니다.</p>
      </section>
      <section>
        <h2>이용 조건</h2>
        <p>사용자는 자신이 정당하게 이용할 수 있는 교재와 강의 범위에서 앱을 사용해야 합니다. 앱의 학습 콘텐츠를 복제, 재배포하거나 공개 게시해서는 안 됩니다.</p>
      </section>
      <section>
        <h2>사용자 작성 내용</h2>
        <p>답변과 작문에는 민감한 개인정보를 입력하지 마세요. 사용자는 자신이 작성한 내용에 대한 책임을 집니다.</p>
      </section>
      <section>
        <h2>서비스 변경과 책임</h2>
        <p>시험 운영 중 기능과 내용이 변경되거나 서비스가 일시 중단될 수 있습니다. 서비스의 중단 없는 제공이나 기록의 영구 보관을 보장하지 않습니다.</p>
        <p>이 앱은 학습을 돕는 도구이며 시험 점수, 자격 또는 특정 학습 결과를 보장하지 않습니다.</p>
      </section>
      <section>
        <h2>콘텐츠 권리</h2>
        <p>교재와 강의 콘텐츠의 권리는 각 권리자에게 있습니다. 이 앱의 이용은 해당 콘텐츠를 다시 배포할 권리를 부여하지 않습니다.</p>
      </section>
    </PublicPage>
  );
}
