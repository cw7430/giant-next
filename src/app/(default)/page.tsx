import clsx from 'clsx';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-100 px-3 text-center">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col d-flex justify-content-end">
            <div
              className={clsx(
                'p-4 border border-danger bg-danger-subtle rounded cursor-pointer h-100 d-flex justify-content-center align-items-center',
                styles['min-contents-block'],
              )}
            >
              재고관리
            </div>
          </div>
          <div className="col d-flex justify-content-start">
            <div
              className={clsx(
                'p-4 border border-warning bg-warning-subtle rounded cursor-pointer h-100 d-flex justify-content-center align-items-center',
                styles['min-contents-block'],
              )}
            >
              매출관리
            </div>
          </div>
        </div>
        <div className="row g-4 mt-3">
          <div className="col d-flex justify-content-center">
            <div
              className={clsx(
                'p-4 border border-primary bg-primary-subtle rounded cursor-pointer h-100 d-flex justify-content-center align-items-center',
                styles['min-contents-block'],
              )}
            >
              인사관리
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
