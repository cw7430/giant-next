'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { EmployeeProfileResponseDto } from '@/features/hr/schema';

interface Props {
  profile: EmployeeProfileResponseDto;
}

export default function ProfilesTableRows({ profile }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const onClick = () => {
    router.push(
      `profiles/${profile.employeeId}?redirect=${encodeURIComponent(`${pathname}?${params}`)}`,
    );
  };

  return (
    <tr style={{ cursor: 'pointer' }} onClick={onClick}>
      <td>{profile.employeeCode}</td>
      <td>{profile.employeeName}</td>
      <td>{profile.phoneNumber}</td>
      <td>{profile.departmentName}</td>
      <td>{profile.positionName}</td>
      <td>{profile.createdAt.toLocaleDateString()}</td>
      <td>{profile.updatedAt.toLocaleDateString()}</td>
    </tr>
  );
}
