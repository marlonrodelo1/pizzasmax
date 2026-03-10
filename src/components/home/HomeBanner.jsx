import { useEffect, useState } from 'react'
import { openInternal } from '../../utils/openInternal'

const HomeBanner = ({ homeContent }) => {
	const safeBannerUrl = typeof homeContent?.banner_image_url === 'string' ? homeContent.banner_image_url.trim() : ''
	const safeLogoUrl = typeof homeContent?.logo_image_url === 'string' ? homeContent.logo_image_url.trim() : ''
	const safeActionUrl =
		typeof homeContent?.action_button_url === 'string' && homeContent.action_button_url.trim()
			? homeContent.action_button_url.trim()
			: '#'
	const hasBanner = safeBannerUrl.trim() !== ''
	const hasLogo = safeLogoUrl.trim() !== ''
	const hasAction = safeActionUrl !== '#'
	const [hasBannerError, setHasBannerError] = useState(false)

	const handleOpenActionUrl = (event) => {
		event.preventDefault()
		if (!hasAction) {
			return
		}

		openInternal(safeActionUrl)
	}

	useEffect(() => {
		setHasBannerError(false)
	}, [safeBannerUrl])

	const showBannerImage = hasBanner && !hasBannerError

	return (
		<>
			<style>
				{`
					@keyframes pulse {
						0% {
							transform: scale(1);
							box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
						}
						50% {
							transform: scale(1.05);
							box-shadow: 0 18px 40px rgba(255, 107, 0, 0.4);
						}
						100% {
							transform: scale(1);
							box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
						}
					}

					.home-container {
						width: 100%;
					}

					.home-banner-wrapper {
						position: relative;
						width: 100%;
						margin-bottom: 58px;
					}

					.home-banner {
						width: 100%;
						aspect-ratio: 358 / 190;
						background: #f3f4f6;
					}

					.home-banner__image,
					.home-banner__placeholder {
						width: 100%;
						height: 100%;
						display: block;
					}

					.home-banner__image {
						object-fit: cover;
						border-radius: 24px;
					}

					.home-banner__placeholder {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 12px;
						text-align: center;
						color: #6b7280;
						font-size: 0.92rem;
						line-height: 1.35;
					}

					.home-logo {
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translate(-50%, 50%);
					}

					.home-logo__image {
						width: 90px;
						height: 90px;
						object-fit: contain;
						background: #ffffff;
						padding: 8px;
						border-radius: 50%;
						box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
						display: block;
					}

					.home-content {
						padding: 16px;
						margin-top: 60px;
					}

					.button-wrapper {
						width: 100%;
						display: flex;
						justify-content: center;
					}

					.order-btn {
						width: 90%;
						height: 100px;
						padding: 0 20px;
						border-radius: 24px;
						border: none;
						display: flex;
						align-items: center;
						justify-content: center;
						text-align: center;
						text-decoration: none;
						font-weight: 600;
						font-size: 18px;
						line-height: 1;
						background: ${hasAction ? '#ff6b00' : '#e5e7eb'};
						color: ${hasAction ? '#ffffff' : '#6b7280'};
						box-shadow: ${hasAction ? '0 12px 30px rgba(0, 0, 0, 0.15)' : 'none'};
						animation: ${hasAction ? 'pulse 2s infinite' : 'none'};
						transition: transform 0.2s ease;
						pointer-events: ${hasAction ? 'auto' : 'none'};
					}

					.cta-button.full-width {
						width: calc(100vw - 16px);
						max-width: none;
						margin-left: calc(50% - 50vw + 8px);
						margin-right: calc(50% - 50vw + 8px);
					}

					@media (min-width: 768px) {
						.cta-button.full-width {
							width: 90%;
							margin-left: 0;
							margin-right: 0;
						}
					}
				`}
			</style>

			<section className="home-container">
				<div className="home-banner-wrapper">
					<div className="home-banner full-width">
					{showBannerImage ? (
						<img
							src={safeBannerUrl}
							alt="Banner principal"
							loading="lazy"
							decoding="async"
							onError={() => setHasBannerError(true)}
							className="home-banner__image"
						/>
					) : (
						<div className="home-banner__placeholder">Imagen no disponible</div>
					)}
					</div>

					{hasLogo ? (
						<div className="home-logo">
							<img src={safeLogoUrl} alt="Logo" className="home-logo__image" />
						</div>
					) : null}
				</div>

				<div className="home-content">
					<div className="button-wrapper">
						<a
							href={safeActionUrl}
							onClick={handleOpenActionUrl}
							aria-disabled={!hasAction}
							className="order-btn cta-button full-width"
						>
							Ordenar o Reservar ahora
						</a>
					</div>
				</div>
			</section>
		</>
	)
}

export default HomeBanner
