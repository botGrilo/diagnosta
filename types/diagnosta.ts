export type EndpointStatus = 'ok' | 'degraded' | 'down' | 'unknown'
export type DiagnosisSeverity = 'info' | 'warning' | 'critical'
export type DiagnosisCategory =
  | 'single_failure'
  | 'recurring_pattern'
  | 'degradation'
  | 'structural'

export interface EndpointSummary {
  id: string
  name: string
  url: string
  method: string
  status: EndpointStatus
  latencyMs: number | null
  deltaMs: number | null
  uptimePct24h: number
  lastCheckedAt: string | null
  isPublic: boolean
  isSuccess?: boolean | null
  statusCode?: number | null
  checkIntervalMin?: number
}

export interface DiagnosisEntry {
  id: string
  severity: DiagnosisSeverity
  category: DiagnosisCategory
  diagnosis: string
  recommendation: string
  patternDetected: string | null
  slaImpact: string | null
  modelUsed: string
  createdAt: string
}

export interface EndpointDetail extends EndpointSummary {
  expectedStatus: number
  checkIntervalMin: number
  latencyThresholdMs: number
  keywordCheck: string | null
  latencyHistory: Array<{
    checkedAt: string
    latencyMs: number | null
    isSuccess: boolean
  }>
  diagnoses: DiagnosisEntry[]
}

export interface StatusPageData {
  username: string
  uptimeGlobal: number
  endpoints: EndpointSummary[]
  lastUpdated: string
}
