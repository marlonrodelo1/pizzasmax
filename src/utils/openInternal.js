import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

const toSafeUrl = (url) => {
	if (typeof url !== 'string') {
		return ''
	}

	const trimmedUrl = url.trim()
	if (!trimmedUrl) {
		return ''
	}

	try {
		const parsedUrl = new URL(trimmedUrl)
		const protocol = parsedUrl.protocol.toLowerCase()
		if (protocol !== 'http:' && protocol !== 'https:') {
			return ''
		}

		return parsedUrl.toString()
	} catch {
		return ''
	}
}

export async function openInternal(url) {
	try {
		const safeUrl = toSafeUrl(url)
		if (!safeUrl) {
			throw new Error('Invalid URL.')
		}

		if (typeof Capacitor?.isNativePlatform === 'function' && Capacitor.isNativePlatform()) {
			await Browser.open({
				url: safeUrl,
				presentationStyle: 'fullscreen',
			})
			return
		}

		window.location.href = safeUrl
	} catch (error) {
		console.error('openInternal error:', error)
	}
}
