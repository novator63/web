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
					<p :class="$style.sectionNote">Редактирование достпуно только в разделе событий.</p>
				</div>
				<div :class="$style.searchActions">
					<BaseInput
						id="home-events-search"
						placeholder="Поиск по названию, описанию и типу"
						:model-value="searchQuery"
						:disabled="loading"
						@update:model-value="searchQuery = $event"
					/>
					<div :class="$style.buttons">
						<BaseButton variant="ghost" :disabled="loading" @click="searchQuery = ''">
							Очистить
						</BaseButton>
						<BaseButton variant="secondary" :disabled="loading" @click="loadEvents">
							{{ loading ? 'Загрузка…' : 'Обновить' }}
						</BaseButton>
					</div>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { eventService } from '../../api/eventService'
import BaseButton from '../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../components/ui/BaseInput/BaseInput.vue'
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
const searchQuery = ref('')
const normalizedSearch = computed(() => searchQuery.value.trim())

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
	}, 500)
})

onBeforeUnmount(() => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer)
	}
})

onMounted(() => {
	void loadEvents()
})
</script>

<style module lang="scss" src="./HomePage.module.scss" />
