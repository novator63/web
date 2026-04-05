<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<h1 :class="$style.title">Регистрация</h1>
			<p :class="$style.subtitle">Создайте аккаунт и начните добавлять мероприятия.</p>
			<RegisterForm />
		</section>
	</div>
</template>

<script setup lang="ts">
import RegisterForm from './components/RegisterForm.vue'
</script>

<style module lang="scss" src="./RegisterPage.module.scss" />
