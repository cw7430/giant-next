'use client';

import { useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  createEmployeeProfileSchema,
  type CreateEmployeeProfileRequestDto,
  type DepartmentsResponseDto,
  type PositionsResponseDto,
} from '@/features/hr/schema';

interface Props {
  modalKey: string;
  departments: DepartmentsResponseDto;
  positions: PositionsResponseDto;
}

export default function CreateProfileModal({
  modalKey,
  departments,
  positions,
}: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes(modalKey);
  const isPermitted = team === 'TM100' || team === 'TM200';

  const [departmentCode, setDepartmentCode] = useState<string>('');
  const [teamCode, setTeamCode] = useState<string>('');

  const createProfileForm = useForm<CreateEmployeeProfileRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(createEmployeeProfileSchema),
    defaultValues: {
      employeeCode: '',
      employeeName: '',
      positionCode: '',
      employeeRole: undefined,
      teamCode: '',
      phoneNumber: '',
      email: '',
    },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = createProfileForm;

  const availableTeams = useMemo(() => {
    const dept = departments.find((d) => d.departmentCode === departmentCode);
    return dept ? dept.teams : [];
  }, [departments, departmentCode]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentCode(e.target.value);
    setTeamCode('');
  };

  const onSubmit: SubmitHandler<CreateEmployeeProfileRequestDto> = (req) => {
    alert(JSON.stringify(req, null, 2));
  };

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal(modalKey)}
    >
      <Modal.Header closeButton>사원 등록</Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="create-profile.employee-code">
            <Form.Label>사번</Form.Label>
            <InputGroup>
              <Form.Control type="text" readOnly={true} />
              <Button variant="primary">발급</Button>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.employee-name">
            <Form.Label>이름</Form.Label>
            <InputGroup>
              <Form.Control type="text" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.position">
            <Form.Label>직급</Form.Label>
            <InputGroup>
              <Form.Select>
                <option value="" selected>
                  선택
                </option>
                {positions.map((pstn) => (
                  <option value={pstn.positionCode} key={pstn.positionId}>
                    {pstn.positionName}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.employee-role">
            <Form.Label>직책</Form.Label>
            <InputGroup>
              <Form.Select>
                <option value="" selected>
                  선택
                </option>
                <option value="EMPLOYEE" selected>
                  팀원
                </option>
                <option value="TEAM_CHIEF" selected>
                  팀장
                </option>
                <option value="DEPARTMENT_CHIEF" selected>
                  총책
                </option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Container} className="mb-3">
            <Row>
              <Col xs={2}>
                <Form.Label htmlFor="create-profile.department">
                  부서
                </Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Select
                  id="create-profile.department"
                  onChange={handleDeptChange}
                >
                  <option value="" selected>
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
                <Form.Label htmlFor="create-profile.team">팀</Form.Label>
              </Col>
              <Col xs={5}>
                <Form.Select
                  id="create-profile.team"
                  onChange={(e) => setTeamCode(e.target.value)}
                  disabled={!departmentCode}
                >
                  <option value="" selected>
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
          <Form.Group className="mb-3" controlId="create-profile.phone-number">
            <Form.Label>전화번호</Form.Label>
            <InputGroup>
              <Form.Control type="text" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.email">
            <Form.Label>이메일</Form.Label>
            <InputGroup>
              <Form.Control type="text" />
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
