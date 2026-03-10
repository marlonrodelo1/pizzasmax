import { supabase } from './supabaseClient'

const TABLE_NAME = 'app_home_popup'
const restaurantId = import.meta.env.VITE_RESTAURANT_ID

export const getHomePopup = async () => {
	if (!restaurantId) {
		console.error('Missing VITE_RESTAURANT_ID environment variable.')
		return null
	}

	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select('*')
			.eq('restaurant_id', restaurantId)
			.eq('is_active', true)
			.order('display_order', { ascending: true })
			.limit(1)
			.single()

		console.log('popup data:', data)
		console.log('popup error:', error)

		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}

			console.error('Error fetching home popup', error)
			return null
		}

		return data ?? null
	} catch (error) {
		console.error('Unexpected error fetching home popup', error)
		return null
	}
}
