"use client"
import { EndpointForm } from "@/components/endpoints/endpoint-form"
import { EndpointList } from "@/components/endpoints/endpoint-list"

export default function EndpointsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">
          Sala de Control
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra tus APIs bajo la vigilancia
          del Guardián. Límite: 20 endpoints.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EndpointForm />
        <EndpointList />
      </div>
    </div>
  )
}
