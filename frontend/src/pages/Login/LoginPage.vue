<template>
  <div class="login-page">
    <h1>Вход</h1>
    <p>Страница входа в приложение</p>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
      <RouterLink to="/register" class="btn btn-primary">Нет аккаунта? Зарегистрируйтесь</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>