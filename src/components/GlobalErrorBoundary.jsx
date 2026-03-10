import { Component } from 'react'

class GlobalErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hasError: false,
			errorMessage: '',
		}
	}

	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			errorMessage: error?.message || 'Error inesperado en la aplicación.',
		}
	}

	componentDidCatch(error, errorInfo) {
		console.error('GlobalErrorBoundary caught an error', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div
					style={{
						minHeight: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '24px',
						backgroundColor: '#ffffff',
						color: '#111827',
					}}
				>
					<div
						style={{
							width: '100%',
							maxWidth: '560px',
							borderRadius: '14px',
							padding: '16px',
							backgroundColor: '#fff7ed',
							color: '#9a3412',
						}}
					>
						<h2 style={{ margin: '0 0 8px' }}>Ocurrió un error inesperado</h2>
						<p style={{ margin: 0 }}>{this.state.errorMessage}</p>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

export default GlobalErrorBoundary
