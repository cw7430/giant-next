'use client';

import { useAuthStore } from '@/features/auth/stores';
import { isProfilePermitted } from '@/features/hr/utils';
import { ShowModalButton } from '@/common/components/ui';

interface Props {
  modalKey: string;
}

export default function ShowProfileModalButton({ modalKey }: Props) {
  const team = useAuthStore((s) => s.team);

  const isPermitted = isProfilePermitted(team);

  return isPermitted ? (
    <ShowModalButton
      modalKey={modalKey}
      name="사원 정보 수정"
      className="me-2"
    />
  ) : null;
}
