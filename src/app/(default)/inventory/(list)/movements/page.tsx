import { ErpTeb } from '@/common/components/ui';

export default function InventoryMovement() {
  return (
    <>
      <h1 className="text-center">입출고</h1>
      <ErpTeb domain="inventory" />
    </>
  );
}
