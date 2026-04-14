'use client';

import { useShallow } from 'zustand/shallow';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';

import { useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import {
  DepartmentsResponseDto,
  PositionsResponseDto,
} from '@/features/hr/schema';

interface Props {
  modalKey: string;
  departments: DepartmentsResponseDto;
  positions: PositionsResponseDto;
}

export default function CreateProfileModal({ modalKey }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes(modalKey);
  const isPermitted = team === 'TM100' || team === 'TM200';

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal(modalKey)}
    >
      <Modal.Header closeButton>사원 등록</Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="employeeCode">사번</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="employeeCode" readOnly={true} />
              <Button variant="primary">발급</Button>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="employeeName">이름</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="employeeName" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="phoneNumber">전화번호</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="phoneNumber" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">이메일</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="email" />
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit">
            등록
          </Button>
          <Button variant="danger" onClick={() => closeModal(modalKey)}>
            닫기
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
