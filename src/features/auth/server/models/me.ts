import { cookies } from "next/headers";

export const me = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return false;
  }

  return true;
};