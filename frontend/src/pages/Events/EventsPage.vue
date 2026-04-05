<template>
	<div :class="$style.root">
		<section :class="$style.section">
			<EventsToolbar :loading="loading" @refresh="loadEvents" />
		</section>

		<section v-if="error" :class="$style.section">
			<ErrorMessage :code="error.code" :message="error.message" />
		</section>

		<section v-if="info" :class="$style.section">{{ info }}</section>

		<section v-if="authStore.isAuthenticated" :class="$style.section">
			<EventCreateForm :disabled="creating" @submit="handleCreate" />
		</section>

		<section :class="$style.section">
			<div v-if="loading">Загрузка…</div>
			<div v-else-if="events.length === 0">Пока нет событий.</div>
			<EventList
				v-else
				:events="events"
				:current-user-id="authStore.user?.id ?? null"
				:deleting-id="deletingId"
				@delete="handleDelete"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
const deletingId = ref<number | null>(null)
const error = ref<UiError | null>(null)
const info = ref('')

const loadEvents = async (): Promise<void> => {
	loading.value = true
	error.value = null

	try {
		events.value = await eventService.getEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось загрузить события')
	} finally {
		loading.value = false
	}
}

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

onMounted(() => {
	authStore.syncAuthState()
	void loadEvents()
})
</script>

<style module lang="scss" src="./EventsPage.module.scss" />
