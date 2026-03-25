import Link from "next/link"
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}
