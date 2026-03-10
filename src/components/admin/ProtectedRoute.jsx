import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
	const { loading, session } = useAuth()

	if (loading) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '16px',
					fontSize: '0.95rem',
					color: '#4b5563',
				}}
			>
				Cargando...
			</div>
		)
	}

	if (!session) {
		return <Navigate to="/admin" replace />
	}

	return children
}

export default ProtectedRoute
