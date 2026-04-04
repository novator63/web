<template>
  <div id="app" class="app-container">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo">MyApp</h1>
        <ul class="nav-links">
          <li><RouterLink to="/">Главная</RouterLink></li>
          <li><RouterLink to="/events">События</RouterLink></li>
          <li><RouterLink to="/login">Вход</RouterLink></li>
          <li><RouterLink to="/register">Регистрация</RouterLink></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>