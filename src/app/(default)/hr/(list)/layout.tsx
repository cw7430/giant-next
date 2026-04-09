import { ErpListLayout } from '@/common/components/layouts';

export default function HrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ErpListLayout title="인사관리">{children}</ErpListLayout>;
}
