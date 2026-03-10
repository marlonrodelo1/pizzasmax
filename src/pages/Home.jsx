import { useEffect, useState } from 'react'
import HomeBanner from '../components/home/HomeBanner'
import HomePopup from '../components/home/HomePopup'
import MapSection from '../components/home/MapSection'
import PromotionsSection from '../components/home/PromotionsSection'
import PageWrapper from '../components/layout/PageWrapper'
import { getHomeContent } from '../services/homeService'
import { getHomePopup } from '../services/popupService'
import { getPromotions } from '../services/promotionService'

const FALLBACK_LOCATION = {
	lat: 19.432608,
	lng: -99.133209,
}

const DEFAULT_HOME_CONTENT = {
	banner_image_url: '',
	logo_image_url: '',
	action_button_url: '#',
	latitude: FALLBACK_LOCATION.lat,
	longitude: FALLBACK_LOCATION.lng,
}

const toNumberOrFallback = (value, fallback) => {
	const parsedValue = Number(value)
	return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const normalizeHomeContent = (content) => {
	if (!content || typeof content !== 'object') {
		return DEFAULT_HOME_CONTENT
	}

	return {
		banner_image_url: content.banner_image_url ?? '',
		logo_image_url: content.logo_image_url ?? '',
		action_button_url: content.action_button_url ?? '#',
		latitude: content.latitude ?? FALLBACK_LOCATION.lat,
		longitude: content.longitude ?? FALLBACK_LOCATION.lng,
	}
}

const normalizePromotions = (items) => {
	if (!Array.isArray(items)) {
		return []
	}

	return items.map((promotion) => ({
		...promotion,
		image: promotion?.image ?? promotion?.image_url ?? '',
		url: promotion?.url ?? promotion?.redirect_url ?? promotion?.link_url ?? null,
	}))
}

const Home = () => {
	const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CONTENT)
	const [popup, setPopup] = useState(null)
	const [promotions, setPromotions] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let isMounted = true

		const loadHomeData = async () => {
			setLoading(true)
			setError('')

			const serviceErrors = []

			let nextHomeContent = DEFAULT_HOME_CONTENT
			try {
				const response = await getHomeContent()
				nextHomeContent = normalizeHomeContent(response)
				console.info('Home content loaded')
			} catch (error) {
				serviceErrors.push('home')
				console.error('Home content load failed', error)
			}

			if (isMounted) {
				setHomeContent(nextHomeContent)
			}

			let nextPopup = null
			try {
				nextPopup = await getHomePopup()
			} catch (loadError) {
				serviceErrors.push('popup')
				console.error('Popup load failed', loadError)
			}

			if (isMounted) {
				setPopup(nextPopup)
			}

			let nextPromotions = []
			try {
				const response = await getPromotions()
				nextPromotions = normalizePromotions(response)
				console.info('Promotions loaded', nextPromotions.length)
			} catch (loadError) {
				serviceErrors.push('promotions')
				console.error('Promotions load failed', loadError)
			}

			if (isMounted) {
				setPromotions(nextPromotions)
			}

			if (!isMounted) {
				return
			}

			if (serviceErrors.length > 0) {
				setError('Algunos contenidos no se pudieron cargar. Mostrando versión básica.')
			}

			setLoading(false)
		}

		loadHomeData().catch((unexpectedError) => {
			if (!isMounted) {
				return
			}

			console.error('Unexpected Home error', unexpectedError)
			setError('Algunos contenidos no se pudieron cargar. Mostrando versión básica.')
			setHomeContent(DEFAULT_HOME_CONTENT)
			setPopup(null)
			setPromotions([])
			setLoading(false)
		})

		return () => {
			isMounted = false
		}
	}, [])

	const latitude = homeContent?.latitude
	const longitude = homeContent?.longitude
	const safeLatitude = toNumberOrFallback(latitude, FALLBACK_LOCATION.lat)
	const safeLongitude = toNumberOrFallback(longitude, FALLBACK_LOCATION.lng)
	const safePromotions = Array.isArray(promotions) ? promotions : []

	return (
		<PageWrapper>
			<HomePopup popup={popup} />

				{loading ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '12px 0',
						}}
					>
						<div
							aria-label="Cargando"
							style={{
								width: '22px',
								height: '22px',
								borderRadius: '999px',
								border: '3px solid #e5e7eb',
								borderTopColor: '#f97316',
								animation: 'spin 0.8s linear infinite',
							}}
						/>
						<style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
					</div>
				) : null}

				{error ? (
					<p
						style={{
							margin: '0 0 12px',
							padding: '10px 12px',
							borderRadius: '10px',
							backgroundColor: '#fff7ed',
							color: '#9a3412',
							fontSize: '0.92rem',
							lineHeight: 1.4,
						}}
					>
							{error}
					</p>
				) : null}

				<div
					style={{
						width: '100%',
						maxWidth: '640px',
						margin: '0 auto',
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
					}}
				>
					<HomeBanner homeContent={homeContent} />

					<PromotionsSection promotions={safePromotions} />
					<MapSection lat={safeLatitude} lng={safeLongitude} logoUrl={homeContent?.logo_image_url ?? ''} />
				</div>
		</PageWrapper>
	)
}

export default Home
