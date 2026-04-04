import { redirect } from 'next/navigation';

import { EmployeeProfileListRequestDto } from '@/features/hr/schema';
import { getEmployeeProfiles } from '@/features/hr/server/models/profiles';
import { ErpTeb } from '@/common/components/ui';
import { ProfilesTable } from '@/features/hr/components/views/profiles';

export default async function EmployeeProfiles() {
  const initParams: EmployeeProfileListRequestDto = {
    page: 1,
    size: 5,
    blockSize: 5,
    sortPath: 'employee',
    sortOrder: 'asc',
  };
  const response = await getEmployeeProfiles(initParams);

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
