'use client';

import { useShallow } from 'zustand/shallow';
import { Button, Modal } from 'react-bootstrap';

import { useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { EmployeeProfileResponseDto } from '@/features/hr/schema';

interface Props {
  data: EmployeeProfileResponseDto;
}

export default function ProfileModal({ data }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const { team, employeeRole } = useAuthStore(
    useShallow((s) => ({ team: s.team, employeeRole: s.employeeRole })),
  );

  const isOpen = modals.includes('profile');

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal('profile')}
    >
      <Modal.Header closeButton>사원 정보</Modal.Header>
      <Modal.Body>
        <div>{team}</div>
        <div>{employeeRole}</div>
      </Modal.Body>
    </Modal>
  );
}
