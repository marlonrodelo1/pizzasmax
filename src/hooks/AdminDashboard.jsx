import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

const sectionCardStyle = {
	border: '1px solid #e5e7eb',
	borderRadius: '14px',
	padding: '14px',
	backgroundColor: '#ffffff',
}

const AdminDashboard = () => {
	const [isSigningOut, setIsSigningOut] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const handleSignOut = async () => {
		setErrorMessage('')
		setIsSigningOut(true)

		try {
			const { error } = await supabase.auth.signOut()
			if (error) {
				setErrorMessage(error.message || 'No se pudo cerrar sesión.')
			}
		} catch (error) {
			setErrorMessage('Error inesperado al cerrar sesión.')
			console.error('AdminDashboard signOut error', error)
		} finally {
			setIsSigningOut(false)
		}
	}

	return (
		<main
			style={{
				minHeight: '100vh',
				backgroundColor: '#f9fafb',
				padding: '16px',
			}}
		>
			<section
				style={{
					width: '100%',
					maxWidth: '760px',
					margin: '0 auto',
					display: 'grid',
					gap: '12px',
				}}
			>
				<header
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: '12px',
						flexWrap: 'wrap',
					}}
				>
					<h1 style={{ margin: 0, fontSize: '1.3rem' }}>Admin Dashboard</h1>
					<button
						type="button"
						onClick={handleSignOut}
						disabled={isSigningOut}
						style={{
							height: '40px',
							padding: '0 14px',
							borderRadius: '10px',
							border: '1px solid #d1d5db',
							backgroundColor: '#ffffff',
							fontWeight: 600,
							cursor: isSigningOut ? 'not-allowed' : 'pointer',
							opacity: isSigningOut ? 0.7 : 1,
						}}
					>
						{isSigningOut ? 'Cerrando...' : 'Cerrar sesión'}
					</button>
				</header>

				{errorMessage ? (
					<p
						style={{
							margin: 0,
							padding: '10px 12px',
							borderRadius: '10px',
							backgroundColor: '#fef2f2',
							color: '#b91c1c',
							fontSize: '0.9rem',
						}}
					>
						{errorMessage}
					</p>
				) : null}

				<section style={sectionCardStyle}>
					<h2 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>Editar Home</h2>
					<p style={{ margin: 0, color: '#6b7280', fontSize: '0.92rem' }}>
						Espacio preparado para formulario de banner, logo, botón y ubicación.
					</p>
				</section>

				<section style={sectionCardStyle}>
					<h2 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>Editar Promociones</h2>
					<p style={{ margin: 0, color: '#6b7280', fontSize: '0.92rem' }}>
						Espacio preparado para listado, orden y estado de promociones activas.
					</p>
				</section>

				<section style={sectionCardStyle}>
					<h2 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>Editar Popup</h2>
					<p style={{ margin: 0, color: '#6b7280', fontSize: '0.92rem' }}>
						Espacio preparado para contenido, fechas y activación del popup principal.
					</p>
				</section>
			</section>
		</main>
	)
}

export default AdminDashboard
