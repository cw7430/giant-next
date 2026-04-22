'use client';

import { useState, useMemo, useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import {
  Button,
  Modal,
  Form,
  InputGroup,
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

  const [departmentCode, setDepartmentCode] = useState<string>('');

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

  const sortedPositions = useMemo(() => {
    return [...positions].sort(
      (a, b) => Number(b.positionId) - Number(a.positionId),
    );
  }, [positions]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentCode(e.target.value);
    setValue('teamCode', '');
  };

  const onSubmit: SubmitHandler<CreateEmployeeProfileRequestDto> = (req) => {
    alert(JSON.stringify(req, null, 2));
  };

  useEffect(() => {
    if (!isOpen) {
      createProfileForm.reset();
      setDepartmentCode('');
    }
  }, [isOpen]);

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
                    maxLength={20}
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
                    {sortedPositions.map((pstn) => (
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
          <Row>
            <Form.Group
              as={Col}
              className="mb-3"
              controlId="create-profile.department"
            >
              <Form.Label>부서</Form.Label>
              <InputGroup>
                <Form.Select
                  onChange={handleDeptChange}
                  isInvalid={!!errors.teamCode}
                >
                  <option value="">선택</option>
                  {departments.map((dept) => (
                    <option value={dept.departmentCode} key={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.teamCode?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group
              as={Col}
              className="mb-3"
              controlId="create-profile.team"
            >
              <Form.Label>팀</Form.Label>
              <InputGroup>
                <Controller
                  control={control}
                  name="teamCode"
                  render={({ field }) => (
                    <Form.Select {...field} isInvalid={!!errors.teamCode}>
                      <option value="">선택</option>
                      {availableTeams.map((team) => (
                        <option value={team.teamCode} key={team.teamId}>
                          {team.teamName}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </InputGroup>
            </Form.Group>
          </Row>
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
                    maxLength={12}
                    onChange={(e) => {
                      const formatted = e.target.value
                        .replace(/[^0-9]/g, '')
                        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
                      field.onChange(formatted);
                    }}
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
                    maxLength={100}
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
