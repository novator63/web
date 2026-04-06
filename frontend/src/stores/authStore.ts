import { defineStore } from 'pinia'

import { authService } from '../api/authService'
import type { User } from '../types/user'
import { isAdminEmail } from '../utils/admin'
import { getToken, hasToken } from '../utils/token'
import { getUserFromToken } from '../utils/auth'

interface AuthState {
	isAuthenticated: boolean
	isLoggingOut: boolean
	user: User | null
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		isAuthenticated: hasToken(),
		isLoggingOut: false,
		user: (() => {
			const token = getToken()
			return token ? getUserFromToken(token) : null
		})(),
	}),
	getters: {
		isAdmin: (state): boolean => isAdminEmail(state.user?.email),
	},
	actions: {
		syncAuthState(): void {
			const token = getToken()
			this.isAuthenticated = Boolean(token)
			this.user = token ? getUserFromToken(token) : null
		},
		setUser(user: User | null): void {
			this.user = user
		},
		async logout(): Promise<string> {
			this.isLoggingOut = true

			try {
				const response = await authService.logout()
				return response.message
			} finally {
				this.syncAuthState()
				this.isLoggingOut = false
			}
		},
	},
})
