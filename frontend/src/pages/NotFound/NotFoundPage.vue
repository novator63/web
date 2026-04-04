<template>
  <div class="not-found-page">
    <h1>404 - Страница не найдена</h1>
    <p>Извините, запрашиваемая страница не существует.</p>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-primary">На главную</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>