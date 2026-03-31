export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_APP_ENV: 'local' | 'development' | 'production';
      readonly API_URL: string;
    }
  }
}
