<template>
  <div class="events-page">
    <h1>События</h1>
    <p>Здесь будет список событий</p>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>