import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

import { clearToken, getToken } from '../utils/token'

const apiClient = axios.create({
	baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? '/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

apiClient.interceptors.request.use((config) => {
	const token = getToken()
	if (token) {
		setAuthHeader(config, token)
	}

	return config
})

const setAuthHeader = (config: AxiosRequestConfig, token: string): void => {
	if (!config.headers) {
		config.headers = {}
	}

	if (typeof config.headers.set === 'function') {
		config.headers.set('Authorization', `Bearer ${token}`)
		return
	}

	config.headers = {
		...config.headers,
		Authorization: `Bearer ${token}`,
	}
}

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			clearToken()
		}

		return Promise.reject(error)
	},
)

export default apiClient
