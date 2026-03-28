

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-1 container max-w-3xl mx-auto px-4 py-12">
      {children}
    </main>
  )
}

