'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores';
import { signOutAction } from '@/features/auth/server/actions';

export default function SignOutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = useAuthStore((s) => s.signOut);

  const mutation = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: signOutAction,
    onSettled: () => {
      signOut();
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
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
