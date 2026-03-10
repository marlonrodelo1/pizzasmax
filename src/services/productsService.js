import { supabase } from './supabaseClient'

const TABLE_NAME = 'products'
const restaurantId = import.meta.env.VITE_RESTAURANT_ID

export const getProducts = async () => {
	console.log('restaurantId:', restaurantId)

	if (!restaurantId) {
		const error = new Error('Missing VITE_RESTAURANT_ID environment variable.')
		console.log('error:', error)
		throw error
	}

	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select('*')
			.eq('restaurant_id', restaurantId)

		console.log('data:', data)
		console.log('error:', error)

		if (error) {
			throw error
		}

		return Array.isArray(data) ? data : []
	} catch (error) {
		console.error('Error fetching products', error)
		throw error
	}
}
