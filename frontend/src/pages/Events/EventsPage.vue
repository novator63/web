<template>
	<div :class="$style.root">
		<section :class="$style.section">
			<EventsToolbar
				:loading="eventsStore.loading"
				:search="searchQuery"
				@update:search="handleSearchUpdate"
				@refresh="reloadEvents"
			/>
		</section>

		<section v-if="eventsStore.error" :class="$style.section">
			<ErrorMessage :code="eventsStore.error.code" :message="eventsStore.error.message" />
		</section>

		<section v-if="eventsStore.info" :class="$style.section">{{ eventsStore.info }}</section>

		<section v-if="authStore.isAuthenticated" :class="$style.section">
			<EventCreateForm mode="create" :disabled="eventsStore.creating" @submit="handleCreate" />
		</section>

		<section :class="$style.section">
			<div v-if="eventsStore.loading">Загрузка…</div>
			<div v-else-if="visibleEvents.length === 0">Пока нет событий.</div>
			<EventList
				v-else
				:events="visibleEvents"
				:current-user-id="authStore.user?.id ?? null"
				:deleting-id="eventsStore.deletingId"
				@delete="handleDelete"
				@edit="openEditModal"
			/>
		</section>

		<div v-if="eventsStore.editingEvent" :class="$style.modalBackdrop" @click.self="closeEditModal">
			<section :class="$style.modalCard">
				<h2 :class="$style.modalTitle">Редактирование мероприятия</h2>
				<EventCreateForm
					mode="edit"
					:disabled="eventsStore.updating"
					:initial-values="{
						title: eventsStore.editingEvent.title,
						description: eventsStore.editingEvent.description,
						date: eventsStore.editingEvent.date,
						category: eventsStore.editingEvent.category,
					}"
					@submit="handleUpdate"
					@cancel="closeEditModal"
				/>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useAuthStore } from '../../stores/authStore'
import { useEventsStore } from '../../stores/eventsStore'
import type { EventItem, EventPayload } from '../../types/event'
import EventCreateForm from './components/EventCreateForm.vue'
import EventList from './components/EventList.vue'
import EventsToolbar from './components/EventsToolbar.vue'

const authStore = useAuthStore()
const eventsStore = useEventsStore()

const searchQuery = computed({
	get: () => eventsStore.searchQuery,
	set: (value: string) => eventsStore.setSearchQuery(value),
})

const visibleEvents = computed(() => {
	const currentUserId = authStore.user?.id
	if (!currentUserId) {
		return []
	}

	return eventsStore.events.filter((event) => event.createdBy === currentUserId)
})

onBeforeUnmount(() => {
	eventsStore.cancelSearchDebounce()
})

const handleSearchUpdate = (value: string): void => {
	eventsStore.setSearchQuery(value)
}

const reloadEvents = async (): Promise<void> => {
	await eventsStore.loadEvents(eventsStore.searchQuery)
}

const handleCreate = async (
	payload: Parameters<typeof eventsStore.createEvent>[0],
): Promise<void> => {
	await eventsStore.createEvent(payload)
}

const handleDelete = async (id: number): Promise<void> => {
	await eventsStore.deleteEvent(id)
}

const openEditModal = (event: EventItem): void => {
	eventsStore.openEditModal(event)
}

const closeEditModal = (): void => {
	eventsStore.closeEditModal()
}

const handleUpdate = async (payload: EventPayload): Promise<void> => {
	await eventsStore.updateEvent(payload)
}

onMounted(() => {
	authStore.syncAuthState()
	void eventsStore.loadEvents(eventsStore.searchQuery)
})
</script>

<style module lang="scss" src="./EventsPage.module.scss" />
