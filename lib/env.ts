/**
 * Environment variable validation and configuration
 * Validates required environment variables at startup
 */

interface EnvConfig {
  // Notion
  notionApiKey: string
  notionHayDatabaseId: string
  notionGuineaPigDatabaseId: string
  notionBlogDatabaseId?: string
  notionPetraAquaDatabaseId?: string
  
  // Montonio
  montonioAccessKey?: string
  montonioSecretKey?: string
  montonioEnvironment: 'sandbox' | 'production'
  montonioEnabled: boolean
  
  // Email
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  
  // Google Analytics
  gaMeasurementId?: string
  
  // App
  nextPublicBaseUrl?: string
  databaseUrl?: string
}

/**
 * Validates and returns environment configuration
 * Throws error if required variables are missing
 */
export function validateEnv(): EnvConfig {
  const errors: string[] = []
  
  // Required Notion variables
  const notionApiKey = process.env.NOTION_API_KEY
  if (!notionApiKey) {
    errors.push('NOTION_API_KEY is required')
  }
  
  const notionHayDatabaseId = process.env.NOTION_HAY_DATABASE_ID
  if (!notionHayDatabaseId) {
    errors.push('NOTION_HAY_DATABASE_ID is required')
  }
  
  const notionGuineaPigDatabaseId = process.env.NOTION_GUINEA_PIG_DATABASE_ID
  if (!notionGuineaPigDatabaseId) {
    errors.push('NOTION_GUINEA_PIG_DATABASE_ID is required')
  }
  
  // Optional Notion variables
  const notionBlogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID
  const notionPetraAquaDatabaseId = process.env.NOTION_PETRA_AQUA_DATABASE_ID
  
  // Montonio (optional, but required if enabled)
  const montonioEnabled = process.env.NEXT_PUBLIC_MONTONIO_ENABLED === 'true' || 
                         process.env.MONTONIO_ENABLED === 'true'
  const montonioAccessKey = process.env.MONTONIO_ACCESS_KEY
  const montonioSecretKey = process.env.MONTONIO_SECRET_KEY
  
  if (montonioEnabled) {
    if (!montonioAccessKey) {
      errors.push('MONTONIO_ACCESS_KEY is required when Montonio is enabled')
    }
    if (!montonioSecretKey) {
      errors.push('MONTONIO_SECRET_KEY is required when Montonio is enabled')
    }
  }
  
  const montonioEnvironment = (process.env.MONTONIO_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'
  
  // Email (optional, but recommended)
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  
  if (smtpHost || smtpUser || smtpPassword) {
    // If any SMTP variable is set, all should be set
    if (!smtpHost) errors.push('SMTP_HOST is required if email is configured')
    if (!smtpPort) errors.push('SMTP_PORT is required if email is configured')
    if (!smtpUser) errors.push('SMTP_USER is required if email is configured')
    if (!smtpPassword) errors.push('SMTP_PASSWORD is required if email is configured')
  }
  
  // Optional variables
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const databaseUrl = process.env.DATABASE_URL
  
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}\n\n` +
      `Please check your .env file and ensure all required variables are set.`
    )
  }
  
  return {
    notionApiKey: notionApiKey!,
    notionHayDatabaseId: notionHayDatabaseId!,
    notionGuineaPigDatabaseId: notionGuineaPigDatabaseId!,
    notionBlogDatabaseId,
    notionPetraAquaDatabaseId,
    montonioAccessKey,
    montonioSecretKey,
    montonioEnvironment,
    montonioEnabled,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPassword,
    gaMeasurementId,
    nextPublicBaseUrl,
    databaseUrl,
  }
}

/**
 * Get validated environment config (cached)
 * Call this function once at app startup
 */
let cachedConfig: EnvConfig | null = null

export function getEnvConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = validateEnv()
  }
  return cachedConfig
}
