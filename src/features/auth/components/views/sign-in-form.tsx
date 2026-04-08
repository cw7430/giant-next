'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Spinner } from 'react-bootstrap';

import { useAppConfigStore } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { SignInRequestDto, signInRequestSchema } from '@/features/auth/schema';
import { signInAction } from '@/features/auth/server/actions';

export default function SignInForm() {
  const router = useRouter();

  const { isAutoSignIn, setAutoSignIn } = useAppConfigStore();
  const { signIn } = useAuthStore();

  const signInForm = useForm<SignInRequestDto>({
    mode: 'onBlur',
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

  const mutation = useMutation({
    mutationFn: signInAction,
    onSuccess: (res) => {
      if (res.code !== 'SU') {
        switch (res.code) {
          case 'LGE':
          case 'VE':
            setError('root', {
              message: '아이디 또는 비밀번호가 올바르지 않습니다.',
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

      signIn(res.result);
      router.replace('/');
    },
    onError: () => {
      setError('root', {
        message: '서버에서 문제가 발생했습니다.',
      });
    },
  });

  const onSubmit: SubmitHandler<SignInRequestDto> = (req) => {
    mutation.mutate(req);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      noValidate
    >
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
              disabled={mutation.isPending}
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
              type="password"
              placeholder="비밀번호를 입력해주세요"
              {...field}
              isInvalid={!!errors.password}
              disabled={mutation.isPending}
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
            disabled={mutation.isPending}
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
        className="w-100 mt-2 mb-3"
        disabled={mutation.isPending}
      >
        {mutation.isPending && <Spinner size="sm" />}
        로그인
      </Button>
    </Form>
  );
}
