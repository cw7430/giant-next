import { ErpListLayout } from '@/common/components/layouts';

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ErpListLayout title="매출관리">{children}</ErpListLayout>;
}
