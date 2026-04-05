import { defineStore } from 'pinia'

import { authService } from '../api/authService'
import { hasToken } from '../utils/token'

interface AuthState {
	isAuthenticated: boolean
	isLoggingOut: boolean
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		isAuthenticated: hasToken(),
		isLoggingOut: false,
	}),
	actions: {
		syncAuthState(): void {
			this.isAuthenticated = hasToken()
		},
		async logout(): Promise<string> {
			this.isLoggingOut = true

			try {
				const response = await authService.logout()
				return response.message
			} finally {
				this.isAuthenticated = false
				this.isLoggingOut = false
			}
		},
	},
})