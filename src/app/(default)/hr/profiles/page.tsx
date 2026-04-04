import { redirect } from 'next/navigation';

import { EmployeeProfileListRequestDto } from '@/features/hr/schema';
import { getEmployeeProfiles } from '@/features/hr/server/models/profiles';
import { ErpTeb } from '@/common/components/ui';
import { ProfilesTable } from '@/features/hr/components/views/profiles';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeeProfiles({ searchParams }: Props) {
  const sParams = await searchParams;

  const page = sParams.page ? Number(sParams.page) : 1;
  const sortPath =
    sParams.sortPath === 'position' || sParams.sortPath === 'department'
      ? sParams.sortPath
      : 'employee';
  const sortOrder = sParams.sortPath === 'desc' ? sParams.sortPath : 'asc';

  const params: EmployeeProfileListRequestDto = {
    page,
    size: 5,
    blockSize: 5,
    sortPath,
    sortOrder,
  };
  const response = await getEmployeeProfiles(params);

  if (response.code != 'SU') {
    redirect('/', 'push');
  }

  return (
    <>
      <ErpTeb domain="hr" />
      <ProfilesTable data={response.result} />
    </>
  );
}
