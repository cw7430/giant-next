'use client';
import { Button } from 'react-bootstrap';

import { SignOutButton } from '@/features/auth/components/ui';

export default function ButtonGroup() {
  return (
    <>
      <Button variant="outline-light" type="button">
        내프로필
      </Button>
      <SignOutButton />
    </>
  );
}
