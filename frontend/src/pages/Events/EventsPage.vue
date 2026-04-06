<template>
	<div :class="$style.root">
		<section :class="$style.section">
			<EventsToolbar
				:loading="loading"
				:search="searchQuery"
				@update:search="searchQuery = $event"
				@refresh="loadEvents"
			/>
		</section>

		<section v-if="error" :class="$style.section">
			<ErrorMessage :code="error.code" :message="error.message" />
		</section>

		<section v-if="info" :class="$style.section">{{ info }}</section>

		<section v-if="authStore.isAuthenticated" :class="$style.section">
			<EventCreateForm mode="create" :disabled="creating" @submit="handleCreate" />
		</section>

		<section :class="$style.section">
			<div v-if="loading">Загрузка…</div>
			<div v-else-if="visibleEvents.length === 0">Пока нет событий.</div>
			<EventList
				v-else
				:events="visibleEvents"
				:current-user-id="authStore.user?.id ?? null"
				:deleting-id="deletingId"
				@delete="handleDelete"
				@edit="openEditModal"
			/>
		</section>

		<div v-if="editingEvent" :class="$style.modalBackdrop" @click.self="closeEditModal">
			<section :class="$style.modalCard">
				<h2 :class="$style.modalTitle">Редактирование мероприятия</h2>
				<EventCreateForm
					mode="edit"
					:disabled="updating"
					:initial-values="{
						title: editingEvent.title,
						description: editingEvent.description,
						date: editingEvent.date,
						category: editingEvent.category,
					}"
					@submit="handleUpdate"
					@cancel="closeEditModal"
				/>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { eventService } from '../../api/eventService'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useAuthStore } from '../../stores/authStore'
import type { UiError } from '../../types/api'
import type { EventItem, EventPayload } from '../../types/event'
import { getErrorMessage } from '../../utils/getErrorMessage'
import EventCreateForm from './components/EventCreateForm.vue'
import EventList from './components/EventList.vue'
import EventsToolbar from './components/EventsToolbar.vue'

const authStore = useAuthStore()

const events = ref<EventItem[]>([])
const loading = ref(false)
const creating = ref(false)
const updating = ref(false)
const deletingId = ref<number | null>(null)
const editingEvent = ref<EventItem | null>(null)
const error = ref<UiError | null>(null)
const info = ref('')
const searchQuery = ref('')
const normalizedSearch = computed(() => searchQuery.value.trim())
const visibleEvents = computed(() => {
	const currentUserId = authStore.user?.id
	if (!currentUserId) {
		return []
	}

	return events.value.filter((event) => event.createdBy === currentUserId)
})

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const loadEvents = async (): Promise<void> => {
	loading.value = true
	error.value = null

	try {
		events.value = await eventService.getEvents(normalizedSearch.value)
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось загрузить события')
	} finally {
		loading.value = false
	}
}

watch(searchQuery, () => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer)
	}

	searchDebounceTimer = setTimeout(() => {
		void loadEvents()
	}, 700)
})

onBeforeUnmount(() => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer)
	}
})

const handleCreate = async (payload: EventPayload): Promise<void> => {
	creating.value = true
	error.value = null
	info.value = ''

	try {
		await eventService.createEvent(payload)
		info.value = 'Событие создано'
		await loadEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось создать событие')
	} finally {
		creating.value = false
	}
}

const handleDelete = async (id: number): Promise<void> => {
	deletingId.value = id
	error.value = null
	info.value = ''

	try {
		const response = await eventService.deleteEvent(id)
		info.value = response.message
		await loadEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось удалить событие')
	} finally {
		deletingId.value = null
	}
}

const openEditModal = (event: EventItem): void => {
	error.value = null
	info.value = ''
	editingEvent.value = event
}

const closeEditModal = (): void => {
	if (updating.value) {
		return
	}

	editingEvent.value = null
}

const handleUpdate = async (payload: EventPayload): Promise<void> => {
	if (!editingEvent.value) return

	updating.value = true
	error.value = null
	info.value = ''

	try {
		await eventService.updateEvent(editingEvent.value.id, payload)
		info.value = 'Событие обновлено'
		editingEvent.value = null
		await loadEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось обновить событие')
	} finally {
		updating.value = false
	}
}

onMounted(() => {
	authStore.syncAuthState()
	void loadEvents()
})
</script>

<style module lang="scss" src="./EventsPage.module.scss" />
