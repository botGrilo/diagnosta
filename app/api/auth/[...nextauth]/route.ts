import { handlers } from "@/auth";

// NextAuth v5: los handlers GET/POST se re-exportan directamente desde auth.ts
export const { GET, POST } = handlers;
