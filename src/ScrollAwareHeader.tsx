import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './scroll-aware-header.css';

export function headerVisibility(y: number, anchor: number, visible: boolean, height: number) {
  if (y <= 20) return { visible: true, anchor: y };
  if (Math.abs(y - anchor) < 12) return { visible, anchor };
  return { visible: y < anchor || y <= height + 12, anchor: y };
}

/** Show on entry/up-scroll; clear the reading area on deliberate down-scroll. */
export function ScrollAwareHeader({ children, screenKey, className = '' }: {
  children: ReactNode; screenKey: string; className?: string;
}) {
  const header = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  useLayoutEffect(() => {
    const element = header.current;
    if (!element) return;
    let anchor = window.scrollY;
    let shown = true;
    let frame = 0;
    setVisible(true);
    const show = () => { shown = true; anchor = window.scrollY; setVisible(true); };
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const active = document.activeElement;
        if (active && element.contains(active) && active.matches(':focus-visible')) { show(); return; }
        // Clamp rubber-band scrolling so reaching the bottom cannot look like up-scroll.
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const next = headerVisibility(Math.min(maxY, Math.max(0, window.scrollY)), anchor, shown, element.offsetHeight);
        anchor = next.anchor;
        shown = next.visible;
        setVisible(shown);
      });
    };
    const focus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) show();
    };
    window.addEventListener('scroll', scroll, { passive: true });
    element.addEventListener('focusin', focus);
    element.addEventListener('keydown', show);
    return () => {
      window.removeEventListener('scroll', scroll);
      element.removeEventListener('focusin', focus);
      element.removeEventListener('keydown', show);
      cancelAnimationFrame(frame);
    };
  }, [screenKey]);
  return <header ref={header} className={`topbar scroll-aware-header ${className}${visible ? '' : ' is-scroll-hidden'}`}>{children}</header>;
}
