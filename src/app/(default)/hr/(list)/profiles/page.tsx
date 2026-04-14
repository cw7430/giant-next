import { redirect } from 'next/navigation';

import {
  getEmployeeProfiles,
  getDepartments,
  getPositions,
} from '@/features/hr/server/models/profiles';
import {
  ProfilesTable,
  ProfilesTeb,
} from '@/features/hr/components/views/profiles/list';
import { CreateProfileModal } from '@/features/hr/components/ui';

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
  const profiles = await getEmployeeProfiles(params);
  const departments = await getDepartments();
  const positions = await getPositions();

  if (
    profiles.code != 'SU' ||
    departments.code != 'SU' ||
    positions.code != 'SU'
  ) {
    redirect('/', 'push');
  }

  const modalKey = 'CreateProfile';

  return (
    <>
      <ProfilesTeb modalKey={modalKey} />
      <ProfilesTable data={profiles.result} params={params} />
      <CreateProfileModal
        modalKey={modalKey}
        departments={departments.result}
        positions={positions.result}
      />
    </>
  );
}
