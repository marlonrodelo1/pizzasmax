import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { motion } from 'framer-motion'
import { openInternal } from '../../utils/openInternal'

const ActionCard = ({ url }) => {
	const actionUrl = typeof url === 'string' && url.trim() !== '' ? url : ''

	const handleOpenBrowser = async () => {
		if (!actionUrl) {
			return
		}

		try {
			await Haptics.impact({ style: ImpactStyle.Light })
		} catch (error) {
			console.error('Haptics not available', error)
		}

		openInternal(actionUrl)
	}

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<motion.button
				type="button"
				onClick={handleOpenBrowser}
				whileTap={{ scale: 0.96 }}
				whileHover={{ scale: 1.02 }}
				transition={{ type: 'spring', stiffness: 300 }}
				style={{
					width: '100%',
					maxWidth: '420px',
					backgroundColor: '#ff7a00',
					border: 'none',
					color: '#ffffff',
					borderRadius: '20px',
					padding: '14px 20px',
					textAlign: 'center',
					textDecoration: 'none',
					fontFamily: 'inherit',
					fontWeight: 700,
					fontSize: '1rem',
					lineHeight: 1.2,
					boxShadow: '0 12px 28px rgba(17, 24, 39, 0.16), 0 4px 10px rgba(0, 0, 0, 0.08)',
					WebkitTapHighlightColor: 'transparent',
					display: 'inline-block',
					cursor: actionUrl ? 'pointer' : 'default',
				}}
			>
				Ver Menú y Pedir Online
			</motion.button>
		</div>
	)
}

export default ActionCard
