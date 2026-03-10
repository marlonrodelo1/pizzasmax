import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const restaurantId = import.meta.env.VITE_RESTAURANT_ID

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
	)
}

if (import.meta.env.DEV) {
	console.log('Supabase URL:', supabaseUrl)
	console.log('Restaurant ID:', restaurantId ?? '(not set)')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)