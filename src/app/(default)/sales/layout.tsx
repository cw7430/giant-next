import { ErpLayout } from '@/common/components/layouts';

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ErpLayout title="매출관리">{children}</ErpLayout>;
}
