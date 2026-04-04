import { redirect } from 'next/navigation';

import { getEmployeeProfiles } from '@/features/hr/server/models/profiles';
import { ErpTeb } from '@/common/components/ui';
import { ProfilesTable } from '@/features/hr/components/views/profiles';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeeProfiles({ searchParams }: Props) {
  const {
    page = '1',
    sortPath = 'employee',
    sortOrder = 'asc',
  } = await searchParams;

  const params = {
    page: Number(page) ?? 1,
    sortPath: (['position', 'department'].includes(sortPath as string)
      ? sortPath
      : 'employee') as 'employee' | 'position' | 'department',
    sortOrder: (sortOrder === 'desc' ? 'desc' : 'asc') as 'desc' | 'asc',
    size: 5,
    blockSize: 5,
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
