<template>
  <div class="register-page">
    <h1>Регистрация</h1>
    <p>Создайте новый аккаунт</p>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
      <RouterLink to="/login" class="btn btn-primary">Уже есть аккаунт? Войдите</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>