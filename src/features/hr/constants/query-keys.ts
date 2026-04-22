const ALL_KEY = 'hr';

export const HR_KYES = {
  all: [ALL_KEY] as const,
  createProfile: [ALL_KEY, 'create-profile'] as const,
  generateEmployeeCode: [ALL_KEY, 'generate-employee-code'] as const,
};
