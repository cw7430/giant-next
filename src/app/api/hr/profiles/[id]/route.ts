import { NextResponse } from 'next/server';

import { getEmployeeProfile } from '@/features/hr/server/models/profiles';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await getEmployeeProfile(id);
  return NextResponse.json(res);
}
