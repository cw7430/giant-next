'use client';

import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores';
import { useModalState } from '@/common/stores';

export default function ShowProfileModalButton() {
  const team = useAuthStore((s) => s.team);
  const showModal = useModalState((s) => s.showModal);

  const isPermitted = team === 'TM100' || team === 'TM200';

  const onClick = () => {
    showModal('profile');
  };

  return (
    <>
      {isPermitted && (
        <Button variant="primary" onClick={onClick}>
          사원 정보 수정
        </Button>
      )}
    </>
  );
}
