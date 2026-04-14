'use client';

import { useAuthStore } from '@/features/auth/stores';
import { isProfilePermitted } from '@/features/hr/utils';
import { ShowModalButton } from '@/common/components/ui';

interface Props {
  modalKey: string;
}

export default function ShowRegisterProfileModalButton({ modalKey }: Props) {
  const team = useAuthStore((s) => s.team);

  const isPermitted = isProfilePermitted(team);

  return isPermitted ? (
    <ShowModalButton modalKey={modalKey} name="추가" />
  ) : null;
}
