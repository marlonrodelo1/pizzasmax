import PromotionCard from './PromotionCard'

const MAX_PROMOTIONS = 5

const PromotionsSection = ({ promotions = [] }) => {
	const safePromotions = Array.isArray(promotions) ? promotions.filter(Boolean) : []
	const visiblePromotions = safePromotions.slice(0, MAX_PROMOTIONS)
	const hasPromotions = visiblePromotions.length > 0

	return (
		<section
			className="promotions-section full-width"
			style={{
				width: '100%',
				padding: '20px 16px 24px',
			}}
		>
			<h2
				style={{
					margin: '0 0 14px',
					fontSize: '1.25rem',
					lineHeight: 1.2,
				}}
			>
				Promociones
			</h2>

			{hasPromotions ? (
				<div style={{ display: 'grid', gap: '12px' }}>
					{visiblePromotions.map((promotion, index) => (
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
						fontSize: '0.92rem',
						lineHeight: 1.45,
						color: '#6b7280',
					}}
				>
					No hay promociones disponibles por el momento.
				</p>
			)}
		</section>
	)
}

export default PromotionsSection
