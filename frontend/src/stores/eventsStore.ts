import { defineStore } from 'pinia'

import { eventService } from '../api/eventService'
import type { UiError } from '../types/api'
import type { EventItem, EventPayload } from '../types/event'
import { getErrorMessage } from '../utils/getErrorMessage'

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const clearSearchDebounceTimer = (): void => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer)
		searchDebounceTimer = null
	}
}

interface EventsState {
	events: EventItem[]
	searchQuery: string
	loading: boolean
	creating: boolean
	updating: boolean
	deletingId: number | null
	editingEvent: EventItem | null
	error: UiError | null
	info: string
}

export const useEventsStore = defineStore('events', {
	state: (): EventsState => ({
		events: [],
		searchQuery: '',
		loading: false,
		creating: false,
		updating: false,
		deletingId: null,
		editingEvent: null,
		error: null,
		info: '',
	}),
	actions: {
		clearStatus(): void {
			this.error = null
			this.info = ''
		},
		cancelSearchDebounce(): void {
			clearSearchDebounceTimer()
		},
		setSearchQuery(value: string): void {
			this.searchQuery = value
			clearSearchDebounceTimer()

			searchDebounceTimer = setTimeout(() => {
				void this.loadEvents(this.searchQuery)
			}, 700)
		},
		async loadEvents(search?: string): Promise<void> {
			this.loading = true
			this.error = null

			try {
				const normalizedSearch = search?.trim()
				this.events = await eventService.getEvents(normalizedSearch || undefined)
			} catch (e) {
				this.error = getErrorMessage(e, 'Не удалось загрузить события')
			} finally {
				this.loading = false
			}
		},
		async createEvent(payload: EventPayload): Promise<void> {
			this.creating = true
			this.clearStatus()

			try {
				await eventService.createEvent(payload)
				this.info = 'Событие создано'
				await this.loadEvents(this.searchQuery)
			} catch (e) {
				this.error = getErrorMessage(e, 'Не удалось создать событие')
			} finally {
				this.creating = false
			}
		},
		async deleteEvent(id: number): Promise<void> {
			this.deletingId = id
			this.clearStatus()

			try {
				const response = await eventService.deleteEvent(id)
				this.info = response.message
				await this.loadEvents(this.searchQuery)
			} catch (e) {
				this.error = getErrorMessage(e, 'Не удалось удалить событие')
			} finally {
				this.deletingId = null
			}
		},
		openEditModal(event: EventItem): void {
			this.clearStatus()
			this.editingEvent = event
		},
		closeEditModal(): void {
			if (this.updating) {
				return
			}

			this.editingEvent = null
		},
		async updateEvent(payload: EventPayload): Promise<void> {
			if (!this.editingEvent) {
				return
			}

			this.updating = true
			this.clearStatus()

			try {
				await eventService.updateEvent(this.editingEvent.id, payload)
				this.info = 'Событие обновлено'
				this.editingEvent = null
				await this.loadEvents(this.searchQuery)
			} catch (e) {
				this.error = getErrorMessage(e, 'Не удалось обновить событие')
			} finally {
				this.updating = false
			}
		},
	},
})
