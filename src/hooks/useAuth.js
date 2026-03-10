import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const useAuth = () => {
	const [session, setSession] = useState(null)
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let isMounted = true

		const loadSession = async () => {
			try {
				const {
					data: { session: currentSession },
				} = await supabase.auth.getSession()

				if (!isMounted) {
					return
				}

				setSession(currentSession ?? null)
				setUser(currentSession?.user ?? null)
			} catch (error) {
				if (isMounted) {
					console.error('useAuth getSession error', error)
					setSession(null)
					setUser(null)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadSession()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			if (!isMounted) {
				return
			}

			setSession(nextSession ?? null)
			setUser(nextSession?.user ?? null)
			setLoading(false)
		})

		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [])

	return {
		user,
		session,
		loading,
	}
}

export default useAuth
