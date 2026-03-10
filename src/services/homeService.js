import { supabase } from './supabaseClient'

const TABLE_NAME = 'restaurants'
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


const extractCoordinates = (data) => {
	let latitude = data?.latitude
	let longitude = data?.longitude

	const location = data?.location
	if (location && typeof location === 'object' && Array.isArray(location.coordinates)) {
		const [lng, lat] = location.coordinates
		latitude = lat
		longitude = lng
	}

	return { latitude, longitude }
}

export const getHomeContent = async () => {
	console.log('restaurantId:', restaurantId)

	if (!restaurantId) {
		throw new Error('Missing VITE_RESTAURANT_ID environment variable.')
	}

	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select('*')
			.eq('id', restaurantId)
			.single()

		console.log('data:', data)
		console.log('error:', error)

		if (error) {
			throw error
		}

		const { latitude, longitude } = extractCoordinates(data)

		return {
			...data,
			banner_image_url: toPublicImageUrl(data?.banner_image_url),
			logo_image_url: toPublicImageUrl(data?.logo_image_url),
			latitude,
			longitude,
			action_button_url: data?.menu_url_individual ?? data?.menu_url ?? '#',
		}
	} catch (error) {
		console.error('Error fetching home content', error)
		throw error
	}
}
