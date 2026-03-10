import { NavLink } from 'react-router-dom'
import { Home, Tag, CreditCard, User } from 'lucide-react'

const navItems = [
	{ label: 'Inicio', to: '/', icon: Home },
	{ label: 'Promociones', to: '/promociones', icon: Tag },
	{ label: 'Tarjetas', to: '/giftcards', icon: CreditCard },
	{ label: 'Nosotros', to: '/nosotros', icon: User },
]

const BottomNav = () => {
	return (
		<>
			<style>
				{`
					.app-nav {
						position: fixed;
						bottom: 0;
						left: 0;
						right: 0;
						width: 100%;
						height: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
						padding-bottom: env(safe-area-inset-bottom);
						display: flex;
						justify-content: space-around;
						align-items: center;
						background: #fff;
						border-top: 1px solid #eee;
						z-index: 100;
						box-sizing: border-box;
					}

					.nav-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						font-size: 11px;
						font-weight: 600;
						color: #777;
						cursor: pointer;
						text-decoration: none;
						line-height: 1.1;
						gap: 4px;
						width: 25%;
						height: 100%;
						transform: translateY(-2px);
					}

					.nav-item svg {
						margin-bottom: 0;
					}

					.nav-item.active {
						color: #ff6b00;
					}
				`}
			</style>

			<nav className="app-nav">
				{navItems.map((item) => {
					const IconComponent = item.icon

					return (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
						>
							<IconComponent size={22} strokeWidth={2} />
							<span>{item.label}</span>
						</NavLink>
					)
				})}
			</nav>
		</>
	)
}

export default BottomNav
