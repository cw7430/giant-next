import { ErpTeb } from '@/common/components/ui';

export default function InventoryStock() {
  return (
    <>
      <h1 className="text-center">재고</h1>
      <ErpTeb domain="inventory" />
    </>
  );
}
