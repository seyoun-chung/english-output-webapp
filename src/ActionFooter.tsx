import type { ReactNode } from 'react';

type Props = { back?: ReactNode; middle?: ReactNode; forward?: ReactNode };

export function ActionFooter({ back, middle, forward }: Props) {
  const occupied = [back && 'back', middle && 'middle', forward && 'forward'].filter(Boolean);
  return <div className="action-footer" role="group" aria-label="Page actions" data-actions={occupied.length} data-layout={occupied.join('-')}>
    {back && <div className="action-footer-back">{back}</div>}
    {middle && <div className="action-footer-middle">{middle}</div>}
    {forward && <div className="action-footer-forward">{forward}</div>}
  </div>;
}
