'use client';

import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores';
import { useModalState } from '@/common/stores';
import { isProfilePermitted } from '@/features/hr/utils';

interface Props {
  modalKey: string;
}

export default function ShowProfileModalButton({ modalKey }: Props) {
  const team = useAuthStore((s) => s.team);
  const showModal = useModalState((s) => s.showModal);

  const isPermitted = isProfilePermitted(team);

  const onClick = () => {
    showModal(modalKey);
  };

  return isPermitted ? (
    <Button variant="primary" onClick={onClick} className="me-2">
      사원 정보 수정
    </Button>
  ) : null;
}
