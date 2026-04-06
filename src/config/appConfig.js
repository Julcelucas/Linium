export const appConfig = {
  authMode: import.meta.env.VITE_AUTH_MODE || 'local',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}
