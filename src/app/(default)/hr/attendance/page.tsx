import { ErpTeb } from '@/common/components/ui';

export default function EmployeeAttendances() {
  return (
    <>
      <h1 className="text-center">근태</h1>
      <ErpTeb domain="hr" />
    </>
  );
}
