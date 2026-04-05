import apiClient from './axios'

export interface EventItem {
	id: number
	title: string
	description: string | null
	date: string
	createdBy?: number
	createdAt?: string
	updatedAt?: string
}

export interface EventPayload {
	title: string
	description?: string | null
	date: string
}

export const eventService = {
	async getEvents(search?: string): Promise<EventItem[]> {
		const response = await apiClient.get<EventItem[]>('api/events', {
			params: search ? { search } : undefined,
		})

		return response.data
	},
	async getEventById(id: number): Promise<EventItem> {
		const response = await apiClient.get<EventItem>(`api/events/${id}`)
		return response.data
	},
	async createEvent(payload: EventPayload): Promise<EventItem> {
		const response = await apiClient.post<EventItem>('api/events', payload)
		return response.data
	},
	async updateEvent(id: number, payload: EventPayload): Promise<EventItem> {
		const response = await apiClient.put<EventItem>(`api/events/${id}`, payload)
		return response.data
	},
	async deleteEvent(id: number): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(`api/events/${id}`)
		return response.data
	},
}
