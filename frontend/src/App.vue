<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo">MyApp</h1>
        <ul class="nav-links">
          <li><RouterLink to="/">Главная</RouterLink></li>
          <li><RouterLink to="/events">События</RouterLink></li>
          <li v-if="!authStore.isAuthenticated"><RouterLink to="/login">Вход</RouterLink></li>
          <li v-if="!authStore.isAuthenticated"><RouterLink to="/register">Регистрация</RouterLink></li>
          <li v-else>
            <button type="button" class="logout-btn" :disabled="authStore.isLoggingOut" @click="handleLogout">
              {{ authStore.isLoggingOut ? 'Выходим...' : 'Выйти' }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.syncAuthState()
})

const handleLogout = async (): Promise<void> => {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch {
    // The token is always cleared in logout finally block, so we still redirect.
    await router.push('/login')
  }
}
</script>

<style scoped>
.logout-btn {
  cursor: pointer;
}

.logout-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>