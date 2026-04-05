import apiClient from './axios'

import type { EventItem, EventPayload } from '../types/event'

export const eventService = {
	async getEvents(search?: string): Promise<EventItem[]> {
		const response = await apiClient.get<EventItem[]>('/api/events', {
			params: search ? { search } : undefined,
		})

		return response.data
	},
	async getEventById(id: number): Promise<EventItem> {
		const response = await apiClient.get<EventItem>(`/api/events/${id}`)
		return response.data
	},
	async createEvent(payload: EventPayload): Promise<EventItem> {
		const response = await apiClient.post<EventItem>('/api/events', payload)
		return response.data
	},
	async updateEvent(id: number, payload: EventPayload): Promise<EventItem> {
		const response = await apiClient.put<EventItem>(`/api/events/${id}`, payload)
		return response.data
	},
	async deleteEvent(id: number): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(`/api/events/${id}`)
		return response.data
	},
}
