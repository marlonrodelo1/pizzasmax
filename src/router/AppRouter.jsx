import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Promociones from "../pages/Promociones"
import GiftCards from "../pages/GiftCards"
import Nosotros from "../pages/Nosotros"

function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/promociones" element={<Promociones />} />
			<Route path="/giftcards" element={<GiftCards />} />
			<Route path="/nosotros" element={<Nosotros />} />
		</Routes>
	)
}

export default AppRouter
