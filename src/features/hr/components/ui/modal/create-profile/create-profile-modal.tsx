'use client';

import { useState, useMemo, useRef } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
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
import CreateEmployeeCodeButton from './create-employee-code-button';

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

  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const [departmentCode, setDepartmentCode] = useState<string>('');

  const handleHypenPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    if (!phoneNumberRef.current) return;
    phoneNumberRef.current.value = formattedValue;
  };

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
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = createProfileForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('employeeCode');
      clearErrors('employeeName');
      clearErrors('positionCode');
      clearErrors('employeeRole');
      clearErrors('teamCode');
      clearErrors('phoneNumber');
      clearErrors('email');
    }
  };

  const availableTeams = useMemo(() => {
    const dept = departments.find((d) => d.departmentCode === departmentCode);
    return dept ? dept.teams : [];
  }, [departments, departmentCode]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentCode(e.target.value);
    setValue('teamCode', '');
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
      <Form
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleFormChange}
        noValidate
      >
        <Modal.Body>
          <Form.Group className="mb-3" controlId="create-profile.employee-code">
            <Form.Label>사번</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="employeeCode"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    readOnly={true}
                    placeholder="사번을 발급 받아 주세요"
                    {...field}
                    isInvalid={!!errors.employeeCode}
                  />
                )}
              />
              <CreateEmployeeCodeButton
                modalKey={modalKey}
                setValue={setValue}
                setError={setError}
              />
              <Form.Control.Feedback type="invalid">
                {errors.employeeCode?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.employee-name">
            <Form.Label>이름</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="employeeName"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="사원 이름을 입력해주세요"
                    {...field}
                    isInvalid={!!errors.employeeName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.employeeName?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.position">
            <Form.Label>직급</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="positionCode"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.positionCode}>
                    <option value="">선택</option>
                    {positions.map((pstn) => (
                      <option value={pstn.positionCode} key={pstn.positionId}>
                        {pstn.positionName}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.positionCode?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.employee-role">
            <Form.Label>직책</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="employeeRole"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.employeeRole}>
                    <option value="">선택</option>
                    <option value="EMPLOYEE">팀원</option>
                    <option value="TEAM_CHIEF">팀장</option>
                    <option value="DEPARTMENT_CHIEF">총책</option>
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.employeeRole?.message}
              </Form.Control.Feedback>
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
                  <option value="">선택</option>
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
                <Controller
                  control={control}
                  name="teamCode"
                  render={({ field }) => (
                    <Form.Select
                      id="create-profile.team"
                      {...field}
                      isInvalid={!!errors.teamCode}
                    >
                      <option value="">선택</option>
                      {availableTeams.map((team) => (
                        <option value={team.teamCode} key={team.teamId}>
                          {team.teamName}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Col>
            </Row>
            <Form.Control.Feedback type="invalid">
              {errors.teamCode?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.phone-number">
            <Form.Label>전화번호</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="사원 휴대전화번호를 입력해주세요"
                    {...field}
                    isInvalid={!!errors.phoneNumber}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="create-profile.email">
            <Form.Label>이메일</Form.Label>
            <InputGroup>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="사원 이메일을 입력해주세요"
                    {...field}
                    isInvalid={!!errors.email}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
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
