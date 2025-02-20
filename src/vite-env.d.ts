/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIAPI_KEY: string
  readonly VITE_WEBHOOK_SECRET: string
  readonly VITE_SUPABASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
