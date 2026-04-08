'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores';
import { signOutAction } from '@/features/auth/server/actions';

export default function SignOutButton() {
  const router = useRouter();

  const { signOut } = useAuthStore();

  const mutation = useMutation({
    mutationFn: signOutAction,
    onSuccess: () => {
      signOut();
      router.replace('/sign-in');
    },
    onError: () => {
      signOut();
      router.replace('/sign-in');
    },
  });

  const onClick = async () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="outline-light"
      type="button"
      onClick={onClick}
      disabled={mutation.isPending}
    >
      로그아웃
    </Button>
  );
}
