import { useEffect, useMemo, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const isValidCoordinate = (value) => {
	const parsedValue = Number(value)
	return Number.isFinite(parsedValue)
}

const hasValidLatLng = (lat, lng) => {
	if (!isValidCoordinate(lat) || !isValidCoordinate(lng)) {
		return false
	}

	const latitude = Number(lat)
	const longitude = Number(lng)

	return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}

const toSafeLogoUrl = (value) => {
	if (typeof value !== 'string') {
		return ''
	}

	const trimmedValue = value.trim()
	if (!trimmedValue) {
		return ''
	}

	try {
		const parsed = new URL(trimmedValue)
		return parsed.toString()
	} catch {
		return ''
	}
}

const MapSection = ({ lat, lng, logoUrl = '' }) => {
	const latitude = Number(lat)
	const longitude = Number(lng)
	const hasValidCoordinates = hasValidLatLng(lat, lng)
	const safeLogoUrl = toSafeLogoUrl(logoUrl)
	const markerHtml = useMemo(() => {
		if (safeLogoUrl) {
			return `<div class="marker-wrapper"><img src="${safeLogoUrl}" alt="Logo restaurante" class="marker-logo" /></div>`
		}

		return '<div class="marker-wrapper"><div class="marker-logo marker-logo--fallback"></div></div>'
	}, [safeLogoUrl])
	const mapContainerRef = useRef(null)
	const mapStateRef = useRef(null)

	if (!hasValidCoordinates) {
		return (
			<div
				style={{
					width: '100%',
					height: '300px',
					borderRadius: '16px',
					overflow: 'hidden',
					backgroundColor: '#f3f4f6',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '16px',
					textAlign: 'center',
					color: '#4b5563',
				}}
			>
				Ubicación no disponible
			</div>
		)
	}

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

		map.setView([latitude, longitude], 16)

		if (marker) {
			marker.remove()
		}

		const icon = L.divIcon({
			className: 'custom-marker',
			html: markerHtml,
			iconSize: [60, 60],
			iconAnchor: [30, 30],
		})

		mapState.marker = L.marker([latitude, longitude], { icon }).addTo(map)
	}, [latitude, longitude, markerHtml])

	return (
		<div
			ref={mapContainerRef}
			style={{
				width: '100%',
				height: '300px',
				borderRadius: '16px',
				overflow: 'hidden',
				backgroundColor: '#f3f4f6',
				boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
			}}
			aria-label="Mapa"
			title="Mapa"
		>
			
		</div>
	)
}

export default MapSection
