const ALL_KEY = 'auth';

export const AUTH_KEYS = {
  all: [ALL_KEY] as const,
  signIn: [ALL_KEY, 'sign-in'] as const,
  signOut: [ALL_KEY, 'sign-out'] as const,
  refresh: [ALL_KEY, 'refresh'] as const,
};
