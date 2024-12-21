// Construct a backend URL based on the current environment
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "";
