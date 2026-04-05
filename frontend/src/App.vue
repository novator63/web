<template>
	<div :class="$style.root">
		<AppHeader />
		<main :class="$style.main">
			<AppContainer>
				<RouterView />
			</AppContainer>
		</main>
	</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppContainer from './components/layout/AppContainer/AppContainer.vue'
import AppHeader from './components/layout/AppHeader/AppHeader.vue'
</script>

<style module lang="scss">
@use './assets/styles/variables.scss' as *;

.root {
	min-height: 100vh;
}

.main {
	padding: 18px 0 42px;
}
</style>
