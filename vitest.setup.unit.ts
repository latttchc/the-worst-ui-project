import { vi } from "vitest";

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE = "http://localhost:8080";

// Setup global mocks if needed
global.fetch = vi.fn();
