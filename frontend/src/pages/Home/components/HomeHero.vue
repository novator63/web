<template>
	<section :class="$style.root">
		<img :src="logoUrl" alt="TM" :class="$style.logo" />
		<div>
			<h1 :class="$style.title">TM</h1>
			<p :class="$style.subtitle">Task Manager - сайт для управления мероприятиями.</p>
			<p :class="$style.desc">Создавайте, планируйте и управляйте своими мероприятиями.</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import logoUrl from '../../../assets/images/logo.svg'
</script>

<style module lang="scss">
@use '../../../assets/styles/variables.scss' as *;

.root {
	display: grid;
	grid-template-columns: 96px 1fr;
	gap: 16px;
	align-items: center;
}

.logo {
	width: 96px;
	height: 96px;
}

.title {
	margin: 0;
	font-size: 34px;
	letter-spacing: 0.2px;
}

.subtitle {
	margin: 6px 0 0;
	font-weight: 700;
	color: $color-text;
}

.desc {
	margin: 6px 0 0;
	color: $color-muted;
	max-width: 56ch;
}

@media (max-width: 560px) {
	.root {
		grid-template-columns: 1fr;
	}

	.logo {
		width: 72px;
		height: 72px;
	}
}
</style>
