import { useEffect, useMemo, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import PageWrapper from '../components/layout/PageWrapper'
import { getHomeContent } from '../services/homeService'
import { openInternal } from '../utils/openInternal'

const FALLBACK_LOCATION = {
	lat: 19.432608,
	lng: -99.133209,
}

const toNumberOrFallback = (value, fallback) => {
	const parsedValue = Number(value)
	return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const Nosotros = () => {
	const [coordinates, setCoordinates] = useState(FALLBACK_LOCATION)
	const [logoUrl, setLogoUrl] = useState('')
	const mapContainerRef = useRef(null)
	const mapStateRef = useRef(null)

	const safeLogoUrl = useMemo(() => {
		if (typeof logoUrl !== 'string') {
			return ''
		}

		const trimmed = logoUrl.trim()
		if (!trimmed) {
			return ''
		}

		try {
			const parsed = new URL(trimmed)
			return parsed.toString()
		} catch {
			return ''
		}
	}, [logoUrl])

	const markerHtml = useMemo(() => {
		if (safeLogoUrl) {
			return `<div class="marker-wrapper"><img src="${safeLogoUrl}" alt="Logo restaurante" class="marker-logo" /></div>`
		}

		return '<div class="marker-wrapper"><div class="marker-logo marker-logo--fallback"></div></div>'
	}, [safeLogoUrl])

	useEffect(() => {
		let isMounted = true

		const loadCoordinates = async () => {
			try {
				const homeContent = await getHomeContent()
				if (!isMounted) {
					return
				}

				setCoordinates({
					lat: toNumberOrFallback(homeContent?.latitude, FALLBACK_LOCATION.lat),
					lng: toNumberOrFallback(homeContent?.longitude, FALLBACK_LOCATION.lng),
				})
				setLogoUrl(homeContent?.restaurant?.logo_url ?? homeContent?.logo_url ?? homeContent?.logo_image_url ?? '')
			} catch (error) {
				if (isMounted) {
					setCoordinates(FALLBACK_LOCATION)
					setLogoUrl('')
				}
			}
		}

		loadCoordinates()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		let isCancelled = false

		const mountMap = async () => {
			if (!mapContainerRef.current) {
				return
			}

			const leaflet = await import('leaflet')
			if (isCancelled || mapStateRef.current) {
				return
			}

			const L = leaflet.default
			const map = L.map(mapContainerRef.current, {
				zoomControl: true,
				attributionControl: true,
			})

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 20,
				attribution: '&copy; OpenStreetMap contributors',
			}).addTo(map)

			mapStateRef.current = { L, map, marker: null }
		}

		mountMap().catch((error) => {
			console.error('Leaflet init error', error)
		})

		return () => {
			isCancelled = true
			if (mapStateRef.current) {
				mapStateRef.current.map.remove()
				mapStateRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		const mapState = mapStateRef.current
		if (!mapState) {
			return
		}

		const { L, map, marker } = mapState
		const lat = toNumberOrFallback(coordinates?.lat, FALLBACK_LOCATION.lat)
		const lng = toNumberOrFallback(coordinates?.lng, FALLBACK_LOCATION.lng)

		map.setView([lat, lng], 16)

		if (marker) {
			marker.remove()
		}

		const icon = L.divIcon({
			className: 'custom-marker',
			html: markerHtml,
			iconSize: [60, 60],
			iconAnchor: [30, 30],
		})

		mapState.marker = L.marker([lat, lng], { icon }).addTo(map)
	}, [coordinates, markerHtml])

	return (
		<PageWrapper>
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
				<h1 style={{ margin: 0, fontSize: '1.65rem', lineHeight: 1.2 }}>Nosotros</h1>

				<section
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<h2 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.25 }}>Nuestra ubicación</h2>
					<div
						ref={mapContainerRef}
						style={{
							width: '100%',
							height: '320px',
							borderRadius: '18px',
							overflow: 'hidden',
							backgroundColor: '#f3f4f6',
							boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
						}}
					/>
				</section>

				<section
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<h2 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.25 }}>Cómo hacer pedido</h2>
					<ol
						style={{
							margin: 0,
							paddingLeft: '20px',
							display: 'grid',
							gap: '8px',
							color: '#374151',
							fontSize: '0.98rem',
							lineHeight: 1.45,
						}}
					>
						<li>Pulsa "Ordenar ahora"</li>
						<li>Elige tus productos</li>
						<li>Completa el pago</li>
						<li>Recibe tu pedido</li>
					</ol>
				</section>

				<button
					type="button"
					onClick={() => openInternal('https://rogotech.es/privacidadcomeycalla')}
					style={{
						height: '52px',
						border: 'none',
						borderRadius: '12px',
						backgroundColor: '#111827',
						color: '#ffffff',
						fontWeight: 700,
						fontSize: '0.96rem',
						cursor: 'pointer',
					}}
				>
					Política de privacidad
				</button>
			</div>
		</PageWrapper>
	)
}

export default Nosotros
