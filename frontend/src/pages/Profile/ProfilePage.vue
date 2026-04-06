<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<h1 :class="$style.title">Профиль</h1>
			<div :class="$style.userInfo">
				<div :class="$style.row">
					<span :class="$style.label">Имя</span>
					<span>{{ authStore.user?.name ?? '—' }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Email</span>
					<span>{{ authStore.user?.email ?? '—' }}</span>
				</div>
			</div>
		</section>

		<section :class="$style.card">
			<div :class="$style.eventsHeader">
				<h2 :class="$style.subtitle">Мои мероприятия</h2>
			</div>

			<div v-if="loading" :class="$style.state">Загрузка…</div>
			<ErrorMessage v-else-if="error" :code="error.code" :message="error.message" />
			<div v-else-if="visibleEvents.length === 0" :class="$style.state">
				Вы ещё не создали ни одного мероприятия.
			</div>
			<EventList
				v-else
				:events="visibleEvents"
				:current-user-id="null"
				:deleting-id="null"
			/>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { eventService } from '../../api/eventService'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useAuthStore } from '../../stores/authStore'
import type { UiError } from '../../types/api'
import type { EventItem } from '../../types/event'
import { getErrorMessage } from '../../utils/getErrorMessage'
import EventList from '../Events/components/EventList.vue'

const authStore = useAuthStore()

const events = ref<EventItem[]>([])
const loading = ref(false)
const error = ref<UiError | null>(null)

const visibleEvents = computed(() => {
	const currentUserId = authStore.user?.id
	if (!currentUserId) {
		return []
	}

	return events.value.filter((event) => event.createdBy === currentUserId)
})

const loadEvents = async (): Promise<void> => {
	loading.value = true
	error.value = null

	try {
		events.value = await eventService.getEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось загрузить мероприятия')
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	authStore.syncAuthState()
	void loadEvents()
})
</script>

<style module lang="scss" src="./ProfilePage.module.scss" />
