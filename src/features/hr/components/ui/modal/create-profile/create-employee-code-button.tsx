'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { UseFormSetValue, UseFormSetError } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import type { CreateEmployeeProfileRequestDto } from '@/features/hr/schema';
import { getEmployeeCode } from '@/features/hr/server/actions/profiles';
import { useDialogModalState, useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { Button, Spinner } from 'react-bootstrap';

interface Props {
  setError: UseFormSetError<CreateEmployeeProfileRequestDto>;
  setValue: UseFormSetValue<CreateEmployeeProfileRequestDto>;
  modalKey: string;
}

export default function CreateEmployeeCodeButton({
  setError,
  setValue,
  modalKey,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const showAlertModal = useDialogModalState((s) => s.showModal);
  const closeModal = useModalState((s) => s.closeModal);
  const signOut = useAuthStore((s) => s.signOut);

  const mutation = useMutation({
    mutationKey: ['hr', 'employee-code'],
    mutationFn: getEmployeeCode,
    onSuccess: (res) => {
      if (res.code !== 'SU') {
        switch (res.code) {
          case 'UA':
            showAlertModal({
              modal: 'alert',
              title: '세션만료',
              text: '세션이 만료되었습니다. 로그아웃합니다.',
              handleAfterClose: () => {
                closeModal(modalKey);
                signOut();
                router.replace(
                  `/sign-in?redirect=${encodeURIComponent(pathname)}`,
                );
              },
            });
          default:
            setError('employeeCode', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        return;
      }

      setValue('employeeCode', res.result.employeeCode, {
        shouldValidate: true,
      });
    },
    onError: () => {
      setError('employeeCode', {
        message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    },
  });

  const onClick = () => {
    mutation.mutate();
  };

  return (
    <Button variant="primary" onClick={onClick} disabled={mutation.isPending}>
      {mutation.isPending && <Spinner size="sm" />}
      발급
    </Button>
  );
}
