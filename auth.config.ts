import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // authorized() corre en Edge Runtime — cero Node.js APIs aquí
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  // providers vacío — los que usan Node.js (pg, bcrypt) se añaden en auth.ts
  providers: [],
};
