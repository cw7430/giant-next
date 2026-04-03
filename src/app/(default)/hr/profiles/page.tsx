import { redirect } from 'next/navigation';

import { EmployeeProfileListRequestDto } from '@/features/hr/schema';
import { getEmployeeProfiles } from '@/features/hr/server/models/profiles';

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
    <div>
      <h1 className="text-center">프로필</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
