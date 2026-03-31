'use client';
import { Button } from 'react-bootstrap';

export default function ButtonGroup() {
  return (
    <>
      <Button variant="outline-light" type="button">
        내프로필
      </Button>
      <Button variant="outline-light" type="button">
        로그아웃
      </Button>
    </>
  );
}
