declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      REDIS_URL: string;
    }
  }
}

export { };