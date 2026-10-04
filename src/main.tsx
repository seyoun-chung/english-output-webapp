import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
const AccountRoot = lazy(() => import('./AccountRoot'));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {import.meta.env.VITE_ACCOUNT_SYNC_ENABLED === '1'
      ? <Suspense fallback={<p role="status">로그인 화면을 불러오고 있어요…</p>}><AccountRoot /></Suspense>
      : <App />}
  </StrictMode>,
);
