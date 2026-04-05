<template>
  <div class="home-page">
    <h1>Добро пожаловать на главную страницу</h1>
    <p>Это тестовая страница для проверки роутинга и API.</p>
    <p v-if="isLoggedIn">Токен сохранён в localStorage.</p>
    <p v-if="loading">Загрузка событий...</p>
    <p v-if="error">{{ error }}</p>
    <button type="button" @click="loadEvents">Обновить события</button>
    <ul>
      <li v-for="event in events" :key="event.id">
        <strong>{{ event.title }}</strong>
        <span> {{ formatDate(event.date) }}</span>
        <p v-if="event.description">{{ event.description }}</p>
      </li>
    </ul>
    <div class="button-group">
      <RouterLink to="/events" class="btn btn-primary">Перейти к событиям</RouterLink>
      <RouterLink to="/login" class="btn btn-secondary">Перейти на вход</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { eventService, type EventItem } from '../../api/eventService'
import { hasToken } from '../../utils/token'

const events = ref<EventItem[]>([])
const loading = ref(false)
const error = ref('')

const isLoggedIn = computed(() => hasToken())

const formatDate = (value: string): string => new Date(value).toLocaleString('ru-RU')

const loadEvents = async (): Promise<void> => {
	loading.value = true
	error.value = ''

	try {
		events.value = await eventService.getEvents()
	} catch {
		error.value = 'Не удалось загрузить события'
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	void loadEvents()
})
</script>