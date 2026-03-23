import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Solo importa authConfig — cero pg/bcryptjs/crypto en Edge Runtime
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
