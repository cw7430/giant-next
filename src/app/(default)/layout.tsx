import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { DefaultHeader, DefaultFooter } from '@/common/components/layouts';
import { AuthInitializer } from '@/features/auth/components/ui';
import { DialogModal } from '@/common/components/ui';

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    redirect('/sign-in', 'replace');
  }

  return (
    <>
      <AuthInitializer />
      <DialogModal />
      <div className="bg-light text-dark">
        <DefaultHeader />
        {children}
        <DefaultFooter />
      </div>
    </>
  );
}
