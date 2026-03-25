import { auth } from "@/auth"; // <-- OJO: Tu instrucción decía @/lib/auth, pero usamos @/auth en este proyecto
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Footer } from "@/components/layout/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNav user={session.user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
