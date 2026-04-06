<template>
	<div :class="$style.root">
		<div :class="$style.card">
			<HomeHero />
		</div>
		<div :class="$style.card">
			<HomeActions />
		</div>
		<section :class="$style.card">
			<div :class="$style.eventsHeader">
				<div>
					<h2 :class="$style.sectionTitle">Все события</h2>
					<p :class="$style.sectionNote">
						Просмотр доступен всем пользователям, редактирование только в разделе событий.
					</p>
				</div>
			</div>
			<ErrorMessage v-if="error" :code="error.code" :message="error.message" />
			<div v-else-if="loading">Загрузка…</div>
			<div v-else-if="events.length === 0">Пока нет событий.</div>
			<EventList v-else :events="events" :current-user-id="null" :deleting-id="null" />
		</section>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { eventService } from '../../api/eventService'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import type { UiError } from '../../types/api'
import type { EventItem } from '../../types/event'
import { getErrorMessage } from '../../utils/getErrorMessage'
import EventList from '../Events/components/EventList.vue'
import HomeActions from './components/HomeActions.vue'
import HomeHero from './components/HomeHero.vue'

const events = ref<EventItem[]>([])
const loading = ref(false)
const error = ref<UiError | null>(null)

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

onMounted(() => {
	void loadEvents()
})
</script>

<style module lang="scss" src="./HomePage.module.scss" />
