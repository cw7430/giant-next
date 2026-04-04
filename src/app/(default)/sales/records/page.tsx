import { ErpTeb } from '@/common/components/ui';

export default function SalesRecords() {
  return (
    <>
      <h1 className="text-center">결제 내역</h1>
      <ErpTeb domain="sales" />
    </>
  );
}
