/* 
  He migrado el Middleware a la convención Proxy de Next.js 16. 
  Mantenemos la misma lógica de seguridad, pero bajo el estándar moderno 
  que separa la lógica de la aplicación del perímetro de red.
*/
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth: proxy } = NextAuth(authConfig);
export default proxy;
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Excluimos diagnostico-push para que el receptor pueda validar su propia firma
    "/api/((?!diagnostico-push).*)", 
  ],
};
/*
 Ahora todo el /api/ sigue protegido por NextAuth 
    EXCEPTO el receptor 'diagnostico-push'. Esta es la puerta blindada por 
    la que entrará la inteligencia de n8n.
*/
