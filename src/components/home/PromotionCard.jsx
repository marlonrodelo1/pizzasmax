import { useEffect, useState } from 'react'
import { openInternal } from '../../utils/openInternal'

const PromotionCard = ({ image, url }) => {
	const safeImageUrl = typeof image === 'string' ? image.trim() : ''
	const safeUrl = typeof url === 'string' ? url.trim() : ''
	const [hasImageError, setHasImageError] = useState(false)

	useEffect(() => {
		setHasImageError(false)
	}, [safeImageUrl])

	const showImage = safeImageUrl !== '' && !hasImageError

	const handleOpenPromotion = (event) => {
		event.preventDefault()
		if (!safeUrl) {
			return
		}

		openInternal(safeUrl)
	}

	return (
		<a
			href={safeUrl || '#'}
			onClick={handleOpenPromotion}
			style={{
				width: '100%',
				display: 'block',
				margin: '0 auto 16px',
				borderRadius: '16px',
				overflow: 'hidden',
				textDecoration: 'none',
			}}
		>
			<div
				style={{
					width: '100%',
					aspectRatio: '326 / 164',
					height: 'auto',
					backgroundColor: '#f3f4f6',
				}}
			>
				{showImage ? (
					<img
						src={safeImageUrl}
						alt="Promoción"
						loading="lazy"
						decoding="async"
						onError={() => setHasImageError(true)}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				) : (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'grid',
							placeItems: 'center',
							color: '#6b7280',
							fontSize: '0.92rem',
							padding: '10px',
							textAlign: 'center',
						}}
					>
						Imagen no disponible
					</div>
				)}
			</div>
		</a>
	)
}

export default PromotionCard
