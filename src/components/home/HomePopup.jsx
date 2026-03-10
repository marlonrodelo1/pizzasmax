import { useEffect, useState } from 'react'

const HomePopup = ({ popup }) => {
	const [isVisible, setIsVisible] = useState(true)
	const [hasImageError, setHasImageError] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [popup?.id])

	useEffect(() => {
		setHasImageError(false)
	}, [popup?.id, popup?.image_url])

	if (!popup || !isVisible) {
		return null
	}

	const imageUrl = typeof popup?.image_url === 'string' ? popup.image_url.trim() : ''
	const title = typeof popup?.title === 'string' && popup.title.trim() ? popup.title.trim() : 'Promoción'
	const description = typeof popup?.description === 'string' ? popup.description.trim() : ''
	const showImage = imageUrl !== '' && !hasImageError

	return (
		<>
			<style>
				{`@keyframes homePopupOverlayFadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}

				@keyframes homePopupContentFadeIn {
					from { opacity: 0; transform: translateY(8px) scale(0.98); }
					to { opacity: 1; transform: translateY(0) scale(1); }
				}`}
			</style>

			<div
				style={{
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.56)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '20px',
					zIndex: 200,
					animation: 'homePopupOverlayFadeIn 0.2s ease',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: '100%',
						maxWidth: '350px',
						backgroundColor: '#ffffff',
						borderRadius: '16px',
						overflow: 'hidden',
						boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18)',
						animation: 'homePopupContentFadeIn 0.28s ease',
					}}
				>
					<button
						type="button"
						onClick={() => setIsVisible(false)}
						aria-label="Cerrar popup"
						style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							width: '32px',
							height: '32px',
							border: 'none',
							borderRadius: '999px',
							backgroundColor: 'rgba(17, 24, 39, 0.75)',
							color: '#ffffff',
							fontSize: '1rem',
							lineHeight: 1,
							cursor: 'pointer',
							display: 'grid',
							placeItems: 'center',
						}}
					>
						×
					</button>

					<div
						style={{
							width: '100%',
							aspectRatio: '350 / 180',
							height: 'auto',
							borderRadius: '20px',
							overflow: 'hidden',
							backgroundColor: '#f3f4f6',
						}}
					>
						{showImage ? (
							<img
								src={imageUrl}
								alt={title}
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
									padding: '12px',
									textAlign: 'center',
									color: '#6b7280',
									fontSize: '0.92rem',
								}}
							>
								Imagen no disponible
							</div>
						)}
					</div>

					<div style={{ padding: '18px 16px 20px' }}>
						<h3
							style={{
								margin: 0,
								fontSize: '1.1rem',
								lineHeight: 1.25,
								fontWeight: 700,
								color: '#111827',
							}}
						>
							{title}
						</h3>

						{description ? (
							<p
								style={{
									margin: '10px 0 0',
									fontSize: '0.96rem',
									lineHeight: 1.5,
									color: '#4b5563',
								}}
							>
								{description}
							</p>
						) : null}
					</div>
				</div>
			</div>
		</>
	)
}

export default HomePopup
