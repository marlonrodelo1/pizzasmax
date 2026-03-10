import { useEffect, useState } from 'react'
import PromotionCard from '../components/home/PromotionCard'
import PageWrapper from '../components/layout/PageWrapper'
import { getPromotions } from '../services/promotionService'

const Promociones = () => {
	const [promotions, setPromotions] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true

		const loadPromotions = async () => {
			setIsLoading(true)
			try {
				const response = await getPromotions()
				if (!isMounted) {
					return
				}

				setPromotions(Array.isArray(response) ? response.filter(Boolean) : [])
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadPromotions()

		return () => {
			isMounted = false
		}
	}, [])

	const hasPromotions = promotions.length > 0

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
				<h1 style={{ margin: 0 }}>Promociones</h1>

				{isLoading ? (
					<p
						style={{
							margin: 0,
							fontSize: '0.95rem',
							color: '#6b7280',
						}}
					>
						Cargando promociones...
					</p>
				) : hasPromotions ? (
					<div style={{ display: 'grid', gap: '12px' }}>
						{promotions.map((promotion, index) => (
							<PromotionCard
								key={promotion.id ?? `${promotion.url ?? 'promotion'}-${index}`}
								image={promotion?.image ?? promotion?.image_url ?? ''}
								url={promotion?.url ?? promotion?.redirect_url ?? '#'}
							/>
						))}
					</div>
				) : (
					<p
						style={{
							margin: 0,
							fontSize: '0.95rem',
							color: '#6b7280',
						}}
					>
						No hay promociones disponibles
					</p>
				)}
			</div>
		</PageWrapper>
	)
}

export default Promociones
