'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Spinner } from 'react-bootstrap';

import { useAppConfigStore } from '@/common/api/stores';
import { useAuthStore } from '@/features/auth/stores/auth';
import { SignInRequestDto, signInRequestSchema } from '@/features/auth/schema';

export default function SignInForm() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);

  const { isAutoSignIn, setAutoSignIn } = useAppConfigStore();
  const { signIn } = useAuthStore();

  const signInForm = useForm<SignInRequestDto>({
    resolver: zodResolver(signInRequestSchema),
    defaultValues: { userName: '', password: '', isAuto: isAutoSignIn },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = signInForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('userName');
      clearErrors('password');
    }
  };

  const onSubmit: SubmitHandler<SignInRequestDto> = async (req) => {
    setLoading(true);
    alert(JSON.stringify(req));
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
      <Form.Group className="mb-2" controlId="sign-in.user-name">
        <Form.Label>아이디</Form.Label>
        <Controller
          control={control}
          name="userName"
          render={({ field }) => (
            <Form.Control
              type="text"
              placeholder="아이디를 입력해주세요"
              {...field}
              isInvalid={!!errors.userName}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.userName?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2" controlId="sign-in.password">
        <Form.Label>비밀번호</Form.Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Form.Control
              type="text"
              placeholder="비밀번호를 입력해주세요"
              {...field}
              isInvalid={!!errors.password}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Controller
        control={control}
        name="isAuto"
        render={({ field }) => (
          <Form.Check
            type="checkbox"
            label="자동 로그인"
            id="sign-in.is-auto"
            className="mb-3"
            checked={field.value}
            disabled={isLoading}
            onChange={(e) => {
              field.onChange(e.currentTarget.checked);
              setAutoSignIn(e.currentTarget.checked);
            }}
          />
        )}
      />

      {errors.root && (
        <div className="d-block invalid-feedback mb-2">
          {errors.root.message}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-100 mt-2"
        disabled={isLoading}
      >
        {isLoading && <Spinner size="sm" />}
        로그인
      </Button>
    </Form>
  );
}
