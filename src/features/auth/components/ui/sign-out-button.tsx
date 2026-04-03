'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';

import { useAppState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { signOutAction } from '@/features/auth/server/actions';

export default function SignOutButton() {
  const router = useRouter();

  const { isLoading, setLoading } = useAppState();

  const { signOut } = useAuthStore();

  const onClick = async () => {
    setLoading(true);
    try {
      await signOutAction();
    } finally {
      signOut();
      setLoading(false);
      router.replace('/sign-in');
    }
  };

  return (
    <Button
      variant="outline-light"
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      로그아웃
    </Button>
  );
}
