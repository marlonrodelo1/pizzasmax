import { supabase } from './supabaseClient'

const TABLE_NAME = 'promociones'
const restaurantId = import.meta.env.VITE_RESTAURANT_ID
const STORAGE_BUCKET = 'app-images'

const toPublicImageUrl = (path) => {
	if (typeof path !== 'string') {
		return ''
	}

	const trimmedPath = path.trim()
	if (!trimmedPath) {
		return ''
	}

	if (/^https?:\/\//i.test(trimmedPath)) {
		return trimmedPath
	}

	const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(trimmedPath)
	return data?.publicUrl ?? ''
}

export const getPromotions = async () => {
	console.log('restaurantId:', restaurantId)

	if (!restaurantId) {
		console.error('Missing VITE_RESTAURANT_ID environment variable.')
		return []
	}

	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select('*')
			.eq('restaurant_id', restaurantId)
			.eq('is_active', true)
			.order('display_order', { ascending: true })

		console.log('promotions data:', data)
		console.log('promotions error:', error)

		if (error) {
			console.error('Error fetching promotions', error)
			return []
		}

		const safePromotions = Array.isArray(data) ? data : []

		return safePromotions.map((promotion) => ({
			...promotion,
			image_url: toPublicImageUrl(promotion?.image_url),
		}))
	} catch (error) {
		console.error('Unexpected error fetching promotions', error)
		return []
	}
}
