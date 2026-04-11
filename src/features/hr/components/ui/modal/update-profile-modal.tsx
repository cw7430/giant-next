'use client';

import { useShallow } from 'zustand/shallow';
import { Button, Modal } from 'react-bootstrap';

import { useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { EmployeeProfileResponseDto } from '@/features/hr/schema';

interface Props {
  data: EmployeeProfileResponseDto;
}

export default function UpdateProfileModal({ data }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes('profile');
  const isPermitted = team === 'TM100' || team === 'TM200';

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal('profile')}
    >
      <Modal.Header closeButton>사원 정보</Modal.Header>
      <Modal.Body>
        <p>{data.employeeCode}</p>
        <p>{data.employeeName}</p>
        <p>{data.positionName}</p>
        <p>{data.phoneNumber}</p>
        <p>{data.email}</p>
        <p>{data.departmentName}</p>
        <p>{data.teamName}</p>
        <p>{data.employeeRole}</p>
      </Modal.Body>
    </Modal>
  );
}
