'use client';

import { useState, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

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

export default function CreateProfileModal({ modalKey, departments }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const team = useAuthStore((s) => s.team);

  const [departmentCode, setDepartmentCode] = useState<string>('');
  const [teamCode, setTeamCode] = useState<string>('');

  const availableTeams = useMemo(() => {
    const dept = departments.find((d) => d.departmentCode === departmentCode);
    return dept ? dept.teams : [];
  }, [departments, departmentCode]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentCode(e.target.value);
    setTeamCode('');
  };

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
            <Form.Label htmlFor="position">직급</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="position" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="employeeRole">직책</Form.Label>
            <InputGroup>
              <Form.Control type="text" id="employeeRole" />
            </InputGroup>
          </Form.Group>
          <Form.Group as={Container} className="mb-3">
            <Row>
              <Col xs={2}>
                <Form.Label htmlFor="department">부서</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Select id="department" onChange={handleDeptChange}>
                  <option value={''} selected>
                    선택
                  </option>
                  {departments.map((dept) => (
                    <option value={dept.departmentCode} key={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={1}>
                <Form.Label htmlFor="team">팀</Form.Label>
              </Col>
              <Col xs={5}>
                <Form.Select
                  id="team"
                  onChange={(e) => setTeamCode(e.target.value)}
                  disabled={!departmentCode}
                >
                  <option value={''} selected>
                    선택
                  </option>
                  {availableTeams.map((team) => (
                    <option value={team.teamCode} key={team.teamId}>
                      {team.teamName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
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
