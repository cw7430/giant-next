import { ErpTeb } from '@/common/components/ui';

export default function SalesPayments() {
  return (
    <>
      <h1 className="text-center">매출 기록</h1>
      <ErpTeb domain="sales" />
    </>
  );
}
