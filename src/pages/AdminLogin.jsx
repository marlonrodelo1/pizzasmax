import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AdminLogin = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [sessionEmail, setSessionEmail] = useState('')

	useEffect(() => {
		let isMounted = true

		const checkCurrentSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession()

				if (!isMounted) {
					return
				}

				if (session?.user?.email) {
					setSessionEmail(session.user.email)
					setSuccessMessage('Sesión activa detectada.')
				}
			} catch (error) {
				if (isMounted) {
					console.error('Error checking session', error)
				}
			}
		}

		checkCurrentSession()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!isMounted) {
				return
			}

			setSessionEmail(session?.user?.email ?? '')
		})

		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()
		setErrorMessage('')
		setSuccessMessage('')

		const normalizedEmail = email.trim().toLowerCase()
		if (!normalizedEmail || !password) {
			setErrorMessage('Ingresa email y contraseña.')
			return
		}

		setIsLoading(true)

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: normalizedEmail,
				password,
			})

			if (error) {
				setErrorMessage(error.message || 'No se pudo iniciar sesión.')
				return
			}

			setSessionEmail(data?.user?.email ?? normalizedEmail)
			setSuccessMessage('Inicio de sesión correcto. La sesión quedó guardada automáticamente.')
		} catch (error) {
			setErrorMessage('Error inesperado al iniciar sesión. Intenta nuevamente.')
			console.error('AdminLogin signIn error', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '20px 16px',
				backgroundColor: '#ffffff',
			}}
		>
			<section
				style={{
					width: '100%',
					maxWidth: '420px',
					borderRadius: '16px',
					border: '1px solid #e5e7eb',
					padding: '18px',
					boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
				}}
			>
				<h1 style={{ margin: '0 0 6px', fontSize: '1.35rem', lineHeight: 1.2 }}>Admin Login</h1>
				<p style={{ margin: '0 0 14px', color: '#6b7280', fontSize: '0.95rem' }}>
					Ingresa tus credenciales para acceder al panel.
				</p>

				<form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '12px' }}>
					<label style={{ display: 'grid', gap: '6px' }}>
						<span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email</span>
						<input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
							placeholder="admin@tuapp.com"
							disabled={isLoading}
							style={{
								width: '100%',
								height: '44px',
								borderRadius: '10px',
								border: '1px solid #d1d5db',
								padding: '0 12px',
								fontSize: '0.95rem',
							}}
						/>
					</label>

					<label style={{ display: 'grid', gap: '6px' }}>
						<span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Password</span>
						<input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="current-password"
							placeholder="••••••••"
							disabled={isLoading}
							style={{
								width: '100%',
								height: '44px',
								borderRadius: '10px',
								border: '1px solid #d1d5db',
								padding: '0 12px',
								fontSize: '0.95rem',
							}}
						/>
					</label>

					<button
						type="submit"
						disabled={isLoading}
						style={{
							height: '46px',
							border: 'none',
							borderRadius: '12px',
							backgroundColor: '#111827',
							color: '#ffffff',
							fontWeight: 700,
							fontSize: '0.95rem',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.7 : 1,
						}}
					>
						{isLoading ? 'Ingresando...' : 'Iniciar sesión'}
					</button>
				</form>

				{errorMessage ? (
					<p
						style={{
							margin: '12px 0 0',
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

				{successMessage ? (
					<p
						style={{
							margin: '12px 0 0',
							padding: '10px 12px',
							borderRadius: '10px',
							backgroundColor: '#f0fdf4',
							color: '#166534',
							fontSize: '0.9rem',
						}}
					>
						{successMessage}
					</p>
				) : null}

				{sessionEmail ? (
					<p style={{ margin: '10px 0 0', fontSize: '0.85rem', color: '#4b5563' }}>
						Sesión activa: {sessionEmail}
					</p>
				) : null}
			</section>
		</main>
	)
}

export default AdminLogin
