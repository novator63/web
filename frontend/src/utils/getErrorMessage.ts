import axios, { type AxiosError } from 'axios'

import type { ApiErrorResponse, UiError } from '../types/api'

export const getErrorMessage = (error: unknown, fallbackMessage = 'Произошла ошибка'): UiError => {
	if (!error) return { message: fallbackMessage }

	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<ApiErrorResponse>
		const status = axiosError.response?.status
		const messageFromServer =
			axiosError.response?.data?.message ?? axiosError.response?.data?.error ?? axiosError.message

		return {
			code: status,
			message: messageFromServer || fallbackMessage,
		}
	}

	if (error instanceof Error) {
		return { message: error.message || fallbackMessage }
	}

	return { message: fallbackMessage }
}
