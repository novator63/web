<template>
  <div class="events-page">
    <h1>События</h1>
    <p>Список событий из backend</p>
    <p v-if="tokenPresent">Токен найден, можно создавать и удалять события.</p>
    <p v-if="message">{{ message }}</p>
    <p v-if="error">{{ error }}</p>
    <button type="button" @click="loadEvents">Обновить список</button>
    <button v-if="tokenPresent" type="button" @click="logout">Выйти</button>
    <form v-if="tokenPresent" @submit.prevent="submitEvent">
      <div>
        <label for="title">Название</label>
        <input id="title" v-model="form.title" type="text" />
      </div>
      <div>
        <label for="description">Описание</label>
        <input id="description" v-model="form.description" type="text" />
      </div>
      <div>
        <label for="date">Дата</label>
        <input id="date" v-model="form.date" type="datetime-local" />
      </div>
      <button type="submit" :disabled="saving">{{ saving ? 'Сохраняем...' : 'Создать событие' }}</button>
    </form>
    <ul>
      <li v-for="event in events" :key="event.id">
        <strong>{{ event.title }}</strong>
        <span> {{ formatDate(event.date) }}</span>
        <p v-if="event.description">{{ event.description }}</p>
        <button v-if="tokenPresent" type="button" @click="removeEvent(event.id)">Удалить</button>
      </li>
    </ul>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { authService } from '../../api/authService'
import { eventService, type EventItem } from '../../api/eventService'
import { hasToken } from '../../utils/token'

const events = ref<EventItem[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const message = ref('')

const tokenPresent = ref(hasToken())

const form = reactive({
  title: '',
  description: '',
  date: '',
})

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

const submitEvent = async (): Promise<void> => {
  saving.value = true
  error.value = ''
  message.value = ''

  try {
    await eventService.createEvent({
      title: form.title,
      description: form.description || null,
      date: new Date(form.date).toISOString(),
    })
    message.value = 'Событие создано'
    form.title = ''
    form.description = ''
    form.date = ''
    await loadEvents()
  } catch {
    error.value = 'Не удалось создать событие'
  } finally {
    saving.value = false
  }
}

const removeEvent = async (id: number): Promise<void> => {
  error.value = ''
  message.value = ''

  try {
    const response = await eventService.deleteEvent(id)
    message.value = response.message
    await loadEvents()
  } catch {
    error.value = 'Не удалось удалить событие'
  }
}

const logout = async (): Promise<void> => {
  try {
    const response = await authService.logout()
    message.value = response.message
    tokenPresent.value = false
    await loadEvents()
  } catch {
    error.value = 'Не удалось выйти'
  }
}

onMounted(() => {
  void loadEvents()
})
</script>