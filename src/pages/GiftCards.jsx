import { useEffect, useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { supabase } from '../services/supabaseClient'
import { openInternal } from '../utils/openInternal'

const TABLE_NAME = 'app_gift_cards'
const restaurantId = import.meta.env.VITE_RESTAURANT_ID

const GiftCards = () => {
	const [giftCards, setGiftCards] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true

		const loadGiftCards = async () => {
			setIsLoading(true)

			if (!restaurantId) {
				if (isMounted) {
					setGiftCards([])
					setIsLoading(false)
				}
				return
			}

			try {
				const { data, error } = await supabase
					.from(TABLE_NAME)
					.select('*')
					.eq('restaurant_id', restaurantId)
					.order('created_at', { ascending: false })

				if (error) {
					throw error
				}

				if (!isMounted) {
					return
				}

				setGiftCards(Array.isArray(data) ? data.filter(Boolean) : [])
			} catch (error) {
				if (isMounted) {
					setGiftCards([])
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadGiftCards()

		return () => {
			isMounted = false
		}
	}, [])

	const hasGiftCards = giftCards.length > 0

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
				<h1 style={{ margin: 0 }}>Tarjetas de Regalo</h1>

				{isLoading ? (
					<p
						style={{
							margin: 0,
							color: '#6b7280',
							fontSize: '0.95rem',
						}}
					>
						Cargando gift cards...
					</p>
				) : hasGiftCards ? (
					<div style={{ width: '100%' }}>
						{giftCards.map((giftCard, index) => {
							const imageUrl = typeof giftCard?.image_url === 'string' ? giftCard.image_url.trim() : ''
							const redirectUrl =
								typeof giftCard?.redirect_url === 'string' ? giftCard.redirect_url.trim() : ''
							const isActive = giftCard?.is_active === true

							return (
								<article
									key={giftCard?.id ?? `${redirectUrl || 'gift-card'}-${index}`}
									onClick={
										redirectUrl
											? () => openInternal(redirectUrl)
											: undefined
									}
									style={{
										borderRadius: '20px',
										overflow: 'hidden',
										background: '#ffffff',
										boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
										marginBottom: '16px',
										cursor: redirectUrl ? 'pointer' : 'default',
									}}
								>
									{imageUrl ? (
										<img
											src={imageUrl}
											alt="Gift card"
											loading="lazy"
											decoding="async"
											style={{
												width: '100%',
												height: '180px',
												objectFit: 'cover',
												display: 'block',
											}}
										/>
									) : (
										<div
											style={{
												width: '100%',
												height: '180px',
												display: 'grid',
												placeItems: 'center',
												backgroundColor: '#f3f4f6',
												color: '#6b7280',
												fontSize: '0.92rem',
											}}
										>
											Imagen no disponible
										</div>
									)}

									<div
										style={{
											padding: '12px 16px',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<span
											style={
												isActive
													? {
														background: '#e6f7ed',
														color: '#1f8b4c',
														padding: '6px 12px',
														borderRadius: '999px',
														fontSize: '12px',
														fontWeight: 600,
													}
													: {
														background: '#fdeaea',
														color: '#c53030',
														padding: '6px 12px',
														borderRadius: '999px',
														fontSize: '12px',
														fontWeight: 600,
													}
											}
										>
											{isActive ? 'Disponible' : 'Agotada'}
										</span>
									</div>
								</article>
							)
						})}
					</div>
				) : (
					<div
						style={{
							minHeight: '180px',
							display: 'grid',
							placeItems: 'center',
							textAlign: 'center',
							color: '#6b7280',
							fontSize: '0.98rem',
						}}
					>
						No hay gift cards disponibles
					</div>
				)}
			</div>
		</PageWrapper>
	)
}

export default GiftCards
