<template>
	<div :class="$style.root">
		<div :class="$style.card">
			<HomeHero />
		</div>
		<div :class="$style.card">
			<HomeActions />
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeActions from './components/HomeActions.vue'
import HomeHero from './components/HomeHero.vue'
</script>

<style module lang="scss" src="./HomePage.module.scss" />
