import clsx from 'clsx';

import styles from './page.module.css';

export default function SignIn() {
  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 bg-background p-4">
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
        <div className={clsx('position-absolute', styles['glow-primary'])} />
        <div className={clsx('position-absolute', styles['glow-accent'])} />
      </div>
      <div
        className={clsx(
          'w-100 position-relative shadow-lg border-0 text-center',
          styles['glass-card'],
          'card',
        )}
      >
        <div className="text-center pb-2 card-body">
          <div className="card-title h5">로그인</div>
          <div className="card-subtitle h6 text-muted">Giant</div>
        </div>
        <div className="text-start pb-2 card-body">폼</div>
      </div>
    </main>
  );
}
