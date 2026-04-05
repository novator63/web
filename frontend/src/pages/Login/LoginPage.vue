<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<h1 :class="$style.title">Вход</h1>
			<p :class="$style.subtitle">Авторизуйтесь, чтобы создавать мероприятия.</p>
			<LoginForm />
		</section>
	</div>
</template>

<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
</script>

<style module lang="scss" src="./LoginPage.module.scss" />
