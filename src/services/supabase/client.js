import { createClient } from '@supabase/supabase-js'
import { appConfig } from '../../config/appConfig'

const supabaseUrl = appConfig.supabaseUrl
const supabaseAnonKey = appConfig.supabaseAnonKey

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
