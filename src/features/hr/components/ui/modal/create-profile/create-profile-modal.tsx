'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';

import { useModalState, useDialogModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import {
  createEmployeeProfileSchema,
  type CreateEmployeeProfileRequestDto,
  type DepartmentsResponseDto,
  type PositionsResponseDto,
} from '@/features/hr/schema';
import { formatPhoneNumber } from '@/common/utils';
import { sortPositionsDesc } from '@/features/hr/utils';
import CreateEmployeeCodeButton from './create-employee-code-button';
import { createProfile } from '@/features/hr/server/actions/profiles/profiles';
import { HR_KEYS } from '@/features/hr/constants';

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
  const router = useRouter();
  const pathname = usePathname();

  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const showDialogModal = useDialogModalState((s) => s.showModal);
  const signOut = useAuthStore((s) => s.signOut);
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes(modalKey);
  const isCreatingEmployeeCode =
    useIsMutating({ mutationKey: HR_KEYS.generateEmployeeCode }) > 0;
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
    watch,
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
    return sortPositionsDesc(positions);
  }, [positions]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentCode(e.target.value);
    setValue('teamCode', '');
  };

  const mutation = useMutation({
    mutationKey: HR_KEYS.createProfile,
    mutationFn: createProfile,
    onSuccess: (res) => {
      if (res.code !== 'SU') {
        switch (res.code) {
          case 'UA':
            showDialogModal({
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
            break;
          case 'FB':
            showDialogModal({
              modal: 'alert',
              title: '권한 오류',
              text: '권한이 없습니다.',
              handleAfterClose: () => {
                closeModal(modalKey);
              },
            });
            break;
          case 'VE':
            setError('root', {
              message: '입력 값이 잘못 되었습니다.',
            });
            break;
          default:
            setError('root', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        return;
      }
      showDialogModal({
        modal: 'alert',
        title: '성공',
        text: '사원 등록이 성공하였습니다.',
        handleAfterClose: () => {
          closeModal(modalKey);
          router.push('/hr/profiles');
        },
      });
    },
    onError: () => {
      setError('employeeCode', {
        message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    },
  });

  const onSubmit: SubmitHandler<CreateEmployeeProfileRequestDto> = async (
    req,
  ) => {
    showDialogModal({
      modal: 'confirm',
      title: '확인',
      text: '등록하시겠습니까?',
      handleAfterClose: () => {
        mutation.mutate(req);
      },
    });
  };

  const employeeCode = watch('employeeCode');

  useEffect(() => {
    if (!isOpen) {
      createProfileForm.reset();
      setDepartmentCode('');
    }
    if (isOpen) {
      if (!isPermitted) {
        showDialogModal({
          modal: 'alert',
          title: '권한 오류',
          text: '권한이 없습니다.',
          handleAfterClose: () => {
            closeModal(modalKey);
          },
        });
      }
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
                    disabled={mutation.isPending || isCreatingEmployeeCode}
                  />
                )}
              />
              <CreateEmployeeCodeButton
                modalKey={modalKey}
                setValue={setValue}
                setError={setError}
                employeeCode={employeeCode}
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
                    disabled={mutation.isPending || isCreatingEmployeeCode}
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
                  <Form.Select
                    {...field}
                    isInvalid={!!errors.positionCode}
                    disabled={mutation.isPending || isCreatingEmployeeCode}
                  >
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
                  <Form.Select
                    {...field}
                    isInvalid={!!errors.employeeRole}
                    disabled={mutation.isPending || isCreatingEmployeeCode}
                  >
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
                  disabled={mutation.isPending || isCreatingEmployeeCode}
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
                    <Form.Select
                      {...field}
                      isInvalid={!!errors.teamCode}
                      disabled={
                        !departmentCode ||
                        mutation.isPending ||
                        isCreatingEmployeeCode
                      }
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
                    onChange={(e) =>
                      field.onChange(formatPhoneNumber(e.target.value))
                    }
                    disabled={mutation.isPending || isCreatingEmployeeCode}
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
                    disabled={mutation.isPending || isCreatingEmployeeCode}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {errors.root && (
            <div className="d-block invalid-feedback mb-2">
              {errors.root.message}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="submit"
            disabled={mutation.isPending || isCreatingEmployeeCode}
          >
            {mutation.isPending && <Spinner size="sm" />}
            등록
          </Button>
          <Button
            variant="danger"
            onClick={() => closeModal(modalKey)}
            disabled={mutation.isPending || isCreatingEmployeeCode}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
