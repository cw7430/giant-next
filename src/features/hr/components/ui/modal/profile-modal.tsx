'use client';

import { Button, Modal } from 'react-bootstrap';

import { useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';

export default function ProfileModal() {
  const { modals, closeModal } = useModalState();
  const { team, employeeRole } = useAuthStore();

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
