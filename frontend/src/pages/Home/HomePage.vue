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
						:disabled="eventsStore.loading"
						@update:model-value="handleSearchUpdate"
					/>
					<div :class="$style.buttons">
						<BaseButton
							variant="ghost"
							:disabled="eventsStore.loading"
							@click="handleSearchUpdate('')"
						>
							Очистить
						</BaseButton>
						<BaseButton variant="secondary" :disabled="eventsStore.loading" @click="reloadEvents">
							{{ eventsStore.loading ? 'Загрузка…' : 'Обновить' }}
						</BaseButton>
					</div>
				</div>
			</div>
			<ErrorMessage
				v-if="eventsStore.error"
				:code="eventsStore.error.code"
				:message="eventsStore.error.message"
			/>
			<div v-else-if="eventsStore.loading">Загрузка…</div>
			<div v-else-if="eventsStore.events.length === 0">Пока нет событий.</div>
			<EventList v-else :events="eventsStore.events" :current-user-id="null" :deleting-id="null" />
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BaseButton from '../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../components/ui/BaseInput/BaseInput.vue'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useEventsStore } from '../../stores/eventsStore'
import EventList from '../Events/components/EventList.vue'
import HomeActions from './components/HomeActions.vue'
import HomeHero from './components/HomeHero.vue'

const eventsStore = useEventsStore()

const searchQuery = computed({
	get: () => eventsStore.searchQuery,
	set: (value: string) => eventsStore.setSearchQuery(value),
})

const handleSearchUpdate = (value: string): void => {
	eventsStore.setSearchQuery(value)
}

const reloadEvents = async (): Promise<void> => {
	await eventsStore.loadEvents(eventsStore.searchQuery)
}

onMounted(() => {
	void eventsStore.loadEvents(eventsStore.searchQuery)
})
</script>

<style module lang="scss" src="./HomePage.module.scss" />
