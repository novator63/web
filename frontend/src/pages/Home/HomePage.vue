<template>
  <div class="home-page">
    <h1>Добро пожаловать на главную страницу</h1>
    <p>Это тестовая страница для проверки роутинга.</p>
    <div class="button-group">
      <RouterLink to="/events" class="btn btn-primary">Перейти к событиям</RouterLink>
      <RouterLink to="/login" class="btn btn-secondary">Перейти на вход</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>