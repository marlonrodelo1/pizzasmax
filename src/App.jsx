import { HashRouter as Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import BottomNav from './components/layout/BottomNav'

function App() {
  return (
    <Router>
      <div className="app-shell">
        <div className="app-main">
          <AppRouter />
        </div>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
