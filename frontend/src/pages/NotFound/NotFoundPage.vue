<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<ErrorMessage code="404" message="Страница не найдена" />
			<p>Проверьте адрес или вернитесь на главную.</p>
			<div :class="$style.actions">
				<BaseButton to="/" variant="primary">На главную</BaseButton>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import BaseButton from '../../components/ui/BaseButton/BaseButton.vue'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
</script>

<style module lang="scss" src="./NotFoundPage.module.scss" />
