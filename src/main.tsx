import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PrivacyPolicyPage, TermsPage } from "./PublicInfoPages";
import { AnalyticsConsentBanner } from './AnalyticsConsent';
import "./styles.css";
import "./library-skin.css";
import "./cafe-skin.css";
const AccountRoot = lazy(() => import('./AccountRoot'));

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const publicPage = path === '/privacy'
  ? <PrivacyPolicyPage />
  : path === '/terms'
    ? <TermsPage />
    : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      {publicPage ?? (import.meta.env.VITE_ACCOUNT_SYNC_ENABLED === '1'
        ? <Suspense fallback={<p role="status">로그인 화면을 불러오고 있어요…</p>}><AccountRoot /></Suspense>
        : <App />)}
      <AnalyticsConsentBanner />
    </>
  </StrictMode>,
);
