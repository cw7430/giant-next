'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'react-bootstrap';

export default function NavProfileListButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  const redirectTo =
    redirect && redirect.startsWith('/')
      ? redirect
      : '/hr/profiles?page=1&sortPath=employee&sortOrder=asc';

  const onClick = () => {
    router.push(redirectTo);
  };

  return (
    <Button variant="secondary" onClick={onClick}>
      목록으로
    </Button>
  );
}
