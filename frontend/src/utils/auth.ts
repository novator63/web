import type { AuthTokenPayload } from '../types/auth'
import type { User } from '../types/user'

const decodeBase64Url = (value: string): string => {
	const padded = value
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(Math.ceil(value.length / 4) * 4, '=')
	return atob(padded)
}

export const parseJwtPayload = <T>(token: string): T | null => {
	const parts = token.split('.')
	if (parts.length < 2) return null

	try {
		const json = decodeBase64Url(parts[1])
		return JSON.parse(json) as T
	} catch {
		return null
	}
}

export const getUserFromToken = (token: string): User | null => {
	const payload = parseJwtPayload<AuthTokenPayload>(token)
	if (!payload) return null
	if (
		typeof payload.id !== 'number' ||
		typeof payload.email !== 'string' ||
		typeof payload.name !== 'string'
	) {
		return null
	}
	return {
		id: payload.id,
		email: payload.email,
		name: payload.name,
	}
}
